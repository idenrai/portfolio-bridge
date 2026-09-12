import { Award, ChevronRight, Terminal } from "lucide-react";
import { useT } from "@/hooks";
import type { GuruMatchResult } from "@/utils";
import type { GuruId } from "@/types";

interface Props {
  topMatch: GuruMatchResult;
  otherMatches: GuruMatchResult[];
  onSelectGuru: (guruId: GuruId) => void;
  onOpenCustomGuruConfig?: () => void;
}

export function GuruGuideResultView({
  topMatch,
  otherMatches,
  onSelectGuru,
  onOpenCustomGuruConfig,
}: Props) {
  const t = useT();

  return (
    <div className="space-y-4">
      {/* BEST MATCH CARD */}
      <div className="relative overflow-hidden rounded-none border border-amber-500/40 bg-zinc-950 p-4.5 shadow-none sm:p-5">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-none border border-amber-500/40 bg-zinc-900">
                <img
                  src={topMatch.guru.avatar}
                  alt={topMatch.guru.name}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-none border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 font-mono text-2xs font-semibold text-amber-300">
                    <Award className="size-3" />
                    {t.guru_guide_result_best_badge}
                  </span>
                  <span className="rounded-none border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-2xs text-zinc-300">
                    {t[topMatch.metadata.tagKey as keyof typeof t] as string}
                  </span>
                </div>
                <h4 className="mt-1 font-mono text-base font-bold text-white sm:text-lg">
                  {t[`guru_name_${topMatch.guru.id}` as keyof typeof t] as string}
                </h4>
                <p className="mt-0.5 font-mono text-xs text-zinc-400">
                  {topMatch.guru.firm}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-mono text-2xs font-medium text-zinc-400">
                {t.guru_guide_result_score}
              </span>
              <span className="font-mono text-xl font-extrabold text-amber-400 sm:text-2xl">
                {topMatch.score}%
              </span>
            </div>
          </div>

          {/* Match Reason */}
          <div className="rounded-none border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="font-mono text-xs leading-relaxed text-zinc-200">
              {t[topMatch.matchReasonKey as keyof typeof t] as string}
            </p>
          </div>

          {/* Select CTA Button */}
          <button
            type="button"
            onClick={() => onSelectGuru(topMatch.guru.id)}
            className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-none border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 font-mono text-xs font-bold text-amber-400 shadow-none transition-all hover:bg-amber-400 hover:text-black active:scale-100"
          >
            <span>{t.guru_guide_result_select_btn}</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* ALTERNATIVE MATCHES */}
      {otherMatches.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-mono text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            {t.guru_guide_result_other_matches}
          </h5>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {otherMatches.map((res) => (
              <div
                key={res.guru.id}
                className="flex items-center justify-between rounded-none border border-zinc-800 bg-zinc-950 p-2.5 transition-colors hover:border-zinc-700"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <img
                    src={res.guru.avatar}
                    alt={res.guru.name}
                    className="size-9 shrink-0 rounded-none border border-zinc-700 object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate font-mono text-xs font-bold text-white">
                      {t[`guru_name_${res.guru.id}` as keyof typeof t] as string}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-zinc-300">
                        {res.score}%
                      </span>
                      <span className="text-xs text-zinc-500">·</span>
                      <span className="truncate font-mono text-xs text-zinc-400">
                        {res.guru.firm}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectGuru(res.guru.id)}
                  className="shrink-0 cursor-pointer rounded-none border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs font-medium text-zinc-200 transition-colors hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400"
                >
                  {t.guru_guide_result_candidate_select}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CUSTOM GURU CALLOUT CARD */}
      <button
        type="button"
        onClick={() => {
          if (onOpenCustomGuruConfig) {
            onOpenCustomGuruConfig();
          } else {
            onSelectGuru("custom");
          }
        }}
        className="group flex min-h-12 w-full cursor-pointer items-center justify-between rounded-none border border-zinc-800 bg-zinc-950 p-3 text-left transition-all hover:border-amber-500/40 hover:bg-zinc-900/80 sm:p-3.5"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-none border border-amber-500/30 bg-amber-500/10 text-amber-400 transition-all group-hover:bg-amber-500/20">
            <Terminal className="size-4.5" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-zinc-100 transition-colors group-hover:text-amber-400 sm:text-sm">
              {t.guru_guide_result_custom_prompt}
            </div>
            <div className="mt-0.5 text-2xs text-zinc-400">
              {t.custom_guru_modal_desc}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-none border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-bold text-amber-300 transition-all group-hover:bg-amber-400 group-hover:text-black">
          <span>{t.guru_guide_result_custom_link}</span>
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </button>
    </div>
  );
}
