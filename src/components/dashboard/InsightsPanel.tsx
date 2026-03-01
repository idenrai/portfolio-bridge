import { useState, useCallback } from "react";
import { Card, Button } from "@/components/common";
import { useT } from "@/hooks";
import { buildInsightPrompt } from "@/utils";
import type { PortfolioSummary, Asset, TargetAllocation } from "@/types";

interface Props {
  summary: PortfolioSummary;
  assets: Asset[];
  targets: TargetAllocation[];
}

const TYPE_STYLES = {
  danger: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-700",
} as const;

const CLOSE_BTN = {
  danger: "text-red-400 hover:text-red-700",
  warning: "text-amber-400 hover:text-amber-700",
  info: "text-blue-300 hover:text-blue-600",
} as const;

export function InsightsPanel({ summary, assets, targets }: Props) {
  const t = useT();
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const dismiss = useCallback(
    (i: number) => setDismissed((prev) => new Set([...prev, i])),
    [],
  );

  const promptText = buildInsightPrompt(summary, assets, targets);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const visible = summary.insights.filter((_, i) => !dismissed.has(i));

  return (
    <Card
      title={t.insights_title}
      action={
        <Button size="sm" variant="secondary" onClick={() => setShowPrompt((v) => !v)}>
          {showPrompt ? t.insights_ai_close : t.insights_ai_btn}
        </Button>
      }
    >
      {/* AI 프롬프트 영역 */}
      {showPrompt && (
        <div className="mb-4 space-y-2">
          <p className="text-xs text-slate-500">{t.insights_ai_desc}</p>
          <textarea
            readOnly
            value={promptText}
            rows={10}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 resize-none focus:outline-none"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={copyPrompt}>
              {copied ? t.insights_ai_copied : t.insights_ai_copy}
            </Button>
          </div>
        </div>
      )}

      {/* 인사이트 목록 */}
      {visible.length === 0 ? (
        <div className="text-sm text-slate-400 py-4 text-center">
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
                <span className="text-sm flex-shrink-0">{insight.icon}</span>
                <span className="leading-relaxed flex-1">{insight.message}</span>
                <button
                  type="button"
                  onClick={() => dismiss(i)}
                  className={`flex-shrink-0 text-base leading-none cursor-pointer transition-colors ${CLOSE_BTN[insight.type]}`}
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
