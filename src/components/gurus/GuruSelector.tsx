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
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
          }`}
        >
          <p className="font-semibold text-slate-800 text-sm leading-tight">
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
