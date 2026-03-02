import { useMemo } from "react";
import { useAssetStore, useSettingsStore } from "@/pages/stores";
import { calculateSummary, calculateRebalancing } from "@/utils";
import { useT } from "@/hooks/useT";
import type { AssetCategory } from "@/types";

/**
 * 포트폴리오 요약 & 리밸런싱 계산 훅
 */
export function usePortfolio() {
  const assets = useAssetStore((s) => s.assets);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const targets = useSettingsStore((s) => s.targetAllocations);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const t = useT();

  const insightMessages = useMemo(
    () => ({
      concentration: (name: string, pct: string) =>
        t.insight_concentration(name, pct),
      bigLoss: (name: string, pct: string) => t.insight_big_loss(name, pct),
      cashHigh: (pct: string) => t.insight_cash_high(pct),
      cashLow: (pct: string) => t.insight_cash_low(pct),
      fxHigh: (currency: string, pct: string) =>
        t.insight_fx_high(currency, pct),
      categoryOver: (label: string, pct: string, target: string, diff: string) =>
        t.insight_category_over(label, pct, target, diff),
      categoryUnder: (label: string, pct: string, target: string, diff: string) =>
        t.insight_category_under(label, pct, target, diff),
      getCategoryLabel: (category: string) =>
        t.category_labels[category as AssetCategory] ?? category,
    }),
    [t],
  );

  const summary = useMemo(
    () =>
      calculateSummary(assets, rates, targets, baseCurrency, insightMessages),
    [assets, rates, targets, baseCurrency, insightMessages],
  );

  const rebalancing = useMemo(
    () => calculateRebalancing(summary, targets),
    [summary, targets],
  );

  return { assets, summary, rebalancing };
}
