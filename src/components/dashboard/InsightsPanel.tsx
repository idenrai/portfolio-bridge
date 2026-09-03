import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  TrendingDown,
  CircleDollarSign,
  Coins,
  PieChart,
} from "lucide-react";
import { Card } from "@/components/common";
import { useT } from "@/hooks";
import { cn } from "@/utils";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

const TYPE_STYLES = {
  danger: "bg-red-500/10 border-red-500/20 text-red-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
} as const;

const CLOSE_BTN = {
  danger: "text-red-500 hover:text-red-300",
  warning: "text-amber-500 hover:text-amber-300",
  info: "text-blue-500 hover:text-blue-300",
} as const;

function getInsightIcon(id: string, className: string) {
  switch (id) {
    case "warning":
      return <AlertTriangle aria-hidden="true" className={className} />;
    case "danger":
      return <TrendingDown aria-hidden="true" className={className} />;
    case "money":
      return <CircleDollarSign aria-hidden="true" className={className} />;
    case "fx":
      return <Coins aria-hidden="true" className={className} />;
    case "chart":
      return <PieChart aria-hidden="true" className={className} />;
    default:
      return <AlertTriangle aria-hidden="true" className={className} />;
  }
}

export function InsightsPanel({ summary }: Props) {
  const t = useT();
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const dismiss = useCallback(
    (i: number) => setDismissed((prev) => new Set([...prev, i])),
    [],
  );

  const visible = summary.insights.filter((_, i) => !dismissed.has(i));

  return (
    <Card title={t.insights_title}>
      {/* ── 커스텀 구루 1:1 상담 바로가기 배너 ── */}
      <div className="mb-4 rounded-xl bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 p-px shadow-sm">
        <div className="rounded-xl bg-zinc-900/95 p-3.5 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-zinc-100 sm:text-xs-plus">
                  {t.custom_guru_dash_banner_title}
                </p>
                <p className="truncate text-3xs text-zinc-400 sm:text-2xs">
                  {t.custom_guru_dash_banner_desc}
                </p>
              </div>
            </div>
            <Link
              to="/gurus?guru=custom"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-indigo-300 shadow-sm transition-all hover:bg-indigo-500/20 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none active:scale-95"
            >
              <span>{t.custom_guru_dash_banner_action}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 룰 기반 실시간 인사이트/경고 목록 ── */}
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
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
                  TYPE_STYLES[insight.type],
                )}
              >
                <span className="mt-px shrink-0">
                  {getInsightIcon(insight.icon, "w-3.5 h-3.5")}
                </span>
                <span className="flex-1 leading-relaxed">
                  {insight.message}
                </span>
                <button
                  type="button"
                  onClick={() => dismiss(i)}
                  className={cn(
                    "shrink-0 cursor-pointer rounded-sm text-base leading-none transition-colors focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900 focus-visible:outline-none",
                    CLOSE_BTN[insight.type],
                  )}
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
