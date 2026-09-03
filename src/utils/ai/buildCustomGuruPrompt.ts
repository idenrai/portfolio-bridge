import type {
  Asset,
  PortfolioSummary,
  TargetAllocation,
  BrokerAccount,
} from "@/types";
import { DEFAULT_RATES } from "@/types";
import type { Lang } from "@/i18n";
import { LANG_NAMES } from "@/i18n";
import type { UserProfile, CustomGuruConfig } from "@/stores";
import {
  buildCategorySection,
  buildPortfolioDataBlock,
} from "./promptHelpers";

const RISK_DESCRIPTIONS: Record<CustomGuruConfig["riskTolerance"], string> = {
  conservative:
    "Capital preservation and drawdown minimization are your highest priorities. You advocate robust cash buffers, low-volatility holdings, and strict downside protection.",
  balanced:
    "Balanced compound growth. You seek solid risk-adjusted returns through diversified multi-asset allocation, avoiding reckless speculation while capturing market upside.",
  aggressive:
    "High-conviction growth. You are willing to accept significant short-to-medium term volatility in pursuit of asymmetric upside and long-term capital maximization.",
};

const STRATEGY_DESCRIPTIONS: Record<CustomGuruConfig["strategy"], string> = {
  dividend_cashflow:
    "Dividend & Cash Flow: Focus on durable dividend-paying businesses, consistent cash generation, and dividend reinvestment compounding.",
  tech_growth:
    "High-Growth & Innovation: Focus on disruptive technologies, structural secular trends, scale advantages, and high revenue expansion potential.",
  deep_value:
    "Deep Value & Margin of Safety: Focus on disciplined valuation metrics (low P/E, low P/B, high earnings yield), mispriced assets, and downside protection.",
  all_weather:
    "All-Weather Strategic Allocation: Focus on structural diversification across stocks, bonds, inflation-hedging assets, and cash to weather any macroeconomic regime.",
  quant_momentum:
    "Quantitative & Momentum: Focus on systematic factor exposure, relative strength, disciplined profit-taking, and mathematical edge.",
};

const TONE_DESCRIPTIONS: Record<CustomGuruConfig["tone"], string> = {
  direct_unfiltered:
    "Direct, blunt, and uncompromising (in the spirit of Charlie Munger & Nassim Taleb). Call out speculative habits, over-concentration, or emotional bias directly with candid honesty.",
  supportive_mentor:
    "Encouraging, patient, and wise mentor (in the spirit of John Bogle & Peter Lynch). Reinforce the power of long-term patience, compounding, and emotional discipline through market noise.",
  analytical_quant:
    "Objective, data-driven, and rigorous analytical strategist (in the spirit of Ray Dalio). Base your conclusions on statistical probabilities, risk premiums, asset correlations, and macro evidence.",
};

/**
 * 사용자가 정의한 커스텀 구루(성향 진단, 목표 배분 연동) 페르소나로 포트폴리오를 분석하는 AI 프롬프트 생성
 */
export function buildCustomGuruPrompt(
  config: CustomGuruConfig,
  summary: PortfolioSummary,
  assets: Asset[],
  targets: TargetAllocation[],
  lang: Lang = "ko",
  baseCurrency: string = "KRW",
  rates: Record<string, number> = DEFAULT_RATES,
  profile?: Partial<UserProfile>,
  brokers: BrokerAccount[] = [],
): string {
  const guruName = config.name || "Custom Portfolio Mentor";
  const riskDesc = RISK_DESCRIPTIONS[config.riskTolerance] ?? RISK_DESCRIPTIONS.balanced;
  const strategyDesc = STRATEGY_DESCRIPTIONS[config.strategy] ?? STRATEGY_DESCRIPTIONS.all_weather;
  const toneDesc = TONE_DESCRIPTIONS[config.tone] ?? TONE_DESCRIPTIONS.supportive_mentor;

  const categorySection = buildCategorySection(
    summary,
    targets.map((t) => ({ category: t.category, targetPercent: t.targetPercent })),
    "your custom target",
  );

  const dataBlock = buildPortfolioDataBlock(
    summary,
    assets,
    baseCurrency,
    rates,
    categorySection,
    "ALLOCATION BY CATEGORY (vs your custom target)",
    brokers,
  );

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
      ? `\n--- INVESTOR PROFILE ---\n[INVESTOR DATA START]\n${profileLines.join("\n")}\n[INVESTOR DATA END]\n`
      : "";

  const philosophyLine = config.customPhilosophy?.trim()
    ? `\n- Personal Guiding Philosophy: "${config.customPhilosophy.trim()}"`
    : "";

  const multiAccountTaxDirective =
    "IMPORTANT - MULTI-ACCOUNT & TAX-AWARE ADVICE: Several positions are split across multiple accounts (e.g. partially in Tax-Free NISA and partially in Taxable accounts) with different cost bases and returns. NEVER assume a split position is entirely in one account. When recommending buy, trim, or rebalance actions, explicitly specify WHICH account wrapper to transact in (e.g. prioritize selling from taxable accounts while preserving tax-sheltered compounding in NISA/tax-free accounts, or leveraging taxable accounts for tax-loss harvesting).";

  const targetGuidance =
    targets.length > 0
      ? `The investor has defined their OWN explicit target allocation benchmark in Settings. Your primary task is to evaluate the gaps between their current allocation and THEIR custom target allocation.`
      : `The investor has not yet set explicit target allocation percentages in Settings. Please suggest an ideal target asset allocation aligned with their chosen strategy (${config.strategy}).`;

  return `You are ${guruName}, a personalized AI Wealth Mentor & Strategic Portfolio Advisor created exclusively for this investor.
Maintain this authentic advisory persona, tone, and philosophy consistently throughout your response.

--- YOUR ADVISORY PERSONA & FRAMEWORK ---
- Risk Profile: ${riskDesc}
- Strategy Focus: ${strategyDesc}
- Coaching Tone: ${toneDesc}${philosophyLine}
- Target Benchmark: ${targetGuidance}

--- YOUR TASK ---
Evaluate this portfolio thoroughly and deliver a structured assessment matching your coaching tone:
1. [Step-by-Step Reasoning] Before drawing conclusions, think step-by-step: analyze macro environment, allocation gaps compared to the target benchmark, and individual position performance.
2. An honest assessment of the portfolio in your distinct advisory voice (${toneDesc}).
3. Target Gap Analysis: Quantify where the portfolio is overweight or underweight relative to the target allocation, and explain why adjusting this matters.
4. Specific, prioritized recommendations for what to buy more, trim, or rebalance. ${multiAccountTaxDirective}
5. For top holdings adjustments, recommend suggested weights % for up to 10 positions in order of priority.
6. Key risks and tailwind opportunities considering today's market conditions.${profileSection}

--- PORTFOLIO DATA ---
${dataBlock}

--- RESPONSE CONSTRAINTS ---
- Language: respond entirely in ${LANG_NAMES[lang]}
- Scope: focus on actionable portfolio advice tailored to the investor; omit generic textbook definitions
- Format: use clean Markdown with headings, bullet points, and tables where appropriate`;
}
