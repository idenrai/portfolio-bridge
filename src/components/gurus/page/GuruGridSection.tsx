import { Sparkles } from "lucide-react";
import type { GuruProfile } from "@/types";
import type { CustomGuruConfig } from "@/stores";
import { CUSTOM_GURU_STRATEGY_KEYS } from "@/stores";
import { GURU_SINCE_YEARS, GURU_METADATA } from "@/utils";
import { GuruFirm } from "../GuruFirm";
import { CustomGuruAvatarIcon } from "../CustomGuruAvatarIcon";
import type { Translations } from "@/i18n";

interface GuruGridSectionProps {
  showCustomGuruCard: boolean;
  customGuruConfig: CustomGuruConfig;
  customProfile: GuruProfile;
  filteredGurus: GuruProfile[];
  guruName: (guru: GuruProfile) => string;
  onSelectGuru: (guru: GuruProfile) => void;
  onResetFilters: () => void;
  t: Translations;
}

export function GuruGridSection({
  showCustomGuruCard,
  customGuruConfig,
  customProfile,
  filteredGurus,
  guruName,
  onSelectGuru,
  onResetFilters,
  t,
}: GuruGridSectionProps) {
  const strategyKey = CUSTOM_GURU_STRATEGY_KEYS[customGuruConfig.strategy];
  const strategyLabel = (t[strategyKey] as string) ?? customGuruConfig.strategy;

  if (filteredGurus.length === 0 && !showCustomGuruCard) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-12 text-center">
        <p className="text-sm text-zinc-400">{t.guru_search_empty}</p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-3 cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          {t.filter_clear_all}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {showCustomGuruCard && (
        <button
          type="button"
          onClick={() => onSelectGuru(customProfile)}
          aria-label={`${customGuruConfig.name || t.custom_guru_default_name}, Custom AI Guru`}
          className="group relative block aspect-card w-full cursor-pointer overflow-hidden rounded-xl border border-indigo-500/40 bg-zinc-950 text-left transition-[transform,box-shadow,border-color] duration-500 hover:scale-[1.02] hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none sm:rounded-2xl"
        >
          <div className="absolute inset-0 bg-linear-to-br from-indigo-950/30 via-zinc-950 to-black transition-opacity duration-500" />
          <div className="absolute inset-0 bg-linear-to-br from-indigo-900/40 via-zinc-900/80 to-black opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-2 rounded-lg border border-dashed border-indigo-500/30 transition-colors duration-500 group-hover:border-indigo-400/50 sm:inset-2.5 sm:rounded-xl" />

          <div className="absolute top-3 left-0 z-10 w-full text-center sm:top-5">
            <span className="inline-flex items-center gap-1 font-mono text-3xs leading-none font-medium tracking-widest text-indigo-400 uppercase transition-colors duration-500 group-hover:text-indigo-300">
              <Sparkles className="size-2.5" />
              <span>{t.custom_guru_selector_badge}</span>
            </span>
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex aspect-square w-[28%] items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-950/50 p-0.5 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-[border-color,background-color] duration-500 group-hover:border-indigo-400 group-hover:bg-indigo-900/60">
              <CustomGuruAvatarIcon
                iconId={customGuruConfig.avatarIcon}
                className="size-6 sm:size-7"
              />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-3 sm:p-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="truncate font-mono text-xs font-bold tracking-wider text-white uppercase sm:text-xs-plus">
                {customGuruConfig.name || t.custom_guru_default_name}
              </p>
              <p className="truncate text-3xs tracking-wider text-indigo-300/80 sm:text-2xs">
                {strategyLabel}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end font-mono text-3xs leading-tight text-indigo-400">
              <span className="text-4xs tracking-wider uppercase opacity-70">
                AI
              </span>
              <span className="font-bold">GURU</span>
            </div>
          </div>
        </button>
      )}

      {filteredGurus.map((guru) => (
        <button
          key={guru.id}
          onClick={() => onSelectGuru(guru)}
          aria-label={`${guruName(guru)}, ${guru.firm}`}
          className="group relative block aspect-card w-full cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-left transition-[transform,box-shadow,border-color] duration-500 hover:scale-[1.02] hover:border-zinc-700 hover:shadow-2xl hover:shadow-white/5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none sm:rounded-2xl"
        >
          <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-950 to-black transition-opacity duration-500" />
          <div className="absolute inset-0 bg-linear-to-br from-zinc-800/80 via-zinc-900/80 to-black opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-2 rounded-lg border border-dashed border-zinc-800/30 transition-colors duration-500 group-hover:border-zinc-400/40 sm:inset-2.5 sm:rounded-xl" />

          <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-between sm:inset-x-4 sm:top-4">
            <span className="font-mono text-4xs font-medium tracking-widest text-zinc-500 uppercase transition-colors duration-500 group-hover:text-zinc-400">
              Portfolio Bridge
            </span>
            <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-4xs text-zinc-400 group-hover:text-zinc-300">
              {t[GURU_METADATA[guru.id]?.tagKey as keyof typeof t] as string}
            </span>
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="aspect-square w-[28%] rounded-full border border-zinc-800/80 bg-black/20 p-0.5 shadow-inner transition-[border-color,background-color] duration-500 group-hover:border-zinc-600/60 group-hover:bg-zinc-800/50">
              <div className="size-full overflow-hidden rounded-full border border-zinc-900">
                <img
                  src={guru.avatar || "/fallback-avatar.svg"}
                  alt={guruName(guru)}
                  width={100}
                  height={100}
                  className="size-full object-cover contrast-125 grayscale transition-[filter] duration-500 group-hover:contrast-100 group-hover:grayscale-0"
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-3 sm:p-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="truncate font-mono text-xs font-bold tracking-wider text-white uppercase sm:text-xs-plus">
                {guruName(guru)}
              </p>
              <GuruFirm
                firm={guru.firm}
                className="text-3xs tracking-wider text-zinc-500 transition-colors duration-500 group-hover:text-zinc-400 sm:text-2xs"
              />
            </div>

            <div className="flex shrink-0 flex-col items-end font-mono text-3xs leading-tight text-zinc-500 transition-colors duration-500 group-hover:text-zinc-400">
              <span className="text-4xs tracking-wider uppercase opacity-60">
                Since
              </span>
              <span className="font-bold">
                ’{GURU_SINCE_YEARS[guru.id] || "26"}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
