import { useState, useCallback } from "react";
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
      <div className="mb-4 rounded-xl bg-linear-to-r from-indigo-600 to-blue-500 p-px shadow-md">
        <div className="rounded-[11px] bg-zinc-900/95 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* 좌측: 아이콘 + 텍스트 */}
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-2xl shrink-0 mt-0.5">🤖</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-200 leading-tight">
                  {t.insights_ai_banner_title}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  {t.insights_ai_banner_desc}
                </p>
              </div>
            </div>
            {/* 우측: 버튼 */}
            <button
              type="button"
              onClick={() => setShowPrompt((v) => !v)}
              className="shrink-0 rounded-lg bg-linear-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              {showPrompt ? t.insights_ai_close : t.insights_ai_btn}
            </button>
          </div>

          {/* 프롬프트 확장 영역 */}
          {showPrompt && (
            <div className="mt-3 pt-3 border-t border-zinc-800/50 space-y-2">
              <p className="text-xs text-zinc-500">{t.insights_ai_desc}</p>
              <textarea
                readOnly
                value={promptText}
                rows={10}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-300 resize-none focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  {copied ? t.insights_ai_copied : t.insights_ai_copy}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 인사이트 목록 ── */}
      {visible.length === 0 ? (
        <div className="text-sm text-zinc-400 py-4 text-center">
          {t.insights_ok}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {summary.insights.map((insight, i) =>
            dismissed.has(i) ? null : (
              <div
                key={i}
                className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs ${TYPE_STYLES[insight.type]}`}
              >
                <span className="text-sm shrink-0">{insight.icon}</span>
                <span className="leading-relaxed flex-1">
                  {insight.message}
                </span>
                <button
                  type="button"
                  onClick={() => dismiss(i)}
                  className={`shrink-0 text-base leading-none cursor-pointer transition-colors ${CLOSE_BTN[insight.type]}`}
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
