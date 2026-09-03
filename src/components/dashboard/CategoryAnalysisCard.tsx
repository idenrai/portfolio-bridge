import { useState, memo } from "react";
import { Card, TargetAllocationModal } from "@/components/common";
import { useT } from "@/hooks";
import { cn } from "@/utils";
import type { RebalanceSuggestion, AssetCategory } from "@/types";

interface Props {
  rebalancing: RebalanceSuggestion[];
}

export const CategoryAnalysisCard = memo(function CategoryAnalysisCard({ rebalancing }: Props) {
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);

  const setTargetBtn = (
    <button
      type="button"
      onClick={() => setModalOpen(true)}
      className="inline-flex min-h-8 cursor-pointer items-center rounded-md border border-zinc-800 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
    >
      {t.category_set_target}
    </button>
  );

  const modal = (
    <TargetAllocationModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
    />
  );

  if (rebalancing.length === 0) {
    return (
      <>
        <Card title={t.category_title} action={setTargetBtn}>
          <p className="py-4 text-center text-sm text-zinc-400">
            {t.category_empty}
          </p>
        </Card>
        {modal}
      </>
    );
  }

  const maxPercent = Math.max(
    ...rebalancing.map((r) => Math.max(r.currentPercent, r.targetPercent)),
    1,
  );

  return (
    <>
      <Card title={t.category_title} action={setTargetBtn}>
        <div className="space-y-3">
          {rebalancing.map((r) => {
            const diff = r.currentPercent - r.targetPercent;
            const absDiff = Math.abs(diff);
            const isOver = diff > 0;
            const label =
              t.category_labels[r.category as AssetCategory] ?? r.category;
            return (
              <div key={r.category}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300">
                    {label}
                  </span>
                  <span
                    className={cn(
                      "text-xs-plus font-medium",
                      absDiff > 5
                        ? isOver
                          ? "text-amber-400"
                          : "text-zinc-300"
                        : "text-zinc-400",
                    )}
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
                  <div className="absolute inset-0 overflow-hidden rounded-full bg-zinc-800/50">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full",
                        absDiff > 5
                          ? isOver
                            ? "bg-amber-400"
                            : "bg-blue-400"
                          : "bg-emerald-400",
                      )}
                      style={{
                        width: `${(r.currentPercent / maxPercent) * 100}%`,
                      }}
                    />
                  </div>
                  <div
                    className="absolute top-0 h-full w-0.5 rounded-full bg-zinc-500"
                    style={{ left: `${(r.targetPercent / maxPercent) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-2xs text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-0.5 bg-zinc-500" />
            {t.category_legend_target}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-emerald-400" />
            {t.category_legend_normal}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-amber-400" />
            {t.category_legend_over}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-blue-400" />
            {t.category_legend_under}
          </span>
        </div>
      </Card>
      {modal}
    </>
  );
});

