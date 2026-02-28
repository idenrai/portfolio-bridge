import { useSettingsStore } from "@/stores";
import { formatCurrency, formatPercent, fromKRW } from "@/utils";
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

  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);

  // 외화 노출 합산 (KRW 제외)
  const fxExposure = summary.currencyExposure
    .filter((e) => e.currency !== "KRW")
    .reduce((sum, e) => sum + e.percent, 0);

  const items: KpiItem[] = [
    {
      label: "총 평가액",
      value: formatCurrency(convert(summary.totalValueKRW), baseCurrency, true),
    },
    {
      label: "평가 손익",
      value: formatCurrency(convert(summary.totalPnLKRW), baseCurrency, true),
      sub: formatPercent(summary.totalReturnPercent),
      color: summary.totalPnLKRW >= 0 ? "text-red-600" : "text-blue-600",
    },
    {
      label: "보유 종목",
      value: `${summary.holdingCount}종목`,
      sub: `${summary.assetTypeCount}개 자산군`,
    },
    {
      label: "현금 비중",
      value: `${summary.cashPercent.toFixed(1)}%`,
      color:
        summary.cashPercent > 20
          ? "text-amber-600"
          : summary.cashPercent < 3
            ? "text-red-600"
            : "text-slate-900",
    },
    {
      label: "외화 노출",
      value: `${fxExposure.toFixed(1)}%`,
      sub: summary.currencyExposure
        .filter((e) => e.currency !== "KRW")
        .map((e) => `${e.currency} ${e.percent.toFixed(0)}%`)
        .join(" · "),
      color: fxExposure > 40 ? "text-amber-600" : "text-slate-900",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
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
