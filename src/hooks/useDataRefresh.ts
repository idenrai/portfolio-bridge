import { useState, useCallback, useRef } from "react";
import { useExchangeRates } from "./useExchangeRates";
import { usePriceRefresh } from "./usePriceRefresh";

interface UseDataRefreshResult {
  /** 환율 + 시세 통합 새로고침 */
  refreshAll: () => Promise<void>;
  /** 전체 로딩 중 여부 */
  isLoading: boolean;
  /** 환율 마지막 갱신 시각 */
  rateLastUpdated: string | null;
  /** 시세 마지막 갱신 시각 */
  priceLastUpdated: string | null;
  /** 둘 중 더 최근 갱신 시각 */
  lastUpdated: string | null;
  /** 에러 메시지 (환율 또는 시세) */
  error: string | null;
  /** 캐시 폴백 중 여부 */
  isCached: boolean;
  /** 시세 갱신 진행률 */
  progress: number;
  /** 갱신된 종목 수 */
  updatedCount: number;
  /** 갱신 대상 종목 수 */
  totalCount: number;
  /** 시세 조회 실패 항목 */
  failedAssets: { ticker: string; name: string }[];
}

/**
 * 환율 + 시세를 한 번에 갱신하는 통합 훅
 *
 * - 내부적으로 useExchangeRates · usePriceRefresh를 병렬 호출
 * - 대시보드 / 설정 페이지에서 하나의 새로고침 버튼으로 사용
 */
export function useDataRefresh(): UseDataRefreshResult {
  const rates = useExchangeRates();
  const prices = usePriceRefresh();
  const [isLoading, setIsLoading] = useState(false);
  const runningRef = useRef(false);

  const refreshAll = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setIsLoading(true);
    try {
      await Promise.all([rates.refreshRates(), prices.refreshPrices()]);
    } finally {
      setIsLoading(false);
      runningRef.current = false;
    }
  }, [rates.refreshRates, prices.refreshPrices]);

  // 둘 중 더 최근 갱신 시각
  const lastUpdated = (() => {
    if (!rates.lastUpdated) return prices.lastUpdated;
    if (!prices.lastUpdated) return rates.lastUpdated;
    return rates.lastUpdated > prices.lastUpdated
      ? rates.lastUpdated
      : prices.lastUpdated;
  })();

  const combinedLoading = isLoading || rates.isLoading || prices.isLoading;

  return {
    refreshAll,
    isLoading: combinedLoading,
    rateLastUpdated: rates.lastUpdated,
    priceLastUpdated: prices.lastUpdated,
    lastUpdated,
    error: rates.error || prices.error,
    isCached: rates.isCached || prices.isCached,
    progress: prices.progress,
    updatedCount: prices.updatedCount,
    totalCount: prices.totalCount,
    failedAssets: prices.failedAssets,
  };
}
