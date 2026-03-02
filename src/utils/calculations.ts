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
  PortfolioInsight,
} from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { toKRW } from "./currency";

/** 인사이트 메시지 템플릿 (i18n 주입용) */
export interface InsightMessages {
  concentration: (name: string, pct: string) => string;
  bigLoss: (name: string, pct: string) => string;
  cashHigh: (pct: string) => string;
  cashLow: (pct: string) => string;
  fxHigh: (currency: string, pct: string) => string;
  categoryOver: (label: string, pct: string, target: string, diff: string) => string;
  categoryUnder: (
    label: string,
    pct: string,
    target: string,
    diff: string,
  ) => string;
  getCategoryLabel: (category: string) => string;
}

const DEFAULT_INSIGHT_MESSAGES: InsightMessages = {
  concentration: (name, pct) => `${name} 비중 ${pct}% — 개별 종목 집중도 높음`,
  bigLoss: (name, pct) => `${name} 수익률 ${pct}% — 큰 손실 발생 중`,
  cashHigh: (pct) => `현금 비중 ${pct}% — 유동성 과다, 투자 기회 검토`,
  cashLow: (pct) => `현금 비중 ${pct}% — 비상자금 부족 주의`,
  fxHigh: (currency, pct) => `${currency} 노출 ${pct}% — 환율 변동 민감`,
  categoryOver: (label, pct, target, diff) =>
    `${label} 비중 ${pct}% (목표 ${target}%) → +${diff}%p 과중`,
  categoryUnder: (label, pct, target, diff) =>
    `${label} 비중 ${pct}% (목표 ${target}%) → ${diff}%p 부족`,
  getCategoryLabel: (category) =>
    CATEGORY_LABELS[category as AssetCategory] ?? category,
};

/**
 * 자산 한 건의 현재 평가액 (현지 통화)
 */
export function assetValue(asset: Asset): number {
  return asset.quantity * asset.currentPrice;
}

/**
 * 자산 한 건의 투자 원금 (현지 통화)
 */
export function assetCost(asset: Asset): number {
  return asset.quantity * asset.avgBuyPrice;
}

/**
 * 자산 한 건의 손익 (현지 통화)
 */
export function assetPnL(asset: Asset): number {
  return assetValue(asset) - assetCost(asset);
}

/**
 * 자산 한 건의 수익률 (%)
 */
export function assetReturnPercent(asset: Asset): number {
  const cost = assetCost(asset);
  return cost === 0 ? 0 : (assetPnL(asset) / cost) * 100;
}

/**
 * 인사이트/경고 자동 생성
 */
function generateInsights(
  assets: Asset[],
  holdings: HoldingDetail[],
  cashPercent: number,
  categoryAllocation: { category: AssetCategory; percent: number }[],
  currencyExposure: CurrencyExposure[],
  targets: TargetAllocation[],
  baseCurrency: CurrencyCode,
  msg: InsightMessages,
): PortfolioInsight[] {
  const insights: PortfolioInsight[] = [];

  // 1. 개별 종목 과대 비중 (> 15%)
  for (const h of holdings) {
    if (h.type !== "cash" && h.weightPercent > 15) {
      insights.push({
        type: "warning",
        icon: "⚠️",
        message: msg.concentration(h.name, h.weightPercent.toFixed(1)),
      });
    }
  }

  // 2. 큰 손실 종목 (< -20%)
  for (const h of holdings) {
    if (h.type !== "cash" && h.returnPercent < -20) {
      insights.push({
        type: "danger",
        icon: "🔻",
        message: msg.bigLoss(h.name, h.returnPercent.toFixed(1)),
      });
    }
  }

  // 3. 현금 비중 경고
  if (cashPercent > 20) {
    insights.push({
      type: "info",
      icon: "💰",
      message: msg.cashHigh(cashPercent.toFixed(1)),
    });
  } else if (cashPercent < 3 && assets.length > 3) {
    insights.push({
      type: "warning",
      icon: "💰",
      message: msg.cashLow(cashPercent.toFixed(1)),
    });
  }

  // 4. 환율 노출 (> 40%)
  for (const exp of currencyExposure) {
    if (exp.currency !== baseCurrency && exp.percent > 40) {
      insights.push({
        type: "warning",
        icon: "💱",
        message: msg.fxHigh(exp.currency, exp.percent.toFixed(1)),
      });
    }
  }

  // 5. 카테고리 목표 대비 편차 (|diff| > 10%)
  for (const t of targets) {
    const current = categoryAllocation.find((a) => a.category === t.category);
    const currentPercent = current?.percent ?? 0;
    const diff = currentPercent - t.targetPercent;
    if (Math.abs(diff) > 10) {
      const label = msg.getCategoryLabel(t.category);
      if (diff > 0) {
        insights.push({
          type: "warning",
          icon: "📊",
          message: msg.categoryOver(
            label,
            currentPercent.toFixed(1),
            String(t.targetPercent),
            diff.toFixed(1),
          ),
        });
      } else {
        insights.push({
          type: "info",
          icon: "📊",
          message: msg.categoryUnder(
            label,
            currentPercent.toFixed(1),
            String(t.targetPercent),
            Math.abs(diff).toFixed(1),
          ),
        });
      }
    }
  }

  return insights;
}

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

  // 지도: 카테고리 / 시장 / 통화별
  const categoryMap = new Map<AssetCategory, number>();
  const marketMap = new Map<string, number>();
  const currencyMap = new Map<string, number>();

  let cashValueKRW = 0;

  // 환율 노출 집계 (현지 통화 기준)
  const localMap = new Map<
    CurrencyCode,
    { totalLocal: number; totalKRW: number }
  >();

  // 자산 유형 셋
  const typeSet = new Set<AssetType>();

  const holdings: HoldingDetail[] = [];
  let holdingCountNonCash = 0;

  for (const a of assets) {
    const valKRW = toKRW(assetValue(a), a.currency, rates);
    const costKRW = toKRW(assetCost(a), a.currency, rates);
    totalValueKRW += valKRW;
    totalCostKRW += costKRW;
    typeSet.add(a.type);

    // 환율 노출
    const localVal = assetValue(a);
    const prev = localMap.get(a.currency);
    if (prev) {
      prev.totalLocal += localVal;
      prev.totalKRW += valKRW;
    } else {
      localMap.set(a.currency, { totalLocal: localVal, totalKRW: valKRW });
    }

    // 카테고리 (복수 카테고리면 균등 분배)
    const categoryShare =
      a.categories.length > 0 ? valKRW / a.categories.length : 0;
    for (const cat of a.categories) {
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + categoryShare);
    }
    if (a.categories.length === 0) {
      categoryMap.set("other", (categoryMap.get("other") ?? 0) + valKRW);
    }

    // 시장
    marketMap.set(a.market, (marketMap.get(a.market) ?? 0) + valKRW);

    // 통화
    currencyMap.set(a.currency, (currencyMap.get(a.currency) ?? 0) + valKRW);

    // 현금 vs 금융자산
    if (a.type === "cash") {
      cashValueKRW += valKRW;
    } else {
      holdingCountNonCash++;
    }

    // holding detail
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
      weightPercent: 0, // 아래서 채움
    });
  }

  // 비중 계산
  for (const h of holdings) {
    h.weightPercent =
      totalValueKRW === 0 ? 0 : (h.valueKRW / totalValueKRW) * 100;
  }
  holdings.sort((a, b) => b.valueKRW - a.valueKRW);

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

  // 환율 노출
  const currencyExposure: CurrencyExposure[] = [...localMap.entries()]
    .map(([currency, { totalLocal, totalKRW }]) => ({
      currency,
      totalLocal,
      totalKRW,
      percent: totalValueKRW === 0 ? 0 : (totalKRW / totalValueKRW) * 100,
      rate: rates[currency] ?? 1,
    }))
    .sort((a, b) => b.totalKRW - a.totalKRW);

  // 환율 시나리오 (±5%) — baseCurrency 제외한 외화만
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

  // 인사이트 생성
  const msg = insightMessages ?? DEFAULT_INSIGHT_MESSAGES;
  const insights = generateInsights(
    assets,
    holdings,
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
    holdings,
    currencyExposure,
    currencyScenarios,
    insights,
  };
}

/**
 * 리밸런싱 권장 계산
 */
export function calculateRebalancing(
  summary: PortfolioSummary,
  targets: TargetAllocation[],
): RebalanceSuggestion[] {
  const currentMap = new Map(
    summary.categoryAllocation.map((t) => [t.category, t.percent]),
  );

  return targets.map((t) => {
    const currentPercent = currentMap.get(t.category) ?? 0;
    const diffPercent = t.targetPercent - currentPercent;
    const diffAmountKRW = (diffPercent / 100) * summary.totalValueKRW;
    return {
      category: t.category,
      currentPercent,
      targetPercent: t.targetPercent,
      diffAmountKRW,
    };
  });
}
