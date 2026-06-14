import { useT } from "@/hooks";
import { GURU_PROFILES } from "@/utils";
import type { GuruProfile } from "@/types";

interface GuruSelectorProps {
  selectedGuru: GuruProfile | null;
  onSelect: (guru: GuruProfile) => void;
}

export function GuruSelector({ selectedGuru, onSelect }: GuruSelectorProps) {
  const t = useT();

  const guruName = (guru: GuruProfile) =>
    (t[`guru_name_${guru.id}` as keyof typeof t] as string) ?? guru.name;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
      {GURU_PROFILES.map((guru) => (
        <button
          key={guru.id}
          onClick={() => onSelect(guru)}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
            selectedGuru?.id === guru.id
              ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              : "border-slate-800 bg-slate-900/50 hover:border-emerald-500/50 hover:shadow-sm"
          }`}
        >
          <p className="font-semibold text-slate-200 text-sm leading-tight">
            {guruName(guru)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-tight">
            {guru.firm}
          </p>
        </button>
      ))}
    </div>
  );
}
