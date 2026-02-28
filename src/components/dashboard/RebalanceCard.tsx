import { Card } from "@/components/common";
import { formatCurrency, fromKRW } from "@/utils";
import { useSettingsStore } from "@/stores";
import { useT } from "@/hooks";
import type { RebalanceSuggestion, AssetTag } from "@/types";

interface Props {
  rebalancing: RebalanceSuggestion[];
}

export function RebalanceCard({ rebalancing }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);
  const t = useT();

  // diff가 유의미한 것만 (±1% 이상)
  const significant = rebalancing.filter(
    (r) => Math.abs(r.targetPercent - r.currentPercent) > 1,
  );

  if (significant.length === 0) {
    return (
      <Card title={t.rebalance_title}>
        <div className="text-sm text-slate-400 py-4 text-center">
          {t.rebalance_ok}
        </div>
      </Card>
    );
  }

  return (
    <Card title={t.rebalance_title}>
      <div className="space-y-2">
        {significant
          .sort((a, b) => Math.abs(b.diffAmountKRW) - Math.abs(a.diffAmountKRW))
          .map((r) => {
            const isBuy = r.diffAmountKRW > 0;
            const label = t.tag_labels[r.tag as AssetTag] ?? r.tag;
            return (
              <div
                key={r.tag}
                className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0"
              >
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    {label}
                  </span>
                  <span className="ml-2 text-[11px] text-slate-400">
                    {r.currentPercent.toFixed(1)}% → {r.targetPercent}%
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    isBuy ? "text-red-600" : "text-blue-600"
                  }`}
                >
                {isBuy ? t.rebalance_buy + " " : t.rebalance_sell + " "}
                  {formatCurrency(
                    Math.abs(convert(r.diffAmountKRW)),
                    baseCurrency,
                    true,
                  )}
                </span>
              </div>
            );
          })}
      </div>
    </Card>
  );
}
