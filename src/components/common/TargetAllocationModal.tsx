import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useT } from "@/hooks";
import { useSettingsStore } from "@/stores";
import { cn } from "@/utils";
import type { AssetCategory, TargetAllocation } from "@/types";

interface TargetAllocationModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

function TargetAllocationModalInner({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved?: () => void;
}) {
  const t = useT();
  const targetAllocations = useSettingsStore((s) => s.targetAllocations);
  const setTargetAllocations = useSettingsStore((s) => s.setTargetAllocations);

  const [allocations, setAllocations] = useState<TargetAllocation[]>(() => [
    ...(targetAllocations ?? []),
  ]);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const totalPercent = allocations.reduce((s, a) => s + a.targetPercent, 0);
  const isExact = Math.abs(totalPercent - 100) < 0.01;

  const handleChange = (index: number, value: string) => {
    const updated = [...allocations];
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    updated[index] = { ...updated[index], targetPercent: num };
    setAllocations(updated);
    setSaved(false);
  };

  const handleSave = () => {
    if (!isExact) return;
    setTargetAllocations(allocations);
    setSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaved(false);
      onClose();
      onSaved?.();
    }, 900);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">
        {t.settings_target_section_desc}
      </p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
        <div className="divide-y divide-zinc-800/60">
          {allocations.map((a, i) => (
            <label
              key={a.category}
              className="flex items-center justify-between gap-3 p-2 text-sm text-zinc-300"
            >
              <span className="font-medium text-zinc-200">
                {t.category_labels[a.category as AssetCategory] ?? a.category}
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={a.targetPercent === 0 ? "" : a.targetPercent}
                  placeholder="0"
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isExact) {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                  className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-right font-mono text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="w-4 text-xs text-zinc-400">%</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-zinc-800/80 pt-3">
        <span
          className={cn(
            "font-mono text-sm font-bold",
            isExact ? "text-emerald-400" : "text-rose-400",
          )}
        >
          {t.settings_target_sum(totalPercent.toFixed(0))}
        </span>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <Check className="size-3.5" />
              <span>{t.settings_target_saved}</span>
            </span>
          )}
          <Button size="sm" onClick={handleSave} disabled={!isExact}>
            {t.settings_target_save}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TargetAllocationModal({
  open,
  onClose,
  onSaved,
}: TargetAllocationModalProps) {
  const t = useT();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.settings_target_title}
      maxWidth="max-w-md"
    >
      {open && (
        <TargetAllocationModalInner onClose={onClose} onSaved={onSaved} />
      )}
    </Modal>
  );
}
