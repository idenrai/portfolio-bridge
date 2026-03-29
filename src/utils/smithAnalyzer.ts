import { yahooFetch } from "./yahooCore";
import type { UniverseStock } from "./stockUniverse";

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export type SmithCriterionKey =
  | "returnOnEquity"
  | "operatingMargin"
  | "fcfConversion"
  | "revenueGrowth"
  | "debtToEquity";

export interface SmithCriterion {
  key: SmithCriterionKey;
  value: number | null;
  pass: boolean | null;
  score: number;
  maxScore: number;
}

export interface SmithAnalyzerResult {
  stock: UniverseStock;
  criteria: SmithCriterion[];
  /** 0 – 100 합산 점수 */
  totalScore: number;
}

// ─── quoteSummary에서 Quality Compounder 데이터 추출 ────────────────────────

interface SmithRawData {
  returnOnEquity: number | null;
  operatingMargin: number | null;
  freeCashflow: number | null;
  operatingCashflow: number | null;
  revenueGrowth: number | null;
  debtToEquity: number | null;
}

type RawVal = { raw?: number };

type CfStmt = { freeCashFlow?: RawVal; totalCashFromOperatingActivities?: RawVal };

async function fetchSmithData(symbol: string): Promise<SmithRawData | null> {
  const encoded = encodeURIComponent(symbol);
  const modules = "defaultKeyStatistics,summaryDetail,financialData,cashflowStatementHistory";

  for (const ver of ["v10", "v11"] as const) {
    try {
      const res = await yahooFetch(
        `/api/yahoo/${ver}/finance/quoteSummary/${encoded}?modules=${modules}`,
      );
      if (!res.ok) continue;

      const data = await res.json();
      const result = (data as { quoteSummary?: { result?: unknown[] } })
        ?.quoteSummary?.result?.[0] as Record<string, unknown> | undefined;
      if (!result) continue;

      const fd = (result.financialData ?? {}) as Record<string, RawVal | string>;

      const returnOnEquity = (fd.returnOnEquity as RawVal | undefined)?.raw ?? null;
      const operatingMargin = (fd.operatingMargins as RawVal | undefined)?.raw ?? null;
      let freeCashflow = (fd.freeCashflow as RawVal | undefined)?.raw ?? null;
      let operatingCashflow = (fd.operatingCashflow as RawVal | undefined)?.raw ?? null;
      const revenueGrowth = (fd.revenueGrowth as RawVal | undefined)?.raw ?? null;
      const debtToEquity = (fd.debtToEquity as RawVal | undefined)?.raw ?? null;

      // FCF/OperatingCashflow 폴백: cashflowStatementHistory 최신 연도
      if (freeCashflow === null || operatingCashflow === null) {
        const cfStmts = (result.cashflowStatementHistory as
          { cashflowStatements?: CfStmt[] } | undefined
        )?.cashflowStatements;
        if (cfStmts && cfStmts.length > 0) {
          const latest = cfStmts[0];
          if (freeCashflow === null) {
            freeCashflow = latest.freeCashFlow?.raw ?? null;
          }
          if (operatingCashflow === null) {
            operatingCashflow = latest.totalCashFromOperatingActivities?.raw ?? null;
          }
        }
      }

      return { returnOnEquity, operatingMargin, freeCashflow, operatingCashflow, revenueGrowth, debtToEquity };
    } catch {
      continue;
    }
  }
  return null;
}

// ─── 각 기준별 스코어링 ──────────────────────────────────────────────────────

/**
 * ROE (max 30점) — 스미스: ROIC ≥ 20% 선호 (ROE 프록시)
 * > 30%: 30, 20~30%: 25, 15~20%: 15, 10~15%: 8, ≤ 10%: 0
 */
function scoreROE(roe: number | null): Pick<SmithCriterion, "pass" | "score"> {
  if (roe === null) return { pass: null, score: 0 };
  if (roe > 0.30) return { pass: true, score: 30 };
  if (roe > 0.20) return { pass: true, score: 25 };
  if (roe > 0.15) return { pass: false, score: 15 };
  if (roe > 0.10) return { pass: false, score: 8 };
  return { pass: false, score: 0 };
}

/**
 * 영업이익률 (max 25점) — 스미스: > 15% 선호
 * > 25%: 25, 15~25%: 20, 10~15%: 12, 5~10%: 5, ≤ 5%: 0
 */
function scoreOperatingMargin(m: number | null): Pick<SmithCriterion, "pass" | "score"> {
  if (m === null) return { pass: null, score: 0 };
  if (m > 0.25) return { pass: true, score: 25 };
  if (m > 0.15) return { pass: true, score: 20 };
  if (m > 0.10) return { pass: false, score: 12 };
  if (m > 0.05) return { pass: false, score: 5 };
  return { pass: false, score: 0 };
}

/**
 * FCF 전환율 (max 20점) — FCF / Operating Cashflow
 * > 80%: 20, 60~80%: 15, 40~60%: 8, ≤ 40%: 0
 */
function scoreFCFConversion(
  fcf: number | null,
  opCF: number | null,
): Pick<SmithCriterion, "pass" | "score"> {
  if (fcf === null || opCF === null || opCF <= 0) return { pass: null, score: 0 };
  const ratio = fcf / opCF;
  if (ratio > 0.80) return { pass: true, score: 20 };
  if (ratio > 0.60) return { pass: true, score: 15 };
  if (ratio > 0.40) return { pass: false, score: 8 };
  return { pass: false, score: 0 };
}

/**
 * 매출 성장률 (max 15점)
 * > 15%: 15, 10~15%: 12, 5~10%: 7, 0~5%: 3, ≤ 0%: 0
 */
function scoreRevenueGrowth(g: number | null): Pick<SmithCriterion, "pass" | "score"> {
  if (g === null) return { pass: null, score: 0 };
  if (g > 0.15) return { pass: true, score: 15 };
  if (g > 0.10) return { pass: true, score: 12 };
  if (g > 0.05) return { pass: false, score: 7 };
  if (g > 0) return { pass: false, score: 3 };
  return { pass: false, score: 0 };
}

/**
 * 부채비율 D/E (max 10점) — 낮은 부채 선호
 * < 30: 10, 30~60: 8, 60~100: 4, ≥ 100: 0
 */
function scoreDebtToEquity(de: number | null): Pick<SmithCriterion, "pass" | "score"> {
  if (de === null) return { pass: null, score: 0 };
  if (de < 30) return { pass: true, score: 10 };
  if (de < 60) return { pass: true, score: 8 };
  if (de < 100) return { pass: false, score: 4 };
  return { pass: false, score: 0 };
}

// ─── 스코어링 함수 ──────────────────────────────────────────────────────────

function scoreStock(stock: UniverseStock, data: SmithRawData): SmithAnalyzerResult {
  const roe    = scoreROE(data.returnOnEquity);
  const margin = scoreOperatingMargin(data.operatingMargin);
  const fcf    = scoreFCFConversion(data.freeCashflow, data.operatingCashflow);
  const rev    = scoreRevenueGrowth(data.revenueGrowth);
  const debt   = scoreDebtToEquity(data.debtToEquity);

  const fcfRatio =
    data.freeCashflow !== null && data.operatingCashflow !== null && data.operatingCashflow > 0
      ? data.freeCashflow / data.operatingCashflow
      : null;

  const criteria: SmithCriterion[] = [
    { key: "returnOnEquity",  value: data.returnOnEquity,  maxScore: 30, ...roe    },
    { key: "operatingMargin", value: data.operatingMargin, maxScore: 25, ...margin },
    { key: "fcfConversion",   value: fcfRatio,             maxScore: 20, ...fcf    },
    { key: "revenueGrowth",   value: data.revenueGrowth,   maxScore: 15, ...rev    },
    { key: "debtToEquity",    value: data.debtToEquity,    maxScore: 10, ...debt   },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  return { stock, criteria, totalScore };
}

// ─── 포트폴리오·검색 채점 ──────────────────────────────────────────────────

export async function analyzeByTickersSmith(
  tickers: Array<{ ticker: string; name?: string }>,
  onProgress?: (p: { phase: "enrich"; done: number; total: number }) => void,
): Promise<SmithAnalyzerResult[]> {
  if (tickers.length === 0) return [];

  onProgress?.({ phase: "enrich", done: 0, total: tickers.length });

  const results: SmithAnalyzerResult[] = [];

  for (let i = 0; i < tickers.length; i++) {
    const { ticker, name } = tickers[i];
    const raw = await fetchSmithData(ticker);

    results.push(
      scoreStock(
        { ticker, name: name ?? ticker, market: "OTHER" },
        raw ?? {
          returnOnEquity: null,
          operatingMargin: null,
          freeCashflow: null,
          operatingCashflow: null,
          revenueGrowth: null,
          debtToEquity: null,
        },
      ),
    );

    onProgress?.({ phase: "enrich", done: i + 1, total: tickers.length });

    if (i < tickers.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  return results.sort((a, b) => b.totalScore - a.totalScore);
}
