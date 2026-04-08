import { fetchQuoteSummary, analyzeByTickersGeneric, type RawVal } from "../yahoo/yahooCore";
import type { UniverseStock } from "./stockUniverse";

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export type OneilCriterionKey =
  | "currentEarnings"
  | "annualEarnings"
  | "newHighs"
  | "supplyDemand"
  | "leader"
  | "institutional"
  | "marketCap";

export interface OneilCriterion {
  key: OneilCriterionKey;
  value: number | null;
  pass: boolean | null;
  score: number;
  maxScore: number;
}

export interface OneilAnalyzerResult {
  stock: UniverseStock;
  criteria: OneilCriterion[];
  /** 0 – 100 합산 점수 */
  totalScore: number;
}

// ─── Yahoo Finance에서 CAN SLIM 데이터 추출 ────────────────────────────────

interface OneilRawData {
  currentEarningsGrowth: number | null; // 분기 EPS 성장률
  annualEarningsGrowth: number | null;  // 연간 EPS 성장률
  nearHighPercent: number | null;       // 52주 최고가 대비 현재가 %
  float: number | null;                 // 유통주식 수
  relativeStrength: number | null;      // 상대강도 (52주 수익률)
  institutionalHolders: number | null;  // 기관 보유 비율
  marketCap: number | null;             // 시가총액 (USD)
}

type IncomeStmt = {
  netIncome?: RawVal;
  totalRevenue?: RawVal;
};

type EarningsEntry = {
  quarter?: RawVal;
  actual?: RawVal;
};

async function fetchOneilData(symbol: string): Promise<OneilRawData | null> {
  const result = await fetchQuoteSummary(
    symbol,
    "defaultKeyStatistics,summaryDetail,financialData,incomeStatementHistory,earningsHistory",
  );
  if (!result) return null;

  const ks = (result.defaultKeyStatistics ?? {}) as Record<string, RawVal | { raw?: number; fmt?: string }>;
  const sd = (result.summaryDetail ?? {}) as Record<string, RawVal>;
  const fd = (result.financialData ?? {}) as Record<string, RawVal | string>;

  // ─── C: 분기 EPS 성장률 ─────────────────────────────────────
  let currentEarningsGrowth: number | null = null;

  // earningsQuarterlyGrowth (financialData)
  const eqg = (fd.earningsQuarterlyGrowth as RawVal | undefined)?.raw;
  if (eqg != null) {
    currentEarningsGrowth = eqg; // 이미 비율 (0.25 = 25%)
  }

  // fallback: earningsHistory 에서 직접 계산
  if (currentEarningsGrowth === null) {
    const eh = (result.earningsHistory as
      { history?: EarningsEntry[] } | undefined
    )?.history;
    if (eh && eh.length >= 2) {
      const recent = eh[eh.length - 1]?.actual?.raw;
      const prev = eh[eh.length - 2]?.actual?.raw;
      if (recent != null && prev != null && prev > 0) {
        currentEarningsGrowth = (recent - prev) / Math.abs(prev);
      }
    }
  }

  // ─── A: 연간 EPS 성장률 ─────────────────────────────────────
  let annualEarningsGrowth: number | null = null;

  // earningsGrowth (financialData)
  const eg = (fd.earningsGrowth as RawVal | undefined)?.raw;
  if (eg != null) {
    annualEarningsGrowth = eg;
  }

  // fallback: incomeStatementHistory (최근 2년 순이익 비교)
  if (annualEarningsGrowth === null) {
    const isStmts = (result.incomeStatementHistory as
      { incomeStatementHistory?: IncomeStmt[] } | undefined
    )?.incomeStatementHistory;
    if (isStmts && isStmts.length >= 2) {
      const ni0 = isStmts[0]?.netIncome?.raw;
      const ni1 = isStmts[1]?.netIncome?.raw;
      if (ni0 != null && ni1 != null && ni1 > 0) {
        annualEarningsGrowth = (ni0 - ni1) / Math.abs(ni1);
      }
    }
  }

  // ─── N: 52주 최고가 대비 현재가 위치 ────────────────────────
  let nearHighPercent: number | null = null;
  const high52 = sd.fiftyTwoWeekHigh?.raw ?? null;
  const price = (fd.currentPrice as RawVal | undefined)?.raw ?? sd.previousClose?.raw ?? null;
  if (high52 != null && high52 > 0 && price != null) {
    nearHighPercent = price / high52; // 1.0 = 신고가, 0.8 = 20% 하락
  }

  // ─── S: 유통주식 수 (float) ─────────────────────────────────
  const floatShares = ks.floatShares?.raw ?? null;

  // ─── L: 상대강도 (52주 수익률) ──────────────────────────────
  let relativeStrength: number | null = null;
  const low52 = sd.fiftyTwoWeekLow?.raw ?? null;
  if (price != null && low52 != null && low52 > 0) {
    relativeStrength = (price - low52) / low52; // 52주 저점 대비 상승률
  }

  // ─── I: 기관 투자자 비중 ────────────────────────────────────
  const institutionalHolders = ks.heldPercentInstitutions?.raw ?? null;

  // ─── M: 시가총액 → 대형주 선호 ─────────────────────────────
  let marketCap: number | null = sd.marketCap?.raw ?? null;
  if (marketCap === null) {
    marketCap = ks.enterpriseValue?.raw ?? null;
  }

  return {
    currentEarningsGrowth,
    annualEarningsGrowth,
    nearHighPercent,
    float: floatShares,
    relativeStrength,
    institutionalHolders: institutionalHolders,
    marketCap,
  };
}

// ─── 각 기준별 스코어링 ──────────────────────────────────────────────────────

/**
 * C (Current Quarterly Earnings) — max 20점
 * 오닐: 분기 EPS 성장률 25%+ 선호
 */
function scoreCurrentEarnings(v: number | null): Pick<OneilCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  if (v >= 0.50) return { pass: true,  score: 20 };
  if (v >= 0.35) return { pass: true,  score: 17 };
  if (v >= 0.25) return { pass: true,  score: 14 };
  if (v >= 0.15) return { pass: false, score: 9 };
  if (v >= 0.05) return { pass: false, score: 4 };
  return { pass: false, score: 0 };
}

/**
 * A (Annual Earnings Growth) — max 20점
 * 오닐: 연간 EPS 성장률 25%+, 3~5년 지속 선호
 */
function scoreAnnualEarnings(v: number | null): Pick<OneilCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  if (v >= 0.40) return { pass: true,  score: 20 };
  if (v >= 0.30) return { pass: true,  score: 17 };
  if (v >= 0.25) return { pass: true,  score: 14 };
  if (v >= 0.15) return { pass: false, score: 9 };
  if (v >= 0.05) return { pass: false, score: 4 };
  return { pass: false, score: 0 };
}

/**
 * N (New High) — max 15점
 * 52주 최고가 대비 현재가 위치: 95%+ → 신고가 부근
 */
function scoreNewHighs(v: number | null): Pick<OneilCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  if (v >= 0.95) return { pass: true,  score: 15 };
  if (v >= 0.90) return { pass: true,  score: 12 };
  if (v >= 0.85) return { pass: false, score: 8 };
  if (v >= 0.75) return { pass: false, score: 4 };
  return { pass: false, score: 0 };
}

/**
 * S (Supply & Demand / Float) — max 10점
 * 오닐: 유통주식 수가 적을수록 수급 효과 큼
 */
function scoreSupplyDemand(v: number | null): Pick<OneilCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  const millions = v / 1e6;
  if (millions < 20)  return { pass: true,  score: 10 };
  if (millions < 50)  return { pass: true,  score: 8 };
  if (millions < 100) return { pass: false, score: 6 };
  if (millions < 300) return { pass: false, score: 3 };
  return { pass: false, score: 1 };
}

/**
 * L (Leader / Laggard) — max 15점
 * 52주 저점 대비 상승률: 선도주 판별
 */
function scoreLeader(v: number | null): Pick<OneilCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  if (v >= 1.0)  return { pass: true,  score: 15 }; // 100%+ 상승
  if (v >= 0.60) return { pass: true,  score: 12 };
  if (v >= 0.30) return { pass: false, score: 8 };
  if (v >= 0.10) return { pass: false, score: 4 };
  return { pass: false, score: 0 };
}

/**
 * I (Institutional Sponsorship) — max 10점
 * 기관 보유 비중: 적절한 수준 (20~60%) 선호
 */
function scoreInstitutional(v: number | null): Pick<OneilCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  if (v >= 0.30 && v <= 0.70) return { pass: true, score: 10 };
  if (v >= 0.20 && v <= 0.80) return { pass: true, score: 7 };
  if (v >= 0.10) return { pass: false, score: 4 };
  return { pass: false, score: 1 };
}

/**
 * Market Cap — max 10점
 * 오닐: 중소형주에서 대형 성장주까지 다양, 중↔대형 선호
 */
function scoreMarketCap(v: number | null): Pick<OneilCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  const b = v / 1e9;
  if (b >= 2 && b <= 50)   return { pass: true,  score: 10 };
  if (b >= 1 && b <= 100)  return { pass: true,  score: 8 };
  if (b >= 0.3 && b <= 200) return { pass: false, score: 5 };
  if (b >= 0.1)            return { pass: false, score: 3 };
  return { pass: false, score: 1 };
}

// ─── 스코어링 함수 ──────────────────────────────────────────────────────────

function scoreStock(stock: UniverseStock, data: OneilRawData): OneilAnalyzerResult {
  const criteria: OneilCriterion[] = [
    { key: "currentEarnings",  value: data.currentEarningsGrowth,  maxScore: 20, ...scoreCurrentEarnings(data.currentEarningsGrowth) },
    { key: "annualEarnings",   value: data.annualEarningsGrowth,   maxScore: 20, ...scoreAnnualEarnings(data.annualEarningsGrowth) },
    { key: "newHighs",         value: data.nearHighPercent,        maxScore: 15, ...scoreNewHighs(data.nearHighPercent) },
    { key: "supplyDemand",     value: data.float,                  maxScore: 10, ...scoreSupplyDemand(data.float) },
    { key: "leader",           value: data.relativeStrength,       maxScore: 15, ...scoreLeader(data.relativeStrength) },
    { key: "institutional",    value: data.institutionalHolders,   maxScore: 10, ...scoreInstitutional(data.institutionalHolders) },
    { key: "marketCap",        value: data.marketCap,              maxScore: 10, ...scoreMarketCap(data.marketCap) },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  return { stock, criteria, totalScore };
}

// ─── 포트폴리오·검색 채점 ──────────────────────────────────────────────────

const ONEIL_DEFAULT: OneilRawData = {
  currentEarningsGrowth: null, annualEarningsGrowth: null,
  nearHighPercent: null, float: null, relativeStrength: null,
  institutionalHolders: null, marketCap: null,
};

export function analyzeByTickersOneil(
  tickers: Array<{ ticker: string; name?: string }>,
  onProgress?: (p: { phase: "enrich"; done: number; total: number }) => void,
): Promise<OneilAnalyzerResult[]> {
  return analyzeByTickersGeneric({
    tickers,
    fetchData: fetchOneilData,
    defaultRaw: ONEIL_DEFAULT,
    scoreStock,
    onProgress,
  });
}
