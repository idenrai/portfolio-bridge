import { fetchQuoteSummary, analyzeByTickersGeneric, type RawVal } from "./yahooCore";
import type { UniverseStock } from "./stockUniverse";

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export type PiotroskiCriterionKey =
  | "roa"
  | "cfo"
  | "deltaRoa"
  | "accruals"
  | "deltaLeverage"
  | "deltaLiquidity"
  | "equityDilution"
  | "deltaMargin"
  | "deltaTurnover";

export interface PiotroskiCriterion {
  key: PiotroskiCriterionKey;
  value: number | null;
  pass: boolean | null;
  score: number;
  maxScore: number;
}

export interface PiotroskiAnalyzerResult {
  stock: UniverseStock;
  criteria: PiotroskiCriterion[];
  /** 0 – 100 합산 점수 (F-Score 0~9 → 0~100 환산) */
  totalScore: number;
}

// ─── Yahoo Finance에서 F-Score 데이터 추출 ──────────────────────────────────

interface PiotroskiRawData {
  roa: number | null;
  cfo: number | null;
  deltaRoa: number | null;
  accruals: number | null; // CFO - NetIncome (양이면 PASS)
  deltaLeverage: number | null; // 장기부채 변화: 감소면 PASS
  deltaLiquidity: number | null; // 유동비율 변화: 개선이면 PASS
  equityDilution: number | null; // 발행주식 변화: 0 이하면 PASS
  deltaMargin: number | null; // 매출총이익률 변화: 개선이면 PASS
  deltaTurnover: number | null; // 자산회전율 변화: 개선이면 PASS
}

type BalanceStmt = {
  totalCurrentAssets?: RawVal;
  totalCurrentLiabilities?: RawVal;
  totalAssets?: RawVal;
  totalStockholderEquity?: RawVal;
  longTermDebt?: RawVal;
  commonStock?: RawVal;
};

type IncomeStmt = {
  netIncome?: RawVal;
  totalRevenue?: RawVal;
  grossProfit?: RawVal;
  costOfRevenue?: RawVal;
};

type CfStmt = {
  totalCashFromOperatingActivities?: RawVal;
};

async function fetchPiotroskiData(symbol: string): Promise<PiotroskiRawData | null> {
  const result = await fetchQuoteSummary(
    symbol,
    "financialData,balanceSheetHistory,incomeStatementHistory,cashflowStatementHistory",
  );
  if (!result) return null;

  const fd = (result.financialData ?? {}) as Record<string, RawVal | string>;

  // 재무제표 (최근 2년치 필요)
  const bsStmts = (result.balanceSheetHistory as
    { balanceSheetStatements?: BalanceStmt[] } | undefined
  )?.balanceSheetStatements ?? [];

  const isStmts = (result.incomeStatementHistory as
    { incomeStatementHistory?: IncomeStmt[] } | undefined
  )?.incomeStatementHistory ?? [];

  const cfStmts = (result.cashflowStatementHistory as
    { cashflowStatements?: CfStmt[] } | undefined
  )?.cashflowStatements ?? [];

  const bs0 = bsStmts[0]; // 최근 연도
  const bs1 = bsStmts[1]; // 이전 연도
  const is0 = isStmts[0];
  const is1 = isStmts[1];
  const cf0 = cfStmts[0];

  // ROA = Net Income / Total Assets
  const totalAssets0 = bs0?.totalAssets?.raw;
  const netIncome0 = is0?.netIncome?.raw;
  let roa: number | null = null;
  if (netIncome0 != null && totalAssets0 != null && totalAssets0 > 0) {
    roa = netIncome0 / totalAssets0;
  } else {
    // fallback: financialData returnOnAssets
    roa = (fd.returnOnAssets as RawVal | undefined)?.raw ?? null;
  }

  // CFO (Operating Cash Flow)
  let cfo: number | null = cf0?.totalCashFromOperatingActivities?.raw ?? null;
  if (cfo === null) {
    cfo = (fd.operatingCashflow as RawVal | undefined)?.raw ?? null;
  }

  // ΔROA (ROA 변화)
  let deltaRoa: number | null = null;
  if (roa !== null) {
    const totalAssets1 = bs1?.totalAssets?.raw;
    const netIncome1 = is1?.netIncome?.raw;
    if (netIncome1 != null && totalAssets1 != null && totalAssets1 > 0) {
      const roaPrev = netIncome1 / totalAssets1;
      deltaRoa = roa - roaPrev;
    }
  }

  // Accruals: CFO > Net Income → 양이면 PASS
  let accruals: number | null = null;
  if (cfo !== null && netIncome0 !== null) {
    accruals = cfo - netIncome0;
  }

  // ΔLeverage: 장기부채 감소 → 음이면 PASS
  let deltaLeverage: number | null = null;
  const ltDebt0 = bs0?.longTermDebt?.raw;
  const ltDebt1 = bs1?.longTermDebt?.raw;
  if (ltDebt0 != null && ltDebt1 != null) {
    deltaLeverage = ltDebt0 - ltDebt1; // 감소하면 음수
  }

  // ΔLiquidity: 유동비율 변화
  let deltaLiquidity: number | null = null;
  if (bs0 && bs1) {
    const ca0 = bs0.totalCurrentAssets?.raw;
    const cl0 = bs0.totalCurrentLiabilities?.raw;
    const ca1 = bs1.totalCurrentAssets?.raw;
    const cl1 = bs1.totalCurrentLiabilities?.raw;
    if (ca0 != null && cl0 != null && cl0 > 0 && ca1 != null && cl1 != null && cl1 > 0) {
      deltaLiquidity = (ca0 / cl0) - (ca1 / cl1);
    }
  }

  // Equity Dilution: 주식 수 변화
  let equityDilution: number | null = null;
  const shares0 = bs0?.commonStock?.raw;
  const shares1 = bs1?.commonStock?.raw;
  if (shares0 != null && shares1 != null && shares1 > 0) {
    equityDilution = shares0 - shares1; // 증가하면 양수(나쁨)
  }

  // ΔMargin: 매출총이익률 변화
  let deltaMargin: number | null = null;
  if (is0 && is1) {
    const rev0 = is0.totalRevenue?.raw;
    const gp0 = is0.grossProfit?.raw;
    const rev1 = is1.totalRevenue?.raw;
    const gp1 = is1.grossProfit?.raw;
    if (rev0 != null && rev0 > 0 && gp0 != null && rev1 != null && rev1 > 0 && gp1 != null) {
      deltaMargin = (gp0 / rev0) - (gp1 / rev1);
    }
  }

  // ΔTurnover: 자산회전율 변화 (Revenue / Total Assets)
  let deltaTurnover: number | null = null;
  if (is0 && is1 && bs0 && bs1) {
    const rev0 = is0.totalRevenue?.raw;
    const rev1 = is1.totalRevenue?.raw;
    const ta0 = bs0.totalAssets?.raw;
    const ta1 = bs1.totalAssets?.raw;
    if (rev0 != null && ta0 != null && ta0 > 0 && rev1 != null && ta1 != null && ta1 > 0) {
      deltaTurnover = (rev0 / ta0) - (rev1 / ta1);
    }
  }

  return {
    roa, cfo, deltaRoa, accruals,
    deltaLeverage, deltaLiquidity, equityDilution,
    deltaMargin, deltaTurnover,
  };
}

// ─── 각 기준별 스코어링 (각 max 11점, 9개 합산 = 최대 99 → 100 환산) ────────

const PER_CRITERION = 11; // 각 기준 최대점수 (11 * 9 = 99 ≈ 100)

/** ROA > 0 → PASS */
function scoreROA(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v > 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

/** CFO > 0 → PASS */
function scoreCFO(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v > 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

/** ΔROA > 0 → PASS */
function scoreDeltaROA(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v > 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

/** Accruals (CFO − NI) > 0 → PASS */
function scoreAccruals(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v > 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

/** ΔLeverage ≤ 0 → PASS */
function scoreDeltaLeverage(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v <= 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

/** ΔLiquidity > 0 → PASS */
function scoreDeltaLiquidity(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v > 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

/** Equity Dilution ≤ 0 → PASS (주식 수 증가 없음) */
function scoreEquityDilution(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v <= 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

/** ΔMargin > 0 → PASS */
function scoreDeltaMargin(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v > 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

/** ΔTurnover > 0 → PASS */
function scoreDeltaTurnover(v: number | null): Pick<PiotroskiCriterion, "pass" | "score"> {
  if (v === null) return { pass: null, score: 0 };
  return v > 0 ? { pass: true, score: PER_CRITERION } : { pass: false, score: 0 };
}

// ─── 스코어링 함수 ──────────────────────────────────────────────────────────

function scoreStock(stock: UniverseStock, data: PiotroskiRawData): PiotroskiAnalyzerResult {
  const criteria: PiotroskiCriterion[] = [
    { key: "roa",             value: data.roa,             maxScore: PER_CRITERION, ...scoreROA(data.roa) },
    { key: "cfo",             value: data.cfo,             maxScore: PER_CRITERION, ...scoreCFO(data.cfo) },
    { key: "deltaRoa",        value: data.deltaRoa,        maxScore: PER_CRITERION, ...scoreDeltaROA(data.deltaRoa) },
    { key: "accruals",        value: data.accruals,        maxScore: PER_CRITERION, ...scoreAccruals(data.accruals) },
    { key: "deltaLeverage",   value: data.deltaLeverage,   maxScore: PER_CRITERION, ...scoreDeltaLeverage(data.deltaLeverage) },
    { key: "deltaLiquidity",  value: data.deltaLiquidity,  maxScore: PER_CRITERION, ...scoreDeltaLiquidity(data.deltaLiquidity) },
    { key: "equityDilution",  value: data.equityDilution,  maxScore: PER_CRITERION, ...scoreEquityDilution(data.equityDilution) },
    { key: "deltaMargin",     value: data.deltaMargin,     maxScore: PER_CRITERION, ...scoreDeltaMargin(data.deltaMargin) },
    { key: "deltaTurnover",   value: data.deltaTurnover,   maxScore: PER_CRITERION, ...scoreDeltaTurnover(data.deltaTurnover) },
  ];

  // F-Score 0-9 → 0-100 환산
  const fScore = criteria.reduce((sum, c) => sum + (c.score > 0 ? 1 : 0), 0);
  const totalScore = Math.round((fScore / 9) * 100);
  return { stock, criteria, totalScore };
}

// ─── 포트폴리오·검색 채점 ──────────────────────────────────────────────────

const PIOTROSKI_DEFAULT: PiotroskiRawData = {
  roa: null, cfo: null, deltaRoa: null, accruals: null,
  deltaLeverage: null, deltaLiquidity: null, equityDilution: null,
  deltaMargin: null, deltaTurnover: null,
};

export function analyzeByTickersPiotroski(
  tickers: Array<{ ticker: string; name?: string }>,
  onProgress?: (p: { phase: "enrich"; done: number; total: number }) => void,
): Promise<PiotroskiAnalyzerResult[]> {
  return analyzeByTickersGeneric({
    tickers,
    fetchData: fetchPiotroskiData,
    defaultRaw: PIOTROSKI_DEFAULT,
    scoreStock,
    onProgress,
  });
}
