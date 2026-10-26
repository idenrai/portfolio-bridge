import { useRef } from "react";
import { AlertTriangle, Check, Copy, RefreshCw, Calendar } from "lucide-react";
import { FeedbackIconText } from "@/components/common";
import { cn } from "@/utils";
import type { Translations } from "@/i18n";

export type GuruPromptMode = "full" | "followup";

interface GuruPromptCardProps {
  mode: GuruPromptMode;
  onModeChange: (mode: GuruPromptMode) => void;
  fullPromptText: string;
  followUpPromptText: string | null;
  prevSessionDate?: string;
  activeAssetsCount: number;
  copied: boolean;
  onCopy: () => void;
  onResetBaseline: () => void;
  baselineResetFeedback: boolean;
  t: Translations;
}

export function GuruPromptCard({
  mode,
  onModeChange,
  fullPromptText,
  followUpPromptText,
  prevSessionDate,
  activeAssetsCount,
  copied,
  onCopy,
  onResetBaseline,
  baselineResetFeedback,
  t,
}: GuruPromptCardProps) {
  const isFollowUp = mode === "followup";
  const currentPromptText = isFollowUp ? (followUpPromptText ?? "") : fullPromptText;
  const hasFollowUp = Boolean(followUpPromptText && prevSessionDate);

  const fullTabRef = useRef<HTMLButtonElement>(null);
  const followUpTabRef = useRef<HTMLButtonElement>(null);

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onModeChange("followup");
      followUpTabRef.current?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onModeChange("full");
      fullTabRef.current?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      onModeChange("full");
      fullTabRef.current?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      onModeChange("followup");
      followUpTabRef.current?.focus();
    }
  };

  return (
    <div className="mt-4 space-y-3 border-t border-zinc-800/80 pt-4">
      {/* ─── Mode Tabs & Baseline Controls ─────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5" role="tablist" aria-label={t.guru_ai_banner_title}>
          <button
            id="guru-prompt-tab-full"
            ref={fullTabRef}
            type="button"
            role="tab"
            aria-controls="guru-prompt-panel"
            tabIndex={!isFollowUp ? 0 : -1}
            aria-selected={!isFollowUp}
            onClick={() => onModeChange("full")}
            onKeyDown={handleTabKeyDown}
            className={cn(
              "cursor-pointer rounded-none border px-3 py-1.5 font-mono text-xs font-semibold whitespace-nowrap transition-colors",
              !isFollowUp
                ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200",
            )}
          >
            [ 01: {t.guru_ai_tab_full} ]
          </button>

          <button
            id="guru-prompt-tab-followup"
            ref={followUpTabRef}
            type="button"
            role="tab"
            aria-controls="guru-prompt-panel"
            tabIndex={isFollowUp ? 0 : -1}
            aria-selected={isFollowUp}
            onClick={() => onModeChange("followup")}
            onKeyDown={handleTabKeyDown}
            className={cn(
              "cursor-pointer rounded-none border px-3 py-1.5 font-mono text-xs font-semibold whitespace-nowrap transition-colors",
              isFollowUp
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200",
            )}
          >
            <span className="flex items-center gap-1.5">
              <span>[ 02: {t.guru_ai_tab_followup}</span>
              {prevSessionDate && (
                <span className="inline-block size-1.5 rounded-none bg-emerald-400" aria-hidden="true" />
              )}
              <span>]</span>
            </span>
          </button>
        </div>

        {/* Baseline Reset Button (when previous session exists) */}
        {prevSessionDate && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-3xs text-zinc-500">
              <Calendar className="size-3 text-zinc-500" />
              <span className="tracking-wider uppercase">Base:</span>
              <span className="text-zinc-300">{prevSessionDate}</span>
            </span>

            <button
              type="button"
              onClick={onResetBaseline}
              title={t.guru_ai_baseline_reset_desc}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1 rounded-none border px-2 py-1 font-mono text-3xs font-medium whitespace-nowrap transition-colors",
                baselineResetFeedback
                  ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200",
              )}
            >
              {baselineResetFeedback ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span>{t.guru_ai_session_saved}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="size-3 text-zinc-400" />
                  <span>{t.guru_ai_baseline_reset}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ─── Mode Description ────────────────────────────────────────── */}
      <p className="font-mono text-xs leading-relaxed text-zinc-400">
        {isFollowUp ? t.guru_ai_followup_desc : t.guru_ai_desc}
      </p>

      {/* ─── Content Area (WAI-ARIA Tabpanel) ─────────────────────────── */}
      <div
        id="guru-prompt-panel"
        role="tabpanel"
        aria-labelledby={isFollowUp ? "guru-prompt-tab-followup" : "guru-prompt-tab-full"}
      >
        {activeAssetsCount === 0 ? (
          <div className="flex items-center gap-2 rounded-none border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-xs text-amber-400">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{t.guru_ai_scope_empty_warning}</span>
          </div>
        ) : isFollowUp && !hasFollowUp ? (
          <div className="rounded-none border border-zinc-800 bg-zinc-900/40 p-4 font-mono text-xs text-zinc-400">
            <p className="font-semibold text-zinc-300">[ NOTICE ]</p>
            <p className="mt-1 text-zinc-400">{t.guru_ai_no_prev_session}</p>
            <button
              type="button"
              onClick={() => onModeChange("full")}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-none border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20"
            >
              <span>&gt; {t.guru_ai_tab_full}</span>
            </button>
          </div>
        ) : (
          <div className="group relative">
            <textarea
              readOnly
              value={currentPromptText}
              rows={12}
              aria-label={isFollowUp ? t.guru_ai_tab_followup : t.guru_ai_tab_full}
              className={cn(
                "max-h-[55vh] min-h-60 w-full resize-none rounded-none border p-3 pb-12 font-mono text-xs-plus text-zinc-200 focus:outline-none sm:min-h-75 sm:text-xs",
                isFollowUp
                  ? "border-emerald-900/40 bg-emerald-950/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                  : "border-zinc-800 bg-zinc-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40",
              )}
            />
            <button
              type="button"
              onClick={onCopy}
              className={cn(
                "absolute right-3 bottom-3 shrink-0 cursor-pointer rounded-none border px-3 py-1.5 font-mono text-xs font-semibold shadow-none transition-colors",
                isFollowUp
                  ? "border-emerald-600/60 bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800"
                  : "border-zinc-700 bg-zinc-900 text-white hover:border-zinc-500 hover:bg-zinc-800",
              )}
            >
              {copied ? (
                <FeedbackIconText
                  icon={Check}
                  text={t.guru_ai_copied}
                  animate={true}
                  className={isFollowUp ? "text-emerald-300" : "text-emerald-400"}
                  textClassName="text-white"
                />
              ) : (
                <FeedbackIconText
                  icon={Copy}
                  text={t.guru_ai_copy}
                  className="transition-opacity hover:opacity-90"
                  iconClassName="opacity-80"
                />
              )}
            </button>
          </div>
        )}
      </div>

      {/* ─── Search Warning Banner ───────────────────────────────────── */}
      <div className="mt-1 flex items-start gap-2 rounded-none border border-yellow-500/20 bg-yellow-500/10 p-2.5 font-mono">
        <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow-500" />
        <span className="text-2xs leading-relaxed text-yellow-500/90 sm:text-xs-plus">
          {t.guru_ai_search_warn}
        </span>
      </div>
    </div>
  );
}

