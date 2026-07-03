
import { useT } from "@/hooks";
import { AlertTriangle } from "lucide-react";
import type { FireResult } from "@/utils/calc/fire";

interface FireResultCardProps {
  result: FireResult | null;
}

export function FireResultCard({ result }: FireResultCardProps) {
  const t = useT();

  if (!result) return null;

  if (result.isInvalidInput) {
    return (
      <div className="flex w-full items-start gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-400 shadow-sm">
        <AlertTriangle className="mt-0.5 shrink-0 size-4 text-amber-500" />
        <span className="flex-1 text-sm leading-relaxed font-medium">
          {t.fire_error_savings_exceed_target}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[320px] flex-col justify-end gap-4 overflow-hidden border border-zinc-800 bg-black p-8 text-left md:p-12">
      {/* 배경 장식 (우측 하단으로 이동) */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-emerald-500/5 blur-[100px]" />
      
      {result.alreadyReached ? (
        <h2 className="z-10 py-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          {t.fire_result_already_reached}
        </h2>
      ) : result.successYear !== null ? (
        <div className="z-10 mt-auto flex flex-col gap-12">
          <div>
            <span className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              {t.fire_res_years_label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-8xl font-light tracking-tighter text-white md:text-9xl">
                {result.successYear}
              </span>
              <span className="text-2xl font-medium text-zinc-400">{t.fire_res_yrs}</span>
            </div>
          </div>
          
          {result.successAge && (
            <div>
              <span className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
                {t.fire_res_age_label}
              </span>
              <span className="font-mono text-6xl font-light tracking-tighter text-zinc-400 md:text-7xl">
                {result.successAge}
              </span>
            </div>
          )}
        </div>
      ) : (
        <h2 className="z-10 mt-auto py-4 text-lg font-medium text-zinc-500 md:text-xl">
          {t.fire_res_out_of_bounds}
        </h2>
      )}
    </div>
  );
}
