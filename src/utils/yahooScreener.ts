import { yahooFetch, toMarket } from "./yahooCore";
import type { FundamentalsData } from "./yahooCore";
import type { Market } from "@/types";
import { approxToUSD } from "@/constants";
import type { UniverseStock } from "./stockUniverse";
import { TRENDING_REGIONS, MARKET_SEEDS, MCAP_MIN, MCAP_MAX } from "./stockUniverse";

export interface ScreenerResult {
  stock: UniverseStock;
  data: FundamentalsData;
}

/**
 * Yahoo Finance Trending API (GET)에서 해당 지역의 인기 종목 가져오기.
 */
async function fetchTrendingTickers(region: string, count: number): Promise<string[]> {
  try {
    const res = await yahooFetch(
      `/api/yahoo/v1/finance/trending/${region}?count=${count}`,
    );
    if (!res.ok) {
      console.warn(`[Trending] ${region} HTTP ${res.status}`);
      return [];
    }
    const json = await res.json() as {
      finance?: {
        result?: Array<{
          quotes?: Array<{ symbol?: string }>;
        }>;
      };
    };
    return (json.finance?.result?.[0]?.quotes ?? [])
      .map((q) => q.symbol)
      .filter((s): s is string => !!s);
  } catch (e) {
    console.warn(`[Trending] ${region} error:`, e);
    return [];
  }
}

/**
 * v7 배치 시세 조회 → mapQuote 변환
 */
async function fetchQuoteBatch(
  symbols: string[],
  mapQuote: (q: Record<string, unknown>) => ScreenerResult | null,
  results: ScreenerResult[],
): Promise<void> {
  for (let i = 0; i < symbols.length; i += 50) {
    const chunk = symbols.slice(i, i + 50);
    const joined = chunk.join(",");
    try {
      const res = await yahooFetch(
        `/api/yahoo/v7/finance/quote?formatted=false&lang=en-US&symbols=${joined}`,
      );
      if (res.ok) {
        const json = await res.json() as {
          quoteResponse?: { result?: Array<Record<string, unknown>> };
        };
        for (const q of json.quoteResponse?.result ?? []) {
          const r = mapQuote(q);
          if (r) results.push(r);
        }
      }
    } catch (e) {
      console.warn("[Screener] batch error:", e);
    }
    if (i + 50 < symbols.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

/**
 * 단일 시장에서 종목 후보 가져오기 (내부용)
 */
async function fetchMarketStocks(
  targetMarket: Market | "OTHER",
): Promise<ScreenerResult[]> {
  const seen = new Set<string>();
  const results: ScreenerResult[] = [];

  const mapQuote = (q: Record<string, unknown>): ScreenerResult | null => {
    const sym = q.symbol as string | undefined;
    if (!sym || seen.has(sym)) return null;
    if (q.quoteType !== "EQUITY") return null;

    const num = (v: unknown) => (typeof v === "number" ? v : null);
    const str = (v: unknown) => (typeof v === "string" ? v : null);
    const cap = num(q.marketCap);

    if (cap !== null) {
      const cur = str(q.financialCurrency) ?? str(q.currency);
      const capUSD = approxToUSD(cap, cur ?? "USD");
      if (capUSD < MCAP_MIN || capUSD > MCAP_MAX) return null;
    }

    const stockMarket = toMarket(
      q.exchange as string | undefined,
      q.currency as string | undefined,
      sym,
    );
    if (targetMarket !== "OTHER" && stockMarket !== targetMarket) return null;

    seen.add(sym);
    return {
      stock: {
        ticker: sym,
        name: (q.longName ?? q.shortName ?? sym) as string,
        market: stockMarket,
      },
      data: {
        pegRatio: num(q.pegRatio),
        epsGrowth: num(q.earningsQuarterlyGrowth),
        revenueGrowth: num(q.revenueQuarterlyGrowth),
        debtToEquity: null,
        operatingMargin: null,
        marketCap: cap,
        currency: str(q.financialCurrency) ?? str(q.currency),
      },
    };
  };

  if (targetMarket === "US") {
    const tickers = await fetchTrendingTickers(TRENDING_REGIONS.US, 50);
    const unique = [...new Set(tickers)];
    if (unique.length > 0) {
      await fetchQuoteBatch(unique, mapQuote, results);
    }
    console.log(`[Screener] US trending → ${results.length} equities`);
  }

  const seeds = MARKET_SEEDS[targetMarket];
  if (seeds?.length) {
    const unseen = seeds.filter((t) => !seen.has(t));
    await fetchQuoteBatch(unseen, mapQuote, results);
    console.log(`[Screener] ${targetMarket} seeds → ${results.length} equities`);
  }

  return results;
}

/**
 * 동적 종목 발굴
 *
 * US: Trending API → v7 배치, KR/JP/EU: 시드 티커 풀 → v7 배치
 * EQUITY만 선별, 시가총액 $300M–$30B 범위로 필터링
 */
export async function fetchScreenerStocks(
  market: Market,
  count = 30,
): Promise<ScreenerResult[]> {
  const results = await fetchMarketStocks(market);
  console.log(`[Screener] Final: ${results.length} stocks for market=${market}`);
  return results.slice(0, count);
}
