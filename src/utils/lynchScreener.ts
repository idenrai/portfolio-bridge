import type { Asset } from "@/types";
import { fetchFundamentals, type FundamentalsData } from "./yahooFinance";

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
  asset: Asset;
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

  // 통화별 2B USD 환산 근사값
  const BILLION = 1_000_000_000;
  let capUSD = cap;
  if (currency === "KRW") capUSD = cap / 1350;       // 약 1350 KRW/USD
  else if (currency === "JPY") capUSD = cap / 150;    // 약 150 JPY/USD
  else if (currency === "EUR") capUSD = cap / 0.92;   // 약 0.92 EUR/USD

  if (capUSD < 2 * BILLION) return { pass: true, score: 10 };
  if (capUSD < 10 * BILLION) return { pass: true, score: 8 };
  if (capUSD < 50 * BILLION) return { pass: false, score: 5 };
  if (capUSD < 200 * BILLION) return { pass: false, score: 2 };
  return { pass: false, score: 0 };
}

// ─── 메인 스크리너 ────────────────────────────────────────────────────────────

/**
 * 단일 자산을 피터 린치 기준으로 스크리닝
 * - 주식(stock)이면서 ticker가 있는 자산만 대상
 */
export async function screenAsset(
  asset: Asset,
): Promise<LynchScreenResult | null> {
  if (asset.type !== "stock" || !asset.ticker) return null;

  const fundamentals = await fetchFundamentals(asset.ticker);
  if (!fundamentals) return null;

  const { pegRatio, epsGrowth, revenueGrowth, debtToEquity, operatingMargin, marketCap, currency } =
    fundamentals;

  const peg = scorePEG(pegRatio);
  const eps = scoreEpsGrowth(epsGrowth);
  const rev = scoreRevenueGrowth(revenueGrowth);
  const debt = scoreDebtToEquity(debtToEquity);
  const margin = scoreOperatingMargin(operatingMargin);
  const cap = scoreMarketCap(marketCap, currency);

  const criteria: LynchCriterion[] = [
    { key: "peg",            value: pegRatio,       maxScore: 25, ...peg   },
    { key: "epsGrowth",      value: epsGrowth,      maxScore: 20, ...eps   },
    { key: "revenueGrowth",  value: revenueGrowth,  maxScore: 20, ...rev   },
    { key: "debtToEquity",   value: debtToEquity,   maxScore: 15, ...debt  },
    { key: "operatingMargin",value: operatingMargin, maxScore: 10, ...margin},
    { key: "marketCap",      value: marketCap,      maxScore: 10, ...cap   },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);

  return { asset, fundamentals, criteria, totalScore };
}

/**
 * 자산 목록 전체를 병렬 스크리닝 (결과 내림차순 정렬)
 */
export async function screenAll(
  assets: Asset[],
): Promise<LynchScreenResult[]> {
  const results = await Promise.allSettled(assets.map(screenAsset));
  return results
    .filter(
      (r): r is PromiseFulfilledResult<LynchScreenResult> =>
        r.status === "fulfilled" && r.value !== null,
    )
    .map((r) => r.value)
    .sort((a, b) => b.totalScore - a.totalScore);
}
