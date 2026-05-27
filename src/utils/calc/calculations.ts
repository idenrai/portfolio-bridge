import type {
  Asset,
  AssetCategory,
  AssetType,
  CurrencyCode,
  PortfolioSummary,
  TargetAllocation,
  RebalanceSuggestion,
  HoldingDetail,
  CurrencyExposure,
  CurrencyScenario,
} from "@/types";
import { toKRW } from "./currency";
import { assetValue, assetCost } from "./assetCalcs";
import { generateInsights, DEFAULT_INSIGHT_MESSAGES } from "./insightGenerator";
import type { InsightMessages } from "./insightGenerator";

// Re-export for barrel
export { assetValue, assetCost, assetPnL, assetReturnPercent } from "./assetCalcs";
export type { InsightMessages } from "./insightGenerator";

/**
 * 전체 포트폴리오 요약 계산
 */
export function calculateSummary(
  assets: Asset[],
  rates: Record<CurrencyCode, number>,
  targets: TargetAllocation[] = [],
  baseCurrency: CurrencyCode = "KRW",
  insightMessages?: InsightMessages,
): PortfolioSummary {
  let totalValueKRW = 0;
  let totalCostKRW = 0;

  const categoryMap = new Map<AssetCategory, number>();
  const marketMap = new Map<string, number>();
  const currencyMap = new Map<string, number>();

  let cashValueKRW = 0;

  const localMap = new Map<
    CurrencyCode,
    { totalLocal: number; totalKRW: number }
  >();

  const typeSet = new Set<AssetType>();

  const holdings: HoldingDetail[] = [];
  let holdingCountNonCash = 0;

  for (const a of assets) {
    const valKRW = toKRW(assetValue(a), a.currency, rates);
    const costKRW = toKRW(assetCost(a), a.currency, rates);
    totalValueKRW += valKRW;
    totalCostKRW += costKRW;
    typeSet.add(a.type);

    const localVal = assetValue(a);
    const prev = localMap.get(a.currency);
    if (prev) {
      prev.totalLocal += localVal;
      prev.totalKRW += valKRW;
    } else {
      localMap.set(a.currency, { totalLocal: localVal, totalKRW: valKRW });
    }

    const categoryShare =
      a.categories.length > 0 ? valKRW / a.categories.length : 0;
    for (const cat of a.categories) {
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + categoryShare);
    }
    if (a.categories.length === 0) {
      categoryMap.set("other", (categoryMap.get("other") ?? 0) + valKRW);
    }

    marketMap.set(a.market, (marketMap.get(a.market) ?? 0) + valKRW);
    currencyMap.set(a.currency, (currencyMap.get(a.currency) ?? 0) + valKRW);

    if (a.type === "cash") {
      cashValueKRW += valKRW;
    } else {
      holdingCountNonCash++;
    }

    const pnlKRW = valKRW - costKRW;
    holdings.push({
      id: a.id,
      name: a.name,
      ticker: a.ticker,
      type: a.type,
      market: a.market,
      currency: a.currency,
      quantity: a.quantity,
      avgBuyPrice: a.avgBuyPrice,
      currentPrice: a.currentPrice,
      category: a.categories[0] ?? null,
      valueKRW: valKRW,
      costKRW,
      pnlKRW,
      returnPercent: costKRW === 0 ? 0 : (pnlKRW / costKRW) * 100,
      weightPercent: 0,
      peRatio: a.peRatio ?? null,
      pbRatio: a.pbRatio ?? null,
      dividendYield: a.dividendYield ?? null,
    });
  }

  for (const h of holdings) {
    h.weightPercent =
      totalValueKRW === 0 ? 0 : (h.valueKRW / totalValueKRW) * 100;
  }
  holdings.sort((a, b) => b.valueKRW - a.valueKRW);

  // ── 동일 종목 합산 (서로 다른 계좌에 같은 ticker가 있을 경우 하나로 병합) ──
  // 병합 키: ticker 있으면 "t:<ticker>", 없으면 "n:<name>__<currency>"
  const holdingMergeMap = new Map<string, HoldingDetail>();
  for (const h of holdings) {
    const key = h.ticker
      ? `t:${h.ticker}`
      : `n:${h.name}__${h.currency}`;
    const existing = holdingMergeMap.get(key);
    if (!existing) {
      holdingMergeMap.set(key, { ...h, id: key });
    } else {
      const newQty = existing.quantity + h.quantity;
      const totalCostLocal =
        existing.quantity * existing.avgBuyPrice +
        h.quantity * h.avgBuyPrice;
      const newCostKRW = existing.costKRW + h.costKRW;
      const newValueKRW = existing.valueKRW + h.valueKRW;
      const newPnL = newValueKRW - newCostKRW;
      holdingMergeMap.set(key, {
        ...existing,
        quantity: newQty,
        avgBuyPrice: newQty > 0 ? totalCostLocal / newQty : 0,
        currentPrice: h.currentPrice || existing.currentPrice,
        category: existing.category ?? h.category,
        valueKRW: newValueKRW,
        costKRW: newCostKRW,
        pnlKRW: newPnL,
        returnPercent: newCostKRW === 0 ? 0 : (newPnL / newCostKRW) * 100,
        peRatio: existing.peRatio ?? h.peRatio,
        pbRatio: existing.pbRatio ?? h.pbRatio,
        dividendYield: existing.dividendYield ?? h.dividendYield,
        weightPercent: existing.weightPercent + h.weightPercent,
      });
    }
  }
  const mergedHoldings = [...holdingMergeMap.values()];
  mergedHoldings.sort((a, b) => b.valueKRW - a.valueKRW);

  // 병합 후 비현금 보유 종목 수 재산출
  holdingCountNonCash = mergedHoldings.filter((h) => h.type !== "cash").length;

  const totalPnLKRW = totalValueKRW - totalCostKRW;
  const totalReturnPercent =
    totalCostKRW === 0 ? 0 : (totalPnLKRW / totalCostKRW) * 100;
  const cashPercent =
    totalValueKRW === 0 ? 0 : (cashValueKRW / totalValueKRW) * 100;

  const toAllocation = (map: Map<string, number>) =>
    [...map.entries()]
      .map(([key, valueKRW]) => ({
        key,
        percent: totalValueKRW === 0 ? 0 : (valueKRW / totalValueKRW) * 100,
        valueKRW,
      }))
      .sort((a, b) => b.valueKRW - a.valueKRW);

  const categoryAllocation = toAllocation(categoryMap).map((x) => ({
    category: x.key as AssetCategory,
    percent: x.percent,
    valueKRW: x.valueKRW,
  }));

  const currencyExposure: CurrencyExposure[] = [...localMap.entries()]
    .map(([currency, { totalLocal, totalKRW }]) => ({
      currency,
      totalLocal,
      totalKRW,
      percent: totalValueKRW === 0 ? 0 : (totalKRW / totalValueKRW) * 100,
      rate: rates[currency] ?? 1,
    }))
    .sort((a, b) => b.totalKRW - a.totalKRW);

  const currencyScenarios: CurrencyScenario[] = [];
  for (const exp of currencyExposure) {
    if (exp.currency === baseCurrency) continue;
    for (const changePercent of [5, -5]) {
      const impactKRW = exp.totalKRW * (changePercent / 100);
      currencyScenarios.push({
        currency: exp.currency,
        changePercent,
        impactKRW,
        impactPercent:
          totalValueKRW === 0 ? 0 : (impactKRW / totalValueKRW) * 100,
      });
    }
  }

  const msg = insightMessages ?? DEFAULT_INSIGHT_MESSAGES;
  const insights = generateInsights(
    assets,
    mergedHoldings,
    cashPercent,
    categoryAllocation,
    currencyExposure,
    targets,
    baseCurrency,
    msg,
  );

  return {
    totalValueKRW,
    totalCostKRW,
    totalPnLKRW,
    totalReturnPercent,
    holdingCount: holdingCountNonCash,
    assetTypeCount: typeSet.size,
    cashPercent,
    categoryAllocation,
    marketAllocation: toAllocation(marketMap).map((x) => ({
      market: x.key,
      percent: x.percent,
      valueKRW: x.valueKRW,
    })),
    currencyAllocation: toAllocation(currencyMap).map((x) => ({
      currency: x.key,
      percent: x.percent,
      valueKRW: x.valueKRW,
    })),
    holdings: mergedHoldings,
    currencyExposure,
    currencyScenarios,
    insights,
  };
}

/**
 * 리밸런싱 권장 계산
 * 내 자산 카테고리 + 구루 목표 카테고리의 합집합 기준으로 산출
 */
export function calculateRebalancing(
  summary: PortfolioSummary,
  targets: TargetAllocation[],
): RebalanceSuggestion[] {
  const currentMap = new Map(
    summary.categoryAllocation.map((t) => [t.category, t.percent]),
  );
  const targetMap = new Map(
    targets.map((t) => [t.category, t.targetPercent]),
  );

  // 합집합: 구루 목표 카테고리 + 내 보유 카테고리
  const allCategories = new Set<AssetCategory>([
    ...targetMap.keys(),
    ...currentMap.keys(),
  ]);

  return [...allCategories].map((category) => {
    const currentPercent = currentMap.get(category) ?? 0;
    const targetPercent = targetMap.get(category) ?? 0;
    const diffPercent = targetPercent - currentPercent;
    const diffAmountKRW = (diffPercent / 100) * summary.totalValueKRW;
    return { category, currentPercent, targetPercent, diffAmountKRW };
  });
}
