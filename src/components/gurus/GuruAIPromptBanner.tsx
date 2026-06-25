import { useState } from "react";
import { useT } from "@/hooks";
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
  const rates = useSettingsStore((s) => s.exchangeRates);
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
    <div className="rounded-xl bg-linear-to-r from-purple-600 to-indigo-500 p-px shadow-md">
      <div className="rounded-[11px] bg-zinc-900/95 px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl shrink-0 mt-0.5">🧘</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-200 leading-tight">
                {t.guru_ai_banner_title}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                {t.guru_ai_banner_desc}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
            {prevSession && (
              <button
                type="button"
                onClick={() => {
                  setShowFollowUp(true);
                  setShowPrompt(false);
                }}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap text-center"
              >
                {t.guru_ai_followup_btn}
              </button>
            )}
            <button
              type="button"
              onClick={handleNewSession}
              className="rounded-lg bg-linear-to-r from-purple-600 to-indigo-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap text-center"
            >
              {t.guru_ai_followup_new_session}
            </button>
          </div>
        </div>

        {/* 첫 번째 프롬프트 */}
        {showPrompt && (
          <div className="mt-3 pt-3 border-t border-zinc-800/50 space-y-2">
            <p className="text-xs text-zinc-500">{t.guru_ai_desc}</p>
            <textarea
              readOnly
              value={promptText}
              rows={12}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-300 resize-none focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={copyPrompt}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {copied ? t.guru_ai_copied : t.guru_ai_copy}
              </button>
            </div>
          </div>
        )}

        {/* 두 번째 (변동 사항) 프롬프트 */}
        {showFollowUp && followUpText && (
          <div className="mt-3 pt-3 border-t border-zinc-800/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">
                📅 {prevSession?.date}
              </span>
              <p className="text-xs text-zinc-500">{t.guru_ai_followup_desc}</p>
            </div>
            <textarea
              readOnly
              value={followUpText}
              rows={14}
              className="w-full rounded-lg border border-emerald-800 bg-emerald-900/20 px-3 py-2 text-xs font-mono text-zinc-300 resize-none focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={copyFollowUp}
                className="rounded-lg bg-emerald-700 hover:bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {copiedFollowUp ? t.guru_ai_copied : t.guru_ai_copy}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
