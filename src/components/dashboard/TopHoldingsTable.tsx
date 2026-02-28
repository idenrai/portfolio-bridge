import { useState } from "react";
import { Card } from "@/components/common";
import { formatCurrency, formatPercent, fromKRW } from "@/utils";
import { useSettingsStore } from "@/stores";
import { TAG_LABELS, ASSET_TYPE_LABELS, MARKET_LABELS } from "@/types";
import type { PortfolioSummary, AssetTag, AssetType, Market } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

type SortKey = "value" | "pnl" | "return" | "weight";

export function TopHoldingsTable({ summary }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [showAll, setShowAll] = useState(false);

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
      title="보유 종목"
      action={
        sorted.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 hover:underline cursor-pointer"
          >
            {showAll ? "상위 10개만" : `전체 ${sorted.length}개 보기`}
          </button>
        )
      }
    >
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-[11px] text-slate-500 font-medium px-3 py-2 text-left">
                종목
              </th>
              <th className="text-[11px] text-slate-500 font-medium px-3 py-2 text-left">
                유형
              </th>
              {sortBtn("value", "평가액")}
              {sortBtn("pnl", "손익")}
              {sortBtn("return", "수익률")}
              {sortBtn("weight", "비중")}
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
                    {h.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {h.ticker && <span>{h.ticker}</span>}
                    {h.tag && (
                      <span className="ml-1 px-1 py-0.5 bg-slate-100 rounded text-[9px]">
                        {TAG_LABELS[h.tag as AssetTag] ?? h.tag}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-left text-[11px] text-slate-500">
                  <div>{ASSET_TYPE_LABELS[h.type as AssetType] ?? h.type}</div>
                  <div className="text-[10px] text-slate-400">
                    {MARKET_LABELS[h.market as Market] ?? h.market}
                  </div>
                </td>
                <td className={tdCls}>
                  {formatCurrency(convert(h.valueKRW), baseCurrency, true)}
                </td>
                <td
                  className={`${tdCls} ${h.pnlKRW >= 0 ? "text-red-600" : "text-blue-600"}`}
                >
                  {formatCurrency(convert(h.pnlKRW), baseCurrency, true)}
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
