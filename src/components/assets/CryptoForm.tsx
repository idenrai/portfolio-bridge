import { useState } from "react";
import { Button, Input, Label } from "@/components/common";
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
  onCancel }: {
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
      categories: [] });
  };

  const sym = selectedPair ? CURRENCY_SYMBOLS[selectedPair.currency] : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-zinc-500">{t.af_crypto_hint}</p>

      <div className="flex gap-2">
        <Input
          type="text"
          value={coinQuery}
          onChange={(e) => setCoinQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="BTC, ETH, SOL..."
          autoFocus
          
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
        <div >
          <div className="border-b border-zinc-800 bg-zinc-900/50 px-3 py-2">
            <p className="text-xs font-medium text-zinc-400">
              {t.af_crypto_pair_title}
            </p>
          </div>
          <div className="divide-y divide-zinc-800">
            {pairs.map((p) => (
              <button
                key={p.symbol}
                type="button"
                onClick={() => setSelectedPair(p)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                  selectedPair?.symbol === p.symbol
                    ? "border-l-2 border-emerald-500 bg-emerald-950/30"
                    : "hover:bg-zinc-900/50"
                }`}
              >
                <span className="text-sm font-bold text-white">
                  {p.symbol}
                </span>
                <div className="flex items-center gap-3">
                  {p.price !== null && (
                    <span className="text-sm text-zinc-400">
                      {CURRENCY_SYMBOLS[p.currency]}
                      {p.price.toLocaleString()}
                    </span>
                  )}
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      selectedPair?.symbol === p.symbol
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 text-zinc-300"
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
        <p className="rounded-lg bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400">
          {t.af_crypto_no_pairs}
        </p>
      )}

      {selectedPair && (
        <>
          <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                {selectedPair.symbol}
              </span>
              {selectedPair.price !== null && (
                <span className="text-sm font-medium text-green-600">
                  {t.af_current_price_label} {sym}
                  {selectedPair.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="block">
              <Label>
                {t.af_quantity_label} *
              </Label>
              <Input
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
                
              />
            </div>
            <div className="block">
              <Label>
                {t.af_avg_price_label} ({sym}) *
              </Label>
              <Input
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
                
              />
            </div>
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
