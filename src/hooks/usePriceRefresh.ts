import { useState, useCallback, useRef } from "react";
import {
  useAssetStore,
  useSettingsStore,
  useLanguageStore,
} from "@/stores";
import { TRANSLATIONS } from "@/i18n";
import { fetchBatchQuote, fetchCurrentPrice } from "@/utils";

/** 캐시 폴백 한도: 24분 */
const CACHE_FALLBACK_MS = 24 * 60 * 1000;

interface FailedAsset {
  ticker: string;
  name: string;
}

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
  /** 시세 조회 실패 항목 */
  failedAssets: FailedAsset[];
}

type PriceUpdate = {
  id: string;
  currentPrice: number;
  peRatio?: number | null;
  pbRatio?: number | null;
};

/**
 * Yahoo Finance에서 보유 자산 현재가를 일괄 갱신하는 훅
 *
 * 전략:
 *   1차) v7 배치 조회 (15개/요청) — 현재가 + PER + PBR 동시 취득
 *   2차) 배치에서 currentPrice 누락된 종목만 v8 chart 개별 폴백
 *
 * → 기존 개별 호출(N번) 대비 요청 횟수 대폭 감소
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
  const [failedAssets, setFailedAssets] = useState<FailedAsset[]>([]);

  const runningRef = useRef(false);

  const refreshPrices = useCallback(async () => {
    const targets = assets.filter(
      (a) => a.ticker && !a.categories.includes("cash"),
    );
    if (targets.length === 0) return;
    if (runningRef.current) return;
    runningRef.current = true;

    setIsLoading(true);
    setError(null);
    setIsCached(false);
    setProgress(0);
    setTotalCount(targets.length);
    setUpdatedCount(0);
    setFailedAssets([]);

    const updates: PriceUpdate[] = [];
    const failed: FailedAsset[] = [];

    try {
      // ── 1차: v7 배치 조회 (현재가 + PER + PBR) ───────────────────────────
      const tickers = targets.map((a) => a.ticker!);
      const batchMap = await fetchBatchQuote(
        tickers,
        1500,
        (done: number, total: number) => setProgress((done / total) * 0.9),
      );

      // 배치 결과 분류
      const needsFallback: typeof targets = [];
      for (const asset of targets) {
        const data = batchMap.get(asset.ticker!);
        if (data?.currentPrice != null && data.currentPrice > 0) {
          updates.push({
            id: asset.id,
            currentPrice: data.currentPrice,
            peRatio: data.peRatio,
            pbRatio: data.pbRatio,
          });
        } else {
          needsFallback.push(asset);
        }
      }

      // ── 2차: 배치 누락 종목 → v8 chart 개별 폴백 ────────────────────────
      for (let i = 0; i < needsFallback.length; i++) {
        const asset = needsFallback[i];
        try {
          const quote = await fetchCurrentPrice(asset.ticker!);
          if (quote && quote.price > 0) {
            updates.push({ id: asset.id, currentPrice: quote.price });
          } else {
            failed.push({ ticker: asset.ticker!, name: asset.name });
          }
        } catch {
          failed.push({ ticker: asset.ticker!, name: asset.name });
        }
        setProgress(0.9 + ((i + 1) / Math.max(needsFallback.length, 1)) * 0.1);
      }

      setUpdatedCount(updates.length);

      if (updates.length > 0) {
        updatePrices(updates);
        setLastUpdated(new Date().toISOString());
      }

      if (failed.length > 0) {
        setFailedAssets(failed);
      }

      if (updates.length === 0 && failed.length > 0) {
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

  return {
    refreshPrices,
    isLoading,
    progress,
    lastUpdated,
    error,
    isCached,
    updatedCount,
    totalCount,
    failedAssets,
  };
}
