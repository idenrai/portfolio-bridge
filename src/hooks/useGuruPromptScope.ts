import { useState, useMemo, useCallback } from "react";
import type { PortfolioAsset, PortfolioSummary, TargetAllocation, CurrencyCode } from "@/types";
import { DEFAULT_RATES } from "@/types";
import { calculateSummary } from "@/utils";

interface UseGuruPromptScopeProps {
  assets: PortfolioAsset[];
  allAssets?: PortfolioAsset[];
  summary: PortfolioSummary;
  rates?: Record<CurrencyCode, number>;
  targets?: TargetAllocation[];
  baseCurrency: CurrencyCode;
}

export function useGuruPromptScope({
  assets,
  allAssets,
  summary,
  rates = DEFAULT_RATES,
  targets = [],
  baseCurrency,
}: UseGuruPromptScopeProps) {
  const availableAssets = useMemo(
    () => (allAssets && allAssets.length > 0 ? allAssets : assets),
    [allAssets, assets],
  );

  const defaultSelectedAssetIds = useMemo(
    () => new Set(assets.map((a) => a.id)),
    [assets],
  );

  const [customSelectedAssetIds, setCustomSelectedAssetIds] = useState<Set<string> | null>(null);
  const [showScopeSelector, setShowScopeSelector] = useState(false);

  const selectedAssetIds = customSelectedAssetIds ?? defaultSelectedAssetIds;
  const isCustomScope = customSelectedAssetIds !== null;

  const activeAssets = useMemo(() => {
    return availableAssets.filter((a) => selectedAssetIds.has(a.id));
  }, [availableAssets, selectedAssetIds]);

  const activeSummary = useMemo(() => {
    if (!isCustomScope) return summary;
    return calculateSummary(activeAssets, rates, targets, baseCurrency);
  }, [isCustomScope, summary, activeAssets, rates, targets, baseCurrency]);

  const toggleAssetId = useCallback((id: string) => {
    setCustomSelectedAssetIds((prev) => {
      const current = prev ? new Set(prev) : new Set(defaultSelectedAssetIds);
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }
      return current;
    });
  }, [defaultSelectedAssetIds]);

  const selectAll = useCallback(() => {
    setCustomSelectedAssetIds(new Set(availableAssets.map((a) => a.id)));
  }, [availableAssets]);

  const deselectAll = useCallback(() => {
    setCustomSelectedAssetIds(new Set());
  }, []);

  const resetToDefaultScope = useCallback(() => {
    setCustomSelectedAssetIds(null);
  }, []);

  return {
    availableAssets,
    selectedAssetIds,
    isCustomScope,
    showScopeSelector,
    setShowScopeSelector,
    activeAssets,
    activeSummary,
    toggleAssetId,
    selectAll,
    deselectAll,
    resetToDefaultScope,
  };
}
