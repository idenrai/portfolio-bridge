import type {
  Asset,
  TargetAllocation,
  PortfolioSummary,
} from "@/types";
import type { Lang } from "@/i18n";
import { LANG_NAMES } from "@/i18n";
import {
  formatInBase,
  buildCategorySection,
  buildMarketSection,
  buildFxSection,
  buildHoldingRows,
  buildCashSection,
} from "./promptHelpers";

/**
 * AI에게 포트폴리오 인사이트를 요청하는 프롬프트 생성
 */
export function buildInsightPrompt(
  summary: PortfolioSummary,
  assets: Asset[],
  targets: TargetAllocation[],
  lang: Lang = "ko",
  baseCurrency: string = "KRW",
  rates: Record<string, number> = { KRW: 1, USD: 1350, JPY: 9 },
): string {
  const totalKRW = summary.totalValueKRW;
  const pnlKRW = summary.totalPnLKRW;
  const returnPct = summary.totalReturnPercent;

  const categorySection = buildCategorySection(summary, targets);
  const marketSection = buildMarketSection(summary);
  const fxSection = buildFxSection(summary);
  const { rows: holdingRows, count: holdingCount } = buildHoldingRows(summary);
  const cashSection = buildCashSection(assets);

  return `You are a professional portfolio analyst. Please analyze the following portfolio and provide:
1. An assessment of the current portfolio composition (diversification, risk concentration, currency exposure)
2. An ideal asset allocation model tailored to the portfolio's profile
3. Specific, actionable portfolio adjustment insights (what to buy more, reduce, or rebalance)
4. Any notable risks or opportunities you observe

--- PORTFOLIO OVERVIEW ---
Total value (${baseCurrency}): ${formatInBase(totalKRW, baseCurrency, rates)}
Total P&L (${baseCurrency}):   ${pnlKRW >= 0 ? "+" : ""}${formatInBase(pnlKRW, baseCurrency, rates)} (${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(2)}%)
Number of positions: ${summary.holdingCount}
Cash %: ${summary.cashPercent.toFixed(1)}%

--- ALLOCATION BY CATEGORY ---
${categorySection}

--- ALLOCATION BY MARKET ---
${marketSection}

--- CURRENCY EXPOSURE ---
${fxSection}

--- HOLDINGS (sorted by weight, top ${holdingCount}) ---
${holdingRows}

--- CASH POSITIONS ---
${cashSection}

IMPORTANT: Please respond entirely in ${LANG_NAMES[lang]}. Be concise but specific, and prioritize actionable recommendations.`;
}
