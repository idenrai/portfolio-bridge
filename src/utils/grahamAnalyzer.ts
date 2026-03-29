import { yahooFetch } from "./yahooCore";
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

type RawVal = { raw?: number };

async function fetchGrahamData(symbol: string): Promise<GrahamRawData | null> {
  const encoded = encodeURIComponent(symbol);
  const modules = "defaultKeyStatistics,summaryDetail,financialData";

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

      const ks = (result.defaultKeyStatistics ?? {}) as Record<string, RawVal>;
      const sd = (result.summaryDetail ?? {}) as Record<string, RawVal>;
      const fd = (result.financialData ?? {}) as Record<string, RawVal | string>;

      const peRatio = sd.trailingPE?.raw ?? null;

      // P/B: summaryDetail.priceToBook 우선, 없으면 currentPrice / bookValue 폴백
      let pbRatio = sd.priceToBook?.raw ?? null;
      if (pbRatio === null) {
        const bookValue = ks.bookValue?.raw ?? null;
        const price = (fd.currentPrice as RawVal | undefined)?.raw ?? sd.previousClose?.raw ?? null;
        if (bookValue !== null && bookValue > 0 && price !== null && price > 0) {
          pbRatio = price / bookValue;
        }
      }

      const currentRatio = (fd.currentRatio as RawVal | undefined)?.raw ?? null;
      const debtToEquity = (fd.debtToEquity as RawVal | undefined)?.raw ?? null;
      const dividendYield = sd.dividendYield?.raw ?? null;

      return { peRatio, pbRatio, currentRatio, debtToEquity, dividendYield };
    } catch {
      continue;
    }
  }
  return null;
}

// ─── 각 기준별 스코어링 ──────────────────────────────────────────────────────

/**
 * P/E 비율 (max 25점) — 그레이엄: < 15 선호
 * < 10: 25, 10~15: 20, 15~20: 10, ≥ 20: 0
 */
function scorePE(pe: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (pe === null || pe <= 0) return { pass: null, score: 0 };
  if (pe < 10) return { pass: true, score: 25 };
  if (pe < 15) return { pass: true, score: 20 };
  if (pe < 20) return { pass: false, score: 10 };
  return { pass: false, score: 0 };
}

/**
 * P/B 비율 (max 20점) — 그레이엄: < 1.5 선호
 * < 1.0: 20, 1.0~1.5: 15, 1.5~3.0: 8, ≥ 3.0: 0
 */
function scorePB(pb: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (pb === null || pb <= 0) return { pass: null, score: 0 };
  if (pb < 1.0) return { pass: true, score: 20 };
  if (pb < 1.5) return { pass: true, score: 15 };
  if (pb < 3.0) return { pass: false, score: 8 };
  return { pass: false, score: 0 };
}

/**
 * 그레이엄 넘버: P/E × P/B (max 20점) — < 22.5 선호
 * < 15: 20, 15~22.5: 15, 22.5~40: 8, ≥ 40: 0
 */
function scoreGrahamNumber(pe: number | null, pb: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (pe === null || pe <= 0 || pb === null || pb <= 0) return { pass: null, score: 0 };
  const product = pe * pb;
  if (product < 15) return { pass: true, score: 20 };
  if (product < 22.5) return { pass: true, score: 15 };
  if (product < 40) return { pass: false, score: 8 };
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
 * < 30: 10, 30~50: 8, 50~100: 4, ≥ 100: 0
 */
function scoreDebtToEquity(de: number | null): Pick<GrahamCriterion, "pass" | "score"> {
  if (de === null) return { pass: null, score: 0 };
  if (de < 30) return { pass: true, score: 10 };
  if (de < 50) return { pass: true, score: 8 };
  if (de < 100) return { pass: false, score: 4 };
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

export async function analyzeByTickersGraham(
  tickers: Array<{ ticker: string; name?: string }>,
  onProgress?: (p: { phase: "enrich"; done: number; total: number }) => void,
): Promise<GrahamAnalyzerResult[]> {
  if (tickers.length === 0) return [];

  onProgress?.({ phase: "enrich", done: 0, total: tickers.length });

  const results: GrahamAnalyzerResult[] = [];

  for (let i = 0; i < tickers.length; i++) {
    const { ticker, name } = tickers[i];
    const raw = await fetchGrahamData(ticker);

    results.push(
      scoreStock(
        { ticker, name: name ?? ticker, market: "OTHER" },
        raw ?? {
          peRatio: null,
          pbRatio: null,
          currentRatio: null,
          debtToEquity: null,
          dividendYield: null,
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
