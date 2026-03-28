import { yahooFetch, toMarket, toCurrency } from "./yahooCore";
import type { QuoteData } from "./yahooCore";
import type { Market } from "@/types";

/**
 * 특정 심볼의 현재가 조회 (Yahoo Finance)
 */
export async function fetchCurrentPrice(
  symbol: string,
): Promise<QuoteData | null> {
  const chartPath = `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

  const parseChart = (
    data: unknown,
    fallbackMarket?: Market,
  ): QuoteData | null => {
    const result = (
      data as {
        chart?: { result?: { meta: Record<string, string | number> }[] };
      }
    )?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta as Record<string, string | number | undefined>;
    const market =
      toMarket(
        meta.exchangeName as string | undefined,
        meta.currency as string | undefined,
        meta.symbol as string | undefined,
      ) ??
      fallbackMarket ??
      "OTHER";
    return {
      ticker: (meta.symbol as string) ?? symbol,
      name: (meta.longName ??
        meta.shortName ??
        meta.symbol ??
        symbol) as string,
      price: (meta.regularMarketPrice as number) ?? 0,
      currency: toCurrency(meta.currency as string | undefined, market),
      market,
      type: "stock",
      exchange: (meta.exchangeName as string) ?? "",
    };
  };

  try {
    const res = await yahooFetch(`/api/yahoo${chartPath}`);
    if (res.ok) {
      const data = await res.json();
      const parsed = parseChart(data);
      if (parsed && parsed.price > 0) return parsed;
    }
  } catch {
    /* ignore */
  }

  return null;
}
