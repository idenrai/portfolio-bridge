import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
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
      <div className="mb-4 border border-zinc-800 bg-black p-3 font-mono sm:p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center border border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-400">
              {">"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-zinc-100">
                {t.custom_guru_dash_banner_title}
              </p>
              <p className="truncate text-3xs text-zinc-400">
                {t.custom_guru_dash_banner_desc}
              </p>
            </div>
          </div>
          <Link
            to="/gurus?guru=custom"
            className="inline-flex shrink-0 items-center gap-1 border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 transition-colors hover:border-amber-400 hover:bg-amber-400 hover:text-black focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <span className="opacity-50">{"["}</span>
            <span>{t.custom_guru_dash_banner_action}</span>
            <span className="opacity-50">{"]"}</span>
            <ArrowRight className="size-3" />
          </Link>
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
                  "flex items-start gap-2 rounded-none border px-3 py-2 text-xs",
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
