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
      {GURU_PROFILES.map((guru) => {
        const avatarUrl = guru.avatar || "/fallback-avatar.svg";
        return (
          <button
            key={guru.id}
            onClick={() => onSelect(guru)}
            className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:border-transparent ${
              selectedGuru?.id === guru.id
                ? "border-zinc-400 bg-zinc-900 text-white shadow-sm"
                : "border-zinc-800 bg-black hover:border-zinc-700 hover:bg-zinc-900/50"
            }`}
          >
            <img src={avatarUrl} alt={guru.name} className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 bg-zinc-900 transition-colors ${selectedGuru?.id === guru.id ? "border border-zinc-500" : "border border-zinc-800"}`} />
            <div className="min-w-0">
              <p className="font-semibold text-zinc-200 text-sm leading-tight truncate">
                {guruName(guru)}
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 leading-tight truncate">
                {guru.firm}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
