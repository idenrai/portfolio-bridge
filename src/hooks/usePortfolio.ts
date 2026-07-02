import { useMemo } from "react";
import { useAssetStore, useSettingsStore } from "@/stores";
import { calculateSummary, calculateRebalancing } from "@/utils";
import { useT, useExchangeRates, usePriceRefresh } from "@/hooks";
import type { AssetCategory, PortfolioAsset } from "@/types";

/**
 * 포트폴리오 요약 & 리밸런싱 계산 훅
 * (Zustand의 클라이언트 상태와 React Query의 서버 상태를 결합하는 단방향 데이터 허브)
 */
export function usePortfolio() {
  const baseAssets = useAssetStore((s) => s.assets);
  const targets = useSettingsStore((s) => s.targetAllocations);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const t = useT();

  const { data: rates } = useExchangeRates();
  const { data: prices } = usePriceRefresh();

  // Create a map for O(1) lookups, memoized by prices only
  const priceMap = useMemo(() => new Map(prices.map((p) => [p.ticker, p])), [prices]);

  const assets: PortfolioAsset[] = useMemo(() => {
    return baseAssets.map((a) => {
      const priceData = a.ticker ? priceMap.get(a.ticker) : undefined;
      return {
        ...a,
        livePrice: priceData?.currentPrice,
        // 오프라인이거나 API 조회가 안 된 경우 수동 입력값(또는 이전 캐시값)으로 Fallback
        currentPrice: priceData?.currentPrice ?? a.currentPrice,
        peRatio: priceData?.peRatio,
        pbRatio: priceData?.pbRatio,
        dividendYield: priceData?.dividendYield,
      };
    });
  }, [baseAssets, priceMap]);

  const insightMessages = useMemo(
    () => ({
      concentration: (name: string, pct: string) =>
        t.insight_concentration(name, pct),
      bigLoss: (name: string, pct: string) => t.insight_big_loss(name, pct),
      cashHigh: (pct: string) => t.insight_cash_high(pct),
      cashLow: (pct: string) => t.insight_cash_low(pct),
      fxHigh: (currency: string, pct: string) =>
        t.insight_fx_high(currency, pct),
      categoryOver: (
        label: string,
        pct: string,
        target: string,
        diff: string,
      ) => t.insight_category_over(label, pct, target, diff),
      categoryUnder: (
        label: string,
        pct: string,
        target: string,
        diff: string,
      ) => t.insight_category_under(label, pct, target, diff),
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
