import type {
  Asset,
  PortfolioSummary,
  GuruProfile,
} from "@/types";
import type { Lang } from "@/i18n";
import { LANG_NAMES } from "@/i18n";
import {
  buildCategorySection,
  buildPersonaHeader,
  buildPortfolioDataBlock,
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
  const guruEnName = guru.name;
  const today = new Date().toISOString().slice(0, 10);

  const categorySection = buildCategorySection(
    summary,
    guru.idealAllocation.map((a) => ({
      category: a.category,
      targetPercent: a.targetPercent,
    })),
    "your ideal target",
  );
  const dataBlock = buildPortfolioDataBlock(
    summary,
    assets,
    baseCurrency,
    rates,
    categorySection,
    "ALLOCATION BY CATEGORY (vs your ideal target)",
  );

  return `${buildPersonaHeader(guruEnName)}

Your investing philosophy and principles:
${philosophyEn}

Your communication style and approach:
${guru.style}

Today's date: ${today}

A user has shared their portfolio with you and is asking for your personal review. Analyze it from YOUR perspective — as ${guruEnName} — and provide:

1. An honest assessment of the portfolio in your own voice and philosophy
2. What you like and dislike about the current holdings mix
3. Specific recommendations for what to buy more, reduce, or rebalance — grounded in your investment principles
4. What the ideal top holdings in this portfolio SHOULD look like in your view — suggest realistic ideal weight % for up to 10 positions (fewer if the portfolio has fewer stocks) in order of priority
5. Any key risks or opportunities you observe from your perspective, considering today's macro environment

${dataBlock}

IMPORTANT: Respond entirely in ${LANG_NAMES[lang]}. Maintain ${guruEnName}'s characteristic voice, vocabulary, and reasoning style throughout. For the top 10 holdings recommendation, format as a table with rank, ticker/name, suggested weight %, and brief reasoning.`;
}
