import { yahooFetch } from "./yahooCore";
import type { CurrencyCode } from "@/types";

/**
 * Yahoo Finance에서 환율을 KRW 기준으로 조회
 */
export async function fetchExchangeRate(
  fromCurrency: string,
  toCurrency = "KRW",
): Promise<number | null> {
  if (fromCurrency === toCurrency) return 1;

  const symbol = `${fromCurrency}${toCurrency}=X`;
  const url = `/api/yahoo/v8/finance/chart/${symbol}?interval=1d&range=1d`;

  const res = await yahooFetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const result = data.chart?.result?.[0];
  if (!result) return null;

  return result.meta?.regularMarketPrice ?? null;
}

/**
 * KRW 기준 환율 전체 갱신 (JPY, USD, EUR → KRW)
 */
export async function fetchAllExchangeRates(): Promise<
  Partial<Record<CurrencyCode, number>>
> {
  const [jpy, usd, eur] = await Promise.all([
    fetchExchangeRate("JPY", "KRW"),
    fetchExchangeRate("USD", "KRW"),
    fetchExchangeRate("EUR", "KRW"),
  ]);

  const result: Partial<Record<CurrencyCode, number>> = {};
  if (jpy !== null) result.JPY = jpy;
  if (usd !== null) result.USD = usd;
  if (eur !== null) result.EUR = eur;
  return result;
}
