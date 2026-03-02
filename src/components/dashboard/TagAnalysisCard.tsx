import { Card } from "@/components/common";
import { useT } from "@/hooks";
import type { RebalanceSuggestion, AssetCategory } from "@/types";

interface Props {
  rebalancing: RebalanceSuggestion[];
}

export function TagAnalysisCard({ rebalancing }: Props) {
  const t = useT();

  if (rebalancing.length === 0) {
    return (
      <Card title={t.tag_title}>
        <p className="text-sm text-slate-400 py-4 text-center">{t.tag_empty}</p>
      </Card>
    );
  }

  const maxPercent = Math.max(
    ...rebalancing.map((r) => Math.max(r.currentPercent, r.targetPercent)),
    1,
  );

  return (
    <Card title={t.tag_title}>
      <div className="space-y-3">
        {rebalancing.map((r) => {
          const diff = r.currentPercent - r.targetPercent;
          const absDiff = Math.abs(diff);
          const isOver = diff > 0;
          const label =
            t.category_labels[r.category as AssetCategory] ?? r.category;

          return (
            <div key={r.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-700">
                  {label}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    absDiff > 5
                      ? isOver
                        ? "text-amber-600"
                        : "text-blue-600"
                      : "text-slate-400"
                  }`}
                >
                  {r.currentPercent.toFixed(1)}% / {r.targetPercent}%
                  {absDiff > 1 && (
                    <span className="ml-1">
                      ({isOver ? "+" : ""}
                      {diff.toFixed(1)}%p)
                    </span>
                  )}
                </span>
              </div>
              <div className="relative h-2">
                <div className="absolute inset-0 bg-slate-100 rounded-full overflow-hidden">
                  {/* 실제 */}
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      absDiff > 5
                        ? isOver
                          ? "bg-amber-400"
                          : "bg-blue-400"
                        : "bg-emerald-400"
                    }`}
                    style={{
                      width: `${(r.currentPercent / maxPercent) * 100}%`,
                    }}
                  />
                </div>
                {/* 목표 마커 */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-slate-500/70 rounded-full"
                  style={{
                    left: `${(r.targetPercent / maxPercent) * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-0.5 h-3 bg-slate-500/70 inline-block" />
          {t.tag_legend_target}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />
          {t.tag_legend_normal}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-amber-400 rounded-full inline-block" />
          {t.tag_legend_over}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-400 rounded-full inline-block" />
          {t.tag_legend_under}
        </span>
      </div>
    </Card>
  );
}
