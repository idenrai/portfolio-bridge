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

  return `--- ROLE ---
You are a senior portfolio analyst with deep expertise in multi-asset, multi-currency portfolio construction. You are conducting an objective, professional review for an individual investor.

--- TASK ---
Analyze the portfolio below and deliver a structured assessment covering:
1. Portfolio composition quality — diversification breadth, risk concentration, and currency exposure
2. Recommended ideal allocation model tailored to the portfolio's observable profile
3. Specific, prioritized action recommendations — what to increase, reduce, or rebalance and why
4. Key risks or opportunities that stand out given the current holdings

--- PORTFOLIO DATA ---
${dataBlock}

--- OUTPUT FORMAT ---
Structure your response with clear section headers matching the four task items above.
Each action recommendation must name the specific asset or category, state the direction (increase / reduce / rebalance), and provide a one-sentence rationale.

--- RESPONSE CONSTRAINTS ---
- Language: respond entirely in ${LANG_NAMES[lang]}
- Scope: focus on actionable insights; omit general investment education
- Length: aim for 400–600 words; prioritize specificity over comprehensiveness`;
}
