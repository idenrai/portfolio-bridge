import { Card } from "@/components/common";
import { formatCurrency, fromKRW } from "@/utils";
import { CURRENCY_LABELS } from "@/types";
import { useSettingsStore } from "@/stores";
import type { PortfolioSummary, CurrencyCode } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

export function CurrencyExposureCard({ summary }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);

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
    <Card title="환율 노출 & 시나리오">
      {/* 환율 노출 테이블 */}
      <div className="overflow-x-auto -mx-5 px-5 mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-[11px] text-slate-500 font-medium px-2 py-1.5 text-left">
                통화
              </th>
              <th className="text-[11px] text-slate-500 font-medium px-2 py-1.5 text-right">
                평가액
              </th>
              <th className="text-[11px] text-slate-500 font-medium px-2 py-1.5 text-right">
                비중
              </th>
              <th className="text-[11px] text-slate-500 font-medium px-2 py-1.5 text-right">
                환율
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.currencyExposure.map((exp) => (
              <tr key={exp.currency} className="border-b border-slate-50">
                <td className="px-2 py-1.5 text-left">
                  <span className="font-medium text-slate-700">
                    {CURRENCY_LABELS[exp.currency as CurrencyCode] ??
                      exp.currency}
                  </span>
                  <span className="ml-1 text-[10px] text-slate-400">
                    {exp.currency}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-right text-slate-700">
                  {formatCurrency(convert(exp.totalKRW), baseCurrency, true)}
                </td>
                <td className="px-2 py-1.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{
                          width: `${Math.min(exp.percent, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-600 w-10 text-right">
                      {exp.percent.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-right text-[11px] text-slate-500">
                  {exp.currency === "KRW"
                    ? "-"
                    : `₩${exp.rate.toLocaleString()}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ±5% 환율 시나리오 */}
      {scenarioMap.size > 0 && (
        <div>
          <h4 className="text-[11px] text-slate-500 font-medium mb-2">
            환율 ±5% 시나리오
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {[...scenarioMap.entries()].map(([currency, { up, down }]) => (
              <div key={currency} className="flex items-center gap-3 text-xs">
                <span className="font-medium text-slate-700 w-8">
                  {currency}
                </span>
                <span className="text-red-600 flex-1 text-right">
                  +5% → {formatCurrency(convert(up), baseCurrency, true)}
                </span>
                <span className="text-blue-600 flex-1 text-right">
                  −5% → {formatCurrency(convert(down), baseCurrency, true)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
