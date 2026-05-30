import { useState, useEffect } from "react";

export interface BuffettIndicatorData {
  /** 버핏 지수 = 시가총액 / GDP × 100 (%) */
  ratio: number;
  /** 미국 GDP (조 USD) */
  gdpTrillions: number;
  /** 미국 주식시장 시가총액 (조 USD) */
  marketCapTrillions: number;
  /** 기준 날짜 (YYYY-MM-DD) */
  date: string;
  /** 로딩 중 */
  loading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * FRED CSV에서 마지막 유효한(non-"." 또는 빈 값) 행을 반환
 * FRED CSV 포맷: DATE,VALUE (헤더 1줄 + 데이터)
 * 결측치는 "." 으로 표시됨
 */
function parseLastValidRow(csv: string): { date: string; value: number } | null {
  const lines = csv.trim().split("\n").slice(1); // 헤더 제거
  for (let i = lines.length - 1; i >= 0; i--) {
    const [date, value] = lines[i].split(",");
    if (date && value && value.trim() !== ".") {
      const num = parseFloat(value.trim());
      if (!isNaN(num)) return { date: date.trim(), value: num };
    }
  }
  return null;
}

/** /api/fred?id=SERIES_ID 를 통해 FRED CSV를 가져옴 */
async function fetchFred(seriesId: string): Promise<{ date: string; value: number }> {
  const url = `/api/fred?id=${encodeURIComponent(seriesId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED proxy error: ${res.status}`);
  const csv = await res.text();
  const row = parseLastValidRow(csv);
  if (!row) throw new Error(`No valid data in FRED series: ${seriesId}`);
  return row;
}

/**
 * FRED에서 미국 GDP와 Wilshire 5000 시가총액을 조회해
 * 버핏 지수(Buffett Indicator = Market Cap / GDP × 100%)를 계산합니다.
 *
 * - Market Cap: WILL5000INDFC (Wilshire 5000 Full Cap, 단위: 십억 USD, 분기/월별)
 * - GDP: GDP (SAAR, 단위: 십억 USD, 분기별)
 * - 데이터 지연: 최대 1분기 (World Bank 대비 훨씬 최신)
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
        const [mcRow, gdpRow] = await Promise.all([
          fetchFred("WILL5000INDFC"),
          fetchFred("GDP"),
        ]);

        if (cancelled) return;

        // 두 시리즈 모두 단위: 십억(Billions) USD → 조(Trillions)로 변환
        const marketCapTrillions = mcRow.value / 1_000;
        const gdpTrillions = gdpRow.value / 1_000;
        const ratio = (marketCapTrillions / gdpTrillions) * 100;

        // 더 최신 날짜를 기준 날짜로 표시
        const date = mcRow.date > gdpRow.date ? mcRow.date : gdpRow.date;

        setData({ ratio, gdpTrillions, marketCapTrillions, date });
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
