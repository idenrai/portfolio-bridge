import { useT } from "@/hooks";
import { MultiSelect } from "./MultiSelect";
import type { Market, AssetType, AssetCategory, BrokerAccount } from "@/types";

export interface FilterBarProps {
  markets: Market[];
  types: AssetType[];
  categoryOptions: [AssetCategory, string][];
  brokers: BrokerAccount[];
  
  filterMarkets: Market[];
  filterTypes: AssetType[];
  filterCategories: AssetCategory[];
  filterBrokerIds: string[];
  
  onFilterMarkets: (v: Market[]) => void;
  onFilterTypes: (v: AssetType[]) => void;
  onFilterCategories: (v: AssetCategory[]) => void;
  onFilterBrokerIds: (v: string[]) => void;
  
  onClearFilters: () => void;
  
  sortedCount?: number;
  allCount?: number;
  showCount?: boolean;
}

export function FilterBar({
  markets,
  types,
  categoryOptions,
  brokers,
  filterMarkets,
  filterTypes,
  filterCategories,
  filterBrokerIds,
  onFilterMarkets,
  onFilterTypes,
  onFilterCategories,
  onFilterBrokerIds,
  onClearFilters,
  sortedCount = 0,
  allCount = 0,
  showCount = false,
}: FilterBarProps) {
  const t = useT();

  const hasFilter =
    filterMarkets.length > 0 ||
    filterTypes.length > 0 ||
    filterCategories.length > 0 ||
    filterBrokerIds.length > 0;

  const marketOptions = markets.map((m) => ({ label: t.market_labels[m], value: m }));
  const typeOptions = types.map((tp) => ({ label: t.asset_type_labels[tp] ?? tp, value: tp }));
  const categoryOpts = categoryOptions.map(([val, label]) => ({ label, value: val }));
  const brokerOptions = brokers.map((b) => ({ label: b.nickname || b.broker, value: b.id }));

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {/* Account (Broker) Filter */}
      {brokers.length > 0 && (
        <MultiSelect
          options={brokerOptions}
          selectedValues={filterBrokerIds}
          onChange={onFilterBrokerIds}
          placeholder={t.at_filter_all_account}
          selectAllText={t.filter_select_all}
          clearText={t.filter_clear_all}
        />
      )}

      {/* Market Filter */}
      <MultiSelect
        options={marketOptions}
        selectedValues={filterMarkets}
        onChange={(v) => onFilterMarkets(v as Market[])}
        placeholder={t.at_filter_all_market}
        selectAllText={t.filter_select_all}
        clearText={t.filter_clear_all}
      />

      {/* Type Filter */}
      <MultiSelect
        options={typeOptions}
        selectedValues={filterTypes}
        onChange={(v) => onFilterTypes(v as AssetType[])}
        placeholder={t.at_filter_all_type}
        selectAllText={t.filter_select_all}
        clearText={t.filter_clear_all}
      />

      {/* Category Filter */}
      <MultiSelect
        options={categoryOpts}
        selectedValues={filterCategories}
        onChange={(v) => onFilterCategories(v as AssetCategory[])}
        placeholder={t.at_filter_all_category}
        selectAllText={t.filter_select_all}
        clearText={t.filter_clear_all}
      />

      {/* Clear Button */}
      {hasFilter && (
        <button
          type="button"
          onClick={onClearFilters}
          className="cursor-pointer text-xs text-zinc-400 underline hover:text-zinc-200"
        >
          {t.at_filter_clear}
        </button>
      )}

      {/* Count Indicator */}
      {showCount && (
        <span className="ml-auto text-xs text-zinc-400">
          {t.at_filter_count(sortedCount, allCount)}
        </span>
      )}
    </div>
  );
}
