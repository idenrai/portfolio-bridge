import { Button } from "@/components/common";
import {
  type Asset,
  type AssetCategory,
  type Market,
  type AssetType,
  CURRENCY_SYMBOLS,
} from "@/types";
import { useAssetStore, useSettingsStore } from "@/pages/stores";
import { useT } from "@/hooks";
import {
  assetValue,
  assetPnL,
  assetReturnPercent,
  formatPercent,
  toKRW,
} from "@/utils";

export type SortKey = "name" | "value" | "pnl" | "return";
export type SortDir = "asc" | "desc";

interface Props {
  assets: Asset[];
  allAssets: Asset[];
  filterMarket: Market | "";
  filterType: AssetType | "";
  filterCategory: AssetCategory | "";
  onFilterMarket: (v: Market | "") => void;
  onFilterType: (v: AssetType | "") => void;
  onFilterCategory: (v: AssetCategory | "") => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className={`ml-0.5 inline-block text-[10px] ${active ? "text-blue-500" : "text-slate-300"}`}
    >
      {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );
}

export function AssetTable({
  assets,
  allAssets,
  filterMarket,
  filterType,
  filterCategory,
  onFilterMarket,
  onFilterType,
  onFilterCategory,
  sortKey,
  sortDir,
  onSort,
  onEdit,
  onDelete,
}: Props) {
  const updateAsset = useAssetStore((s) => s.updateAsset);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const t = useT();
  const CATEGORY_OPTIONS = Object.entries(t.category_labels) as [
    AssetCategory,
    string,
  ][];

  const handleCategoryChange = (id: string, category: AssetCategory | "") => {
    updateAsset(id, { categories: category ? [category] : [] });
  };

  const markets = [...new Set(allAssets.map((a) => a.market))] as Market[];
  const types = [...new Set(allAssets.map((a) => a.type))] as AssetType[];

  const sorted = [...assets].sort((a, b) => {
    if (sortKey === "name") {
      return sortDir === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    let av = 0,
      bv = 0;
    if (sortKey === "value") {
      av = toKRW(assetValue(a), a.currency, rates);
      bv = toKRW(assetValue(b), b.currency, rates);
    } else if (sortKey === "pnl") {
      av = toKRW(assetPnL(a), a.currency, rates);
      bv = toKRW(assetPnL(b), b.currency, rates);
    } else if (sortKey === "return") {
      av = assetReturnPercent(a);
      bv = assetReturnPercent(b);
    }
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const hasFilter = filterMarket || filterType || filterCategory;

  if (allAssets.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">💼</p>
        <p className="font-medium">{t.at_empty_title}</p>
        <p className="text-sm mt-1">{t.at_empty_desc}</p>
      </div>
    );
  }

  return (
    <div>
      {/* 필터 바 */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          value={filterMarket}
          onChange={(e) => onFilterMarket(e.target.value as Market | "")}
          className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white text-slate-600 focus:border-blue-400 focus:outline-none"
        >
          <option value="">{t.at_filter_all_market}</option>
          {markets.map((m) => (
            <option key={m} value={m}>
              {t.market_labels[m]}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => onFilterType(e.target.value as AssetType | "")}
          className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white text-slate-600 focus:border-blue-400 focus:outline-none"
        >
          <option value="">{t.at_filter_all_type}</option>
          {types.map((tp) => (
            <option key={tp} value={tp}>
              {t.asset_type_labels[tp] ?? tp}
            </option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) =>
            onFilterCategory(e.target.value as AssetCategory | "")
          }
          className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white text-slate-600 focus:border-blue-400 focus:outline-none"
        >
          <option value="">{t.at_filter_all_category}</option>
          {CATEGORY_OPTIONS.map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              onFilterMarket("");
              onFilterType("");
              onFilterCategory("");
            }}
            className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
          >
            {t.at_filter_clear}
          </button>
        )}

        <span className="ml-auto text-xs text-slate-400">
          {t.at_filter_count(sorted.length, allAssets.length)}
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          {t.at_filter_no_result}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                <th
                  className="pb-2 font-medium cursor-pointer select-none"
                  onClick={() => onSort("name")}
                >
                  {t.at_col_name}
                  <SortIcon active={sortKey === "name"} dir={sortDir} />
                </th>
                <th className="pb-2 font-medium">{t.at_col_market}</th>
                <th className="pb-2 font-medium">{t.at_col_category}</th>
                <th className="pb-2 font-medium text-right">
                  {t.at_col_quantity}
                </th>
                <th className="pb-2 font-medium text-right">
                  {t.at_col_current_price}
                </th>
                <th
                  className="pb-2 font-medium text-right cursor-pointer select-none"
                  onClick={() => onSort("value")}
                >
                  {t.at_col_value}
                  <SortIcon active={sortKey === "value"} dir={sortDir} />
                </th>
                <th
                  className="pb-2 font-medium text-right cursor-pointer select-none"
                  onClick={() => onSort("pnl")}
                >
                  {t.at_col_pnl}
                  <SortIcon active={sortKey === "pnl"} dir={sortDir} />
                </th>
                <th
                  className="pb-2 font-medium text-right cursor-pointer select-none"
                  onClick={() => onSort("return")}
                >
                  {t.at_col_return}
                  <SortIcon active={sortKey === "return"} dir={sortDir} />
                </th>
                <th className="pb-2 font-medium text-center">
                  {t.at_col_actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((a) => {
                const val = assetValue(a);
                const pnl = assetPnL(a);
                const ret = assetReturnPercent(a);
                const sym = CURRENCY_SYMBOLS[a.currency];
                const pnlColor = pnl >= 0 ? "text-red-600" : "text-blue-600";

                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-2.5 max-w-[260px]">
                      <p className="font-medium text-slate-800 break-words whitespace-normal leading-snug">
                        {a.name}
                      </p>
                      {a.ticker && (
                        <p className="text-xs text-slate-400">{a.ticker}</p>
                      )}
                    </td>
                    <td className="py-2.5 whitespace-nowrap">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {t.market_labels[a.market]}
                      </span>
                    </td>
                    <td className="py-2.5 whitespace-nowrap">
                      <select
                        value={a.categories[0] ?? ""}
                        onChange={(e) =>
                          handleCategoryChange(
                            a.id,
                            e.target.value as AssetCategory | "",
                          )
                        }
                        className="text-xs rounded border border-slate-200 px-1.5 py-1 bg-white text-slate-700 focus:border-blue-400 focus:outline-none min-w-22.5"
                      >
                        <option value="">{t.at_unclassified}</option>
                        {CATEGORY_OPTIONS.map(([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      {a.quantity.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      {sym}
                      {a.currentPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-medium">
                      {sym}
                      {val.toLocaleString()}
                    </td>
                    <td
                      className={`py-2.5 text-right tabular-nums ${pnlColor}`}
                    >
                      {sym}
                      {pnl.toLocaleString()}
                    </td>
                    <td
                      className={`py-2.5 text-right tabular-nums font-medium ${pnlColor}`}
                    >
                      {formatPercent(ret)}
                    </td>
                    <td className="py-2.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(a)}
                        >
                          {t.at_btn_edit}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(a.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          {t.at_btn_delete}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
