import { useState } from "react";
import { PieChart, SlidersHorizontal } from "lucide-react";
import { Card, TargetAllocationModal } from "@/components/common";
import { useT } from "@/hooks";
import { useSettingsStore } from "@/stores";
import { cn } from "@/utils";
import type { AssetCategory } from "@/types";

export function TargetAllocationSection() {
  const t = useT();
  const targetAllocations = useSettingsStore((s) => s.targetAllocations);
  const [modalOpen, setModalOpen] = useState(false);

  const totalPercent = (targetAllocations ?? []).reduce(
    (sum, a) => sum + a.targetPercent,
    0,
  );
  const isExact = Math.abs(totalPercent - 100) < 0.01;

  const actionBtn = (
    <button
      type="button"
      onClick={() => setModalOpen(true)}
      className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/25 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none sm:min-h-8"
    >
      <SlidersHorizontal className="size-3.5" />
      <span>{t.category_set_target}</span>
    </button>
  );

  return (
    <>
      <Card
        title={
          <div className="flex items-center gap-2">
            <PieChart className="size-4 text-indigo-400" />
            <span>{t.settings_target_title}</span>
          </div>
        }
        action={actionBtn}
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-zinc-400">
            {t.settings_target_section_desc}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {targetAllocations && targetAllocations.length > 0 ? (
              targetAllocations.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/70 px-2.5 py-1.5 text-xs text-zinc-300"
                >
                  <span className="font-medium text-zinc-200">
                    {t.category_labels[item.category as AssetCategory] ?? item.category}
                  </span>
                  <span className="font-mono font-bold text-indigo-400">
                    {item.targetPercent}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">
                {t.custom_guru_target_empty}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs">
            <span className="text-zinc-400">
              {t.settings_target_title}
            </span>
            <span
              className={cn(
                "font-mono font-bold",
                isExact ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {t.settings_target_sum(totalPercent.toFixed(0))}
            </span>
          </div>
        </div>
      </Card>

      <TargetAllocationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
