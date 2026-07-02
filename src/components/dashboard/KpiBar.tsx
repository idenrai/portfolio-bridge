import { useSettingsStore } from "@/stores";
import { formatCurrency, formatPercent, fromKRW } from "@/utils";
import { useT, useExchangeRates } from "@/hooks";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

export function KpiBar({ summary }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();
  const t = useT();

  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);

  // 외화 노출 합산 (baseCurrency 제외)
  const fxExposure = summary.currencyExposure
    .filter((e) => e.currency !== baseCurrency)
    .reduce((sum, e) => sum + e.percent, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* 주 계기판 (Total Value & PnL) */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col md:flex-row md:items-end justify-between gap-6 relative overflow-hidden">
        {/* 장식용 스캔라인/도트 배경 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:16px_16px] pointer-events-none opacity-50" />
        
        <div className="relative z-10">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">{t.kpi_total_value}</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-4xl md:text-6xl font-mono font-light tracking-tighter text-white tabular-nums">
              {formatCurrency(convert(summary.totalValueKRW), baseCurrency)}
            </h2>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:items-end">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1 md:mb-2">{t.kpi_pnl}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl md:text-3xl font-mono font-medium tracking-tight tabular-nums ${summary.totalPnLKRW >= 0 ? "text-red-500" : "text-blue-500"}`}>
              {summary.totalPnLKRW >= 0 ? "+" : ""}{formatCurrency(convert(summary.totalPnLKRW), baseCurrency)}
            </span>
            <span className={`text-sm md:text-base font-mono font-medium ${summary.totalPnLKRW >= 0 ? "text-red-500/80" : "text-blue-500/80"}`}>
              ({summary.totalPnLKRW >= 0 ? "+" : ""}{formatPercent(summary.totalReturnPercent)})
            </span>
          </div>
        </div>
      </div>

      {/* 보조 지표 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-black border border-zinc-800 px-4 py-3">
          <p className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-wider">{t.holdings_title}</p>
          <p className="text-lg font-mono text-zinc-300 tabular-nums">
            {summary.holdingCount}{t.kpi_holdings_unit}
          </p>
          <p className="text-xs text-zinc-600 mt-0.5 truncate font-mono">
            {summary.assetTypeCount}{t.kpi_asset_type_unit}
          </p>
        </div>
        
        <div className="bg-black border border-zinc-800 px-4 py-3">
          <p className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-wider">{t.kpi_cash_weight}</p>
          <p className="text-lg font-mono text-zinc-300 tabular-nums">
            {summary.cashPercent.toFixed(1)}%
          </p>
        </div>

        <div className="bg-black border border-zinc-800 px-4 py-3 col-span-2 md:col-span-1">
          <p className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-wider">{t.kpi_fx_exposure}</p>
          <p className="text-lg font-mono text-zinc-300 tabular-nums">
            {fxExposure.toFixed(1)}%
          </p>
          <p className="text-xs text-zinc-600 mt-0.5 truncate font-mono">
            {summary.currencyExposure
              .filter((e) => e.currency !== baseCurrency)
              .map((e) => `${e.currency} ${e.percent.toFixed(0)}%`)
              .join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}
