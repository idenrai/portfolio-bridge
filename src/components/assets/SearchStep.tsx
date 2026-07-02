import { useEffect } from "react";
import { Button, Input } from "@/components/common";
import { useTickerSearch, useT } from "@/hooks";
import type { SelectedStock } from "./assetFormTypes";

export function SearchStep({
  onSelect,
  onManual,
  onCancel }: {
  onSelect: (item: SelectedStock) => void;
  onManual: () => void;
  onCancel: () => void;
}) {
  const {
    query,
    setQuery,
    results,
    isSearching,
    searchError,
    search,
    selected,
    selectedPrice,
    isFetchingPrice,
    selectItem } = useTickerSearch();
  const t = useT();

  useEffect(() => {
    if (!selected || isFetchingPrice) return;
    onSelect({
      name: selected.name,
      ticker: selected.ticker,
      type: selected.type,
      market: selected.market,
      currency: selected.currency,
      currentPrice: selectedPrice ?? 0 });
  }, [selected, selectedPrice, isFetchingPrice, onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      search();
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">{t.af_search_hint}</p>

      <div className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.af_search_placeholder}
          autoFocus
          
        />
        <Button
          type="button"
          onClick={search}
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? t.af_searching : t.af_search_btn}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <div className="border-b border-zinc-800 bg-zinc-900/50 px-3 py-2">
            <p className="text-xs font-medium text-zinc-500">
              {t.af_results_count(results.length)}
            </p>
          </div>
          <div className="max-h-64 divide-y divide-zinc-800/50 overflow-y-auto">
            {results.map((item) => (
              <button
                key={item.ticker}
                type="button"
                onClick={() => selectItem(item)}
                disabled={isFetchingPrice}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50 disabled:opacity-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {item.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-400">
                    {item.ticker}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="rounded bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400">
                    {t.asset_type_labels[item.type]}
                  </span>
                  <span className="rounded bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400">
                    {t.market_labels[item.market]}
                  </span>
                  <span className="rounded bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400">
                    {item.currency}
                  </span>
                  <span className="ml-1 text-xs font-semibold text-zinc-300">
                    {t.af_search_btn} →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchError && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {searchError}
        </p>
      )}
      {isFetchingPrice && (
        <p className="animate-pulse py-2 text-center text-sm text-zinc-500">
          {t.af_current_price_label} {t.af_fetching}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onManual}
          className="py-1 text-center text-xs text-zinc-400 underline transition-colors hover:text-zinc-300"
        >
          {t.af_manual_link}
        </button>
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t.af_btn_cancel}
          </Button>
        </div>
      </div>
    </div>
  );
}
