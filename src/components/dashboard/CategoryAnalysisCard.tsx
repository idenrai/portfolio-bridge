import { useState } from "react";
import { Card, Button, Modal } from "@/components/common";
import { useT } from "@/hooks";
import { useSettingsStore } from "@/pages/stores";
import type { RebalanceSuggestion, AssetCategory, TargetAllocation } from "@/types";

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
    setTimeout(() => { setSaved(false); setModalOpen(false); }, 1200);
  };

  const setTargetBtn = (
    <button
      type="button"
      onClick={openModal}
      className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md px-2 py-1 hover:bg-slate-50 transition-colors cursor-pointer"
    >
      {t.category_set_target}
    </button>
  );

  const modal = (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.settings_target_title}>
      <div className="space-y-2">
        {allocations.map((a, i) => (
          <label key={a.category} className="flex items-center gap-3">
            <span className="text-sm text-slate-600 w-32">
              {t.category_labels[a.category as AssetCategory] ?? a.category}
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={a.targetPercent}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-24 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            />
            <span className="text-xs text-slate-400">%</span>
          </label>
        ))}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
          <span className={`text-sm font-medium ${isExact ? "text-green-600" : "text-red-600"}`}>
            {t.settings_target_sum(totalPercent.toFixed(0))}
          </span>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-green-600 font-medium animate-pulse">
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
          <p className="text-sm text-slate-400 py-4 text-center">{t.category_empty}</p>
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
            const label = t.category_labels[r.category as AssetCategory] ?? r.category;
            return (
              <div key={r.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700">{label}</span>
                  <span className={`text-[11px] font-medium ${
                    absDiff > 5 ? (isOver ? "text-amber-600" : "text-blue-600") : "text-slate-400"
                  }`}>
                    {r.currentPercent.toFixed(1)}% / {r.targetPercent}%
                    {absDiff > 1 && (
                      <span className="ml-1">({isOver ? "+" : ""}{diff.toFixed(1)}%p)</span>
                    )}
                  </span>
                </div>
                <div className="relative h-2">
                  <div className="absolute inset-0 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        absDiff > 5 ? (isOver ? "bg-amber-400" : "bg-blue-400") : "bg-emerald-400"
                      }`}
                      style={{ width: `${(r.currentPercent / maxPercent) * 100}%` }}
                    />
                  </div>
                  <div
                    className="absolute top-0 h-full w-0.5 bg-slate-500/70 rounded-full"
                    style={{ left: `${(r.targetPercent / maxPercent) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-0.5 h-3 bg-slate-500/70 inline-block" />
            {t.category_legend_target}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />
            {t.category_legend_normal}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-amber-400 rounded-full inline-block" />
            {t.category_legend_over}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full inline-block" />
            {t.category_legend_under}
          </span>
        </div>
      </Card>
      {modal}
    </>
  );
}
