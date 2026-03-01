import { useSettingsStore } from "@/stores";
import { formatCurrency, formatPercent, fromKRW } from "@/utils";
import { useT } from "@/hooks";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

interface KpiItem {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export function KpiBar({ summary }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const t = useT();

  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);

  // 외화 노출 합산 (baseCurrency 제외)
  const fxExposure = summary.currencyExposure
    .filter((e) => e.currency !== baseCurrency)
    .reduce((sum, e) => sum + e.percent, 0);

  const items: KpiItem[] = [
    {
      label: t.kpi_total_value,
      value: formatCurrency(convert(summary.totalValueKRW), baseCurrency, true),
    },
    {
      label: t.kpi_pnl,
      value: formatCurrency(convert(summary.totalPnLKRW), baseCurrency, true),
      sub: formatPercent(summary.totalReturnPercent),
      color: summary.totalPnLKRW >= 0 ? "text-red-600" : "text-blue-600",
    },
    {
      label: t.holdings_title,
      value: `${summary.holdingCount}${t.kpi_holdings_unit}`,
      sub: `${summary.assetTypeCount}${t.kpi_asset_type_unit}`,
    },
    {
      label: t.kpi_cash_weight,
      value: `${summary.cashPercent.toFixed(1)}%`,
      color:
        summary.cashPercent > 20
          ? "text-amber-600"
          : summary.cashPercent < 3
            ? "text-red-600"
            : "text-slate-900",
    },
    {
      label: t.kpi_fx_exposure,
      value: `${fxExposure.toFixed(1)}%`,
      sub: summary.currencyExposure
        .filter((e) => e.currency !== baseCurrency)
        .map((e) => `${e.currency} ${e.percent.toFixed(0)}%`)
        .join(" · "),
      color: fxExposure > 40 ? "text-amber-600" : "text-slate-900",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3"
        >
          <p className="text-[11px] text-slate-500 font-medium mb-0.5">
            {item.label}
          </p>
          <p
            className={`text-lg font-bold leading-tight ${item.color ?? "text-slate-900"}`}
          >
            {item.value}
          </p>
          {item.sub && (
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {item.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
