import type {
  Asset,
  TargetAllocation,
  PortfolioSummary,
} from "@/types";
import type { Lang } from "@/i18n";
import { LANG_NAMES } from "@/i18n";
import {
  buildCategorySection,
  buildPortfolioDataBlock,
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
  const categorySection = buildCategorySection(summary, targets);
  const dataBlock = buildPortfolioDataBlock(
    summary,
    assets,
    baseCurrency,
    rates,
    categorySection,
  );

  return `You are a professional portfolio analyst. Please analyze the following portfolio and provide:
1. An assessment of the current portfolio composition (diversification, risk concentration, currency exposure)
2. An ideal asset allocation model tailored to the portfolio's profile
3. Specific, actionable portfolio adjustment insights (what to buy more, reduce, or rebalance)
4. Any notable risks or opportunities you observe

${dataBlock}

IMPORTANT: Please respond entirely in ${LANG_NAMES[lang]}. Be concise but specific, and prioritize actionable recommendations.`;
}
