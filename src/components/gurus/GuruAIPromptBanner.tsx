import { useState, useMemo } from "react";
import {
  MessageSquareQuote,
  AlertTriangle,
  Calendar,
  Check,
  Copy,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useT, useExchangeRates } from "@/hooks";
import {
  useLanguageStore,
  useSettingsStore,
  useProfileStore,
  useGuruSessionStore,
  useBrokerStore,
} from "@/stores";
import {
  buildGuruPrompt,
  buildGuruFollowUpPrompt,
  calculateSummary,
  assetValue,
  cn,
} from "@/utils";
import type { GuruProfile, PortfolioSummary, PortfolioAsset } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";
import { FeedbackIconText } from "@/components/common";
import { en } from "@/i18n";

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

  // ── 상담 대상 종목 동적 선택 상태 ──────────────────────────────────────────
  const availableAssets = useMemo(
    () => (allAssets && allAssets.length > 0 ? allAssets : assets),
    [allAssets, assets],
  );
  const defaultSelectedAssetIds = useMemo(
    () => new Set(assets.map((a) => a.id)),
    [assets],
  );
  const [customSelectedAssetIds, setCustomSelectedAssetIds] = useState<Set<string> | null>(null);
  const selectedAssetIds = customSelectedAssetIds ?? defaultSelectedAssetIds;
  const isCustomScope = customSelectedAssetIds !== null;
  const [showScopeSelector, setShowScopeSelector] = useState(false);

  const activeAssets = useMemo(() => {
    return availableAssets.filter((a) => selectedAssetIds.has(a.id));
  }, [availableAssets, selectedAssetIds]);

  const activeSummary = useMemo(() => {
    if (!isCustomScope) return summary;
    return calculateSummary(activeAssets, rates, targets, baseCurrency);
  }, [isCustomScope, summary, activeAssets, rates, targets, baseCurrency]);

  const selectedPhilosophyKey = `guru_philosophy_${selectedGuru.id}` as keyof typeof en;
  const englishPhilosophy = (en[selectedPhilosophyKey] as string | undefined) ?? "";

  const promptText = useMemo(() => {
    if (activeAssets.length === 0) return "";
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
    );
  }, [
    selectedGuru,
    prevSession,
    activeSummary,
    activeAssets.length,
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
      currencyAllocation: activeSummary.currencyAllocation.map((c) => ({
        currency: c.currency,
        percent: c.percent,
      })),
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
    if (!promptText) return;
    await navigator.clipboard.writeText(promptText);
    updateCurrentSession();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyFollowUp = async () => {
    if (!followUpText) return;
    await navigator.clipboard.writeText(followUpText);
    updateCurrentSession();
    setCopiedFollowUp(true);
    setTimeout(() => setCopiedFollowUp(false), 2000);
  };

  const handleNewSession = () => {
    clearSession(selectedGuru.id);
    setShowFollowUp(false);
    setShowPrompt(true);
  };

  const handleSelectAll = () => {
    setCustomSelectedAssetIds(new Set(availableAssets.map((a) => a.id)));
  };

  const handleDeselectAll = () => {
    setCustomSelectedAssetIds(new Set());
  };

  const handleResetToDefault = () => {
    setCustomSelectedAssetIds(null);
  };

  const toggleAsset = (id: string) => {
    const next = new Set(selectedAssetIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCustomSelectedAssetIds(next);
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
            {/* 종목 선택기 토글 버튼 */}
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
          <div className="mt-4 space-y-3 rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-200">
                  {t.guru_ai_scope_title}
                </p>
                <p className="text-2xs text-zinc-400">
                  {t.guru_ai_scope_desc}
                </p>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="cursor-pointer text-2xs text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  {t.guru_ai_scope_select_all}
                </button>
                <span className="text-2xs text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="cursor-pointer text-2xs text-zinc-400 transition-colors hover:text-zinc-300"
                >
                  {t.guru_ai_scope_deselect_all}
                </button>
                <span className="text-2xs text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="cursor-pointer text-2xs text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  {t.guru_ai_scope_reset}
                </button>
              </div>
            </div>

            {availableAssets.length === 0 ? (
              <p className="py-2 text-center text-xs text-zinc-500">{t.guru_empty_desc}</p>
            ) : (
              <div className="grid max-h-60 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                {availableAssets.map((asset) => {
                  const isSelected = selectedAssetIds.has(asset.id);
                  const vis = asset.visibility ?? "all";
                  const val = assetValue(asset);
                  const sym = CURRENCY_SYMBOLS[asset.currency];

                  return (
                    <label
                      key={asset.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-lg border p-2 text-xs transition-all select-none",
                        isSelected
                          ? "border-indigo-500/40 bg-indigo-500/5 text-zinc-100"
                          : "border-zinc-800/80 bg-zinc-900/30 text-zinc-500 opacity-60 hover:border-zinc-700",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAsset(asset.id)}
                        className="size-4 shrink-0 cursor-pointer rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium">{asset.name}</span>
                          {asset.ticker && (
                            <span className="shrink-0 font-mono text-3xs text-zinc-500">
                              {asset.ticker}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-3xs text-zinc-400">
                          <span>
                            {t.category_labels[asset.categories[0]] ??
                              t.asset_type_labels[asset.type] ??
                              asset.type}
                          </span>
                          <span>•</span>
                          <span className="font-mono">
                            {sym}
                            {val.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {vis !== "all" && (
                        <span
                          className={cn(
                            "shrink-0 rounded border px-1.5 py-0.5 text-4xs font-medium uppercase",
                            vis === "dashboard_only" &&
                              "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                            vis === "guru_only" &&
                              "border-purple-500/30 bg-purple-500/10 text-purple-400",
                            vis === "hidden" &&
                              "border-zinc-700 bg-zinc-800 text-zinc-400",
                          )}
                        >
                          {t.visibility_labels[vis]}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {activeAssets.length === 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span>{t.guru_ai_scope_empty_warning}</span>
              </div>
            )}
          </div>
        )}

        {/* 첫 번째 프롬프트 */}
        {showPrompt && (
          <div className="mt-4 space-y-3 border-t border-zinc-800/50 pt-4">
            <p className="text-xs-plus text-zinc-500">{t.guru_ai_desc}</p>
            {activeAssets.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span>{t.guru_ai_scope_empty_warning}</span>
              </div>
            ) : (
              <div className="group relative">
                <textarea
                  readOnly
                  value={promptText}
                  rows={12}
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-3 pb-12 font-mono text-xs-plus text-zinc-300 transition-shadow focus:ring-1 focus:ring-indigo-500/50 focus:outline-none sm:text-xs"
                />
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="absolute right-3 bottom-3 shrink-0 cursor-pointer rounded-md border border-zinc-700/50 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur transition-colors hover:bg-zinc-700"
                >
                  {copied ? (
                    <FeedbackIconText
                      icon={Check}
                      text={t.guru_ai_copied}
                      animate={true}
                      className="text-emerald-400"
                      textClassName="text-white"
                    />
                  ) : (
                    <FeedbackIconText
                      icon={Copy}
                      text={t.guru_ai_copy}
                      className="transition-opacity hover:opacity-80"
                      iconClassName="opacity-70"
                    />
                  )}
                </button>
              </div>
            )}
            <div className="mt-1 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2.5">
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow-500" />
              <span className="text-2xs leading-relaxed text-yellow-500/90 sm:text-xs-plus">
                {t.guru_ai_search_warn}
              </span>
            </div>
          </div>
        )}

        {/* 두 번째 (변동 사항) 프롬프트 */}
        {showFollowUp && followUpText && (
          <div className="mt-4 space-y-3 border-t border-zinc-800/50 pt-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-800/50 bg-emerald-900/30 px-2 py-0.5 text-2xs font-medium text-emerald-400">
                <Calendar className="mr-1.5 inline-block size-3 text-emerald-400/80" /> {prevSession?.date}
              </span>
              <p className="text-xs-plus text-zinc-500">{t.guru_ai_followup_desc}</p>
            </div>
            {activeAssets.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span>{t.guru_ai_scope_empty_warning}</span>
              </div>
            ) : (
              <div className="group relative">
                <textarea
                  readOnly
                  value={followUpText}
                  rows={14}
                  className="w-full resize-none rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-3 pb-12 font-mono text-xs-plus text-zinc-300 transition-shadow focus:ring-1 focus:ring-emerald-500/50 focus:outline-none sm:text-xs"
                />
                <button
                  type="button"
                  onClick={copyFollowUp}
                  className="absolute right-3 bottom-3 shrink-0 cursor-pointer rounded-md border border-emerald-700/50 bg-emerald-800/80 px-3 py-1.5 text-xs font-medium text-emerald-50 shadow-sm backdrop-blur transition-colors hover:bg-emerald-700"
                >
                  {copiedFollowUp ? (
                    <FeedbackIconText
                      icon={Check}
                      text={t.guru_ai_copied}
                      animate={true}
                      className="text-emerald-300"
                      textClassName="text-emerald-50"
                    />
                  ) : (
                    <FeedbackIconText
                      icon={Copy}
                      text={t.guru_ai_copy}
                      className="transition-opacity hover:opacity-80"
                      iconClassName="opacity-70"
                    />
                  )}
                </button>
              </div>
            )}
            <div className="mt-1 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2.5">
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow-500" />
              <span className="text-2xs leading-relaxed text-yellow-500/90 sm:text-xs-plus">
                {t.guru_ai_search_warn}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

