import type {
  AssetCategory,
  CurrencyCode,
  TargetAllocation,
  HoldingDetail,
  CurrencyExposure,
  PortfolioInsight,
  PortfolioAsset,
} from "@/types";
import { INSIGHT_THRESHOLDS } from "@/constants";
import { CATEGORY_LABELS_EN } from "../ai/promptHelpers";

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

export const DEFAULT_INSIGHT_MESSAGES: InsightMessages = {
  concentration: (name, pct) => `${name} weight ${pct}% — High concentration`,
  bigLoss: (name, pct) => `${name} return ${pct}% — Significant loss`,
  cashHigh: (pct) => `Cash ${pct}% — High liquidity, consider investing`,
  cashLow: (pct) => `Cash ${pct}% — Low liquidity, keep emergency fund`,
  fxHigh: (currency, pct) => `${currency} exposure ${pct}% — High FX sensitivity`,
  categoryOver: (label, pct, target, diff) =>
    `${label} ${pct}% (Target ${target}%) → +${diff}%p Overweight`,
  categoryUnder: (label, pct, target, diff) =>
    `${label} ${pct}% (Target ${target}%) → ${diff}%p Underweight`,
  getCategoryLabel: (category) =>
    CATEGORY_LABELS_EN[category as AssetCategory] ?? category,
};

/**
 * 인사이트/경고 자동 생성
 */
export function generateInsights(
  assets: PortfolioAsset[],
  holdings: HoldingDetail[],
  cashPercent: number,
  categoryAllocation: { category: AssetCategory; percent: number }[],
  currencyExposure: CurrencyExposure[],
  targets: TargetAllocation[],
  baseCurrency: CurrencyCode,
  msg: InsightMessages,
): PortfolioInsight[] {
  const insights: PortfolioInsight[] = [];

  // 1. 개별 종목 과대 비중
  for (const h of holdings) {
    if (h.type !== "cash" && h.weightPercent > INSIGHT_THRESHOLDS.CONCENTRATION) {
      insights.push({
        type: "warning",
        icon: "⚠️",
        message: msg.concentration(h.name, h.weightPercent.toFixed(1)),
      });
    }
  }

  // 2. 큰 손실 종목
  for (const h of holdings) {
    if (h.type !== "cash" && h.returnPercent < INSIGHT_THRESHOLDS.BIG_LOSS) {
      insights.push({
        type: "danger",
        icon: "🔻",
        message: msg.bigLoss(h.name, h.returnPercent.toFixed(1)),
      });
    }
  }

  // 3. 현금 비중 경고
  if (cashPercent > INSIGHT_THRESHOLDS.CASH_HIGH) {
    insights.push({
      type: "info",
      icon: "💰",
      message: msg.cashHigh(cashPercent.toFixed(1)),
    });
  } else if (cashPercent < INSIGHT_THRESHOLDS.CASH_LOW && assets.length > INSIGHT_THRESHOLDS.CASH_LOW_MIN_ASSETS) {
    insights.push({
      type: "warning",
      icon: "💰",
      message: msg.cashLow(cashPercent.toFixed(1)),
    });
  }

  // 4. 환율 노출
  for (const exp of currencyExposure) {
    if (exp.currency !== baseCurrency && exp.percent > INSIGHT_THRESHOLDS.FX_HIGH) {
      insights.push({
        type: "warning",
        icon: "💱",
        message: msg.fxHigh(exp.currency, exp.percent.toFixed(1)),
      });
    }
  }

  // 5. 카테고리 목표 대비 편차
  for (const t of targets) {
    const current = categoryAllocation.find((a) => a.category === t.category);
    const currentPercent = current?.percent ?? 0;
    const diff = currentPercent - t.targetPercent;
    if (Math.abs(diff) > INSIGHT_THRESHOLDS.CATEGORY_DIFF) {
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
