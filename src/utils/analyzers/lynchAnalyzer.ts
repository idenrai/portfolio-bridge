import { enrichFundamentals, type FundamentalsData } from "../yahoo/yahooFinance";
import { analyzeByTickersGeneric } from "../yahoo/yahooCore";
import type { UniverseStock } from "./stockUniverse";

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

export interface LynchAnalyzerResult {
  stock: UniverseStock;
  fundamentals: FundamentalsData;
  criteria: LynchCriterion[];
  /** 0 – 100 합산 점수 */
  totalScore: number;
}

// ─── 각 기준별 스코어링 ──────────────────────────────────────────────────────

/**
 * PEG 비율 (max 25점)
 * < 0.5: 25, 0.5~0.75: 22, 0.75~1.0: 18, 1.0~1.5: 12, 1.5~2.0: 6, ≥ 2.0: 0
 */
function scorePEG(peg: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (peg === null || peg <= 0) return { pass: null, score: 0 };
  if (peg < 0.5)  return { pass: true,  score: 25 };
  if (peg < 0.75) return { pass: true,  score: 22 };
  if (peg < 1.0)  return { pass: true,  score: 18 };
  if (peg < 1.5)  return { pass: false, score: 12 };
  if (peg < 2.0)  return { pass: false, score: 6 };
  return { pass: false, score: 0 };
}

/**
 * EPS 성장률 (max 20점)
 * > 30%: 20, 20~30: 17, 15~20: 14, 10~15: 10, 5~10: 5, ≤ 5%: 0
 */
function scoreEpsGrowth(g: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (g === null) return { pass: null, score: 0 };
  if (g > 0.30) return { pass: true,  score: 20 };
  if (g > 0.20) return { pass: true,  score: 17 };
  if (g > 0.15) return { pass: true,  score: 14 };
  if (g > 0.10) return { pass: false, score: 10 };
  if (g > 0.05) return { pass: false, score: 5 };
  return { pass: false, score: 0 };
}

/**
 * 매출 성장률 (max 20점)
 * > 20%: 20, 15~20: 17, 10~15: 13, 5~10: 8, 0~5: 3, ≤ 0%: 0
 */
function scoreRevenueGrowth(g: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (g === null) return { pass: null, score: 0 };
  if (g > 0.20) return { pass: true,  score: 20 };
  if (g > 0.15) return { pass: true,  score: 17 };
  if (g > 0.10) return { pass: true,  score: 13 };
  if (g > 0.05) return { pass: false, score: 8 };
  if (g > 0)    return { pass: false, score: 3 };
  return { pass: false, score: 0 };
}

/**
 * 부채비율 D/E (max 15점) — Yahoo 스케일: 50 = 0.5x
 * < 20: 15, 20~30: 13, 30~50: 10, 50~80: 7, 80~120: 4, 120~150: 2, ≥ 150: 0
 */
function scoreDebtToEquity(de: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (de === null) return { pass: null, score: 0 };
  if (de < 20)  return { pass: true,  score: 15 };
  if (de < 30)  return { pass: true,  score: 13 };
  if (de < 50)  return { pass: true,  score: 10 };
  if (de < 80)  return { pass: false, score: 7 };
  if (de < 120) return { pass: false, score: 4 };
  if (de < 150) return { pass: false, score: 2 };
  return { pass: false, score: 0 };
}

/**
 * 영업이익률 (max 10점)
 * > 25%: 10, 20~25: 8, 15~20: 6, 10~15: 4, 5~10: 2, ≤ 5%: 0
 */
function scoreOperatingMargin(m: number | null): Pick<LynchCriterion, "pass" | "score"> {
  if (m === null) return { pass: null, score: 0 };
  if (m > 0.25) return { pass: true,  score: 10 };
  if (m > 0.20) return { pass: true,  score: 8 };
  if (m > 0.15) return { pass: true,  score: 6 };
  if (m > 0.10) return { pass: false, score: 4 };
  if (m > 0.05) return { pass: false, score: 2 };
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
): LynchAnalyzerResult {
  const { pegRatio, epsGrowth, revenueGrowth, debtToEquity, operatingMargin, marketCap, currency } =
    fundamentals;

  const peg    = scorePEG(pegRatio);
  const eps    = scoreEpsGrowth(epsGrowth);
  const rev    = scoreRevenueGrowth(revenueGrowth);
  const debt   = scoreDebtToEquity(debtToEquity);
  const margin = scoreOperatingMargin(operatingMargin);
  const cap    = scoreMarketCap(marketCap, currency);

  const capUSD = marketCap !== null ? approxToUSD(marketCap, currency ?? "USD") : null;

  const criteria: LynchCriterion[] = [
    { key: "peg",             value: pegRatio,        maxScore: 25, ...peg    },
    { key: "epsGrowth",       value: epsGrowth,       maxScore: 20, ...eps    },
    { key: "revenueGrowth",   value: revenueGrowth,   maxScore: 20, ...rev    },
    { key: "debtToEquity",    value: debtToEquity,    maxScore: 15, ...debt   },
    { key: "operatingMargin", value: operatingMargin, maxScore: 10, ...margin },
    { key: "marketCap",       value: capUSD,          maxScore: 10, ...cap    },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);

  return { stock, fundamentals, criteria, totalScore };
}

// ─── 포트폴리오·검색 스크리너 ──────────────────────────────────────────────

const LYNCH_DEFAULT: FundamentalsData = {
  pegRatio: null, epsGrowth: null, revenueGrowth: null,
  debtToEquity: null, operatingMargin: null, marketCap: null, currency: null,
  peRatio: null, pbRatio: null, currentPrice: null,
};

export function analyzeByTickers(
  tickers: Array<{ ticker: string; name?: string }>,
  onProgress?: (p: { phase: "enrich"; done: number; total: number }) => void,
): Promise<LynchAnalyzerResult[]> {
  return analyzeByTickersGeneric({
    tickers,
    fetchData: (symbol) => enrichFundamentals(symbol, LYNCH_DEFAULT),
    defaultRaw: LYNCH_DEFAULT,
    scoreStock,
    onProgress,
  });
}

