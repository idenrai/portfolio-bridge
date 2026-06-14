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
      <p className="text-sm text-slate-500">{t.af_search_hint}</p>

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
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
            <p className="text-xs text-slate-500 font-medium">
              {t.af_results_count(results.length)}
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {results.map((item) => (
              <button
                key={item.ticker}
                type="button"
                onClick={() => selectItem(item)}
                disabled={isFetchingPrice}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {item.ticker}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {t.asset_type_labels[item.type]}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {t.market_labels[item.market]}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {item.currency}
                  </span>
                  <span className="text-xs text-blue-600 font-semibold ml-1">
                    {t.af_search_btn} →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {searchError}
        </p>
      )}
      {isFetchingPrice && (
        <p className="text-sm text-slate-500 text-center animate-pulse py-2">
          {t.af_current_price_label} {t.af_fetching}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onManual}
          className="text-xs text-slate-400 hover:text-blue-600 underline text-center py-1 transition-colors"
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
