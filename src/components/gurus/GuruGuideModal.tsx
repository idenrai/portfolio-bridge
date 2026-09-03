import { useState, useMemo } from "react";
import {
  Compass,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Shield,
  TrendingUp,
  BarChart3,
  Layers,
  Globe,
  Flame,
  Check,
  Award,
} from "lucide-react";
import { Modal } from "@/components/common";
import { useT } from "@/hooks";
import {
  matchGurus,
  type GuruCategoryTag,
  type GuruMatchAnswer,
  type GuruMatchResult,
  cn,
} from "@/utils";
import type { GuruId } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectGuru: (guruId: GuruId) => void;
  onOpenCustomGuruConfig?: () => void;
}

function GuruGuideModalInner({
  onClose,
  onSelectGuru,
  onOpenCustomGuruConfig,
}: Omit<Props, "open">) {
  const t = useT();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [risk, setRisk] = useState<GuruMatchAnswer["risk"]>("balanced");
  const [strategy, setStrategy] = useState<GuruCategoryTag>("value");
  const [tone, setTone] = useState<GuruMatchAnswer["tone"]>("mentor");

  const matchResults = useMemo<GuruMatchResult[]>(() => {
    if (step !== 4) return [];
    return matchGurus({ risk, strategy, tone });
  }, [step, risk, strategy, tone]);

  const topMatch = matchResults[0];
  const otherMatches = matchResults.slice(1, 3);

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setRisk("balanced");
    setStrategy("value");
    setTone("mentor");
  };

  const handleSelect = (guruId: GuruId) => {
    onSelectGuru(guruId);
    onClose();
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <Compass className="size-3.5" />
          </div>
          <span>
            {step === 4
              ? t.guru_guide_result_title
              : t.guru_guide_modal_title}
          </span>
        </div>
      }
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-6 p-1 sm:p-2">
        {/* Step indicator header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <p className="text-xs text-zinc-400">
            {step === 4
              ? t.guru_guide_result_desc
              : t.guru_guide_modal_desc}
          </p>

          {step < 4 ? (
            <span className="shrink-0 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-2xs font-semibold text-indigo-400">
              {t.guru_guide_step(step, 3)}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleRestart}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <RotateCcw className="size-3.5" />
              <span>{t.guru_guide_btn_restart}</span>
            </button>
          )}
        </div>

        {/* STEP 1: RISK & OBJECTIVE */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-zinc-200">
              {t.guru_guide_q1_title}
            </h4>
            <div className="grid grid-cols-1 gap-2.5" role="radiogroup" aria-label={t.guru_guide_q1_title}>
              {[
                {
                  id: "conservative" as const,
                  title: t.custom_guru_risk_conservative,
                  desc: t.guru_guide_q1_opt_conservative,
                  Icon: Shield,
                },
                {
                  id: "balanced" as const,
                  title: t.custom_guru_risk_balanced,
                  desc: t.guru_guide_q1_opt_balanced,
                  Icon: Layers,
                },
                {
                  id: "aggressive" as const,
                  title: t.custom_guru_risk_aggressive,
                  desc: t.guru_guide_q1_opt_aggressive,
                  Icon: Flame,
                },
              ].map(({ id, title, desc, Icon }) => {
                const selected = risk === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setRisk(id)}
                    className={cn(
                      "flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl border p-3.5 text-left transition-all",
                      selected
                        ? "border-indigo-500/80 bg-indigo-500/10 shadow-sm ring-1 shadow-indigo-500/10 ring-indigo-500/50"
                        : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg border",
                          selected
                            ? "border-indigo-500/40 bg-indigo-500/20 text-indigo-300"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400",
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{title}</div>
                        <div className="mt-0.5 text-xs text-zinc-400">{desc}</div>
                      </div>
                    </div>
                    {selected && <Check className="size-4 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: PORTFOLIO STRATEGY */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-zinc-200">
              {t.guru_guide_q2_title}
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={t.guru_guide_q2_title}>
              {[
                {
                  id: "value" as const,
                  label: t.guru_tag_value,
                  desc: t.guru_guide_q2_opt_value,
                  Icon: Shield,
                },
                {
                  id: "growth" as const,
                  label: t.guru_tag_growth,
                  desc: t.guru_guide_q2_opt_growth,
                  Icon: TrendingUp,
                },
                {
                  id: "passive" as const,
                  label: t.guru_tag_passive,
                  desc: t.guru_guide_q2_opt_passive,
                  Icon: Layers,
                },
                {
                  id: "quant" as const,
                  label: t.guru_tag_quant,
                  desc: t.guru_guide_q2_opt_quant,
                  Icon: BarChart3,
                },
                {
                  id: "macro" as const,
                  label: t.guru_tag_macro,
                  desc: t.guru_guide_q2_opt_macro,
                  Icon: Globe,
                },
                {
                  id: "hedge" as const,
                  label: t.guru_tag_hedge,
                  desc: t.guru_guide_q2_opt_hedge,
                  Icon: Flame,
                },
              ].map(({ id, label, desc, Icon }) => {
                const selected = strategy === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setStrategy(id)}
                    className={cn(
                      "flex min-h-11 w-full cursor-pointer flex-col justify-between rounded-xl border p-3 text-left transition-all",
                      selected
                        ? "border-indigo-500/80 bg-indigo-500/10 shadow-sm ring-1 shadow-indigo-500/10 ring-indigo-500/50"
                        : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex size-7 items-center justify-center rounded-lg border",
                            selected
                              ? "border-indigo-500/40 bg-indigo-500/20 text-indigo-300"
                              : "border-zinc-800 bg-zinc-900 text-zinc-400",
                          )}
                        >
                          <Icon className="size-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white">{label}</span>
                      </div>
                      {selected && <Check className="size-4 text-indigo-400" />}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: ADVISORY TONE */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-zinc-200">
              {t.guru_guide_q3_title}
            </h4>
            <div className="grid grid-cols-1 gap-2.5" role="radiogroup" aria-label={t.guru_guide_q3_title}>
              {[
                {
                  id: "mentor" as const,
                  title: t.custom_guru_tone_mentor,
                  desc: t.guru_guide_q3_opt_mentor,
                },
                {
                  id: "blunt" as const,
                  title: t.custom_guru_tone_direct,
                  desc: t.guru_guide_q3_opt_blunt,
                },
                {
                  id: "academic" as const,
                  title: t.custom_guru_tone_quant,
                  desc: t.guru_guide_q3_opt_academic,
                },
                {
                  id: "trader" as const,
                  title: t.guru_guide_q3_opt_trader,
                  desc: t.guru_guide_q3_opt_trader_desc,
                },
              ].map(({ id, title, desc }) => {
                const selected = tone === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setTone(id)}
                    className={cn(
                      "flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl border p-3.5 text-left transition-all",
                      selected
                        ? "border-indigo-500/80 bg-indigo-500/10 shadow-sm ring-1 shadow-indigo-500/10 ring-indigo-500/50"
                        : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900",
                    )}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{title}</div>
                      <div className="mt-0.5 text-xs text-zinc-400">{desc}</div>
                    </div>
                    {selected && <Check className="size-4 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: RECOMMENDATION RESULTS */}
        {step === 4 && topMatch && (
          <div className="space-y-4">
            {/* BEST MATCH CARD */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-linear-to-b from-indigo-950/40 via-zinc-900 to-black p-4.5 shadow-xl sm:p-5">
              <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-indigo-500/10 blur-2xl" />

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-indigo-400/60 bg-zinc-800 shadow-md">
                      <img
                        src={topMatch.guru.avatar}
                        alt={topMatch.guru.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 rounded bg-indigo-500/20 px-2 py-0.5 text-2xs font-semibold text-indigo-300">
                          <Award className="size-3" />
                          {t.guru_guide_result_best_badge}
                        </span>
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-2xs text-zinc-300">
                          {t[topMatch.metadata.tagKey as keyof typeof t] as string}
                        </span>
                      </div>
                      <h4 className="mt-1 text-base font-bold text-white sm:text-lg">
                        {t[`guru_name_${topMatch.guru.id}` as keyof typeof t] as string}
                      </h4>
                      <p className="mt-0.5 text-xs text-zinc-400">{topMatch.guru.firm}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-2xs font-medium text-zinc-400">
                      {t.guru_guide_result_score}
                    </span>
                    <span className="font-mono text-xl font-extrabold text-indigo-400 sm:text-2xl">
                      {topMatch.score}%
                    </span>
                  </div>
                </div>

                {/* Match Reason */}
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3">
                  <p className="text-xs leading-relaxed text-zinc-200">
                    {t[topMatch.matchReasonKey as keyof typeof t] as string}
                  </p>
                </div>

                {/* Select CTA Button */}
                <button
                  type="button"
                  onClick={() => handleSelect(topMatch.guru.id)}
                  className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-98"
                >
                  <span>{t.guru_guide_result_select_btn}</span>
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* ALTERNATIVE MATCHES */}
            {otherMatches.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  {t.guru_guide_result_other_matches}
                </h5>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {otherMatches.map((res) => (
                    <div
                      key={res.guru.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 transition-colors hover:border-zinc-700"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <img
                          src={res.guru.avatar}
                          alt={res.guru.name}
                          className="size-9 shrink-0 rounded-full border border-zinc-700 object-cover"
                        />
                        <div className="min-w-0">
                          <div className="truncate text-xs font-bold text-white">
                            {t[`guru_name_${res.guru.id}` as keyof typeof t] as string}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold text-zinc-300">
                              {res.score}%
                            </span>
                            <span className="text-xs text-zinc-500">·</span>
                            <span className="truncate text-xs text-zinc-400">
                              {res.guru.firm}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelect(res.guru.id)}
                        className="shrink-0 cursor-pointer rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
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
                  handleSelect("custom");
                }
              }}
              className="group flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-indigo-500/30 bg-linear-to-r from-indigo-950/40 via-purple-950/25 to-zinc-900/60 p-3 text-left transition-all hover:border-indigo-500/60 hover:bg-indigo-950/50 active:scale-[0.99] sm:p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 transition-all group-hover:scale-105 group-hover:bg-indigo-500/25">
                  <Sparkles className="size-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-100 transition-colors group-hover:text-white sm:text-sm">
                    {t.guru_guide_result_custom_prompt}
                  </div>
                  <div className="mt-0.5 text-2xs text-zinc-400">
                    {t.custom_guru_modal_desc}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-lg border border-indigo-500/40 bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-300 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                <span>{t.guru_guide_result_custom_link}</span>
                <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>
        )}

        {/* MODAL FOOTER NAV BUTTONS */}
        {step < 4 && (
          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex min-h-11 cursor-pointer items-center gap-1 rounded-lg border border-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
              >
                <ChevronLeft className="size-4" />
                <span>{t.guru_guide_btn_prev}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex min-h-11 cursor-pointer items-center gap-1 rounded-lg bg-white px-5 py-2 text-xs font-bold text-black shadow-sm transition-all hover:bg-zinc-200 active:scale-98"
            >
              <span>{step === 3 ? t.guru_guide_btn : t.guru_guide_btn_next}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function GuruGuideModal({
  open,
  onClose,
  onSelectGuru,
  onOpenCustomGuruConfig,
}: Props) {
  if (!open) return null;

  return (
    <GuruGuideModalInner
      onClose={onClose}
      onSelectGuru={onSelectGuru}
      onOpenCustomGuruConfig={onOpenCustomGuruConfig}
    />
  );
}
