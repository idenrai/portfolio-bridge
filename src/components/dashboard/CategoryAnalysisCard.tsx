import { useState } from "react";
import { Card, Button, Modal } from "@/components/common";
import { useT } from "@/hooks";
import { useSettingsStore } from "@/stores";
import type {
  RebalanceSuggestion,
  AssetCategory,
  TargetAllocation,
} from "@/types";

interface Props {
  rebalancing: RebalanceSuggestion[];
}

export function CategoryAnalysisCard({ rebalancing }: Props) {
  const t = useT();
  const settings = useSettingsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [allocations, setAllocations] = useState<TargetAllocation[]>([]);
  const [saved, setSaved] = useState(false);

  const totalPercent = allocations.reduce((s, a) => s + a.targetPercent, 0);
  const isExact = Math.abs(totalPercent - 100) < 0.01;

  const openModal = () => {
    setAllocations([...settings.targetAllocations]);
    setSaved(false);
    setModalOpen(true);
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], targetPercent: Number(value) || 0 };
    setAllocations(updated);
    setSaved(false);
  };

  const handleSave = () => {
    settings.setTargetAllocations(allocations);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setModalOpen(false);
    }, 1200);
  };

  const setTargetBtn = (
    <button
      type="button"
      onClick={openModal}
      className="cursor-pointer rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-900/50 hover:text-zinc-700"
    >
      {t.category_set_target}
    </button>
  );

  const modal = (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      title={t.settings_target_title}
    >
      <div className="space-y-2">
        {allocations.map((a, i) => (
          <label key={a.category} className="flex items-center gap-3">
            <span className="w-32 text-sm text-zinc-400">
              {t.category_labels[a.category as AssetCategory] ?? a.category}
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={a.targetPercent}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-24 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm"
            />
            <span className="text-xs text-zinc-400">%</span>
          </label>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-zinc-800 pt-3">
          <span
            className={`text-sm font-medium ${isExact ? "text-green-600" : "text-red-600"}`}
          >
            {t.settings_target_sum(totalPercent.toFixed(0))}
          </span>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="animate-pulse text-xs font-medium text-green-600">
                ✓ {t.settings_target_saved}
              </span>
            )}
            <Button size="sm" onClick={handleSave} disabled={!isExact}>
              {t.settings_target_save}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
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
                    className={`text-[11px] font-medium ${
                      absDiff > 5
                        ? isOver
                          ? "text-amber-400"
                          : "text-zinc-300"
                        : "text-zinc-400"
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
                  <div className="absolute inset-0 overflow-hidden rounded-full bg-zinc-800/50">
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
                  <div
                    className="absolute top-0 h-full w-0.5 rounded-full bg-zinc-500"
                    style={{ left: `${(r.targetPercent / maxPercent) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-[10px] text-zinc-400">
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
}
