import {
  type Asset,
  type AssetCategory,
  type Market,
  type AssetType,
} from "@/types";
import { useAssetStore, useSettingsStore, useBrokerStore } from "@/stores";
import { useT } from "@/hooks";
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
        <div className="text-center py-10 text-slate-400 text-sm">
          {t.at_filter_no_result}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
          <table className="w-full text-sm min-w-225">
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
