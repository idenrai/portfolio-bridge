import { yahooFetch, isISIN, toAssetType, toMarket, toCurrency } from "./yahooCore";
import type { TickerSearchItem } from "./yahooCore";

/**
 * 티커/종목명/ISIN으로 Yahoo Finance 검색
 */
export async function searchTicker(query: string): Promise<TickerSearchItem[]> {
  const q = query.trim();
  const enhanced = isISIN(q);

  const usUrl =
    `/api/yahoo/v1/finance/search?q=${encodeURIComponent(q)}` +
    `&quotesCount=20&newsCount=0` +
    `&enableFuzzyQuery=true&enableCb=false` +
    `&enableNavLinks=false&enableEnhancedTrivialQuery=${enhanced}`;

  const usResult = await yahooFetch(usUrl)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

  if (!usResult) return [];

  const quotes = (usResult.quotes ?? []) as Array<{
    symbol: string;
    longname?: string;
    shortname?: string;
    quoteType?: string;
    exchange?: string;
    currency?: string;
  }>;

  return quotes
    .filter((q) => Boolean(q.symbol))
    .map((q) => {
      const market = toMarket(q.exchange, q.currency, q.symbol);
      return {
        ticker: q.symbol,
        name: q.longname ?? q.shortname ?? q.symbol,
        type: toAssetType(q.quoteType),
        market,
        currency: toCurrency(q.currency, market),
        exchange: q.exchange ?? "",
      };
    });
}
