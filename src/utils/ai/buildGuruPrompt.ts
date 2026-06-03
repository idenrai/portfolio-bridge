import type {
  Asset,
  PortfolioSummary,
  GuruProfile,
} from "@/types";
import type { Lang } from "@/i18n";
import { LANG_NAMES } from "@/i18n";
import type { UserProfile } from "@/stores";
import {
  buildCategorySection,
  buildPersonaHeader,
  buildPortfolioDataBlock,
} from "./promptHelpers";
import { GURU_FRAMEWORKS } from "./guruFrameworks";

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
  profile?: Partial<UserProfile>,
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

  const framework = GURU_FRAMEWORKS[guru.id];

  const taskSection = framework
    ? `Apply YOUR specific analytical framework to this portfolio:\n\n--- YOUR ANALYTICAL FRAMEWORK ---\n${framework.lens}`
    : `Analyze it from YOUR perspective — as ${guruEnName} — and provide:\n\n` +
      `1. An honest assessment of the portfolio in your own voice and philosophy\n` +
      `2. What you like and dislike about the current holdings mix\n` +
      `3. Specific recommendations for what to buy more, reduce, or rebalance — grounded in your investment principles\n` +
      `4. What the ideal top holdings should look like — suggest weight % for up to 10 positions in order of priority\n` +
      `5. Any key risks or opportunities considering today's macro environment`;

  const formatSection = framework
    ? `--- OUTPUT FORMAT ---\n${framework.format}`
    : `For the top 10 holdings recommendation, format as a table with rank, ticker/name, suggested weight %, and brief reasoning.`;

  // ── 투자자 프로필 섹션 ────────────────────────────────────────────────────
  const profileLines: string[] = [];
  if (profile) {
    if (profile.nickname) profileLines.push(`- Name: ${profile.nickname}`);
    if (profile.age != null) profileLines.push(`- Age: ${profile.age}`);
    if (profile.annualIncome != null)
      profileLines.push(
        `- Annual Income: ${profile.annualIncome.toLocaleString()} ${baseCurrency}`,
      );
    if (profile.monthlyBudget != null)
      profileLines.push(
        `- Monthly Investment Budget: ${profile.monthlyBudget.toLocaleString()} ${baseCurrency}`,
      );
    if (profile.plan3y) profileLines.push(`- 3-Year Plan: ${profile.plan3y}`);
    if (profile.plan5y) profileLines.push(`- 5-Year Plan: ${profile.plan5y}`);
    if (profile.plan10y)
      profileLines.push(`- 10-Year Plan: ${profile.plan10y}`);
    if (profile.notes)
      profileLines.push(`- Notes / Caveats: ${profile.notes}`);
  }
  const profileSection =
    profileLines.length > 0
      ? `\n--- INVESTOR PROFILE ---\n${profileLines.join("\n")}\n`
      : "";

  const addressLine = profile?.nickname
    ? `Please address the investor as "${profile.nickname}" throughout your response.`
    : `If you need additional context about the investor's age, financial goals, or investment timeline to give a more complete analysis, ask for it before proceeding.`;

  return `${buildPersonaHeader(guruEnName)}

Your investing philosophy and principles:
${philosophyEn}

Your communication style and approach:
${guru.style}

Today's date: ${today}
${profileSection}
A user has shared their investment portfolio and is asking for your personal review. ${taskSection}

${dataBlock}

${formatSection}

IMPORTANT: Respond entirely in ${LANG_NAMES[lang]}. Maintain ${guruEnName}'s characteristic voice, vocabulary, and reasoning style throughout. ${addressLine}`;
}
