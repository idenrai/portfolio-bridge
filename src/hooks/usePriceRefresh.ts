import { useState, useCallback, useEffect, useRef } from "react";
import { useAssetStore, useSettingsStore, useLanguageStore } from "@/stores";
import { TRANSLATIONS } from "@/i18n";
import { fetchCurrentPrice } from "@/utils";

/** 캐시 유효 기간: 1시간 */
const CACHE_TTL_MS = 60 * 60 * 1000;
/** 캐시 폴백 한도: 24시간 */
const CACHE_FALLBACK_MS = 24 * 60 * 1000;
/** 동시 요청 제한 */
const CONCURRENCY = 5;

interface UsePriceRefreshResult {
  /** 수동 새로고침 */
  refreshPrices: () => Promise<void>;
  isLoading: boolean;
  /** 갱신 진행률 (0~1) */
  progress: number;
  /** 마지막 성공 갱신 시각 (ISO) */
  lastUpdated: string | null;
  /** 에러 메시지 */
  error: string | null;
  /** 캐시 폴백 중 여부 */
  isCached: boolean;
  /** 갱신된 종목 수 / 전체 종목 수 */
  updatedCount: number;
  totalCount: number;
}

/**
 * Yahoo Finance에서 보유 자산 현재가를 일괄 갱신하는 훅
 *
 * - 마운트 시 캐시가 1시간 이상 됐거나 없으면 자동 조회
 * - 티커가 있는 자산만 조회 (현금·수동자산은 건너뜀)
 * - CONCURRENCY 단위 병렬 처리
 */
export function usePriceRefresh(): UsePriceRefreshResult {
  const assets = useAssetStore((s) => s.assets);
  const updatePrices = useAssetStore((s) => s.updatePrices);
  const lastUpdated = useSettingsStore((s) => s.pricesUpdatedAt);
  const setLastUpdated = useSettingsStore((s) => s.setPricesUpdatedAt);
  const lang = useLanguageStore((s) => s.lang);

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // 중복 실행 방지
  const runningRef = useRef(false);

  const refreshPrices = useCallback(async () => {
    // 시세를 가져올 대상: ticker가 있고.tags에 cash가 아닌 자산
    const targets = assets.filter((a) => a.ticker && !a.tags.includes("cash"));
    if (targets.length === 0) return;
    if (runningRef.current) return;
    runningRef.current = true;

    setIsLoading(true);
    setError(null);
    setIsCached(false);
    setProgress(0);
    setTotalCount(targets.length);
    setUpdatedCount(0);

    const updates: { id: string; currentPrice: number }[] = [];
    let completed = 0;
    let failed = 0;

    // 동시성 제한 병렬 처리
    const queue = [...targets];
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length > 0) {
        const asset = queue.shift();
        if (!asset) break;
        try {
          const quote = await fetchCurrentPrice(asset.ticker!);
          if (quote && quote.price > 0) {
            updates.push({ id: asset.id, currentPrice: quote.price });
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
        completed++;
        setProgress(completed / targets.length);
        setUpdatedCount(updates.length);
      }
    });

    try {
      await Promise.all(workers);

      if (updates.length > 0) {
        updatePrices(updates);
        setLastUpdated(new Date().toISOString());
        setUpdatedCount(updates.length);
      }

      // 전부 실패한 경우
      if (updates.length === 0 && failed > 0) {
        const cacheAge = lastUpdated
          ? Date.now() - new Date(lastUpdated).getTime()
          : Infinity;
        if (cacheAge < CACHE_FALLBACK_MS) {
          setIsCached(true);
        } else {
          setError(TRANSLATIONS[lang].data_refresh_error);
        }
      }
    } catch (e) {
      console.error("[PriceRefresh]", e);
      setError(TRANSLATIONS[lang].data_refresh_error);
    } finally {
      setIsLoading(false);
      setProgress(1);
      runningRef.current = false;
    }
  }, [assets, updatePrices, setLastUpdated, lastUpdated, lang]);

  // 마운트 시 자동 조회: 캐시가 없거나 1시간 이상 경과
  useEffect(() => {
    const cacheAge = lastUpdated
      ? Date.now() - new Date(lastUpdated).getTime()
      : Infinity;
    if (cacheAge > CACHE_TTL_MS) {
      refreshPrices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    refreshPrices,
    isLoading,
    progress,
    lastUpdated,
    error,
    isCached,
    updatedCount,
    totalCount,
  };
}
