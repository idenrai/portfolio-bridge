import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguageStore } from "@/stores";
import { TRANSLATIONS } from "@/i18n";
import { fetchAllExchangeRates } from "@/utils";
import { DEFAULT_RATES, type CurrencyCode } from "@/types";

const CACHE_FALLBACK_MS = 24 * 60 * 60 * 1000;

interface UseExchangeRateResult {
  refreshRates: () => Promise<void>;
  isLoading: boolean;
  data: Record<CurrencyCode, number>;
  lastUpdated: string | null;
  error: string | null;
  isCached: boolean;
}

export function useExchangeRates(): UseExchangeRateResult {
  const lang = useLanguageStore((s) => s.lang);

  const { data, isLoading, refetch, isError, dataUpdatedAt } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: fetchAllExchangeRates,
    staleTime: CACHE_FALLBACK_MS,
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : null;

  // React Query preserves 'data' if it was successfully fetched during the session.
  // If we have an error but data exists, we are using the fallback cache.
  const isFallbackCached = isError && !!data;

  const errorMsg =
    isError && !isFallbackCached ? TRANSLATIONS[lang].exchange_rate_error : null;

  const mergedData = useMemo(() => {
    return data ? { ...DEFAULT_RATES, ...data } : DEFAULT_RATES;
  }, [data]);

  const refreshRates = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    refreshRates,
    isLoading,
    data: mergedData,
    lastUpdated,
    error: errorMsg,
    isCached: isFallbackCached,
  };
}
