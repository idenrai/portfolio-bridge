import { yahooFetch } from "./yahooCore";
import type { FundamentalsData } from "./yahooCore";

type RawVal = { raw?: number };
type RawStr = { raw?: number } | string;
type Stmt = { totalRevenue?: RawVal; dilutedEPS?: RawVal };

/** quoteSummary JSON → FundamentalsData 변환 */
function parseQuoteSummary(data: unknown): FundamentalsData | null {
  const result = (data as { quoteSummary?: { result?: unknown[] } })
    ?.quoteSummary?.result?.[0] as Record<string, unknown> | undefined;
  if (!result) return null;

  const ks = (result.defaultKeyStatistics ?? {}) as Record<string, RawVal>;
  const sd = (result.summaryDetail        ?? {}) as Record<string, RawVal>;
  const fd = (result.financialData        ?? {}) as Record<string, RawStr>;

  let epsGrowth     = (fd.earningsGrowth as RawVal | undefined)?.raw ?? null;
  let revenueGrowth = (fd.revenueGrowth  as RawVal | undefined)?.raw ?? null;

  const stmts = (result.incomeStatementHistory as
    { incomeStatementHistory?: Stmt[] } | undefined
  )?.incomeStatementHistory;

  if (stmts && stmts.length >= 2) {
    const curr = stmts[0];
    const prev = stmts[1];
    if (
      epsGrowth === null &&
      curr.dilutedEPS?.raw != null && prev.dilutedEPS?.raw != null &&
      prev.dilutedEPS.raw !== 0
    ) {
      epsGrowth = (curr.dilutedEPS.raw - prev.dilutedEPS.raw) / Math.abs(prev.dilutedEPS.raw);
    }
    if (
      revenueGrowth === null &&
      curr.totalRevenue?.raw != null && prev.totalRevenue?.raw != null &&
      prev.totalRevenue.raw !== 0
    ) {
      revenueGrowth = (curr.totalRevenue.raw - prev.totalRevenue.raw) / Math.abs(prev.totalRevenue.raw);
    }
  }

  const marketCap = sd.marketCap?.raw ?? ks.marketCap?.raw ?? null;

  // PEG: Yahoo 제공값 우선, 없으면 trailingPE / (epsGrowth * 100) 로 계산
  const peRatio = sd.trailingPE?.raw ?? sd.forwardPE?.raw ?? null;
  const pegRatio = ks.pegRatio?.raw
    ?? (peRatio !== null && epsGrowth !== null && epsGrowth > 0
        ? peRatio / (epsGrowth * 100)
        : null);

  return {
    pegRatio,
    epsGrowth,
    revenueGrowth,
    debtToEquity:   (fd.debtToEquity   as RawVal | undefined)?.raw ?? null,
    operatingMargin:(fd.operatingMargins as RawVal | undefined)?.raw ?? null,
    marketCap,
    currency: typeof fd.financialCurrency === "string" ? fd.financialCurrency : null,
  };
}

/**
 * Yahoo Finance quoteSummary 기반 재무 펀더멘털 조회
 */
export async function fetchFundamentals(
  symbol: string,
): Promise<FundamentalsData | null> {
  const encoded = encodeURIComponent(symbol);
  const modules = "defaultKeyStatistics,summaryDetail,financialData,incomeStatementHistory";

  // v10, v11 시도
  for (const ver of ["v10", "v11"] as const) {
    try {
      const res = await yahooFetch(
        `/api/yahoo/${ver}/finance/quoteSummary/${encoded}?modules=${modules}`,
      );
      if (res.ok) {
        const json = await res.json();
        const parsed = parseQuoteSummary(json);
        if (parsed) return parsed;
        if (import.meta.env.DEV) {
          console.warn(`[Lynch] ${symbol} ${ver} 파싱 실패:`, JSON.stringify(json).slice(0, 400));
        }
      } else if (import.meta.env.DEV) {
        console.warn(`[Lynch] ${symbol} ${ver} HTTP ${res.status}`);
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn(`[Lynch] ${symbol} ${ver} 오류:`, e);
    }
  }

  // v8 chart 폴백
  try {
    const res = await yahooFetch(
      `/api/yahoo/v8/finance/chart/${encoded}?interval=1d&range=1d`,
    );
    if (res.ok) {
      const data = await res.json() as {
        chart?: { result?: Array<{ meta?: Record<string, number | string> }> }
      };
      const meta = data.chart?.result?.[0]?.meta;
      if (meta?.marketCap) {
        return {
          pegRatio: null, epsGrowth: null, revenueGrowth: null,
          debtToEquity: null, operatingMargin: null,
          marketCap: typeof meta.marketCap === "number" ? meta.marketCap : null,
          currency: typeof meta.currency === "string" ? meta.currency : null,
        };
      }
    }
  } catch { /* ignore */ }

  return null;
}

/**
 * 단일 종목 quoteSummary 보강
 */
export async function enrichFundamentals(
  symbol: string,
  base: FundamentalsData,
): Promise<FundamentalsData> {
  const detail = await fetchFundamentals(symbol);
  if (!detail) return base;

  return {
    pegRatio:       detail.pegRatio       ?? base.pegRatio,
    epsGrowth:      detail.epsGrowth      ?? base.epsGrowth,
    revenueGrowth:  detail.revenueGrowth  ?? base.revenueGrowth,
    debtToEquity:   detail.debtToEquity   ?? base.debtToEquity,
    operatingMargin:detail.operatingMargin ?? base.operatingMargin,
    marketCap:      detail.marketCap      ?? base.marketCap,
    currency:       detail.currency       ?? base.currency,
  };
}

/**
 * v7 배치 시세 조회 → FundamentalsData 맵 반환
 */
export async function fetchBatchQuote(
  symbols: string[],
  chunkDelay = 1500,
  onChunkDone?: (done: number, total: number) => void,
): Promise<Map<string, FundamentalsData>> {
  const CHUNK_SIZE = 15;
  const map = new Map<string, FundamentalsData>();
  let done = 0;

  for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
    const chunk = symbols.slice(i, i + CHUNK_SIZE);
    const joined = chunk.map(s => encodeURIComponent(s)).join(",");

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await yahooFetch(
          `/api/yahoo/v7/finance/quote?formatted=false&lang=en-US&region=US&symbols=${joined}`,
        );

        if (res.status === 429) {
          console.warn(`[BatchQuote] 429 rate limit, attempt ${attempt + 1}`);
          await new Promise(r => setTimeout(r, 2000 * 2 ** attempt));
          continue;
        }

        if (!res.ok) {
          console.warn(`[BatchQuote] HTTP ${res.status} for chunk`, chunk.join(","));
          break;
        }

        const data = await res.json() as {
          quoteResponse?: { result?: Array<Record<string, unknown>> };
        };

        const results = data.quoteResponse?.result ?? [];
        console.log(`[BatchQuote] chunk got ${results.length} results for ${chunk.length} symbols`);

        for (const q of results) {
          const sym = q.symbol as string;
          if (!sym) continue;

          const num = (v: unknown) => typeof v === "number" ? v : null;
          const str = (v: unknown) => typeof v === "string" ? v : null;

          map.set(sym, {
            pegRatio:       num(q.pegRatio),
            epsGrowth:      num(q.earningsQuarterlyGrowth),
            revenueGrowth:  num(q.revenueQuarterlyGrowth) ?? null,
            debtToEquity:   null,
            operatingMargin:null,
            marketCap:      num(q.marketCap),
            currency:       str(q.financialCurrency) ?? str(q.currency),
          });
        }
        break;
      } catch (e) {
        console.warn(`[BatchQuote] error attempt ${attempt + 1}:`, e);
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    done += chunk.length;
    onChunkDone?.(Math.min(done, symbols.length), symbols.length);

    if (i + CHUNK_SIZE < symbols.length) {
      await new Promise(r => setTimeout(r, chunkDelay));
    }
  }

  // v7 배치가 전혀 데이터를 못 가져온 경우 → 개별 quoteSummary 폴백
  if (map.size === 0 && symbols.length > 0) {
    console.warn(`[BatchQuote] v7 batch returned 0 data, falling back to individual quoteSummary`);
    let fallbackDone = 0;
    for (const sym of symbols) {
      try {
        const detail = await fetchFundamentals(sym);
        if (detail) map.set(sym, detail);
      } catch { /* ignore */ }
      fallbackDone++;
      onChunkDone?.(fallbackDone, symbols.length);
      if (fallbackDone < symbols.length) {
        await new Promise(r => setTimeout(r, 1200));
      }
    }
  }

  return map;
}
