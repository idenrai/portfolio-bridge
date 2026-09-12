import { Shield, TrendingUp, Layers, BarChart3, Globe, Flame, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { useT } from "@/hooks";
import type { GuruCategoryTag } from "@/utils";

interface Props {
  strategy: GuruCategoryTag;
  onChangeStrategy: (strategy: GuruCategoryTag) => void;
}

export function GuruGuideStepStrategy({ strategy, onChangeStrategy }: Props) {
  const t = useT();

  const options = [
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
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-mono text-xs font-semibold text-zinc-200">
        {t.guru_guide_q2_title}
      </h4>
      <div
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        role="radiogroup"
        aria-label={t.guru_guide_q2_title}
      >
        {options.map(({ id, label, desc, Icon }) => {
          const selected = strategy === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChangeStrategy(id)}
              className={cn(
                "flex min-h-11 w-full cursor-pointer flex-col justify-between rounded-none border p-3 text-left transition-all",
                selected
                  ? "border-amber-400 bg-amber-500/10 shadow-none ring-1 ring-amber-400/40"
                  : "border-zinc-800/80 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-none border",
                      selected
                        ? "border-amber-400/40 bg-amber-500/20 text-amber-300"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400",
                    )}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-white">
                    {label}
                  </span>
                </div>
                {selected && <Check className="size-4 text-amber-400" />}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                {desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
