
import { useT } from "@/hooks";
import type { FireResult } from "@/utils/calc/fire";

interface FireResultCardProps {
  result: FireResult | null;
}

export function FireResultCard({ result }: FireResultCardProps) {
  const t = useT();

  if (!result) return null;

  if (result.isInvalidInput) {
    return (
      <div className="flex items-start gap-2 px-4 py-3 rounded-lg border bg-amber-500/10 border-amber-500/50 text-amber-400 w-full shadow-sm">
        <span className="text-base shrink-0 mt-0.5">⚠️</span>
        <span className="leading-relaxed flex-1 font-medium text-sm">
          {t.fire_error_savings_exceed_target}
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black border border-zinc-800 p-8 md:p-12 flex flex-col justify-end text-left gap-4 min-h-[320px]">
      {/* 배경 장식 (우측 하단으로 이동) */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      {result.alreadyReached ? (
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight py-4 z-10">
          {t.fire_result_already_reached}
        </h2>
      ) : result.successYear !== null ? (
        <div className="flex flex-col gap-12 mt-auto z-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2 block">
              {t.fire_res_years_label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-8xl md:text-9xl font-mono font-light text-white tracking-tighter">
                {result.successYear}
              </span>
              <span className="text-2xl font-medium text-zinc-600">{t.fire_res_yrs}</span>
            </div>
          </div>
          
          {result.successAge && (
            <div>
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2 block">
                {t.fire_res_age_label}
              </span>
              <span className="text-6xl md:text-7xl font-mono font-light text-zinc-400 tracking-tighter">
                {result.successAge}
              </span>
            </div>
          )}
        </div>
      ) : (
        <h2 className="text-lg md:text-xl font-medium text-zinc-500 py-4 z-10 mt-auto">
          {t.fire_res_out_of_bounds}
        </h2>
      )}
    </div>
  );
}
