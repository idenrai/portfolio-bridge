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
          className={`text-left p-4 rounded-none border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-500 ${
            selectedGuru?.id === guru.id
              ? "border-zinc-300 bg-zinc-900 text-white shadow-sm"
              : "border-zinc-800 bg-black hover:border-zinc-600"
          }`}
        >
          <p className="font-semibold text-zinc-200 text-sm leading-tight">
            {guruName(guru)}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-tight">
            {guru.firm}
          </p>
        </button>
      ))}
    </div>
  );
}
