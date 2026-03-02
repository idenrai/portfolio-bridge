import { useState } from "react";
import { Card } from "@/components/common";
import { formatCurrency, formatPercent, fromKRW } from "@/utils";
import { useSettingsStore } from "@/pages/stores";
import { useT } from "@/hooks";
import type {
  PortfolioSummary,
  AssetCategory,
  AssetType,
  Market,
} from "@/types";

interface Props {
  summary: PortfolioSummary;
}

type SortKey = "value" | "pnl" | "return" | "weight";

export function TopHoldingsTable({ summary }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [showAll, setShowAll] = useState(false);
  const t = useT();

  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);

  const sorted = [...summary.holdings].sort((a, b) => {
    switch (sortKey) {
      case "pnl":
        return b.pnlKRW - a.pnlKRW;
      case "return":
        return b.returnPercent - a.returnPercent;
      case "weight":
        return b.weightPercent - a.weightPercent;
      default:
        return b.valueKRW - a.valueKRW;
    }
  });

  const display = showAll ? sorted : sorted.slice(0, 10);

  const thCls = "text-[11px] text-slate-500 font-medium px-3 py-2 text-right";
  const tdCls = "px-3 py-2 text-right text-sm";

  const sortBtn = (key: SortKey, label: string) => (
    <th className="p-0">
      <button
        onClick={() => setSortKey(key)}
        className={`${thCls} w-full cursor-pointer hover:text-slate-800 ${sortKey === key ? "text-blue-600 font-semibold" : ""}`}
      >
        {label}
        {sortKey === key ? " ↓" : ""}
      </button>
    </th>
  );

  return (
    <Card
      title={t.holdings_title}
      action={
        sorted.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 hover:underline cursor-pointer"
          >
            {showAll
              ? t.holdings_show_top10
              : t.holdings_show_all(sorted.length)}
          </button>
        )
      }
    >
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-[11px] text-slate-500 font-medium px-3 py-2 text-left">
                {t.holdings_col_name}
              </th>
              <th className="text-[11px] text-slate-500 font-medium px-3 py-2 text-left">
                {t.holdings_col_type}
              </th>
              {sortBtn("value", t.holdings_col_value)}
              {sortBtn("pnl", t.holdings_col_pnl)}
              {sortBtn("return", t.holdings_col_return)}
              {sortBtn("weight", t.holdings_col_weight)}
            </tr>
          </thead>
          <tbody>
            {display.map((h) => (
              <tr
                key={h.id}
                className="border-b border-slate-50 hover:bg-slate-50/50"
              >
                <td className="px-3 py-2 text-left">
                  <div className="text-sm font-medium text-slate-800 truncate max-w-[200px]">
                    {h.type === "cash"
                      ? ({
                          KRW: t.currency_krw,
                          USD: t.currency_usd,
                          JPY: t.currency_jpy,
                          EUR: t.currency_eur,
                        }[h.currency] ?? h.name)
                      : h.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {h.ticker && <span>{h.ticker}</span>}
                    {h.category && (
                      <span className="ml-1 px-1 py-0.5 bg-slate-100 rounded text-[9px]">
                        {t.category_labels[h.category as AssetCategory] ??
                          h.category}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-left text-[11px] text-slate-500">
                  <div>
                    {t.asset_type_labels[h.type as AssetType] ?? h.type}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {t.market_labels[h.market as Market] ?? h.market}
                  </div>
                </td>
                <td className={tdCls}>
                  {formatCurrency(convert(h.valueKRW), baseCurrency)}
                </td>
                <td
                  className={`${tdCls} ${h.pnlKRW >= 0 ? "text-red-600" : "text-blue-600"}`}
                >
                  {formatCurrency(convert(h.pnlKRW), baseCurrency)}
                </td>
                <td
                  className={`${tdCls} font-medium ${h.returnPercent >= 0 ? "text-red-600" : "text-blue-600"}`}
                >
                  {formatPercent(h.returnPercent)}
                </td>
                <td className={tdCls}>
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min(h.weightPercent, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-600 w-10 text-right">
                      {h.weightPercent.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
