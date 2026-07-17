import { useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Briefcase, SearchX } from "lucide-react";
import {
  type Asset,
  type AssetCategory,
  type PortfolioAsset,
} from "@/types";
import { useAssetStore, useBrokerStore } from "@/stores";
import { useT, useExchangeRates } from "@/hooks";
import {
  assetValue,
  assetPnL,
  assetReturnPercent,
  toKRW,
  cn,
} from "@/utils";
import { AssetTableRow } from "@/components/assets";

export type SortKey = "name" | "value" | "pnl" | "return";
export type SortDir = "asc" | "desc";

interface Props {
  assets: PortfolioAsset[];
  allAssets: PortfolioAsset[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className={cn(
        "ml-0.5 inline-block text-[10px]",
        active ? "text-blue-500" : "text-zinc-300"
      )}
    >
      {active ? (dir === "asc" ? <ChevronUp aria-hidden="true" className="inline size-3" /> : <ChevronDown aria-hidden="true" className="inline size-3" />) : <ChevronsUpDown aria-hidden="true" className="inline size-3 text-zinc-600" />}
    </span>
  );
}

export function AssetTable({
  assets,
  allAssets,
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
      <div className="py-16 text-center text-zinc-400">
        <Briefcase aria-hidden="true" className="mx-auto mb-3 size-12 text-zinc-600" />
        <p className="font-medium">{t.at_empty_title}</p>
        <p className="mt-1 text-sm">{t.at_empty_desc}</p>
      </div>
    );
  }

  return (
    <div>
      {sorted.length === 0 ? (
        <div className="py-10 text-center text-zinc-400">
          <SearchX aria-hidden="true" className="mx-auto mb-3 size-8 opacity-50" />
          <p className="text-sm">{t.at_filter_no_result}</p>
        </div>
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 md:-mx-5 md:px-5 mt-2">
          <table className="w-full min-w-225 text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs whitespace-nowrap text-zinc-500">
                <th className="pb-2 font-medium select-none">
                  <button
                    type="button"
                    onClick={() => onSort("name")}
                    className="-ml-1 flex items-center gap-1 rounded px-1 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
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
                <th className="pb-2 text-right font-medium">
                  {t.at_col_quantity}
                </th>
                <th className="pb-2 text-right font-medium">
                  {t.at_col_avg_buy_price}
                </th>
                <th className="pb-2 text-right font-medium">
                  {t.at_col_current_price}
                </th>
                <th className="pb-2 text-right font-medium select-none">
                  <button
                    type="button"
                    onClick={() => onSort("value")}
                    className="-mr-1 inline-flex items-center justify-end gap-1 rounded px-1 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
                  >
                    {t.at_col_value}
                    <SortIcon active={sortKey === "value"} dir={sortDir} />
                  </button>
                </th>
                <th className="pb-2 text-right font-medium select-none">
                  <button
                    type="button"
                    onClick={() => onSort("pnl")}
                    className="-mr-1 inline-flex items-center justify-end gap-1 rounded px-1 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
                  >
                    {t.at_col_pnl}
                    <SortIcon active={sortKey === "pnl"} dir={sortDir} />
                  </button>
                </th>
                <th className="pb-2 text-right font-medium select-none">
                  <button
                    type="button"
                    onClick={() => onSort("return")}
                    className="-mr-1 inline-flex items-center justify-end gap-1 rounded px-1 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
                  >
                    {t.at_col_return}
                    <SortIcon active={sortKey === "return"} dir={sortDir} />
                  </button>
                </th>
                <th className="pb-2 text-center font-medium">
                  {t.at_col_actions}
                </th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
