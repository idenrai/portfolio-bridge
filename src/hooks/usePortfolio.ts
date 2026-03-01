import { useMemo } from "react";
import { useAssetStore } from "@/stores";
import { useSettingsStore } from "@/stores";
import { calculateSummary, calculateRebalancing } from "@/utils";

/**
 * 포트폴리오 요약 & 리밸런싱 계산 훅
 */
export function usePortfolio() {
  const assets = useAssetStore((s) => s.assets);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const targets = useSettingsStore((s) => s.targetAllocations);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);

  const summary = useMemo(
    () => calculateSummary(assets, rates, targets, baseCurrency),
    [assets, rates, targets, baseCurrency],
  );

  const rebalancing = useMemo(
    () => calculateRebalancing(summary, targets),
    [summary, targets],
  );

  return { assets, summary, rebalancing };
}
