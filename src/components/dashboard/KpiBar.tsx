import { memo } from "react";
import { useSettingsStore } from "@/stores";
import { formatCurrency, formatPercent, fromKRW, cn } from "@/utils";
import { useT, useExchangeRates } from "@/hooks";
import type { PortfolioSummary } from "@/types";
import { Loader2 } from "lucide-react";

interface Props {
  summary: PortfolioSummary;
  isInitialLoading?: boolean;
}

export const KpiBar = memo(function KpiBar({ summary, isInitialLoading }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();
  const t = useT();

  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);

  // 외화 노출 합산 (baseCurrency 제외)
  const foreignCurrencies = summary.currencyExposure.filter((e) => e.currency !== baseCurrency);
  const fxExposure = foreignCurrencies.reduce((sum, e) => sum + e.percent, 0);
  const foreignCurrencySummary =
    foreignCurrencies.length > 0
      ? foreignCurrencies.map((e) => `${e.currency} ${e.percent.toFixed(0)}%`).join(" · ")
      : "-";

  const isZeroPnL = summary.totalPnLKRW === 0;
  const isPositivePnL = summary.totalPnLKRW > 0;
  const pnlColor = isZeroPnL ? "text-zinc-400" : isPositivePnL ? "text-red-500" : "text-blue-500";
  const pnlSubColor = isZeroPnL ? "text-zinc-500" : isPositivePnL ? "text-red-500/80" : "text-blue-500/80";

  return (
    <div className="relative flex flex-col gap-4">
      {/* 로딩 오버레이 */}
      {isInitialLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-4 shadow-2xl">
            <Loader2 className="size-5 text-white motion-safe:animate-spin" />
            <span className="text-sm font-bold tracking-tight text-white">{t.dash_refreshing}</span>
          </div>
        </div>
      )}

      {/* 주 계기판 (Total Value & PnL) */}
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden border border-zinc-800 bg-zinc-950 p-6 md:flex-row md:items-end">
        {/* 장식용 스캔라인/도트 배경 */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[16px_16px] opacity-50" />
        
        <div className="relative z-10">
          <p className="mb-2 text-sm font-bold tracking-widest text-zinc-500 uppercase">{t.kpi_total_value}</p>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2
              className="font-mono text-4xl font-light tracking-tighter whitespace-nowrap text-white tabular-nums md:text-6xl"
              aria-label={`${t.kpi_total_value}: ${formatCurrency(convert(summary.totalValueKRW), baseCurrency)}`}
            >
              {formatCurrency(convert(summary.totalValueKRW), baseCurrency)}
            </h2>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:items-end">
          <p className="mb-1 text-sm font-bold tracking-widest text-zinc-500 uppercase md:mb-2">{t.kpi_pnl}</p>
          <div
            className="flex flex-wrap items-baseline gap-2 md:justify-end"
            aria-label={`${t.kpi_pnl}: ${formatCurrency(convert(summary.totalPnLKRW), baseCurrency, false, true)} (${formatPercent(summary.totalReturnPercent)})`}
          >
            <span
              aria-hidden="true"
              className={cn(
                "font-mono text-2xl font-medium tracking-tight whitespace-nowrap tabular-nums md:text-3xl",
                pnlColor,
              )}
            >
              {formatCurrency(convert(summary.totalPnLKRW), baseCurrency, false, true)}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "font-mono text-sm font-medium whitespace-nowrap md:text-base",
                pnlSubColor,
              )}
            >
              ({formatPercent(summary.totalReturnPercent)})
            </span>
          </div>
        </div>
      </div>

      {/* 보조 지표 그리드 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="border border-zinc-800 bg-black px-4 py-3">
          <p className="mb-1 text-xs font-bold tracking-wider text-zinc-500 uppercase">{t.holdings_title}</p>
          <p className="font-mono text-lg text-zinc-300 tabular-nums">
            {summary.holdingCount ?? 0}{t.kpi_holdings_unit}
          </p>
          <p className="mt-0.5 truncate font-mono text-xs text-zinc-500">
            {summary.assetTypeCount ?? 0}{t.kpi_asset_type_unit}
          </p>
        </div>
        
        <div className="border border-zinc-800 bg-black px-4 py-3">
          <p className="mb-1 text-xs font-bold tracking-wider text-zinc-500 uppercase">{t.kpi_cash_weight}</p>
          <p className="font-mono text-lg text-zinc-300 tabular-nums">
            {(summary.cashPercent || 0).toFixed(1)}%
          </p>
        </div>

        <div className="col-span-2 border border-zinc-800 bg-black px-4 py-3 md:col-span-1">
          <p className="mb-1 text-xs font-bold tracking-wider text-zinc-500 uppercase">{t.kpi_fx_exposure}</p>
          <p className="font-mono text-lg text-zinc-300 tabular-nums">
            {(fxExposure || 0).toFixed(1)}%
          </p>
          <p
            className="mt-0.5 truncate font-mono text-xs text-zinc-500"
            title={foreignCurrencySummary !== "-" ? foreignCurrencySummary : undefined}
          >
            {foreignCurrencySummary}
          </p>
        </div>
      </div>
    </div>
  );
});

