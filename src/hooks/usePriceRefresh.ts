import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAssetStore, useLanguageStore } from "@/stores";
import { TRANSLATIONS } from "@/i18n";
import { fetchBatchQuote, fetchCurrentPrice } from "@/utils";

const CACHE_FALLBACK_MS = 24 * 60 * 1000;
const EMPTY_ARRAY: any[] = [];

export interface FailedAsset {
  ticker: string;
  name: string;
}

export type PriceUpdate = {
  id: string;
  ticker: string;
  currentPrice: number;
  peRatio?: number | null;
  pbRatio?: number | null;
  dividendYield?: number | null;
};

export interface UsePriceRefreshResult {
  refreshPrices: () => Promise<void>;
  isLoading: boolean;
  progress: number;
  lastUpdated: string | null;
  error: string | null;
  isCached: boolean;
  updatedCount: number;
  totalCount: number;
  failedAssets: FailedAsset[];
  data: PriceUpdate[];
}

export function usePriceRefresh(): UsePriceRefreshResult {
  const assets = useAssetStore((s) => s.assets);
  const lang = useLanguageStore((s) => s.lang);

  const [progress, setProgress] = useState(0);

  // Memoize targets so we don't cause infinite re-renders for queryKey
  const targets = useMemo(
    () => assets.filter((a) => a.ticker && !a.categories.includes("cash")),
    [assets]
  );

  // Memoize queryKey string to prevent array reallocation
  const queryKeyStr = useMemo(
    () => targets.map((t) => t.ticker).sort().join(","),
    [targets]
  );
  const queryKey = useMemo(() => ["prices", queryKeyStr], [queryKeyStr]);

  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey,
    queryFn: async () => {
      setProgress(0);

      if (targets.length === 0) return { updates: [], failed: [] };

      const updates: PriceUpdate[] = [];
      const failed: FailedAsset[] = [];

      const tickers = targets.map((a) => a.ticker!);
      const batchMap = await fetchBatchQuote(
        tickers,
        1500,
        (done: number, total: number) => setProgress((done / total) * 0.9),
      );

      const needsFallback: typeof targets = [];
      for (const asset of targets) {
        const data = batchMap.get(asset.ticker!);
        if (data?.currentPrice != null && data.currentPrice > 0) {
          updates.push({
            id: asset.id,
            ticker: asset.ticker!,
            currentPrice: data.currentPrice,
            peRatio: data.peRatio,
            pbRatio: data.pbRatio,
            dividendYield: data.dividendYield,
          });
        } else {
          needsFallback.push(asset);
        }
      }

      for (let i = 0; i < needsFallback.length; i++) {
        const asset = needsFallback[i];
        try {
          const quote = await fetchCurrentPrice(asset.ticker!);
          if (quote && quote.price > 0) {
            updates.push({ id: asset.id, ticker: asset.ticker!, currentPrice: quote.price });
          } else {
            failed.push({ ticker: asset.ticker!, name: asset.name });
          }
        } catch {
          failed.push({ ticker: asset.ticker!, name: asset.name });
        }
        setProgress(0.9 + ((i + 1) / Math.max(needsFallback.length, 1)) * 0.1);
      }

      setProgress(1);
      return { updates, failed };
    },
    staleTime: CACHE_FALLBACK_MS,
    enabled: targets.length > 0,
    retry: 0,
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : null;
  const isFallbackCached = isError && !!data;

  const hasActualError =
    isError || (data && data.updates.length === 0 && data.failed.length > 0);
  const errorMsg =
    hasActualError && !isFallbackCached
      ? TRANSLATIONS[lang].data_refresh_error
      : null;

  return {
    refreshPrices: useCallback(async () => {
      await refetch();
    }, [refetch]),
    isLoading: isLoading || isFetching,
    progress,
    lastUpdated,
    error: errorMsg,
    isCached: isFallbackCached,
    updatedCount: data?.updates.length ?? 0,
    totalCount: targets.length,
    failedAssets: data?.failed ?? EMPTY_ARRAY,
    data: data?.updates ?? EMPTY_ARRAY,
  };
}
