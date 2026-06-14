import { useT } from "@/hooks";
import type { FormMode } from "./assetFormTypes";

export function ModeSelector({
  mode,
  onChange,
}: {
  mode: FormMode;
  onChange: (m: FormMode) => void;
}) {
  const t = useT();
  const tabs: { key: FormMode; label: string }[] = [
    { key: "stock", label: t.af_mode_stock },
    { key: "cash", label: t.af_mode_cash },
    { key: "crypto", label: t.af_mode_crypto },
  ];
  return (
    <div className="flex rounded-lg border border-zinc-800 overflow-hidden">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`flex-1 py-2 text-sm font-medium transition-colors rounded-md ${
            mode === t.key
              ? "bg-zinc-800 text-white shadow-sm"
              : "bg-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
