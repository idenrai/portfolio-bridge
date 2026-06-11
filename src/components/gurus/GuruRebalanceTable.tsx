import { useT } from "@/hooks";
import { Card } from "@/components/common";
import { formatCurrency } from "@/utils";
import type { GuruProfile, RebalanceSuggestion } from "@/types";

interface GuruRebalanceTableProps {
  selectedGuru: GuruProfile;
  guruRebalancing: RebalanceSuggestion[];
}

export function GuruRebalanceTable({
  selectedGuru,
  guruRebalancing,
}: GuruRebalanceTableProps) {
  const t = useT();

  const guruName = (guru: GuruProfile) =>
    (t[`guru_name_${guru.id}` as keyof typeof t] as string) ?? guru.name;

  return (
    <Card title={t.guru_rebalance_title(guruName(selectedGuru))}>
      <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
        <table className="w-full text-sm min-w-125">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b">
              <th className="pb-2 font-medium">{t.guru_col_category}</th>
              <th className="pb-2 font-medium text-right">
                {t.guru_col_current}
              </th>
              <th className="pb-2 font-medium text-right">
                {t.guru_col_guru_target}
              </th>
              <th className="pb-2 font-medium text-right">
                {t.guru_col_diff}
              </th>
              <th className="pb-2 font-medium text-right">
                {t.guru_col_amount}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
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
                    className={`py-2 text-right tabular-nums font-medium ${
                      diff >= 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    {diff >= 0 ? "+" : ""}
                    {diff.toFixed(1)}%p
                  </td>
                  <td
                    className={`py-2 text-right tabular-nums ${
                      s.diffAmountKRW >= 0
                        ? "text-blue-600"
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
