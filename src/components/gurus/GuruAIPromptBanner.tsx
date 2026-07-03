import { useState } from "react";
import { MessageSquareQuote, AlertTriangle, Calendar } from "lucide-react";
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
      <div className="rounded-[11px] bg-zinc-900/95 p-4 sm:px-5">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <MessageSquareQuote aria-hidden="true" className="size-5 text-indigo-400" />
            <div className="min-w-0">
              <p className="text-sm leading-tight font-semibold text-zinc-100">
                {t.guru_ai_banner_title}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
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

        {/* 첫 번째 프롬프트 */}
        {showPrompt && (
          <div className="mt-4 space-y-3 border-t border-zinc-800/50 pt-4">
            <p className="text-[11px] text-zinc-500">{t.guru_ai_desc}</p>
            <div className="group relative">
              <textarea
                readOnly
                value={promptText}
                rows={12}
                className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-3 pb-12 font-mono text-[11px] text-zinc-300 transition-shadow focus:ring-1 focus:ring-indigo-500/50 focus:outline-none sm:text-xs"
              />
              <button
                type="button"
                onClick={copyPrompt}
                className="absolute right-3 bottom-3 shrink-0 cursor-pointer rounded-md border border-zinc-700/50 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur transition-colors hover:bg-zinc-700"
              >
                {copied ? "✓ " + t.guru_ai_copied : t.guru_ai_copy}
              </button>
            </div>
            <div className="mt-1 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2.5">
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow-500" />
              <span className="text-[10px] leading-relaxed text-yellow-500/90 sm:text-[11px]">
                {t.guru_ai_search_warn}
              </span>
            </div>
          </div>
        )}

        {/* 두 번째 (변동 사항) 프롬프트 */}
        {showFollowUp && followUpText && (
          <div className="mt-4 space-y-3 border-t border-zinc-800/50 pt-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-800/50 bg-emerald-900/30 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                <Calendar className="mr-1.5 inline-block size-3 text-emerald-400/80" /> {prevSession?.date}
              </span>
              <p className="text-[11px] text-zinc-500">{t.guru_ai_followup_desc}</p>
            </div>
            <div className="group relative">
              <textarea
                readOnly
                value={followUpText}
                rows={14}
                className="w-full resize-none rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-3 pb-12 font-mono text-[11px] text-zinc-300 transition-shadow focus:ring-1 focus:ring-emerald-500/50 focus:outline-none sm:text-xs"
              />
              <button
                type="button"
                onClick={copyFollowUp}
                className="absolute right-3 bottom-3 shrink-0 cursor-pointer rounded-md border border-emerald-700/50 bg-emerald-800/80 px-3 py-1.5 text-xs font-medium text-emerald-50 shadow-sm backdrop-blur transition-colors hover:bg-emerald-700"
              >
                {copiedFollowUp ? "✓ " + t.guru_ai_copied : t.guru_ai_copy}
              </button>
            </div>
            <div className="mt-1 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2.5">
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow-500" />
              <span className="text-[10px] leading-relaxed text-yellow-500/90 sm:text-[11px]">
                {t.guru_ai_search_warn}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
