import { useState, useCallback } from "react";
import { Sparkles, AlertTriangle, TrendingDown, CircleDollarSign, Coins, PieChart } from "lucide-react";
import { Card } from "@/components/common";
import { useT, useExchangeRates } from "@/hooks";
import { useLanguageStore, useSettingsStore } from "@/stores";
import { buildInsightPrompt } from "@/utils";
import type { PortfolioSummary, Asset, TargetAllocation } from "@/types";

interface Props {
  summary: PortfolioSummary;
  assets: Asset[];
  targets: TargetAllocation[];
}

const TYPE_STYLES = {
  danger: "bg-red-500/100/10 border-red-500/20 text-red-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  info: "bg-zinc-800/500/10 border-blue-500/20 text-blue-400",
} as const;

const CLOSE_BTN = {
  danger: "text-red-500 hover:text-red-300",
  warning: "text-amber-500 hover:text-amber-300",
  info: "text-blue-500 hover:text-blue-300",
} as const;

function getInsightIcon(id: string, className: string) {
  switch (id) {
    case "warning": return <AlertTriangle aria-hidden="true" className={className} />;
    case "danger": return <TrendingDown aria-hidden="true" className={className} />;
    case "money": return <CircleDollarSign aria-hidden="true" className={className} />;
    case "fx": return <Coins aria-hidden="true" className={className} />;
    case "chart": return <PieChart aria-hidden="true" className={className} />;
    default: return <AlertTriangle aria-hidden="true" className={className} />;
  }
}

export function InsightsPanel({ summary, assets, targets }: Props) {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const dismiss = useCallback(
    (i: number) => setDismissed((prev) => new Set([...prev, i])),
    [],
  );

  const promptText = buildInsightPrompt(
    summary,
    assets,
    targets,
    lang,
    baseCurrency,
    rates,
  );

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const visible = summary.insights.filter((_, i) => !dismissed.has(i));

  return (
    <Card title={t.insights_title}>
      {/* ── AI 분석 배너 (항상 표시) ── */}
      <div className="mb-4 rounded-xl bg-linear-to-r from-indigo-500/20 to-blue-500/20 p-px shadow-sm">
        <div className="rounded-[11px] bg-zinc-900/95 p-4 sm:px-5">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex min-w-0 items-start gap-3">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-indigo-400" />
              <div className="min-w-0">
                <p className="text-sm leading-tight font-semibold text-zinc-100 text-pretty">
                  {t.insights_ai_banner_title}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 sm:text-xs text-pretty line-clamp-2">
                  {t.insights_ai_banner_desc}
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPrompt((v) => !v)}
                className="flex-1 cursor-pointer rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-center text-xs font-medium whitespace-nowrap text-indigo-400 shadow-sm transition-all hover:bg-indigo-500/20 hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 sm:flex-none"
              >
                {showPrompt ? t.insights_ai_close : t.insights_ai_btn}
              </button>
            </div>
          </div>

          {/* 프롬프트 확장 영역 */}
          {showPrompt && (
            <div className="mt-4 space-y-3 border-t border-zinc-800/50 pt-4">
              <p className="text-[11px] text-zinc-500">{t.insights_ai_desc}</p>
              <div className="group relative rounded-xl border border-zinc-800 bg-zinc-950 transition-shadow focus-within:ring-1 focus-within:ring-indigo-500/50">
                <textarea
                  readOnly
                  value={promptText}
                  rows={10}
                  className="w-full resize-none rounded-xl bg-transparent p-3 pb-12 font-mono text-[11px] text-zinc-300 focus:outline-none sm:text-xs"
                />
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="absolute right-3 bottom-3 shrink-0 cursor-pointer rounded-md border border-zinc-700/50 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                >
                  {copied ? "✓ " + t.insights_ai_copied : t.insights_ai_copy}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 인사이트 목록 ── */}
      {visible.length === 0 ? (
        <div className="py-4 text-center text-sm text-zinc-400">
          {t.insights_ok}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {summary.insights.map((insight, i) =>
            dismissed.has(i) ? null : (
              <div
                key={i}
                className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${TYPE_STYLES[insight.type]}`}
              >
                <span className="mt-px shrink-0">{getInsightIcon(insight.icon, "w-3.5 h-3.5")}</span>
                <span className="flex-1 leading-relaxed">
                  {insight.message}
                </span>
                <button
                  type="button"
                  onClick={() => dismiss(i)}
                  className={`shrink-0 cursor-pointer rounded-sm text-base leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900 ${CLOSE_BTN[insight.type]}`}
                  aria-label="dismiss"
                >
                  ×
                </button>
              </div>
            ),
          )}
        </div>
      )}
    </Card>
  );
}
