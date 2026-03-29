import { yahooFetch, toMarket } from "./yahooCore";
import type { FundamentalsData } from "./yahooCore";
import type { Market } from "@/types";
import { approxToUSD } from "@/constants";
import type { UniverseStock } from "./stockUniverse";
import { MARKET_REGIONS, TRENDING_REGIONS, MCAP_MIN, MCAP_MAX } from "./stockUniverse";

export interface ScreenerResult {
  stock: UniverseStock;
  data: FundamentalsData;
}

// ─── Yahoo Finance POST Screener API ────────────────────────────────────────

interface ScreenerOperand {
  operator: string;
  operands: (ScreenerOperand | string | number)[];
}

/**
 * Yahoo Finance POST /v1/finance/screener API로 종목 심볼 동적 발굴.
 * 시가총액 범위 + 지역 필터로 하드코딩 없이 실시간 종목 후보를 가져온다.
 */
async function fetchScreenerByPost(
  market: Market,
  size: number,
): Promise<string[]> {
  const regions = MARKET_REGIONS[market];

  const regionOperands: ScreenerOperand[] = regions.map((r) => ({
    operator: "EQ",
    operands: ["region", r],
  }));
  const regionFilter: ScreenerOperand =
    regionOperands.length === 1
      ? regionOperands[0]
      : { operator: "or", operands: regionOperands };

  const body = {
    size,
    offset: 0,
    sortField: "intradaymarketcap",
    sortType: "DESC",
    quoteType: "EQUITY",
    query: {
      operator: "AND",
      operands: [
        regionFilter,
        { operator: "GT", operands: ["intradaymarketcap", MCAP_MIN] },
        { operator: "LT", operands: ["intradaymarketcap", MCAP_MAX] },
      ],
    },
    userId: "",
    userIdType: "guid",
  };

  try {
    const res = await yahooFetch("/api/yahoo/v1/finance/screener", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`[Screener] POST API ${res.status} for ${market}`);
      return [];
    }

    const json = (await res.json()) as {
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
    console.warn(`[Screener] POST API error for ${market}:`, e);
    return [];
  }
}

// ─── Trending API (fallback) ────────────────────────────────────────────────

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

// ─── v7 배치 시세 조회 ──────────────────────────────────────────────────────

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

// ─── 종목 발굴 메인 로직 ────────────────────────────────────────────────────

/**
 * 단일 시장에서 종목 후보 가져오기.
 *
 * 1차: POST Screener API (시가총액 + 지역 동적 필터)
 * 2차: Trending API fallback (POST 실패 시)
 */
async function fetchMarketStocks(
  targetMarket: Market,
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
    if (stockMarket !== targetMarket) return null;

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

  // 1차: POST Screener API
  const screenerSymbols = await fetchScreenerByPost(targetMarket, 100);
  if (screenerSymbols.length > 0) {
    await fetchQuoteBatch(screenerSymbols, mapQuote, results);
    console.log(
      `[Screener] ${targetMarket} POST API → ${screenerSymbols.length} symbols → ${results.length} equities`,
    );
  }

  // 2차: Trending API fallback (결과 부족 시)
  if (results.length < 10) {
    const regions = TRENDING_REGIONS[targetMarket];
    for (const region of regions) {
      const tickers = await fetchTrendingTickers(region, 50);
      const unseen = tickers.filter((t) => !seen.has(t));
      if (unseen.length > 0) {
        await fetchQuoteBatch(unseen, mapQuote, results);
      }
    }
    if (results.length > 0) {
      console.log(
        `[Screener] ${targetMarket} trending fallback → ${results.length} equities`,
      );
    }
  }

  return results;
}

/**
 * 동적 종목 발굴
 *
 * POST Screener API로 시가총액 $300M–$30B + 지역 필터 → v7 배치로 상세 데이터
 * 실패 시 Trending API fallback
 */
export async function fetchScreenerStocks(
  market: Market,
  count = 30,
): Promise<ScreenerResult[]> {
  const results = await fetchMarketStocks(market);
  console.log(`[Screener] Final: ${results.length} stocks for market=${market}`);
  return results.slice(0, count);
}
