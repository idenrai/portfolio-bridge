import { useT } from "@/hooks";
import { Card } from "@/components/common";
import { formatCurrency } from "@/utils";
import type { RebalanceSuggestion } from "@/types";

interface GuruRebalanceTableProps {
  guruRebalancing: RebalanceSuggestion[];
}

export function GuruRebalanceTable({
  guruRebalancing,
}: GuruRebalanceTableProps) {
  const t = useT();

  return (
    <Card title={t.guru_rebalance_title}>
      <div className="-mx-4 overflow-x-auto px-4 md:-mx-5 md:px-5">
        <table className="w-full min-w-125 text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-zinc-500">
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
                      diff >= 0 ? "text-zinc-300" : "text-red-600"
                    }`}
                  >
                    {diff >= 0 ? "+" : ""}
                    {diff.toFixed(1)}%p
                  </td>
                  <td
                    className={`py-2 text-right tabular-nums ${
                      s.diffAmountKRW >= 0
                        ? "text-zinc-300"
                        : "text-red-600"
                    }`}
                  >
                    {s.diffAmountKRW >= 0 ? "+" : ""}
                    {formatCurrency(s.diffAmountKRW, "KRW", true)}
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
