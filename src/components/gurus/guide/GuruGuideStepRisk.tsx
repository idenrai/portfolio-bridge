import { Shield, Layers, Flame, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { useT } from "@/hooks";
import type { GuruMatchAnswer } from "@/utils";

interface Props {
  risk: GuruMatchAnswer["risk"];
  onChangeRisk: (risk: GuruMatchAnswer["risk"]) => void;
}

export function GuruGuideStepRisk({ risk, onChangeRisk }: Props) {
  const t = useT();

  const options = [
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
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-mono text-xs font-semibold text-zinc-200">
        {t.guru_guide_q1_title}
      </h4>
      <div
        className="grid grid-cols-1 gap-2.5"
        role="radiogroup"
        aria-label={t.guru_guide_q1_title}
      >
        {options.map(({ id, title, desc, Icon }) => {
          const selected = risk === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChangeRisk(id)}
              className={cn(
                "flex min-h-11 w-full cursor-pointer items-center justify-between rounded-none border p-3.5 text-left transition-all",
                selected
                  ? "border-amber-400 bg-amber-500/10 shadow-none ring-1 ring-amber-400/40"
                  : "border-zinc-800/80 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-none border",
                    selected
                      ? "border-amber-400/40 bg-amber-500/20 text-amber-300"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400",
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white">
                    {title}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-400">{desc}</div>
                </div>
              </div>
              {selected && <Check className="size-4 text-amber-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
