import { fetchScreenerStocks, enrichFundamentals, type FundamentalsData, type ScreenerResult } from "./yahooFinance";
import type { UniverseStock } from "./stockUniverse";
import type { Market } from "@/types";

import { approxToUSD } from "@/constants";

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export type LynchCriterionKey =
  | "peg"
  | "epsGrowth"
  | "revenueGrowth"
  | "debtToEquity"
  | "operatingMargin"
  | "marketCap";

export interface LynchCriterion {
  key: LynchCriterionKey;
  /** 원시 값 (null = 데이터 없음) */
  value: number | null;
  /** 통과 여부. null = 데이터 없어서 판단 불가 */
  pass: boolean | null;
  score: number;
  maxScore: number;
}

export interface LynchScreenResult {
  stock: UniverseStock;
  fundamentals: FundamentalsData;
  criteria: LynchCriterion[];
  /** 0 – 100 합산 점수 */
  totalScore: number;
}

// ─── 각 기준별 스코어링 ──────────────────────────────────────────────────────

/**
 * PEG 비율 (max 25점)
 * < 0.5: 25점, 0.5~1.0: 20점, 1.0~2.0: 10점, ≥ 2.0: 0점
 */
function scorePEG(peg: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (peg === null || peg <= 0) return { pass: null, score: 0 };
  if (peg < 0.5) return { pass: true, score: 25 };
  if (peg < 1.0) return { pass: true, score: 20 };
  if (peg < 2.0) return { pass: false, score: 10 };
  return { pass: false, score: 0 };
}

/**
 * EPS 성장률 (max 20점)
 * > 30%: 20점, 15~30%: 15점, 5~15%: 8점, < 5%: 0점
 */
function scoreEpsGrowth(g: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (g === null) return { pass: null, score: 0 };
  if (g > 0.3) return { pass: true, score: 20 };
  if (g > 0.15) return { pass: true, score: 15 };
  if (g > 0.05) return { pass: false, score: 8 };
  return { pass: false, score: 0 };
}

/**
 * 매출 성장률 (max 20점)
 * > 20%: 20점, 10~20%: 15점, 5~10%: 8점, < 5%: 0점
 */
function scoreRevenueGrowth(g: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (g === null) return { pass: null, score: 0 };
  if (g > 0.2) return { pass: true, score: 20 };
  if (g > 0.1) return { pass: true, score: 15 };
  if (g > 0.05) return { pass: false, score: 8 };
  return { pass: false, score: 0 };
}

/**
 * 부채비율 D/E (max 15점) — Yahoo 스케일: 50 = 0.5x
 * < 30: 15점, 30~80: 10점, 80~150: 5점, ≥ 150: 0점
 */
function scoreDebtToEquity(de: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (de === null) return { pass: null, score: 0 };
  if (de < 30) return { pass: true, score: 15 };
  if (de < 80) return { pass: true, score: 10 };
  if (de < 150) return { pass: false, score: 5 };
  return { pass: false, score: 0 };
}

/**
 * 영업이익률 (max 10점)
 * > 20%: 10점, 10~20%: 7점, 5~10%: 3점, < 5%: 0점
 */
function scoreOperatingMargin(m: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (m === null) return { pass: null, score: 0 };
  if (m > 0.2) return { pass: true, score: 10 };
  if (m > 0.1) return { pass: true, score: 7 };
  if (m > 0.05) return { pass: false, score: 3 };
  return { pass: false, score: 0 };
}

/**
 * 시가총액 (max 10점) — 린치는 소·중형주 선호
 * < 2B USD: 10점, 2~10B: 8점, 10~50B: 5점, 50~200B: 2점, ≥ 200B: 0점
 * ※ USD 외 통화일 때는 단순 magnitude 기반으로 적용
 */
function scoreMarketCap(cap: number | null, currency: string | null): Pick<LynchCriterion, "pass" | "score"> {
  if (cap === null) return { pass: null, score: 0 };

  const BILLION = 1_000_000_000;
  const capUSD = approxToUSD(cap, currency ?? "USD");

  if (capUSD < 2 * BILLION) return { pass: true, score: 10 };
  if (capUSD < 10 * BILLION) return { pass: true, score: 8 };
  if (capUSD < 50 * BILLION) return { pass: false, score: 5 };
  if (capUSD < 200 * BILLION) return { pass: false, score: 2 };
  return { pass: false, score: 0 };
}

// ─── 스코어링 함수 ──────────────────────────────────────────────────────────

/** FundamentalsData → 스코어링 */
export function scoreStock(
  stock: UniverseStock,
  fundamentals: FundamentalsData,
): LynchScreenResult {
  const { pegRatio, epsGrowth, revenueGrowth, debtToEquity, operatingMargin, marketCap, currency } =
    fundamentals;

  const peg    = scorePEG(pegRatio);
  const eps    = scoreEpsGrowth(epsGrowth);
  const rev    = scoreRevenueGrowth(revenueGrowth);
  const debt   = scoreDebtToEquity(debtToEquity);
  const margin = scoreOperatingMargin(operatingMargin);
  const cap    = scoreMarketCap(marketCap, currency);

  const criteria: LynchCriterion[] = [
    { key: "peg",             value: pegRatio,        maxScore: 25, ...peg    },
    { key: "epsGrowth",       value: epsGrowth,       maxScore: 20, ...eps    },
    { key: "revenueGrowth",   value: revenueGrowth,   maxScore: 20, ...rev    },
    { key: "debtToEquity",    value: debtToEquity,    maxScore: 15, ...debt   },
    { key: "operatingMargin", value: operatingMargin, maxScore: 10, ...margin },
    { key: "marketCap",       value: marketCap,       maxScore: 10, ...cap    },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);

  return { stock, fundamentals, criteria, totalScore };
}

// ─── 동적 스크리너 ─────────────────────────────────────────────────────────────

export type ScreenPhase = "fetch" | "enrich";

export interface ScreenProgress {
  phase: ScreenPhase;
  done: number;
  total: number;
}

/** 후보 풀 크기 / 상세 분석 대상 수 */
const CANDIDATE_POOL = 50;
const ENRICH_TOP = 10;

/**
 * 동적 스크리닝
 *
 * 1. Yahoo Finance Screener로 후보 50개 fetch (v7 배치 — 빠름)
 * 2. v7 데이터 기반 1차 스코어링 (API 호출 없음)
 * 3. 상위 10개만 선별 → quoteSummary로 상세 보강 (느림)
 * 4. 최종 점수 내림차순 정렬
 */
export async function screenAll(
  market: Market,
  onProgress?: (p: ScreenProgress) => void,
): Promise<LynchScreenResult[]> {

  // ─── 후보 가져오기 ──────────────────────────────────────────
  onProgress?.({ phase: "fetch", done: 0, total: 1 });

  const candidates: ScreenerResult[] = await fetchScreenerStocks(market, CANDIDATE_POOL);

  onProgress?.({ phase: "fetch", done: 1, total: 1 });

  if (candidates.length === 0) {
    console.warn("[Lynch] Screener returned 0 candidates");
    return [];
  }

  // ─── 1차 스코어링 (v7 배치 데이터 기반, API 호출 없음) ──────
  const preScored: LynchScreenResult[] = candidates.map((c) =>
    scoreStock(c.stock, c.data),
  );
  preScored.sort((a, b) => b.totalScore - a.totalScore);

  // 상위 N개만 선별
  const top = preScored.slice(0, ENRICH_TOP);

  console.log(
    `[Lynch] ${candidates.length} candidates → top ${top.length} selected (1st pass scores: ${top.map((r) => r.totalScore).join(", ")})`,
  );

  // ─── quoteSummary 보강 (상위 종목만) ─────────────────────────
  onProgress?.({ phase: "enrich", done: 0, total: top.length });

  for (let i = 0; i < top.length; i++) {
    const r = top[i];
    const enriched = await enrichFundamentals(r.stock.ticker, r.fundamentals);
    top[i] = scoreStock(r.stock, enriched);

    onProgress?.({ phase: "enrich", done: i + 1, total: top.length });

    if (i < top.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  return top.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * 주어진 티커 목록에 대해 Lynch 스코어링 실행.
 * 포트폴리오 스크리닝 / 단일 티커 검색에 사용.
 */
export async function screenByTickers(
  tickers: Array<{ ticker: string; name?: string }>,
  onProgress?: (p: ScreenProgress) => void,
): Promise<LynchScreenResult[]> {
  if (tickers.length === 0) return [];

  onProgress?.({ phase: "enrich", done: 0, total: tickers.length });

  const results: LynchScreenResult[] = [];

  for (let i = 0; i < tickers.length; i++) {
    const { ticker, name } = tickers[i];
    const fundamentals = await enrichFundamentals(ticker, {
      pegRatio: null,
      epsGrowth: null,
      revenueGrowth: null,
      debtToEquity: null,
      operatingMargin: null,
      marketCap: null,
      currency: null,
    });

    results.push(
      scoreStock(
        { ticker, name: name ?? ticker, market: "OTHER" },
        fundamentals,
      ),
    );

    onProgress?.({ phase: "enrich", done: i + 1, total: tickers.length });

    if (i < tickers.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  return results.sort((a, b) => b.totalScore - a.totalScore);
}
