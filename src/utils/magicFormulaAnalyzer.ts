import { fetchQuoteSummary, analyzeByTickersGeneric, type RawVal } from "./yahooCore";
import type { UniverseStock } from "./stockUniverse";
import { approxToUSD } from "@/constants";

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export type MFCriterionKey =
  | "earningsYield"
  | "returnOnCapital"
  | "operatingMargin"
  | "debtToEquity"
  | "marketCap";

export interface MFCriterion {
  key: MFCriterionKey;
  value: number | null;
  pass: boolean | null;
  score: number;
  maxScore: number;
}

export interface MFAnalyzerResult {
  stock: UniverseStock;
  criteria: MFCriterion[];
  /** 0 – 100 합산 점수 */
  totalScore: number;
}

// ─── quoteSummary에서 Magic Formula 데이터 추출 ─────────────────────────────

interface MFRawData {
  earningsYield: number | null;
  returnOnCapital: number | null;
  operatingMargin: number | null;
  debtToEquity: number | null;
  marketCap: number | null;
  currency: string | null;
}

type IncStmt = { operatingIncome?: RawVal; totalRevenue?: RawVal; netIncome?: RawVal };
type BalStmt = { totalStockholderEquity?: RawVal; longTermDebt?: RawVal; shortLongTermDebt?: RawVal };

async function fetchMFData(symbol: string): Promise<MFRawData | null> {
  const result = await fetchQuoteSummary(
    symbol,
    "defaultKeyStatistics,summaryDetail,financialData,incomeStatementHistory,balanceSheetHistory",
  );
  if (!result) return null;

  const ks = (result.defaultKeyStatistics ?? {}) as Record<string, RawVal>;
  const sd = (result.summaryDetail ?? {}) as Record<string, RawVal>;
  const fd = (result.financialData ?? {}) as Record<string, RawVal | string>;

  // Earnings Yield: 1/EV÷EBITDA → 폴백: 1/trailingPE 또는 eps/price
  const evToEbitda = ks.enterpriseToEbitda?.raw ?? null;
  let earningsYield = evToEbitda && evToEbitda > 0 ? 1 / evToEbitda : null;
  if (earningsYield === null) {
    const pe = sd.trailingPE?.raw ?? sd.forwardPE?.raw ?? null;
    if (pe != null && pe > 0) earningsYield = 1 / pe;
  }

  let returnOnCapital = (fd.returnOnEquity as RawVal | undefined)?.raw ?? null;
  let operatingMargin = (fd.operatingMargins as RawVal | undefined)?.raw ?? null;
  let debtToEquity = (fd.debtToEquity as RawVal | undefined)?.raw ?? null;
  const marketCap = sd.marketCap?.raw ?? ks.marketCap?.raw ?? null;
  const currency = typeof fd.financialCurrency === "string" ? fd.financialCurrency : null;

  // incomeStatementHistory 폴백: operatingMargin, ROC
  const incStmts = (result.incomeStatementHistory as
    { incomeStatementHistory?: IncStmt[] } | undefined
  )?.incomeStatementHistory;

  if (incStmts && incStmts.length >= 1) {
    const curr = incStmts[0];
    if (operatingMargin === null && curr.operatingIncome?.raw != null && curr.totalRevenue?.raw != null && curr.totalRevenue.raw !== 0) {
      operatingMargin = curr.operatingIncome.raw / curr.totalRevenue.raw;
    }
    // ROC 폴백: netIncome / totalStockholderEquity
    if (returnOnCapital === null && curr.netIncome?.raw != null) {
      const bsStmts = (result.balanceSheetHistory as
        { balanceSheetStatements?: BalStmt[] } | undefined
      )?.balanceSheetStatements;
      if (bsStmts && bsStmts.length > 0) {
        const equity = bsStmts[0].totalStockholderEquity?.raw;
        if (equity != null && equity > 0) {
          returnOnCapital = curr.netIncome.raw / equity;
        }
      }
    }
  }

  // D/E 폴백: balanceSheetHistory
  if (debtToEquity === null) {
    const bsStmts = (result.balanceSheetHistory as
      { balanceSheetStatements?: BalStmt[] } | undefined
    )?.balanceSheetStatements;
    if (bsStmts && bsStmts.length > 0) {
      const bs = bsStmts[0];
      const equity = bs.totalStockholderEquity?.raw;
      const debt = (bs.longTermDebt?.raw ?? 0) + (bs.shortLongTermDebt?.raw ?? 0);
      if (equity != null && equity > 0 && debt > 0) debtToEquity = (debt / equity) * 100;
    }
  }

  return { earningsYield, returnOnCapital, operatingMargin, debtToEquity, marketCap, currency };
}

// ─── 각 기준별 스코어링 ──────────────────────────────────────────────────────

/**
 * Earnings Yield (max 30점)
 * > 15%: 30, 10~15%: 25, 7~10%: 18, 4~7%: 10, ≤ 4%: 0
 */
function scoreEarningsYield(ey: number | null): Pick<MFCriterion, "pass" | "score"> {
  if (ey === null || ey <= 0) return { pass: null, score: 0 };
  if (ey > 0.15) return { pass: true, score: 30 };
  if (ey > 0.10) return { pass: true, score: 25 };
  if (ey > 0.07) return { pass: true, score: 18 };
  if (ey > 0.04) return { pass: false, score: 10 };
  return { pass: false, score: 0 };
}

/**
 * Return on Capital (max 30점) — ROE 프록시
 * > 40%: 30, 25~40%: 25, 15~25%: 18, 8~15%: 10, ≤ 8%: 0
 */
function scoreReturnOnCapital(roc: number | null): Pick<MFCriterion, "pass" | "score"> {
  if (roc === null) return { pass: null, score: 0 };
  if (roc > 0.40) return { pass: true, score: 30 };
  if (roc > 0.25) return { pass: true, score: 25 };
  if (roc > 0.15) return { pass: true, score: 18 };
  if (roc > 0.08) return { pass: false, score: 10 };
  return { pass: false, score: 0 };
}

/**
 * 영업이익률 (max 15점)
 * > 25%: 15, 15~25%: 12, 10~15%: 8, 5~10%: 4, ≤ 5%: 0
 */
function scoreOperatingMargin(m: number | null): Pick<MFCriterion, "pass" | "score"> {
  if (m === null) return { pass: null, score: 0 };
  if (m > 0.25) return { pass: true, score: 15 };
  if (m > 0.15) return { pass: true, score: 12 };
  if (m > 0.10) return { pass: false, score: 8 };
  if (m > 0.05) return { pass: false, score: 4 };
  return { pass: false, score: 0 };
}

/**
 * 부채비율 D/E (max 15점)
 * < 20: 15, 20~30: 13, 30~50: 10, 50~80: 7, 80~120: 4, 120~150: 2, ≥ 150: 0
 */
function scoreDebtToEquity(de: number | null): Pick<MFCriterion, "pass" | "score"> {
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
 * 시가총액 (max 10점) — 중형주 선호
 * $1B–$10B: 10, $300M–$1B: 8, $10B–$50B: 6,
 * $100M–$300M: 4, $50B–$200B: 3, else: 1
 */
function scoreMarketCap(cap: number | null, currency: string | null): Pick<MFCriterion, "pass" | "score"> {
  if (cap === null) return { pass: null, score: 0 };
  const M = 1_000_000;
  const B = 1_000_000_000;
  const capUSD = approxToUSD(cap, currency ?? "USD");
  if (capUSD >= 1 * B && capUSD < 10 * B)   return { pass: true,  score: 10 };
  if (capUSD >= 300 * M && capUSD < 1 * B)   return { pass: true,  score: 8 };
  if (capUSD >= 10 * B && capUSD < 50 * B)   return { pass: true,  score: 6 };
  if (capUSD >= 100 * M && capUSD < 300 * M) return { pass: false, score: 4 };
  if (capUSD >= 50 * B && capUSD < 200 * B)  return { pass: false, score: 3 };
  return { pass: false, score: 1 };
}

// ─── 스코어링 함수 ──────────────────────────────────────────────────────────

function scoreStock(stock: UniverseStock, data: MFRawData): MFAnalyzerResult {
  const ey     = scoreEarningsYield(data.earningsYield);
  const roc    = scoreReturnOnCapital(data.returnOnCapital);
  const margin = scoreOperatingMargin(data.operatingMargin);
  const debt   = scoreDebtToEquity(data.debtToEquity);
  const cap    = scoreMarketCap(data.marketCap, data.currency);

  const capUSD = data.marketCap !== null ? approxToUSD(data.marketCap, data.currency ?? "USD") : null;

  const criteria: MFCriterion[] = [
    { key: "earningsYield",   value: data.earningsYield,   maxScore: 30, ...ey     },
    { key: "returnOnCapital", value: data.returnOnCapital, maxScore: 30, ...roc    },
    { key: "operatingMargin", value: data.operatingMargin, maxScore: 15, ...margin },
    { key: "debtToEquity",    value: data.debtToEquity,    maxScore: 15, ...debt   },
    { key: "marketCap",       value: capUSD,               maxScore: 10, ...cap    },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  return { stock, criteria, totalScore };
}

// ─── 포트폴리오·검색 스크리너 ──────────────────────────────────────────────

const MF_DEFAULT: MFRawData = {
  earningsYield: null, returnOnCapital: null, operatingMargin: null,
  debtToEquity: null, marketCap: null, currency: null,
};

export function analyzeByTickersMF(
  tickers: Array<{ ticker: string; name?: string }>,
  onProgress?: (p: { phase: "enrich"; done: number; total: number }) => void,
): Promise<MFAnalyzerResult[]> {
  return analyzeByTickersGeneric({
    tickers,
    fetchData: fetchMFData,
    defaultRaw: MF_DEFAULT,
    scoreStock,
    onProgress,
  });
}
