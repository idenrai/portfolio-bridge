import { useState, useCallback } from "react";
import { useSettingsStore } from "@/stores";
import { fetchAllExchangeRates } from "@/utils";

interface UseExchangeRateResult {
  refreshRates: () => Promise<void>;
  isLoading: boolean;
  lastUpdated: string | null;
  error: string | null;
}

/**
 * Yahoo Finance에서 환율을 조회하고 설정 스토어를 갱신하는 훅
 */
export function useExchangeRates(): UseExchangeRateResult {
  const setExchangeRate = useSettingsStore((s) => s.setExchangeRate);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rates = await fetchAllExchangeRates();
      if (rates.JPY) setExchangeRate("JPY", rates.JPY);
      if (rates.USD) setExchangeRate("USD", rates.USD);
      setLastUpdated(new Date().toISOString());
    } catch (e) {
      setError("환율 조회에 실패했습니다. 수동으로 입력해 주세요.");
      console.error("[ExchangeRate]", e);
    } finally {
      setIsLoading(false);
    }
  }, [setExchangeRate]);

  return { refreshRates, isLoading, lastUpdated, error };
}
