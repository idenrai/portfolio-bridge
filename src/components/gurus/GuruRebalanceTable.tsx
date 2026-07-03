import { useT, useExchangeRates } from "@/hooks";
import { useSettingsStore } from "@/stores";
import { Card } from "@/components/common";
import { formatCurrency, fromKRW } from "@/utils";
import type { RebalanceSuggestion } from "@/types";

interface GuruRebalanceTableProps {
  guruRebalancing: RebalanceSuggestion[];
}

export function GuruRebalanceTable({
  guruRebalancing,
}: GuruRebalanceTableProps) {
  const t = useT();
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: exchangeRates } = useExchangeRates();

  return (
    <Card title={t.guru_rebalance_title}>
      <div className="-mx-4 overflow-x-auto px-4 md:-mx-5 md:px-5">
        <table className="w-full min-w-[500px] text-sm">
          <thead>
            <tr className="border-b border-zinc-800/50 text-left text-xs text-zinc-500">
              <th className="pb-2 font-medium">{t.guru_col_category}</th>
              <th className="pb-2 text-right font-medium">
                {t.guru_col_current}
              </th>
              <th className="pb-2 text-right font-medium">
                {t.guru_col_guru_target}
              </th>
              <th className="pb-2 text-right font-medium">
                {t.guru_col_diff}
              </th>
              <th className="pb-2 text-right font-medium">
                {t.guru_col_amount}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {guruRebalancing.map((s) => {
              const diff = s.targetPercent - s.currentPercent;
              const roundedDiff = Number(diff.toFixed(1));
              const roundedAmount = Math.round(s.diffAmountKRW);
              
              return (
                <tr key={s.category}>
                  <td className="py-2">
                    {t.category_labels[s.category] ?? s.category}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {s.currentPercent.toFixed(1)}%
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {s.targetPercent.toFixed(1)}%
                  </td>
                  <td
                    className={`py-2 text-right font-medium tabular-nums ${
                      roundedDiff > 0
                        ? "text-emerald-500"
                        : roundedDiff < 0
                          ? "text-rose-500"
                          : "text-zinc-500"
                    }`}
                  >
                    {roundedDiff > 0 ? "+" : ""}
                    {roundedDiff.toFixed(1)}%p
                  </td>
                  <td
                    className={`py-2 text-right tabular-nums ${
                      roundedAmount > 0
                        ? "text-emerald-500"
                        : roundedAmount < 0
                          ? "text-rose-500"
                          : "text-zinc-500"
                    }`}
                  >
                    {roundedAmount > 0 ? "+" : ""}
                    {formatCurrency(fromKRW(roundedAmount, baseCurrency, exchangeRates), baseCurrency, true)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
