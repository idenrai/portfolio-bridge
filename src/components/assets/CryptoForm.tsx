import { useState } from "react";
import { Button } from "@/components/common";
import { useT } from "@/hooks";
import { fetchCurrentPrice } from "@/utils";
import type { AssetFormData, CurrencyCode, Market } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

const QUOTE_CURRENCIES: CurrencyCode[] = ["KRW", "JPY", "USD"];

interface CryptoPair {
  symbol: string;
  currency: CurrencyCode;
  price: number | null;
}

export function CryptoForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}) {
  const [coinQuery, setCoinQuery] = useState("");
  const [pairs, setPairs] = useState<CryptoPair[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [selectedPair, setSelectedPair] = useState<CryptoPair | null>(null);
  const [quantity, setQuantity] = useState<number | "">("");
  const [avgBuyPrice, setAvgBuyPrice] = useState<number | "">("");
  const t = useT();

  const searchPairs = async () => {
    const base = coinQuery.trim().toUpperCase();
    if (!base) return;
    setIsSearching(true);
    setSelectedPair(null);
    setPairs([]);
    setSearchedOnce(false);
    const results = await Promise.all(
      QUOTE_CURRENCIES.map(async (quote) => {
        const symbol = `${base}-${quote}`;
        const data = await fetchCurrentPrice(symbol).catch(() => null);
        if (!data || data.price === 0) return null;
        return { symbol, currency: quote, price: data.price } as CryptoPair;
      }),
    );
    const found = results.filter(Boolean) as CryptoPair[];
    setPairs(found);
    setIsSearching(false);
    setSearchedOnce(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchPairs();
    }
  };

  const marketFromCurrency = (c: CurrencyCode): Market =>
    c === "KRW" ? "KR" : c === "JPY" ? "JP" : c === "EUR" ? "EU" : "US";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPair) return;
    onSubmit({
      name: selectedPair.symbol,
      ticker: selectedPair.symbol,
      type: "crypto",
      market: marketFromCurrency(selectedPair.currency),
      currency: selectedPair.currency,
      quantity: Number(quantity) || 0,
      avgBuyPrice: Number(avgBuyPrice) || 0,
      currentPrice: selectedPair.price ?? 0,
      categories: [],
    });
  };

  const sym = selectedPair ? CURRENCY_SYMBOLS[selectedPair.currency] : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-500">{t.af_crypto_hint}</p>

      <div className="flex gap-2">
        <input
          type="text"
          value={coinQuery}
          onChange={(e) => setCoinQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="BTC, ETH, SOL..."
          autoFocus
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Button
          type="button"
          onClick={searchPairs}
          disabled={isSearching || !coinQuery.trim()}
        >
          {isSearching ? t.af_crypto_searching : t.af_crypto_search_btn}
        </Button>
      </div>

      {pairs.length > 0 && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
            <p className="text-xs text-slate-500 font-medium">
              {t.af_crypto_pair_title}
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {pairs.map((p) => (
              <button
                key={p.symbol}
                type="button"
                onClick={() => setSelectedPair(p)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  selectedPair?.symbol === p.symbol
                    ? "bg-blue-50 border-l-2 border-blue-500"
                    : "hover:bg-slate-50"
                }`}
              >
                <span className="text-sm font-semibold text-slate-800">
                  {p.symbol}
                </span>
                <div className="flex items-center gap-3">
                  {p.price !== null && (
                    <span className="text-sm text-slate-600">
                      {CURRENCY_SYMBOLS[p.currency]}
                      {p.price.toLocaleString()}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      selectedPair?.symbol === p.symbol
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {selectedPair?.symbol === p.symbol
                      ? t.af_crypto_selected
                      : t.af_crypto_select}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchedOnce && pairs.length === 0 && !isSearching && (
        <p className="text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
          {t.af_crypto_no_pairs}
        </p>
      )}

      {selectedPair && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">
                {selectedPair.symbol}
              </span>
              {selectedPair.price !== null && (
                <span className="text-sm text-green-600 font-medium">
                  {t.af_current_price_label} {sym}
                  {selectedPair.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">
                {t.af_quantity_label} *
              </span>
              <input
                type="number"
                required
                min={0}
                step="any"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="0"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">
                {t.af_avg_price_label} ({sym}) *
              </span>
              <input
                type="number"
                required
                min={0}
                step="any"
                value={avgBuyPrice}
                onChange={(e) =>
                  setAvgBuyPrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="0"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              {t.af_btn_cancel}
            </Button>
            <Button type="submit">{t.af_btn_submit}</Button>
          </div>
        </>
      )}

      {!selectedPair && (
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t.af_btn_cancel}
          </Button>
        </div>
      )}
    </form>
  );
}
