import { useMemo } from "react";
import { Settings } from "lucide-react";
import type { GuruProfile, PortfolioSummary, PortfolioAsset, RebalanceSuggestion } from "@/types";
import type { CustomGuruConfig } from "@/stores";
import {
  CUSTOM_GURU_RISK_KEYS,
  CUSTOM_GURU_STRATEGY_KEYS,
  CUSTOM_GURU_TONE_KEYS,
} from "@/stores";
import { GURU_METADATA } from "@/utils";
import { en } from "@/i18n";
import type { Translations } from "@/i18n";
import { GuruSelector } from "../GuruSelector";
import { GuruAIPromptBanner } from "../GuruAIPromptBanner";
import { GuruCharts } from "../GuruCharts";
import { GuruRebalanceTable } from "../GuruRebalanceTable";
import { GrahamDefensiveCard } from "../GrahamDefensiveCard";
import { LynchTenBaggerCard } from "../LynchTenBaggerCard";
import { BuffettIndicatorCard } from "../BuffettIndicatorCard";
import { MagicFormulaCard } from "../MagicFormulaCard";
import { SmithQualityCard } from "../SmithQualityCard";
import { PiotroskiFScoreCard } from "../PiotroskiFScoreCard";
import { OneilCanSlimCard } from "../OneilCanSlimCard";
import { CustomGuruAvatarIcon } from "../CustomGuruAvatarIcon";

interface GuruDetailViewProps {
  selectedGuru: GuruProfile;
  customGuruConfig: CustomGuruConfig;
  summary: PortfolioSummary;
  assets: PortfolioAsset[];
  allAssets?: PortfolioAsset[];
  guruRebalancing: RebalanceSuggestion[];
  radarData: Array<{ category: string; guru: number; mine: number }>;
  onSelectGuru: (guru: GuruProfile) => void;
  onOpenCustomModal: () => void;
  onOpenGuideModal: () => void;
  guruName: (guru: GuruProfile) => string;
  t: Translations;
}

export function GuruDetailView({
  selectedGuru,
  customGuruConfig,
  summary,
  assets,
  allAssets,
  guruRebalancing,
  radarData,
  onSelectGuru,
  onOpenCustomModal,
  onOpenGuideModal,
  guruName,
  t,
}: GuruDetailViewProps) {
  const isCustom = selectedGuru.id === "custom";
  const strategyKey = CUSTOM_GURU_STRATEGY_KEYS[customGuruConfig.strategy];
  const strategyLabel = (t[strategyKey] as string) ?? customGuruConfig.strategy;

  const customPrinciples = useMemo(() => {
    if (!isCustom) return [];
    const riskKey = CUSTOM_GURU_RISK_KEYS[customGuruConfig.riskTolerance];
    const toneKey = CUSTOM_GURU_TONE_KEYS[customGuruConfig.tone];
    const list = [
      `${t.custom_guru_risk_label}: ${(t[riskKey] as string) ?? customGuruConfig.riskTolerance}`,
      `${t.custom_guru_strategy_label}: ${strategyLabel}`,
      `${t.custom_guru_tone_label}: ${(t[toneKey] as string) ?? customGuruConfig.tone}`,
    ];
    if (customGuruConfig.customPhilosophy?.trim()) {
      list.push(`"${customGuruConfig.customPhilosophy.trim()}"`);
    }
    return list;
  }, [isCustom, customGuruConfig, strategyLabel, t]);

  const selectedPhilosophyKey =
    !isCustom ? (`guru_philosophy_${selectedGuru.id}` as keyof typeof en) : null;
  const selectedQuotesKey =
    !isCustom ? (`guru_quotes_${selectedGuru.id}` as keyof typeof en) : null;

  const localizedPhilosophy = selectedPhilosophyKey
    ? ((t[selectedPhilosophyKey as keyof typeof t] as string | undefined) ??
      (en[selectedPhilosophyKey] as string | undefined) ??
      "")
    : "";

  const localizedQuotes = selectedQuotesKey
    ? ((t[selectedQuotesKey as keyof typeof t] as string | undefined) ??
      (en[selectedQuotesKey] as string | undefined) ??
      "")
    : "";

  const principles = isCustom
    ? customPrinciples
    : localizedPhilosophy
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

  const quotes = isCustom
    ? []
    : localizedQuotes
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

  return (
    <>
      <div className="flex items-center justify-between pb-1">
        <span className="font-mono text-3xs font-semibold tracking-wider text-zinc-500 uppercase">
          {t.guru_detail_explorer_label}
        </span>
      </div>

      <GuruSelector
        selectedGuru={selectedGuru}
        onSelect={onSelectGuru}
        onOpenCustomModal={onOpenCustomModal}
        onOpenGuideModal={onOpenGuideModal}
      />

      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Avatar, Philosophy, Quotes */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:col-span-4">
          <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4">
              {isCustom ? (
                <div className="mx-auto flex aspect-square w-full max-w-80 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-linear-to-br from-indigo-950/40 via-zinc-900 to-black text-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                  <CustomGuruAvatarIcon
                    iconId={customGuruConfig.avatarIcon}
                    className="size-24 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  />
                </div>
              ) : (
                <img
                  src={selectedGuru.avatar || "/fallback-avatar.svg"}
                  alt={guruName(selectedGuru)}
                  width={320}
                  height={320}
                  fetchPriority="high"
                  className="mx-auto aspect-square w-full max-w-80 shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900 object-cover shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-shadow hover:shadow-[0_0_50px_rgba(255,255,255,0.08)]"
                />
              )}
              <div className="pt-2 text-center lg:text-left">
                <h2 className="mb-1 text-2xl font-bold tracking-tight text-white">
                  {guruName(selectedGuru)}
                </h2>
                <p className="text-xs tracking-widest text-zinc-500 uppercase">
                  {isCustom ? strategyLabel : selectedGuru.firm}
                </p>
                {!isCustom && GURU_METADATA[selectedGuru.id] && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 font-mono text-3xs font-medium text-zinc-300">
                      #{t[GURU_METADATA[selectedGuru.id].tagKey as keyof typeof t] as string}
                    </span>
                  </div>
                )}
                {isCustom && (
                  <button
                    type="button"
                    onClick={onOpenCustomModal}
                    className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-all hover:bg-indigo-500/20 hover:text-white"
                  >
                    <Settings className="size-3.5" />
                    <span>{t.custom_guru_settings_btn}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4 border-t border-zinc-800/80 pt-4">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-1 rounded-full bg-indigo-500" />
                <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  {t.guru_philosophy_label}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {principles.map((principle, index) => (
                  <li
                    key={index}
                    className="text-xs leading-relaxed text-zinc-300"
                  >
                    {principle}
                  </li>
                ))}
              </ul>
            </div>

            {quotes.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 border-t border-zinc-800/80 pt-4">
                {quotes.map((quote, idx) => (
                  <blockquote key={idx} className="relative">
                    <p className="border-l-2 border-indigo-500/40 pl-3 text-xs leading-relaxed text-zinc-300/90 italic">
                      "{quote}"
                    </p>
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Prompt, Radar Chart, Rebalance Table, Specialist Analyzers */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <GuruAIPromptBanner
            selectedGuru={selectedGuru}
            summary={summary}
            assets={assets}
            allAssets={allAssets}
          />

          <GuruCharts
            selectedGuru={selectedGuru}
            radarData={radarData}
          />

          <GuruRebalanceTable
            guruRebalancing={guruRebalancing}
          />

          {selectedGuru.id === "graham" && <GrahamDefensiveCard />}
          {selectedGuru.id === "lynch" && <LynchTenBaggerCard />}
          {selectedGuru.id === "buffett" && <BuffettIndicatorCard />}
          {selectedGuru.id === "greenblatt" && <MagicFormulaCard />}
          {selectedGuru.id === "smith" && <SmithQualityCard />}
          {selectedGuru.id === "piotroski" && <PiotroskiFScoreCard />}
          {selectedGuru.id === "oneil" && <OneilCanSlimCard />}
        </div>
      </div>
    </>
  );
}
