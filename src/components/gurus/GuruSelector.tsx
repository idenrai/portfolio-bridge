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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
      {GURU_PROFILES.map((guru) => {
        const avatarUrl = guru.avatar || "/fallback-avatar.svg";
        return (
          <button
            key={guru.id}
            onClick={() => onSelect(guru)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none ${
              selectedGuru?.id === guru.id
                ? "border-zinc-400 bg-zinc-900 text-white shadow-sm"
                : "border-zinc-800 bg-black hover:border-zinc-700 hover:bg-zinc-900/50"
            }`}
          >
            <img src={avatarUrl} alt={guru.name} className={`size-11 shrink-0 rounded-full bg-zinc-900 object-cover transition-colors sm:size-12 ${selectedGuru?.id === guru.id ? "border border-zinc-500" : "border border-zinc-800"}`} />
            <div className="min-w-0">
              <p className="truncate text-sm leading-tight font-semibold text-zinc-200">
                {guruName(guru)}
              </p>
              <p className="mt-0.5 truncate text-[10px] leading-tight text-zinc-500 sm:text-xs">
                {guru.firm}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
