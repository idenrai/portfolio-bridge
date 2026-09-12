import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { useT } from "@/hooks";
import type { GuruMatchAnswer } from "@/utils";

interface Props {
  tone: GuruMatchAnswer["tone"];
  onChangeTone: (tone: GuruMatchAnswer["tone"]) => void;
}

export function GuruGuideStepTone({ tone, onChangeTone }: Props) {
  const t = useT();

  const options = [
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
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-mono text-xs font-semibold text-zinc-200">
        {t.guru_guide_q3_title}
      </h4>
      <div
        className="grid grid-cols-1 gap-2.5"
        role="radiogroup"
        aria-label={t.guru_guide_q3_title}
      >
        {options.map(({ id, title, desc }) => {
          const selected = tone === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChangeTone(id)}
              className={cn(
                "flex min-h-11 w-full cursor-pointer items-center justify-between rounded-none border p-3.5 text-left transition-all",
                selected
                  ? "border-amber-400 bg-amber-500/10 shadow-none ring-1 ring-amber-400/40"
                  : "border-zinc-800/80 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900",
              )}
            >
              <div>
                <div className="font-mono text-xs font-bold text-white">
                  {title}
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">{desc}</div>
              </div>
              {selected && <Check className="size-4 text-amber-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
