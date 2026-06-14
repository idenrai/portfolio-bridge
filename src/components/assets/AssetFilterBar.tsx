import { useT } from "@/hooks";
import type { Market, AssetType, AssetCategory } from "@/types";

interface AssetFilterBarProps {
  markets: Market[];
  types: AssetType[];
  categoryOptions: [AssetCategory, string][];
  filterMarket: Market | "";
  filterType: AssetType | "";
  filterCategory: AssetCategory | "";
  onFilterMarket: (v: Market | "") => void;
  onFilterType: (v: AssetType | "") => void;
  onFilterCategory: (v: AssetCategory | "") => void;
  onClearFilter: () => void;
  sortedCount: number;
  allCount: number;
}

export function AssetFilterBar({
  markets,
  types,
  categoryOptions,
  filterMarket,
  filterType,
  filterCategory,
  onFilterMarket,
  onFilterType,
  onFilterCategory,
  onClearFilter,
  sortedCount,
  allCount,
}: AssetFilterBarProps) {
  const t = useT();
  const hasFilter = filterMarket || filterType || filterCategory;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <select
        value={filterMarket}
        onChange={(e) => onFilterMarket(e.target.value as Market | "")}
        className="text-xs rounded-lg border border-zinc-800 px-2.5 py-1.5 bg-zinc-900/50 text-zinc-200 focus:border-emerald-500 focus:outline-none"
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
        className="text-xs rounded-lg border border-zinc-800 px-2.5 py-1.5 bg-zinc-900/50 text-zinc-200 focus:border-emerald-500 focus:outline-none"
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
        onChange={(e) => onFilterCategory(e.target.value as AssetCategory | "")}
        className="text-xs rounded-lg border border-zinc-800 px-2.5 py-1.5 bg-zinc-900/50 text-zinc-200 focus:border-emerald-500 focus:outline-none"
      >
        <option value="">{t.at_filter_all_category}</option>
        {categoryOptions.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>

      {hasFilter && (
        <button
          type="button"
          onClick={onClearFilter}
          className="text-xs text-zinc-400 hover:text-zinc-400 underline cursor-pointer"
        >
          {t.at_filter_clear}
        </button>
      )}

      <span className="ml-auto text-xs text-zinc-400">
        {t.at_filter_count(sortedCount, allCount)}
      </span>
    </div>
  );
}
