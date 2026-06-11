import { useState, useEffect } from "react";

export interface BuffettIndicatorData {
  /** 버핏 지수 = 시가총액 / GDP × 100 (%) */
  ratio: number;
  /** 미국 GDP (조 USD) */
  gdpTrillions: number;
  /** 미국 주식시장 시가총액 (조 USD) */
  marketCapTrillions: number;
  /** 시가총액 기준 날짜 (YYYY-MM-DD) */
  date: string;
  /** 로딩 중 */
  loading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

import { yahooFetch } from "@/utils/yahoo/yahooCore";

/**
 * 기존 Yahoo Finance 프록시로 Wilshire 5000 최신 종가를 조회합니다.
 * ^W5000 index price point ≈ 미국 전체 시가총액 (십억 USD)
 * — Wilshire 5000은 1980년 기준 1 point = $1B 으로 설계되어 있어
 *   현재도 index value ≈ 시가총액 (billions)로 근사합니다.
 */
async function fetchMarketCap(): Promise<{ valueTrillions: number; date: string }> {
  const res = await yahooFetch(
    "/api/yahoo/v8/finance/chart/%5EW5000?interval=1d&range=5d",
  );
  if (!res.ok) throw new Error(`Yahoo Finance error: ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error("No Wilshire 5000 data");

  const timestamps: number[] = result.timestamp ?? [];
  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];

  for (let i = closes.length - 1; i >= 0; i--) {
    if (closes[i] != null) {
      const date = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
      // index point ≈ billions → trillions
      return { valueTrillions: (closes[i] as number) / 1_000, date };
    }
  }
  throw new Error("No valid close price in Wilshire 5000 data");
}

/**
 * World Bank API로 미국 GDP를 조회합니다. (CORS 지원, 프록시 불필요)
 * 연간 데이터로 최대 1년 지연이 있지만 GDP는 분기별로만 바뀌므로 적합합니다.
 */
async function fetchGDP(): Promise<{ valueTrillions: number; year: string }> {
  const res = await fetch(
    "https://api.worldbank.org/v2/country/US/indicator/NY.GDP.MKTP.CD" +
      "?format=json&mrv=3&per_page=3",
  );
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`);
  const json = await res.json();
  const entries: Array<{ date: string; value: number | null }> = json[1] ?? [];
  for (const entry of entries) {
    if (entry.value !== null) {
      return { valueTrillions: entry.value / 1e12, year: entry.date };
    }
  }
  throw new Error("No valid GDP data from World Bank");
}

/**
 * 버핏 지수(Buffett Indicator = Market Cap / GDP × 100%)를 계산합니다.
 *
 * - 시가총액: Yahoo Finance ^W5000 (Wilshire 5000, 일별 갱신)
 * - GDP:      World Bank NY.GDP.MKTP.CD (연간, 최대 1년 지연)
 */
export function useBuffettIndicator(): BuffettIndicatorData {
  const [data, setData] = useState<Omit<BuffettIndicatorData, "loading" | "error">>({
    ratio: 0,
    gdpTrillions: 0,
    marketCapTrillions: 0,
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [mc, gdp] = await Promise.all([fetchMarketCap(), fetchGDP()]);
        if (cancelled) return;

        const ratio = (mc.valueTrillions / gdp.valueTrillions) * 100;
        setData({
          ratio,
          gdpTrillions: gdp.valueTrillions,
          marketCapTrillions: mc.valueTrillions,
          date: mc.date,
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { ...data, loading, error };
}
