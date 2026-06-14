import { Card } from "@/components/common";
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
    <Card className="p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-950/50 border border-slate-800 shadow-sm">
      {result.alreadyReached ? (
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)] py-4">
          {t.fire_result_already_reached}
        </h2>
      ) : result.successYear !== null ? (
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4">
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">
              {t.fire_res_years_label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl md:text-7xl font-mono font-light text-emerald-400 tracking-tighter">
                {result.successYear}
              </span>
              <span className="text-xl font-medium text-slate-500">{t.fire_res_yrs}</span>
            </div>
          </div>
          
          {result.successAge && (
            <>
              <div className="w-px h-16 bg-slate-800 hidden md:block" />
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">
                  {t.fire_res_age_label}
                </span>
                <span className="text-6xl md:text-7xl font-mono font-light text-white tracking-tighter">
                  {result.successAge}
                </span>
              </div>
            </>
          )}
        </div>
      ) : (
        <h2 className="text-lg md:text-xl font-medium text-slate-400 py-4">
          {t.fire_res_out_of_bounds}
        </h2>
      )}
    </Card>
  );
}
