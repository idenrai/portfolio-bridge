import { Card } from "@/components/common";
import { formatCurrency, fromKRW } from "@/utils";
import { CURRENCY_SYMBOLS } from "@/types";
import { useSettingsStore } from "@/stores";
import { useT, useExchangeRates } from "@/hooks";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

export function CurrencyExposureCard({ summary }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();
  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);
  const t = useT();

  if (summary.currencyExposure.length === 0) return null;

  // 시나리오를 통화별로 그룹핑
  const scenarioMap = new Map<string, { up: number; down: number }>();
  for (const s of summary.currencyScenarios) {
    const prev = scenarioMap.get(s.currency) ?? { up: 0, down: 0 };
    if (s.changePercent > 0) prev.up = s.impactKRW;
    else prev.down = s.impactKRW;
    scenarioMap.set(s.currency, prev);
  }

  return (
    <Card title={t.fx_title}>
      {/* 환율 노출 테이블 */}
      <div className="-mx-4 mb-4 overflow-x-auto px-4 md:-mx-5 md:px-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-2 py-1.5 text-left text-[11px] font-medium text-zinc-500">
                {t.fx_col_currency}
              </th>
              <th className="px-2 py-1.5 text-right text-[11px] font-medium text-zinc-500">
                {t.fx_col_value}
              </th>
              <th className="px-2 py-1.5 text-right text-[11px] font-medium text-zinc-500">
                {t.fx_col_weight}
              </th>
              <th className="px-2 py-1.5 text-right text-[11px] font-medium text-zinc-500">
                {t.fx_col_rate}
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.currencyExposure.map((exp) => (
              <tr key={exp.currency} className="border-b border-zinc-800/50">
                <td className="px-2 py-1.5 text-left">
                  <span className="font-medium text-zinc-300">
                    {exp.currency}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-right text-zinc-200">
                  {formatCurrency(convert(exp.totalKRW), baseCurrency, true)}
                </td>
                <td className="px-2 py-1.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <div className="h-1.5 w-10 overflow-hidden rounded-full bg-zinc-800/50">
                      <div
                        className="h-full rounded-full bg-indigo-400"
                        style={{
                          width: `${Math.min(exp.percent, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-[11px] text-zinc-400">
                      {exp.percent.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-right text-[11px] text-zinc-500">
                  {exp.currency === baseCurrency
                    ? "-"
                    : `${CURRENCY_SYMBOLS[baseCurrency]}${fromKRW(exp.rate, baseCurrency, rates).toLocaleString(undefined, { maximumFractionDigits: baseCurrency === "USD" ? 4 : 0 })}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ±5% 환율 시나리오 */}
      {scenarioMap.size > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] font-medium text-zinc-500">
            {t.fx_scenario_title}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {[...scenarioMap.entries()].map(([currency, { up, down }]) => (
              <div key={currency} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-medium text-zinc-300">
                  {currency}
                </span>
                <span className="flex-1 text-right text-rose-400">
                  +5% → {formatCurrency(convert(up), baseCurrency, true)}
                </span>
                <span className="flex-1 text-right text-sky-400">
                  -5% → {formatCurrency(convert(down), baseCurrency, true)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
