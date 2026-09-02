
import { useT } from "@/hooks";
import { AlertTriangle, CheckCircle2, TrendingUp, Target, PiggyBank, Sparkles } from "lucide-react";
import { formatCurrency } from "@/utils/calc/currency";
import { useSettingsStore } from "@/stores";
import type { FireResult } from "@/utils/calc/fire";

interface FireResultCardProps {
  result: FireResult | null;
  targetAmount?: number;
  currentAssets?: number;
  monthlySavings?: number;
}

export function FireResultCard({
  result,
  targetAmount = 0,
  currentAssets = 0,
  monthlySavings = 0,
}: FireResultCardProps) {
  const t = useT();
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);

  if (!result) return null;

  if (result.isInvalidInput) {
    return (
      <div className="flex w-full items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-400 shadow-sm backdrop-blur-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <span className="flex-1 text-sm leading-relaxed font-medium">
          {t.fire_error_savings_exceed_target}
        </span>
      </div>
    );
  }

  // 재무 메트릭 계산
  const years = result.successYear ?? 0;
  const totalContributions = currentAssets + (monthlySavings * 12 * years);
  const compoundGrowth = Math.max(0, targetAmount - totalContributions);
  const growthRatio = targetAmount > 0 ? (compoundGrowth / targetAmount) * 100 : 0;

  return (
    <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-lg backdrop-blur-md md:p-6">
      {/* 배경 은은한 에메랄드 그라디언트 글로우 */}
      <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-indigo-500/10 blur-[80px]" />

      {/* 1. 상단: 메인 결론 헤더 */}
      {result.alreadyReached ? (
        <div className="z-10 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
          <CheckCircle2 className="size-6 shrink-0 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white md:text-lg">
              {t.fire_result_already_reached}
            </h2>
            <p className="mt-0.5 text-xs text-emerald-400/90">
              {t.fire_already_reached_desc}
            </p>
          </div>
        </div>
      ) : result.successYear !== null ? (
        <div className="z-10 flex flex-col justify-between gap-4 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              <Sparkles className="size-3.5" />
              {t.fire_res_years_label}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                {result.successYear}
              </span>
              <span className="text-lg font-medium text-zinc-400">{t.fire_res_yrs}</span>
              {result.successAge && (
                <span className="ml-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-sm font-semibold text-emerald-300">
                  {t.fire_age_reached_badge(result.successAge)}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-right">
            <span className="block text-3xs font-medium text-zinc-400 uppercase">
              {t.fire_kpi_compound_leverage}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400">
              {t.fire_kpi_compound_ratio(growthRatio.toFixed(1))}
            </span>
          </div>
        </div>
      ) : (
        <div className="z-10 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <AlertTriangle className="size-5 shrink-0 text-zinc-400" />
          <p className="text-sm text-zinc-400">
            {t.fire_res_out_of_bounds}
          </p>
        </div>
      )}

      {/* 2. 하단: 4대 핵심 재무 KPI 카드 그리드 */}
      {targetAmount > 0 && (
        <div className="z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* 목표 자산 */}
          <div className="flex flex-col gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-3xs font-semibold tracking-wider text-zinc-400 uppercase">
              <Target className="size-3 text-indigo-400" />
              {t.fire_kpi_target_amount}
            </div>
            <div className="font-mono text-sm font-bold text-zinc-100 tabular-nums">
              {formatCurrency(targetAmount, baseCurrency, true)}
            </div>
          </div>

          {/* 총 저축 원금 */}
          <div className="flex flex-col gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-3xs font-semibold tracking-wider text-zinc-400 uppercase">
              <PiggyBank className="size-3 text-cyan-400" />
              {t.fire_kpi_total_contributions}
            </div>
            <div className="font-mono text-sm font-bold text-zinc-100 tabular-nums">
              {formatCurrency(totalContributions, baseCurrency, true)}
            </div>
          </div>

          {/* 복리 창출 수익 */}
          <div className="flex flex-col gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-3xs font-semibold tracking-wider text-zinc-400 uppercase">
              <TrendingUp className="size-3 text-emerald-400" />
              {t.fire_kpi_compound_growth}
            </div>
            <div className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
              +{formatCurrency(compoundGrowth, baseCurrency, true)}
            </div>
          </div>

          {/* FIRE 마일스톤 */}
          <div className="flex flex-col gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-3xs font-semibold tracking-wider text-zinc-400 uppercase">
              <Sparkles className="size-3 text-amber-400" />
              {t.fire_kpi_years_to_fire}
            </div>
            <div className="font-mono text-sm font-bold text-amber-300 tabular-nums">
              {result.alreadyReached
                ? t.fire_kpi_already_achieved
                : result.successYear !== null
                  ? t.fire_kpi_years_suffix(result.successYear)
                  : "-"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
