import { useMemo } from "react";
import {
  type Asset,
  type AssetCategory,
  type Market,
  type AssetType,
  type PortfolioAsset,
} from "@/types";
import { useAssetStore, useBrokerStore } from "@/stores";
import { useT, useExchangeRates } from "@/hooks";
import {
  assetValue,
  assetPnL,
  assetReturnPercent,
  toKRW,
} from "@/utils";
import { AssetFilterBar, AssetTableRow } from "@/components/assets";

export type SortKey = "name" | "value" | "pnl" | "return";
export type SortDir = "asc" | "desc";

interface Props {
  assets: PortfolioAsset[];
  allAssets: PortfolioAsset[];
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
      className={`ml-0.5 inline-block text-[10px] ${active ? "text-blue-500" : "text-zinc-300"}`}
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
  const { data: rates } = useExchangeRates();
  const brokerAccounts = useBrokerStore((s) => s.accounts);
  const t = useT();
  const CATEGORY_OPTIONS = Object.entries(t.category_labels) as [
    AssetCategory,
    string,
  ][];

  const handleCategoryChange = (id: string, category: AssetCategory | "") => {
    updateAsset(id, { categories: category ? [category] : [] });
  };

  const handleBrokerChange = (id: string, brokerId: string) => {
    updateAsset(id, { brokerId: brokerId || undefined });
  };

  const hasBrokers = brokerAccounts.length > 0;

  const markets = [...new Set(allAssets.map((a) => a.market))] as Market[];
  const types = [...new Set(allAssets.map((a) => a.type))] as AssetType[];

  const sorted = useMemo(() => {
    return [...assets].sort((a, b) => {
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
        av = Number.isFinite(av) ? av : 0;
        bv = assetReturnPercent(b);
        bv = Number.isFinite(bv) ? bv : 0;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [assets, sortKey, sortDir, rates]);



  if (allAssets.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-400">
        <p className="text-4xl mb-3">💼</p>
        <p className="font-medium">{t.at_empty_title}</p>
        <p className="text-sm mt-1">{t.at_empty_desc}</p>
      </div>
    );
  }

  return (
    <div>
      {/* 필터 바 */}
      <AssetFilterBar
        markets={markets}
        types={types}
        categoryOptions={CATEGORY_OPTIONS}
        filterMarket={filterMarket}
        filterType={filterType}
        filterCategory={filterCategory}
        onFilterMarket={onFilterMarket}
        onFilterType={onFilterType}
        onFilterCategory={onFilterCategory}
        onClearFilter={() => {
          onFilterMarket("");
          onFilterType("");
          onFilterCategory("");
        }}
        sortedCount={sorted.length}
        allCount={allAssets.length}
      />

      {sorted.length === 0 ? (
        <div className="text-center py-10 text-zinc-400 text-sm">
          {t.at_filter_no_result}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
          <table className="w-full text-sm min-w-225">
            <thead>
              <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800 whitespace-nowrap">
                <th className="pb-2 font-medium select-none">
                  <button
                    type="button"
                    onClick={() => onSort("name")}
                    className="flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded px-1 -ml-1"
                  >
                    {t.at_col_name}
                    <SortIcon active={sortKey === "name"} dir={sortDir} />
                  </button>
                </th>
                <th className="pb-2 font-medium">{t.at_col_market}</th>
                <th className="pb-2 font-medium">{t.at_col_category}</th>
                {hasBrokers && (
                  <th className="pb-2 font-medium">{t.af_account_label}</th>
                )}
                <th className="pb-2 font-medium text-right">
                  {t.at_col_quantity}
                </th>
                <th className="pb-2 font-medium text-right">
                  {t.at_col_avg_buy_price}
                </th>
                <th className="pb-2 font-medium text-right">
                  {t.at_col_current_price}
                </th>
                <th className="pb-2 font-medium text-right select-none">
                  <button
                    type="button"
                    onClick={() => onSort("value")}
                    className="inline-flex items-center justify-end gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded px-1 -mr-1"
                  >
                    {t.at_col_value}
                    <SortIcon active={sortKey === "value"} dir={sortDir} />
                  </button>
                </th>
                <th className="pb-2 font-medium text-right select-none">
                  <button
                    type="button"
                    onClick={() => onSort("pnl")}
                    className="inline-flex items-center justify-end gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded px-1 -mr-1"
                  >
                    {t.at_col_pnl}
                    <SortIcon active={sortKey === "pnl"} dir={sortDir} />
                  </button>
                </th>
                <th className="pb-2 font-medium text-right select-none">
                  <button
                    type="button"
                    onClick={() => onSort("return")}
                    className="inline-flex items-center justify-end gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded px-1 -mr-1"
                  >
                    {t.at_col_return}
                    <SortIcon active={sortKey === "return"} dir={sortDir} />
                  </button>
                </th>
                <th className="pb-2 font-medium text-center">
                  {t.at_col_actions}
                </th>
              </tr>
            </thead>
              {sorted.map((a) => (
                <AssetTableRow
                  key={a.id}
                  asset={a}
                  categoryOptions={CATEGORY_OPTIONS}
                  brokerAccounts={brokerAccounts}
                  hasBrokers={hasBrokers}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCategoryChange={handleCategoryChange}
                  onBrokerChange={handleBrokerChange}
                />
              ))}
          </table>
        </div>
      )}
    </div>
  );
}
