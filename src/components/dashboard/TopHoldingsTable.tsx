import { useState } from "react";
import { Card } from "@/components/common";
import { formatCurrency, formatPercent, fromKRW } from "@/utils";
import { useSettingsStore } from "@/stores";
import { useT, useExchangeRates } from "@/hooks";
import type {
  PortfolioSummary,
  AssetCategory,
  AssetType,
  Market,
  CurrencyCode,
} from "@/types";

interface Props {
  summary: PortfolioSummary;
}

type SortKey = "value" | "pnl" | "return" | "weight";

export function TopHoldingsTable({ summary }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();
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

  const thCls = "text-[11px] text-zinc-400 font-bold px-3 py-2 text-right";
  const tdCls = "px-3 py-2 text-right text-sm tabular-nums";

  const sortBtn = (key: SortKey, label: string) => (
    <th className="p-0">
      <button
        onClick={() => setSortKey(key)}
        className={`${thCls} w-full cursor-pointer hover:text-white ${sortKey === key ? "font-bold text-white" : ""}`}
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
            className="cursor-pointer text-xs text-zinc-400 transition-colors hover:text-zinc-100"
          >
            {showAll
              ? t.holdings_show_top10
              : t.holdings_show_all(sorted.length)}
          </button>
        )
      }
    >
      <div className="-mx-4 overflow-x-auto px-4 md:-mx-5 md:px-5">
        <table className="w-full min-w-160">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-3 py-2 text-left text-[11px] font-bold text-zinc-400">
                {t.holdings_col_name}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-bold text-zinc-400">
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
                className="border-b border-zinc-900 hover:bg-zinc-900"
              >
                <td className="px-3 py-2 text-left">
                  <div className="max-w-72 text-sm font-bold wrap-break-word text-white">
                    {h.type === "cash"
                      ? ({
                          KRW: t.currency_krw,
                          USD: t.currency_usd,
                          JPY: t.currency_jpy,
                          EUR: t.currency_eur,
                        }[h.currency as CurrencyCode] ?? h.name)
                      : h.name}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {h.ticker && <span>{h.ticker}</span>}
                    {h.category && (
                      <span className="ml-1 rounded bg-zinc-800/80 px-1 py-0.5 text-[9px] text-zinc-300">
                        {t.category_labels[h.category as AssetCategory] ??
                          h.category}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-left text-[11px] whitespace-nowrap text-zinc-400">
                  <div>
                    {t.asset_type_labels[h.type as AssetType] ?? h.type}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {t.market_labels[h.market as Market] ?? h.market}
                  </div>
                </td>
                <td className={tdCls}>
                  {formatCurrency(convert(h.valueKRW), baseCurrency)}
                </td>
                <td
                  className={`${tdCls} ${h.type === "cash" ? "text-zinc-500" : h.pnlKRW >= 0 ? "text-red-500" : "text-blue-500"}`}
                >
                  {h.type === "cash"
                    ? "-"
                    : formatCurrency(convert(h.pnlKRW), baseCurrency)}
                </td>
                <td
                  className={`${tdCls} font-bold ${h.type === "cash" ? "text-zinc-500" : h.returnPercent >= 0 ? "text-red-500" : "text-blue-500"}`}
                >
                  {h.type === "cash" ? "-" : formatPercent(h.returnPercent)}
                </td>
                <td className={tdCls}>
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="h-1.5 w-12 overflow-hidden rounded-none border border-zinc-700 bg-zinc-800">
                      <div
                        className="h-full rounded-none bg-zinc-300"
                        style={{
                          width: `${Math.min(h.weightPercent, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-[11px] text-zinc-500">
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
