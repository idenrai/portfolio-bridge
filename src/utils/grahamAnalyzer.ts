import { fetchQuoteSummary, analyzeByTickersGeneric, type RawVal } from "./yahooCore";
import type { UniverseStock } from "./stockUniverse";

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export type GrahamCriterionKey =
  | "peRatio"
  | "pbRatio"
  | "grahamNumber"
  | "currentRatio"
  | "debtToEquity"
  | "dividendYield";

export interface GrahamCriterion {
  key: GrahamCriterionKey;
  value: number | null;
  pass: boolean | null;
  score: number;
  maxScore: number;
}

export interface GrahamAnalyzerResult {
  stock: UniverseStock;
  criteria: GrahamCriterion[];
  /** 0 – 100 합산 점수 */
  totalScore: number;
}

// ─── quoteSummary에서 Graham 데이터 추출 ────────────────────────────────────

interface GrahamRawData {
  peRatio: number | null;
  pbRatio: number | null;
  currentRatio: number | null;
  debtToEquity: number | null;
  dividendYield: number | null;
}

type BalanceStmt = {
  totalCurrentAssets?: RawVal;
  totalCurrentLiabilities?: RawVal;
  totalStockholderEquity?: RawVal;
  longTermDebt?: RawVal;
  shortLongTermDebt?: RawVal;
};

async function fetchGrahamData(symbol: string): Promise<GrahamRawData | null> {
  const result = await fetchQuoteSummary(
    symbol,
    "defaultKeyStatistics,summaryDetail,financialData,balanceSheetHistory",
  );
  if (!result) return null;

  const ks = (result.defaultKeyStatistics ?? {}) as Record<string, RawVal>;
  const sd = (result.summaryDetail ?? {}) as Record<string, RawVal>;
  const fd = (result.financialData ?? {}) as Record<string, RawVal | string>;

  // P/E: trailingPE → forwardPE → currentPrice / epsTrailingTwelveMonths
  let peRatio = sd.trailingPE?.raw ?? null;
  if (peRatio === null) peRatio = sd.forwardPE?.raw ?? null;
  if (peRatio === null) {
    const price = (fd.currentPrice as RawVal | undefined)?.raw ?? sd.previousClose?.raw ?? null;
    const eps = sd.epsTrailingTwelveMonths?.raw ?? (fd.epsTrailingTwelveMonths as RawVal | undefined)?.raw ?? null;
    if (price != null && eps != null && eps > 0) peRatio = price / eps;
  }

  // P/B: priceToBook → currentPrice / bookValue
  let pbRatio = sd.priceToBook?.raw ?? null;
  if (pbRatio === null) {
    const bookValue = ks.bookValue?.raw ?? null;
    const price = (fd.currentPrice as RawVal | undefined)?.raw ?? sd.previousClose?.raw ?? null;
    if (bookValue !== null && bookValue > 0 && price !== null && price > 0) {
      pbRatio = price / bookValue;
    }
  }

  let currentRatio = (fd.currentRatio as RawVal | undefined)?.raw ?? null;
  let debtToEquity = (fd.debtToEquity as RawVal | undefined)?.raw ?? null;

  // balanceSheetHistory 폴백: currentRatio, debtToEquity
  const bsStmts = (result.balanceSheetHistory as
    { balanceSheetStatements?: BalanceStmt[] } | undefined
  )?.balanceSheetStatements;
  if (bsStmts && bsStmts.length > 0) {
    const bs = bsStmts[0];
    if (currentRatio === null) {
      const ca = bs.totalCurrentAssets?.raw;
      const cl = bs.totalCurrentLiabilities?.raw;
      if (ca != null && cl != null && cl > 0) currentRatio = ca / cl;
    }
    if (debtToEquity === null) {
      const equity = bs.totalStockholderEquity?.raw;
      const debt = (bs.longTermDebt?.raw ?? 0) + (bs.shortLongTermDebt?.raw ?? 0);
      if (equity != null && equity > 0 && debt > 0) debtToEquity = (debt / equity) * 100;
    }
  }

  // 배당수익률: dividendYield → trailingAnnualDividendYield
  let dividendYield = sd.dividendYield?.raw ?? null;
  if (dividendYield === null) {
    dividendYield = sd.trailingAnnualDividendYield?.raw ?? null;
  }

  return { peRatio, pbRatio, currentRatio, debtToEquity, dividendYield };
}

// ─── 각 기준별 스코어링 ──────────────────────────────────────────────────────

/**
 * P/E 비율 (max 25점) — 그레이엄: < 15 선호
 * < 8: 25, 8~10: 22, 10~12: 18, 12~15: 14, 15~18: 8, 18~20: 4, ≥ 20: 0
 */
function scorePE(pe: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (pe === null || pe <= 0) return { pass: null, score: 0 };
  if (pe < 8)  return { pass: true,  score: 25 };
  if (pe < 10) return { pass: true,  score: 22 };
  if (pe < 12) return { pass: true,  score: 18 };
  if (pe < 15) return { pass: true,  score: 14 };
  if (pe < 18) return { pass: false, score: 8 };
  if (pe < 20) return { pass: false, score: 4 };
  return { pass: false, score: 0 };
}

/**
 * P/B 비율 (max 20점) — 그레이엄: < 1.5 선호
 * < 0.7: 20, 0.7~1.0: 17, 1.0~1.2: 14, 1.2~1.5: 11, 1.5~2.0: 6, 2.0~3.0: 3, ≥ 3: 0
 */
function scorePB(pb: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (pb === null || pb <= 0) return { pass: null, score: 0 };
  if (pb < 0.7) return { pass: true,  score: 20 };
  if (pb < 1.0) return { pass: true,  score: 17 };
  if (pb < 1.2) return { pass: true,  score: 14 };
  if (pb < 1.5) return { pass: true,  score: 11 };
  if (pb < 2.0) return { pass: false, score: 6 };
  if (pb < 3.0) return { pass: false, score: 3 };
  return { pass: false, score: 0 };
}

/**
 * 그레이엄 넘버: P/E × P/B (max 20점) — < 22.5 선호
 * < 10: 20, 10~15: 17, 15~18: 14, 18~22.5: 10, 22.5~30: 6, 30~40: 3, ≥ 40: 0
 */
function scoreGrahamNumber(pe: number | null, pb: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (pe === null || pe <= 0 || pb === null || pb <= 0) return { pass: null, score: 0 };
  const product = pe * pb;
  if (product < 10)   return { pass: true,  score: 20 };
  if (product < 15)   return { pass: true,  score: 17 };
  if (product < 18)   return { pass: true,  score: 14 };
  if (product < 22.5) return { pass: true,  score: 10 };
  if (product < 30)   return { pass: false, score: 6 };
  if (product < 40)   return { pass: false, score: 3 };
  return { pass: false, score: 0 };
}

/**
 * 유동비율 Current Ratio (max 15점) — 그레이엄: > 2.0 선호
 * > 2.5: 15, 2.0~2.5: 12, 1.5~2.0: 7, 1.0~1.5: 3, < 1.0: 0
 */
function scoreCurrentRatio(cr: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (cr === null) return { pass: null, score: 0 };
  if (cr > 2.5) return { pass: true, score: 15 };
  if (cr > 2.0) return { pass: true, score: 12 };
  if (cr > 1.5) return { pass: false, score: 7 };
  if (cr > 1.0) return { pass: false, score: 3 };
  return { pass: false, score: 0 };
}

/**
 * 부채비율 D/E (max 10점) — 그레이엄: 낮은 부채 선호
 * < 20: 10, 20~30: 8, 30~50: 6, 50~80: 4, 80~100: 2, ≥ 100: 0
 */
function scoreDebtToEquity(de: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (de === null) return { pass: null, score: 0 };
  if (de < 20)  return { pass: true,  score: 10 };
  if (de < 30)  return { pass: true,  score: 8 };
  if (de < 50)  return { pass: false, score: 6 };
  if (de < 80)  return { pass: false, score: 4 };
  if (de < 100) return { pass: false, score: 2 };
  return { pass: false, score: 0 };
}

/**
 * 배당수익률 (max 10점) — 그레이엄: 안정적 배당 선호
 * > 4%: 10, 3~4%: 8, 2~3%: 5, 1~2%: 2, < 1%: 0
 */
function scoreDividendYield(dy: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (dy === null) return { pass: null, score: 0 };
  if (dy > 0.04) return { pass: true, score: 10 };
  if (dy > 0.03) return { pass: true, score: 8 };
  if (dy > 0.02) return { pass: false, score: 5 };
  if (dy > 0.01) return { pass: false, score: 2 };
  return { pass: false, score: 0 };
}

// ─── 스코어링 함수 ──────────────────────────────────────────────────────────

function scoreStock(stock: UniverseStock, data: GrahamRawData): GrahamAnalyzerResult {
  const pe  = scorePE(data.peRatio);
  const pb  = scorePB(data.pbRatio);
  const gn  = scoreGrahamNumber(data.peRatio, data.pbRatio);
  const cr  = scoreCurrentRatio(data.currentRatio);
  const de  = scoreDebtToEquity(data.debtToEquity);
  const dy  = scoreDividendYield(data.dividendYield);

  const grahamProduct =
    data.peRatio !== null && data.peRatio > 0 && data.pbRatio !== null && data.pbRatio > 0
      ? data.peRatio * data.pbRatio
      : null;

  const criteria: GrahamCriterion[] = [
    { key: "peRatio",       value: data.peRatio,       maxScore: 25, ...pe },
    { key: "pbRatio",       value: data.pbRatio,       maxScore: 20, ...pb },
    { key: "grahamNumber",  value: grahamProduct,      maxScore: 20, ...gn },
    { key: "currentRatio",  value: data.currentRatio,  maxScore: 15, ...cr },
    { key: "debtToEquity",  value: data.debtToEquity,  maxScore: 10, ...de },
    { key: "dividendYield", value: data.dividendYield, maxScore: 10, ...dy },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  return { stock, criteria, totalScore };
}

// ─── 포트폴리오·검색 채점 ──────────────────────────────────────────────────

const GRAHAM_DEFAULT: GrahamRawData = {
  peRatio: null, pbRatio: null, currentRatio: null, debtToEquity: null, dividendYield: null,
};

export function analyzeByTickersGraham(
  tickers: Array<{ ticker: string; name?: string }>,
  onProgress?: (p: { phase: "enrich"; done: number; total: number }) => void,
): Promise<GrahamAnalyzerResult[]> {
  return analyzeByTickersGeneric({
    tickers,
    fetchData: fetchGrahamData,
    defaultRaw: GRAHAM_DEFAULT,
    scoreStock,
    onProgress,
  });
}
