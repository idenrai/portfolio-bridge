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
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <select
        aria-label={t.at_filter_all_market}
        value={filterMarket}
        onChange={(e) => onFilterMarket(e.target.value as Market | "")}
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-xs text-zinc-200 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500/50 focus-visible:outline-none"
      >
        <option value="">{t.at_filter_all_market}</option>
        {markets.map((m) => (
          <option key={m} value={m}>
            {t.market_labels[m]}
          </option>
        ))}
      </select>

      <select
        aria-label={t.at_filter_all_type}
        value={filterType}
        onChange={(e) => onFilterType(e.target.value as AssetType | "")}
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-xs text-zinc-200 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500/50 focus-visible:outline-none"
      >
        <option value="">{t.at_filter_all_type}</option>
        {types.map((tp) => (
          <option key={tp} value={tp}>
            {t.asset_type_labels[tp] ?? tp}
          </option>
        ))}
      </select>

      <select
        aria-label={t.at_filter_all_category}
        value={filterCategory}
        onChange={(e) => onFilterCategory(e.target.value as AssetCategory | "")}
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-xs text-zinc-200 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500/50 focus-visible:outline-none"
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
          className="cursor-pointer text-xs text-zinc-400 underline hover:text-zinc-400"
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
