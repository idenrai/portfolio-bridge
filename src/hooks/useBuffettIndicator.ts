import { useState, useEffect } from "react";

/** World Bank API 응답 타입 */
interface WBEntry {
  date: string;
  value: number | null;
}

type WBResponse = [unknown, WBEntry[]];

export interface BuffettIndicatorData {
  /** 버핏 지수 = 시가총액 / GDP × 100 (%) */
  ratio: number;
  /** 미국 GDP (조 USD) */
  gdpTrillions: number;
  /** 미국 주식시장 시가총액 (조 USD) */
  marketCapTrillions: number;
  /** 기준 연도 */
  year: string;
  /** 로딩 중 */
  loading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

async function fetchWB(indicator: string): Promise<WBEntry[]> {
  const url =
    `https://api.worldbank.org/v2/country/US/indicator/${indicator}` +
    `?format=json&mrv=5&per_page=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`);
  const json: WBResponse = await res.json();
  return json[1] ?? [];
}

/** 가장 최근의 non-null 값을 반환 */
function latestNonNull(entries: WBEntry[]): WBEntry | null {
  return entries.find((e) => e.value !== null) ?? null;
}

/**
 * 세계은행 API에서 미국 GDP와 주식시장 시가총액을 조회해
 * 버핏 지수(Buffett Indicator = Market Cap / GDP × 100%)를 계산합니다.
 *
 * - GDP indicator: NY.GDP.MKTP.CD (current USD)
 * - Market Cap indicator: CM.MKT.LCAP.CD (current USD, listed domestic companies)
 * - CORS 지원, 인증 불필요
 * - 연간 데이터 (보통 1~2년 이내 값)
 */
export function useBuffettIndicator(): BuffettIndicatorData {
  const [data, setData] = useState<Omit<BuffettIndicatorData, "loading" | "error">>({
    ratio: 0,
    gdpTrillions: 0,
    marketCapTrillions: 0,
    year: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [gdpEntries, mcEntries] = await Promise.all([
          fetchWB("NY.GDP.MKTP.CD"),
          fetchWB("CM.MKT.LCAP.CD"),
        ]);

        if (cancelled) return;

        const gdpEntry = latestNonNull(gdpEntries);
        const mcEntry = latestNonNull(mcEntries);

        if (!gdpEntry || !mcEntry) {
          throw new Error("No data available from World Bank");
        }

        // 공통 연도 우선, 없으면 각각의 최신 연도
        const year = gdpEntry.date === mcEntry.date
          ? gdpEntry.date
          : `${mcEntry.date}/${gdpEntry.date}`;

        const gdpTrillions = (gdpEntry.value as number) / 1e12;
        const marketCapTrillions = (mcEntry.value as number) / 1e12;
        const ratio = (marketCapTrillions / gdpTrillions) * 100;

        setData({ ratio, gdpTrillions, marketCapTrillions, year });
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
