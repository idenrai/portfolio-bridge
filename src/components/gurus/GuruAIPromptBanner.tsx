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
import { GuruPromptCard, type GuruPromptMode } from "./prompt/GuruPromptCard";

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

  // ─── 단순화된 단일 뷰 상태 관리 ──────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<GuruPromptMode>("full");
  const [copied, setCopied] = useState(false);
  const [baselineResetFeedback, setBaselineResetFeedback] = useState(false);

  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
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

  const fullPromptText = useMemo(() => {
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
  const followUpPromptText = useMemo(() => {
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
      assets: activeAssets.map((a) => ({
        id: a.id,
        ticker: a.ticker,
        name: a.name,
        currency: a.currency,
        quantity: a.quantity,
        avgBuyPrice: a.avgBuyPrice,
        brokerId: a.brokerId,
      })),
    });
  };

  const handleCopy = async () => {
    const textToCopy = mode === "followup" && followUpPromptText ? followUpPromptText : fullPromptText;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    // 전체 분석을 복사할 때는 현재 상태를 기준 스냅샷으로 자동 저장
    if (mode === "full") {
      updateCurrentSession();
    }
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleResetBaseline = () => {
    updateCurrentSession();
    setBaselineResetFeedback(true);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setBaselineResetFeedback(false), 2000);
  };

  const handleToggleMode = (targetMode: GuruPromptMode) => {
    if (isOpen && mode === targetMode) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setMode(targetMode);
    }
  };

  return (
    <div className="rounded-none border border-zinc-800 bg-zinc-950 p-4 sm:px-5">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <MessageSquareQuote aria-hidden="true" className="size-5 text-amber-400" />
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold text-zinc-100">
              {t.guru_ai_banner_title}
            </p>
            <p className="mt-0.5 font-mono text-xs text-zinc-500">
              {t.guru_ai_banner_desc}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Selector Button */}
          <button
            type="button"
            onClick={() => setShowScopeSelector((prev) => !prev)}
            aria-expanded={showScopeSelector}
            className={cn(
              "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-none border px-3 py-2 text-center font-mono text-xs font-medium whitespace-nowrap shadow-none transition-all sm:flex-none",
              showScopeSelector || isCustomScope
                ? "border-amber-400 bg-amber-500/10 text-amber-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white",
            )}
          >
            <SlidersHorizontal aria-hidden="true" className="size-3.5 text-amber-400" />
            <span>{t.guru_ai_scope_title}</span>
            <span className="rounded-none border border-zinc-800 bg-zinc-800 px-1.5 py-0.5 font-mono text-3xs text-zinc-200">
              {selectedAssetIds.size}/{availableAssets.length}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn("size-3.5 text-zinc-400 transition-transform", showScopeSelector && "rotate-180")}
            />
          </button>

          {/* Mode 1: Full Review Prompt Button */}
          <button
            type="button"
            onClick={() => handleToggleMode("full")}
            aria-expanded={isOpen && mode === "full"}
            className={cn(
              "flex-1 cursor-pointer rounded-none border px-3 py-2 text-center font-mono text-xs font-semibold whitespace-nowrap shadow-none transition-all sm:flex-none",
              isOpen && mode === "full"
                ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/50"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-400 hover:text-black",
            )}
          >
            [ 01: {t.guru_ai_tab_full} ]
          </button>

          {/* Mode 2: Follow-up Delta Button */}
          <button
            type="button"
            onClick={() => handleToggleMode("followup")}
            aria-expanded={isOpen && mode === "followup"}
            className={cn(
              "flex-1 cursor-pointer rounded-none border px-3 py-2 text-center font-mono text-xs font-medium whitespace-nowrap shadow-none transition-all sm:flex-none",
              isOpen && mode === "followup"
                ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/50"
                : prevSession
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
            )}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span>[ 02: {t.guru_ai_tab_followup}</span>
              {prevSession && (
                <span className="inline-block size-1.5 rounded-none bg-emerald-400" aria-hidden="true" />
              )}
              <span>]</span>
            </span>
          </button>
        </div>
      </div>

      {/* Scope Selector Panel */}
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

      {/* Unified Prompt Deck */}
      {isOpen && (
        <GuruPromptCard
          mode={mode}
          onModeChange={setMode}
          fullPromptText={fullPromptText}
          followUpPromptText={followUpPromptText}
          prevSessionDate={prevSession?.date}
          activeAssetsCount={activeAssets.length}
          copied={copied}
          onCopy={handleCopy}
          onResetBaseline={handleResetBaseline}
          baselineResetFeedback={baselineResetFeedback}
          t={t}
        />
      )}
    </div>
  );
}
