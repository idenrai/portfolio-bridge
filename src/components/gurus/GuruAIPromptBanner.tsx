import { useState } from "react";
import { Brain } from "lucide-react";
import { useT, useExchangeRates } from "@/hooks";
import { useLanguageStore, useSettingsStore, useProfileStore, useGuruSessionStore } from "@/stores";
import { buildGuruPrompt, buildGuruFollowUpPrompt } from "@/utils";
import type { GuruProfile, PortfolioSummary, Asset } from "@/types";
import { en } from "@/i18n";

interface GuruAIPromptBannerProps {
  selectedGuru: GuruProfile;
  summary: PortfolioSummary;
  assets: Asset[];
}

export function GuruAIPromptBanner({
  selectedGuru,
  summary,
  assets,
}: GuruAIPromptBannerProps) {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();
  const profile = useProfileStore();
  const { sessions, saveSession, clearSession } = useGuruSessionStore();

  const [showPrompt, setShowPrompt] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedFollowUp, setCopiedFollowUp] = useState(false);

  const selectedPhilosophyKey = `guru_philosophy_${selectedGuru.id}` as keyof typeof en;
  const englishPhilosophy = (en[selectedPhilosophyKey] as string | undefined) ?? "";

  const promptText = buildGuruPrompt(
    selectedGuru,
    summary,
    assets,
    lang,
    baseCurrency,
    rates,
    englishPhilosophy,
    profile
  );

  const prevSession = sessions[selectedGuru.id];
  const followUpText = prevSession
    ? buildGuruFollowUpPrompt(
        selectedGuru,
        prevSession,
        summary,
        lang,
        baseCurrency,
        rates,
        profile
      )
    : null;

  const updateCurrentSession = () => {
    saveSession({
      guruId: selectedGuru.id,
      date: new Date().toLocaleDateString('en-CA'),
      totalValueKRW: summary.totalValueKRW,
      totalCostKRW: summary.totalCostKRW,
      totalPnLKRW: summary.totalPnLKRW,
      totalReturnPercent: summary.totalReturnPercent,
      holdingCount: summary.holdingCount,
      cashPercent: summary.cashPercent,
      categoryAllocation: summary.categoryAllocation.map((c) => ({
        category: c.category,
        percent: c.percent,
      })),
      marketAllocation: summary.marketAllocation.map((m) => ({
        market: m.market,
        percent: m.percent,
      })),
      currencyAllocation: summary.currencyAllocation.map((c) => ({
        currency: c.currency,
        percent: c.percent,
      })),
      holdings: summary.holdings
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

  return (
    <div className="rounded-xl bg-linear-to-r from-indigo-500/20 to-purple-500/20 p-px shadow-sm">
      <div className="rounded-[11px] bg-zinc-900/95 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start gap-3 min-w-0">
            <Brain className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-100 leading-tight">
                {t.guru_ai_banner_title}
              </p>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 leading-relaxed">
                {t.guru_ai_banner_desc}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {prevSession && (
              <button
                type="button"
                onClick={() => {
                  setShowFollowUp(true);
                  setShowPrompt(false);
                }}
                className="flex-1 sm:flex-none rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 text-xs font-medium shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap text-center"
              >
                {t.guru_ai_followup_btn}
              </button>
            )}
            <button
              type="button"
              onClick={handleNewSession}
              className="flex-1 sm:flex-none rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-2 text-xs font-medium shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap text-center"
            >
              {t.guru_ai_followup_new_session}
            </button>
          </div>
        </div>

        {/* 첫 번째 프롬프트 */}
        {showPrompt && (
          <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-3">
            <p className="text-[11px] text-zinc-500">{t.guru_ai_desc}</p>
            <div className="relative group">
              <textarea
                readOnly
                value={promptText}
                rows={12}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 pb-12 text-[11px] sm:text-xs font-mono text-zinc-300 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-shadow"
              />
              <button
                type="button"
                onClick={copyPrompt}
                className="absolute bottom-3 right-3 shrink-0 rounded-md bg-zinc-800/80 backdrop-blur hover:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-white transition-colors cursor-pointer shadow-sm border border-zinc-700/50"
              >
                {copied ? "✓ " + t.guru_ai_copied : t.guru_ai_copy}
              </button>
            </div>
            <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 mt-1">
              <span className="text-yellow-500 text-xs shrink-0 mt-px">⚠️</span>
              <span className="text-[10px] sm:text-[11px] text-yellow-500/90 leading-relaxed">
                {t.guru_ai_search_warn}
              </span>
            </div>
          </div>
        )}

        {/* 두 번째 (변동 사항) 프롬프트 */}
        {showFollowUp && followUpText && (
          <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                📅 {prevSession?.date}
              </span>
              <p className="text-[11px] text-zinc-500">{t.guru_ai_followup_desc}</p>
            </div>
            <div className="relative group">
              <textarea
                readOnly
                value={followUpText}
                rows={14}
                className="w-full rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-3 pb-12 text-[11px] sm:text-xs font-mono text-zinc-300 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-shadow"
              />
              <button
                type="button"
                onClick={copyFollowUp}
                className="absolute bottom-3 right-3 shrink-0 rounded-md bg-emerald-800/80 backdrop-blur hover:bg-emerald-700 px-3 py-1.5 text-xs font-medium text-emerald-50 transition-colors cursor-pointer shadow-sm border border-emerald-700/50"
              >
                {copiedFollowUp ? "✓ " + t.guru_ai_copied : t.guru_ai_copy}
              </button>
            </div>
            <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 mt-1">
              <span className="text-yellow-500 text-xs shrink-0 mt-px">⚠️</span>
              <span className="text-[10px] sm:text-[11px] text-yellow-500/90 leading-relaxed">
                {t.guru_ai_search_warn}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
