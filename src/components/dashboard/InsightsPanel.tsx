import { Card } from "@/components/common";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

const TYPE_STYLES = {
  danger: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-700",
} as const;

export function InsightsPanel({ summary }: Props) {
  if (summary.insights.length === 0) {
    return (
      <Card title="인사이트">
        <div className="text-sm text-slate-400 py-4 text-center">
          ✅ 특이사항 없음
        </div>
      </Card>
    );
  }

  return (
    <Card title="인사이트">
      <div className="space-y-2">
        {summary.insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs ${TYPE_STYLES[insight.type]}`}
          >
            <span className="text-sm flex-shrink-0">{insight.icon}</span>
            <span className="leading-relaxed">{insight.message}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
