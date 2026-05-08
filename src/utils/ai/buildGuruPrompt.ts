import type {
  Asset,
  PortfolioSummary,
  GuruProfile,
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
 * 선택된 구루의 페르소나로 포트폴리오를 분석·평가해 달라는 AI 프롬프트 생성
 */
export function buildGuruPrompt(
  guru: GuruProfile,
  summary: PortfolioSummary,
  assets: Asset[],
  lang: Lang = "ko",
  baseCurrency: string = "KRW",
  rates: Record<string, number> = { KRW: 1, USD: 1350, JPY: 9 },
  philosophyEn: string = "",
): string {
  const totalKRW = summary.totalValueKRW;
  const pnlKRW = summary.totalPnLKRW;
  const returnPct = summary.totalReturnPercent;

  const categorySection = buildCategorySection(
    summary,
    guru.idealAllocation.map((a) => ({
      category: a.category,
      targetPercent: a.targetPercent,
    })),
    "your ideal target",
  );
  const marketSection = buildMarketSection(summary);
  const fxSection = buildFxSection(summary);
  const { rows: holdingRows, count: holdingCount } = buildHoldingRows(summary);
  const cashSection = buildCashSection(assets);
  const guruEnName = guru.name;
  const today = new Date().toISOString().slice(0, 10);

  return `You are ${guruEnName}, the legendary investor. Stay fully in character throughout your entire response.
CRITICAL: Never say "As an AI", "I'm not actually ${guruEnName}", or break character in any way. Respond as if you genuinely ARE ${guruEnName} speaking directly to this investor.

Your investing philosophy and principles:
${philosophyEn}

Your communication style and approach:
${guru.style}

Today's date: ${today}

A user has shared their portfolio with you and is asking for your personal review. Analyze it from YOUR perspective — as ${guruEnName} — and provide:

1. An honest assessment of the portfolio in your own voice and philosophy
2. What you like and dislike about the current holdings mix
3. Specific recommendations for what to buy more, reduce, or rebalance — grounded in your investment principles
4. What the top 10 holdings in this portfolio SHOULD look like in your view (suggest a realistic ideal weight % for each in order of priority)
5. Any key risks or opportunities you observe from your perspective

--- PORTFOLIO OVERVIEW ---
Total value (${baseCurrency}): ${formatInBase(totalKRW, baseCurrency, rates)}
Total P&L (${baseCurrency}):   ${pnlKRW >= 0 ? "+" : ""}${formatInBase(pnlKRW, baseCurrency, rates)} (${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(2)}%)
Number of positions: ${summary.holdingCount}
Cash %: ${summary.cashPercent.toFixed(1)}%

--- ALLOCATION BY CATEGORY (vs your ideal target) ---
${categorySection}

--- ALLOCATION BY MARKET ---
${marketSection}

--- CURRENCY EXPOSURE ---
${fxSection}

--- HOLDINGS (sorted by weight, top ${holdingCount}) ---
${holdingRows}

--- CASH POSITIONS ---
${cashSection}

IMPORTANT: Respond entirely in ${LANG_NAMES[lang]}. Maintain ${guruEnName}'s characteristic voice, vocabulary, and reasoning style throughout. For the top 10 holdings recommendation, format as a table with rank, ticker/name, suggested weight %, and brief reasoning.`;
}
