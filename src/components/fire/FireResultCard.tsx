
import { useT } from "@/hooks";
import { AlertTriangle, CheckCircle2, TrendingUp, Target, PiggyBank, Hourglass } from "lucide-react";
import { formatCurrency } from "@/utils/calc/currency";
import { useSettingsStore } from "@/stores";
import type { FireResult } from "@/utils/calc/fire";

interface FireResultCardProps {
  result: FireResult | null;
  targetAmount?: number;
  currentAssets?: number;
  monthlySavings?: number;
  currentAge?: number | null;
}

export function FireResultCard({
  result,
  targetAmount = 0,
  currentAssets = 0,
  monthlySavings = 0,
  currentAge = null,
}: FireResultCardProps) {
  const t = useT();
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);

  if (!result) return null;

  if (result.isInvalidInput) {
    return (
      <div className="flex w-full items-start gap-2.5 rounded-none border border-amber-500/40 bg-amber-500/10 p-4 font-mono text-amber-400 shadow-none">
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
    <div className="relative flex flex-col gap-5 border border-zinc-800 bg-zinc-950 p-4 md:p-6">
      {/* 1. 상단: 메인 결론 헤더 */}
      {result.alreadyReached ? (
        <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
          <CheckCircle2 className="size-6 shrink-0 text-emerald-400" />
          <div>
            <h2 className="font-mono text-base font-bold text-white md:text-lg">
              {t.fire_result_already_reached}
            </h2>
            <p className="mt-0.5 font-mono text-xs text-emerald-400/90">
              {t.fire_already_reached_desc}
            </p>
          </div>
        </div>
      ) : result.successYear !== null ? (
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-2xs font-bold tracking-wider text-emerald-400 uppercase">
              <span className="text-zinc-500">[</span>
              <span>{t.fire_res_years_label}</span>
              <span className="text-zinc-500">]</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-4xl font-extrabold tracking-tight text-white tabular-nums md:text-5xl">
                {result.successYear}
              </span>
              <span className="font-mono text-lg font-medium text-zinc-400">{t.fire_res_yrs}</span>
              {result.successAge && (
                <span className="ml-2 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300">
                  {t.fire_age_reached_badge(result.successAge)}
                </span>
              )}
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-right font-mono">
            <span className="block text-3xs font-medium tracking-wider text-zinc-500 uppercase">
              {t.fire_kpi_compound_leverage}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
              {t.fire_kpi_compound_ratio(growthRatio.toFixed(1))}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-900/40 p-4">
          <AlertTriangle className="size-5 shrink-0 text-zinc-400" />
          <p className="font-mono text-sm text-zinc-400">
            {t.fire_res_out_of_bounds}
          </p>
        </div>
      )}

      {/* 2. 하단: 4대 핵심 재무 KPI 카드 그리드 */}
      {targetAmount > 0 && (
        <div className="grid grid-cols-2 gap-3 font-mono sm:grid-cols-4">
          {/* 목표 자산 */}
          <div className="flex flex-col gap-1 border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-3xs font-semibold tracking-wider text-zinc-500 uppercase">
              <Target className="size-3 text-zinc-400" />
              {t.fire_kpi_target_amount}
            </div>
            <div className="text-sm font-bold text-zinc-100 tabular-nums">
              {formatCurrency(targetAmount, baseCurrency, true)}
            </div>
          </div>

          {/* 총 저축 원금 */}
          <div className="flex flex-col gap-1 border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-3xs font-semibold tracking-wider text-zinc-500 uppercase">
              <PiggyBank className="size-3 text-cyan-400" />
              {t.fire_kpi_total_contributions}
            </div>
            <div className="text-sm font-bold text-zinc-100 tabular-nums">
              {formatCurrency(totalContributions, baseCurrency, true)}
            </div>
          </div>

          {/* 복리 창출 수익 */}
          <div className="flex flex-col gap-1 border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-3xs font-semibold tracking-wider text-zinc-500 uppercase">
              <TrendingUp className="size-3 text-emerald-400" />
              {t.fire_kpi_compound_growth}
            </div>
            <div className="text-sm font-bold text-emerald-400 tabular-nums">
              +{formatCurrency(compoundGrowth, baseCurrency, true)}
            </div>
          </div>

          {/* FIRE 마일스톤 */}
          <div className="flex flex-col gap-1 border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-3xs font-semibold tracking-wider text-zinc-500 uppercase">
              <Hourglass className="size-3 text-amber-400" />
              {t.fire_kpi_years_to_fire}
            </div>
            <div className="text-sm font-bold text-amber-300 tabular-nums">
              {result.alreadyReached
                ? t.fire_kpi_already_achieved
                : result.successYear !== null
                  ? t.fire_kpi_years_suffix(result.successYear)
                  : "-"}
            </div>
          </div>
        </div>
      )}

      {/* 3. 은퇴 라이프사이클 타임라인 (기대 수명 & 인출 지속 기간) */}
      {typeof result.successAge === "number" && typeof result.retirementYears === "number" && (() => {
        const targetLongevity = result.targetLongevity ?? 100;
        const totalSpan = currentAge !== null ? Math.max(1, targetLongevity - currentAge) : 100;
        const accumSpan = currentAge !== null ? Math.max(0, result.successAge - currentAge) : 0;
        const accumPct = currentAge !== null && result.successAge > currentAge
          ? Math.min(92, Math.max(8, (accumSpan / totalSpan) * 100))
          : 0;

        return (
          <div className="flex flex-col gap-3 border border-zinc-800 bg-zinc-900/40 p-4 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Hourglass className="size-4 text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-200">
                  {t.fire_longevity_title}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-2xs font-semibold text-emerald-300">
                {t.fire_longevity_badge(result.retirementYears)}
              </span>
            </div>

            {/* 시각적 라이프사이클 타임라인 */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-3xs font-medium text-zinc-500">
                {currentAge !== null && <span>{t.fire_timeline_current_age(currentAge)}</span>}
                <span className="font-bold text-emerald-400">
                  {t.fire_timeline_target_age(result.successAge)}
                </span>
                <span>{t.fire_timeline_longevity_age}</span>
              </div>
              <div className="relative flex h-2 w-full overflow-hidden bg-zinc-800">
                {accumPct > 0 && (
                  <div
                    className="h-full bg-amber-500/80 transition-all duration-500"
                    style={{ width: `${accumPct}%` }}
                    title={`${accumSpan}년 자산 축적`}
                  />
                )}
                <div
                  className="h-full flex-1 bg-emerald-500/80 transition-all duration-500"
                  title={`${result.retirementYears}년 안전 인출`}
                />
              </div>
            </div>

            <p className="text-2xs leading-relaxed text-zinc-400">
              {t.fire_longevity_desc(result.successAge, result.retirementYears)}
            </p>

            {/* 30년 초과 시 조기 은퇴 장기 인출 리스크 알림 */}
            {result.isExtendedRetirement && (
              <div className="flex items-start gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-3xs leading-relaxed text-amber-300">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                <span>{t.fire_longevity_warning_extended}</span>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
