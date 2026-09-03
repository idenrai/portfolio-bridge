import { useState, useMemo, useRef, useEffect } from "react";
import {
  MessageSquareQuote,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useT, useExchangeRates, useGuruPromptScope } from "@/hooks";
import {
  useLanguageStore,
  useSettingsStore,
  useProfileStore,
  useGuruSessionStore,
  useBrokerStore,
  useCustomGuruStore,
} from "@/stores";
import {
  buildGuruPrompt,
  buildGuruFollowUpPrompt,
  buildCustomGuruPrompt,
  cn,
} from "@/utils";
import type { GuruProfile, PortfolioSummary, PortfolioAsset } from "@/types";
import { en } from "@/i18n";
import { GuruScopeSelector } from "./prompt/GuruScopeSelector";
import { GuruPromptCard } from "./prompt/GuruPromptCard";
import { GuruFollowUpSection } from "./prompt/GuruFollowUpSection";

interface GuruAIPromptBannerProps {
  selectedGuru: GuruProfile;
  summary: PortfolioSummary;
  assets: PortfolioAsset[];
  allAssets?: PortfolioAsset[];
}

export function GuruAIPromptBanner({
  selectedGuru,
  summary,
  assets,
  allAssets,
}: GuruAIPromptBannerProps) {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const targets = useSettingsStore((s) => s.targetAllocations);
  const { data: rates } = useExchangeRates();
  const brokers = useBrokerStore((s) => s.accounts);
  const customGuruConfig = useCustomGuruStore((s) => s.config);

  const nickname = useProfileStore((s) => s.nickname);
  const age = useProfileStore((s) => s.age);
  const annualIncome = useProfileStore((s) => s.annualIncome);
  const monthlyBudget = useProfileStore((s) => s.monthlyBudget);
  const plan3y = useProfileStore((s) => s.plan3y);
  const plan5y = useProfileStore((s) => s.plan5y);
  const plan10y = useProfileStore((s) => s.plan10y);
  const notes = useProfileStore((s) => s.notes);

  const profile = useMemo(
    () => ({ nickname, age, annualIncome, monthlyBudget, plan3y, plan5y, plan10y, notes }),
    [nickname, age, annualIncome, monthlyBudget, plan3y, plan5y, plan10y, notes],
  );

  const sessions = useGuruSessionStore((s) => s.sessions);
  const saveSession = useGuruSessionStore((s) => s.saveSession);
  const clearSession = useGuruSessionStore((s) => s.clearSession);

  const [showPrompt, setShowPrompt] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedFollowUp, setCopiedFollowUp] = useState(false);

  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const followUpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (followUpTimerRef.current) clearTimeout(followUpTimerRef.current);
    };
  }, []);

  // ── 자산 스코프 관리 훅 ──────────────────────────────────────────────────
  const {
    availableAssets,
    selectedAssetIds,
    isCustomScope,
    showScopeSelector,
    setShowScopeSelector,
    activeAssets,
    activeSummary,
    toggleAssetId,
    selectAll,
    deselectAll,
    resetToDefaultScope,
  } = useGuruPromptScope({
    assets,
    allAssets,
    summary,
    rates,
    targets,
    baseCurrency,
  });

  const selectedPhilosophyKey =
    selectedGuru.id !== "custom"
      ? (`guru_philosophy_${selectedGuru.id}` as keyof typeof en)
      : null;
  const englishPhilosophy = selectedPhilosophyKey
    ? ((en[selectedPhilosophyKey] as string | undefined) ?? "")
    : "";

  const promptText = useMemo(() => {
    if (activeAssets.length === 0) return "";
    if (selectedGuru.id === "custom") {
      return buildCustomGuruPrompt(
        customGuruConfig,
        activeSummary,
        activeAssets,
        targets,
        lang,
        baseCurrency,
        rates,
        profile,
        brokers,
      );
    }
    return buildGuruPrompt(
      selectedGuru,
      activeSummary,
      activeAssets,
      lang,
      baseCurrency,
      rates,
      englishPhilosophy,
      profile,
      brokers,
    );
  }, [
    selectedGuru,
    customGuruConfig,
    targets,
    activeSummary,
    activeAssets,
    lang,
    baseCurrency,
    rates,
    englishPhilosophy,
    profile,
    brokers,
  ]);

  const prevSession = sessions[selectedGuru.id];
  const followUpText = useMemo(() => {
    if (!prevSession || activeAssets.length === 0) return null;
    return buildGuruFollowUpPrompt(
      selectedGuru,
      prevSession,
      activeSummary,
      lang,
      baseCurrency,
      rates,
      profile,
      brokers,
      activeAssets,
    );
  }, [
    selectedGuru,
    prevSession,
    activeSummary,
    activeAssets,
    lang,
    baseCurrency,
    rates,
    profile,
    brokers,
  ]);

  const updateCurrentSession = () => {
    saveSession({
      guruId: selectedGuru.id,
      date: new Date().toLocaleDateString("en-CA"),
      totalValueKRW: activeSummary.totalValueKRW,
      totalCostKRW: activeSummary.totalCostKRW,
      totalPnLKRW: activeSummary.totalPnLKRW,
      totalReturnPercent: activeSummary.totalReturnPercent,
      holdingCount: activeSummary.holdingCount,
      cashPercent: activeSummary.cashPercent,
      categoryAllocation: activeSummary.categoryAllocation.map((c) => ({
        category: c.category,
        percent: c.percent,
      })),
      marketAllocation: activeSummary.marketAllocation.map((m) => ({
        market: m.market,
        percent: m.percent,
      })),
      currencyAllocation: activeSummary.currencyExposure?.map((c) => ({
        currency: c.currency,
        percent: c.percent,
      })) ?? [],
      holdings: activeSummary.holdings
        .filter((h) => h.type !== "cash")
        .map((h) => ({
          id: h.id,
          ticker: h.ticker,
          name: h.name,
          currency: h.currency,
          quantity: h.quantity,
          avgBuyPrice: h.avgBuyPrice,
          weightPercent: h.weightPercent,
          returnPercent: h.returnPercent,
          category: h.category,
        })),
      baseCurrency,
      rates,
    });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    updateCurrentSession();
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const copyFollowUp = async () => {
    if (!followUpText) return;
    try {
      await navigator.clipboard.writeText(followUpText);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = followUpText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedFollowUp(true);
    updateCurrentSession();
    if (followUpTimerRef.current) clearTimeout(followUpTimerRef.current);
    followUpTimerRef.current = setTimeout(() => setCopiedFollowUp(false), 2000);
  };

  const handleNewSession = () => {
    clearSession(selectedGuru.id);
    setShowPrompt(true);
    setShowFollowUp(false);
  };

  return (
    <div className="rounded-xl bg-linear-to-r from-indigo-500/20 to-purple-500/20 p-px shadow-sm">
      <div className="rounded-xl bg-zinc-900/95 p-4 sm:px-5">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <MessageSquareQuote aria-hidden="true" className="size-5 text-indigo-400" />
            <div className="min-w-0">
              <p className="text-sm leading-tight font-semibold text-zinc-100">
                {t.guru_ai_banner_title}
              </p>
              <p className="mt-1 text-xs-plus leading-relaxed text-zinc-500 sm:text-xs">
                {t.guru_ai_banner_desc}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowScopeSelector((prev) => !prev)}
              aria-expanded={showScopeSelector}
              className={cn(
                "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-center text-xs font-medium whitespace-nowrap shadow-sm transition-all active:scale-95 sm:flex-none",
                showScopeSelector || isCustomScope
                  ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-300"
                  : "border-zinc-700/60 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-white",
              )}
            >
              <SlidersHorizontal aria-hidden="true" className="size-3.5 text-indigo-400" />
              <span>{t.guru_ai_scope_title}</span>
              <span className="rounded-full bg-zinc-700/70 px-1.5 py-0.5 font-mono text-3xs text-zinc-200">
                {selectedAssetIds.size}/{availableAssets.length}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn("size-3.5 text-zinc-400 transition-transform", showScopeSelector && "rotate-180")}
              />
            </button>

            {prevSession && (
              <button
                type="button"
                onClick={() => {
                  setShowFollowUp(true);
                  setShowPrompt(false);
                }}
                className="flex-1 cursor-pointer rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-xs font-medium whitespace-nowrap text-emerald-400 shadow-sm transition-all hover:bg-emerald-500/20 active:scale-95 sm:flex-none"
              >
                {t.guru_ai_followup_btn}
              </button>
            )}
            <button
              type="button"
              onClick={handleNewSession}
              className="flex-1 cursor-pointer rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-center text-xs font-medium whitespace-nowrap text-indigo-400 shadow-sm transition-all hover:bg-indigo-500/20 hover:opacity-90 active:scale-95 sm:flex-none"
            >
              {t.guru_ai_followup_new_session}
            </button>
          </div>
        </div>

        {/* 종목 선택기 패널 */}
        {showScopeSelector && (
          <GuruScopeSelector
            availableAssets={availableAssets}
            selectedAssetIds={selectedAssetIds}
            toggleAssetId={toggleAssetId}
            selectAll={selectAll}
            deselectAll={deselectAll}
            resetToDefaultScope={resetToDefaultScope}
            activeAssetsCount={activeAssets.length}
            t={t}
          />
        )}

        {/* 첫 번째 프롬프트 */}
        {showPrompt && (
          <GuruPromptCard
            promptText={promptText}
            activeAssetsCount={activeAssets.length}
            copied={copied}
            onCopy={copyPrompt}
            t={t}
          />
        )}

        {/* 두 번째 (변동 사항) 프롬프트 */}
        {showFollowUp && followUpText && (
          <GuruFollowUpSection
            followUpText={followUpText}
            prevSessionDate={prevSession?.date}
            activeAssetsCount={activeAssets.length}
            copiedFollowUp={copiedFollowUp}
            onCopyFollowUp={copyFollowUp}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
