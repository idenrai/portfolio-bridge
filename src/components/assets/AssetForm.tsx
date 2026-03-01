import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/common";
import { useTickerSearch, useT } from "@/hooks";
import { fetchCurrentPrice } from "@/utils";
import type {
  AssetFormData,
  Asset,
  AssetType,
  Market,
  CurrencyCode,
} from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

interface Props {
  initial?: Asset;
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}

type FormMode = "stock" | "cash" | "crypto";

interface SelectedStock {
  name: string;
  ticker: string;
  type: AssetType;
  market: Market;
  currency: CurrencyCode;
  currentPrice: number;
}

// ─── 수정 모드 ────────────────────────────────────────────────────────────────

function EditForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: Asset;
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}) {
  const [quantity, setQuantity] = useState(initial.quantity);
  const [avgBuyPrice, setAvgBuyPrice] = useState(initial.avgBuyPrice);
  const sym = CURRENCY_SYMBOLS[initial.currency];
  const t = useT();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: initial.name,
      ticker: initial.ticker,
      type: initial.type,
      market: initial.market,
      currency: initial.currency,
      quantity,
      avgBuyPrice,
      currentPrice: initial.currentPrice,
      tags: initial.tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-slate-50 rounded-lg px-4 py-3 flex flex-wrap gap-x-6 gap-y-1">
        <span className="text-sm font-semibold text-slate-800">
          {initial.name}
        </span>
        {initial.ticker && (
          <span className="text-sm text-slate-500 font-mono">
            {initial.ticker}
          </span>
        )}
        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded self-center">
          {t.asset_type_labels[initial.type]}
        </span>
        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded self-center">
          {t.market_labels[initial.market]}
        </span>
        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded self-center">
          {initial.currency}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-slate-600">
            {t.af_quantity_label}
          </span>
          <input
            type="number"
            required
            min={0}
            step="any"
            value={quantity || ""}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-600">
            {t.af_avg_price_label} ({sym})
          </span>
          <input
            type="number"
            required
            min={0}
            step="any"
            value={avgBuyPrice || ""}
            onChange={(e) => setAvgBuyPrice(Number(e.target.value))}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          {t.af_current_price_label} ({sym})
        </span>
        <input
          type="number"
          value={initial.currentPrice}
          readOnly
          className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
        />
      </label>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t.af_btn_cancel}
        </Button>
        <Button type="submit">{t.af_btn_submit}</Button>
      </div>
    </form>
  );
}

// ─── 자산 유형 선택 탭 ────────────────────────────────────────────────────────

function ModeSelector({
  mode,
  onChange,
}: {
  mode: FormMode;
  onChange: (m: FormMode) => void;
}) {
  const t = useT();
  const tabs: { key: FormMode; label: string }[] = [
    { key: "stock", label: t.af_mode_stock },
    { key: "cash", label: t.af_mode_cash },
    { key: "crypto", label: t.af_mode_crypto },
  ];
  return (
    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mode === t.key
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── 현금 등록 폼 ─────────────────────────────────────────────────────────────

function CashForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}) {
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [open, setOpen] = useState(false);
  const t = useT();

  const CURRENCY_OPTIONS: { code: CurrencyCode; label: string }[] = [
    { code: "KRW", label: t.currency_krw },
    { code: "JPY", label: t.currency_jpy },
    { code: "USD", label: t.currency_usd },
  ];

  const filtered = useMemo(
    () =>
      CURRENCY_OPTIONS.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const selected = CURRENCY_OPTIONS.find((c) => c.code === currency);

  const marketFromCurrency = (c: CurrencyCode): Market =>
    c === "KRW" ? "KR" : c === "JPY" ? "JP" : "US";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currency || !selected) return;
    onSubmit({
      name: `${selected.label}`,
      type: "cash",
      market: marketFromCurrency(currency),
      currency,
      quantity: Number(amount) || 0,
      avgBuyPrice: 1,
      currentPrice: 1,
      tags: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <span className="text-xs font-medium text-slate-600">
          {t.af_currency_label}
        </span>
        <div className="relative mt-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-left flex justify-between items-center bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <span className={currency ? "text-slate-800" : "text-slate-400"}>
              {selected ? selected.label : t.af_currency_placeholder}
            </span>
            <span className="text-slate-400 text-xs">▼</span>
          </button>
          {open && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg">
              <div className="p-2 border-b border-slate-100">
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="KRW, JPY, USD..."
                  className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-slate-700"
                  >
                    {c.label}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-3">
                    {t.af_currency_no_result}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          {t.af_cash_amount_label}
          {currency ? ` (${CURRENCY_SYMBOLS[currency]})` : ""} *
        </span>
        <input
          type="number"
          required
          min={0}
          step="any"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="0"
          disabled={!currency}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
        />
      </label>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t.af_btn_cancel}
        </Button>
        <Button type="submit" disabled={!currency}>
          {t.af_btn_submit}
        </Button>
      </div>
    </form>
  );
}

// ─── 코인 등록 폼 ─────────────────────────────────────────────────────────────

const QUOTE_CURRENCIES: CurrencyCode[] = ["KRW", "JPY", "USD"];

interface CryptoPair {
  symbol: string;
  currency: CurrencyCode;
  price: number | null;
}

function CryptoForm({
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
    c === "KRW" ? "KR" : c === "JPY" ? "JP" : "US";

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
      tags: [],
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

// ─── 직접 입력 폼 (Yahoo 검색 불가 시 폴백) ──────────────────────────────────

function ManualEntryForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: AssetFormData) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [assetType, setAssetType] = useState<AssetType>("fund");
  const [market, setMarket] = useState<Market>("JP");
  const [currency, setCurrency] = useState<CurrencyCode>("JPY");
  const [quantity, setQuantity] = useState<number | "">("");
  const [avgBuyPrice, setAvgBuyPrice] = useState<number | "">("");
  const [currentPrice, setCurrentPrice] = useState<number | "">("");
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  const t = useT();
  const ASSET_TYPE_OPTIONS: { value: AssetType; label: string }[] = [
    { value: "stock", label: t.atype_stock },
    { value: "etf", label: t.atype_etf },
    { value: "fund", label: t.atype_fund },
    { value: "bond", label: t.atype_bond },
    { value: "other", label: t.atype_other },
  ];
  const MARKET_OPTIONS: { value: Market; label: string }[] = [
    { value: "JP", label: t.market_jp },
    { value: "US", label: t.market_us },
    { value: "KR", label: t.market_kr },
    { value: "OTHER", label: t.market_other },
  ];
  const CURRENCY_INPUT_OPTIONS: { value: CurrencyCode; label: string }[] = [
    { value: "JPY", label: t.currency_jpy },
    { value: "USD", label: t.currency_usd },
    { value: "KRW", label: t.currency_krw },
  ];

  const sym = CURRENCY_SYMBOLS[currency];

  const handleFetchPrice = async () => {
    const sym = ticker.trim();
    if (!sym) return;
    setIsFetchingPrice(true);
    const data = await fetchCurrentPrice(sym).catch(() => null);
    if (data && data.price > 0) setCurrentPrice(data.price);
    setIsFetchingPrice(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      ticker: ticker.trim() || undefined,
      type: assetType,
      market,
      currency,
      quantity: Number(quantity) || 0,
      avgBuyPrice: Number(avgBuyPrice) || 0,
      currentPrice: Number(currentPrice) || 0,
      tags: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <p className="text-xs text-amber-700">{t.af_manual_hint}</p>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          {t.af_name_label} *
        </span>
        <input
          type="text"
          required
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          placeholder="楽天・プラス・Ｓ＆Ｐ５００インデックス・ファンド"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          {t.af_ticker_label}
        </span>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="0P0001D75H.T 또는 JP90C000KRC0"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleFetchPrice}
            disabled={!ticker.trim() || isFetchingPrice}
          >
            {isFetchingPrice ? t.af_fetching : t.af_fetch_price_btn}
          </Button>
        </div>
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-slate-600">
            {t.af_asset_type_label}
          </span>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value as AssetType)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {ASSET_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-600">
            {t.af_market_label}
          </span>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value as Market)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {MARKET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-600">
            {t.af_currency_label}
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {CURRENCY_INPUT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
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
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
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
        <label className="block">
          <span className="text-xs font-medium text-slate-600">
            {t.af_current_price_label} ({sym})
          </span>
          <input
            type="number"
            min={0}
            step="any"
            value={currentPrice}
            onChange={(e) =>
              setCurrentPrice(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            placeholder={t.af_current_price_placeholder}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          {t.af_back_to_search}
        </Button>
        <Button type="submit">{t.af_btn_submit}</Button>
      </div>
    </form>
  );
}

// ─── 등록 모드 — Step 1: 티커 검색 (주식·ETF·채권) ──────────────────────────

function SearchStep({
  onSelect,
  onManual,
  onCancel,
}: {
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
    selectItem,
  } = useTickerSearch();
  const t = useT();

  useEffect(() => {
    if (!selected || isFetchingPrice) return;
    onSelect({
      name: selected.name,
      ticker: selected.ticker,
      type: selected.type,
      market: selected.market,
      currency: selected.currency,
      currentPrice: selectedPrice ?? 0,
    });
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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.af_search_placeholder}
          autoFocus
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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

// ─── 등록 모드 — Step 2: 수량 / 매입단가 입력 ────────────────────────────────

function ConfirmStep({
  item,
  onSubmit,
  onBack,
}: {
  item: SelectedStock;
  onSubmit: (data: AssetFormData) => void;
  onBack: () => void;
}) {
  const [quantity, setQuantity] = useState<number | "">("");
  const [avgBuyPrice, setAvgBuyPrice] = useState<number | "">("");
  const sym = CURRENCY_SYMBOLS[item.currency];
  const t = useT();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: item.name,
      ticker: item.ticker || undefined,
      type: item.type,
      market: item.market,
      currency: item.currency,
      quantity: Number(quantity) || 0,
      avgBuyPrice: Number(avgBuyPrice) || 0,
      currentPrice: item.currentPrice,
      tags: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-sm font-semibold text-slate-800">
            {item.name}
          </span>
          {item.ticker && (
            <span className="text-sm text-slate-500 font-mono">
              {item.ticker}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded border">
            {t.asset_type_labels[item.type]}
          </span>
          <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded border">
            {t.market_labels[item.market]}
          </span>
          <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded border">
            {item.currency}
          </span>
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
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="0"
            autoFocus
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

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          {t.af_current_price_label} ({sym})
          {item.currentPrice > 0 && (
            <span className="ml-2 text-green-600 font-normal text-xs">
              {t.af_current_price_auto}
            </span>
          )}
        </span>
        <input
          type="number"
          value={item.currentPrice}
          readOnly
          className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
        />
      </label>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          {t.af_re_search}
        </Button>
        <Button type="submit">{t.af_btn_submit}</Button>
      </div>
    </form>
  );
}

// ─── 최상위 AssetForm ─────────────────────────────────────────────────────────

export function AssetForm({ initial, onSubmit, onCancel }: Props) {
  const [mode, setMode] = useState<FormMode>("stock");
  const [stockStep, setStockStep] = useState<"search" | "confirm" | "manual">(
    "search",
  );
  const [selectedStock, setSelectedStock] = useState<SelectedStock | null>(
    null,
  );

  if (initial) {
    return (
      <EditForm initial={initial} onSubmit={onSubmit} onCancel={onCancel} />
    );
  }

  return (
    <div className="space-y-5">
      <ModeSelector
        mode={mode}
        onChange={(m) => {
          setMode(m);
          setStockStep("search");
          setSelectedStock(null);
        }}
      />

      {mode === "cash" && <CashForm onSubmit={onSubmit} onCancel={onCancel} />}

      {mode === "crypto" && (
        <CryptoForm onSubmit={onSubmit} onCancel={onCancel} />
      )}

      {mode === "stock" && stockStep === "search" && (
        <SearchStep
          onSelect={(item) => {
            setSelectedStock(item);
            setStockStep("confirm");
          }}
          onManual={() => setStockStep("manual")}
          onCancel={onCancel}
        />
      )}

      {mode === "stock" && stockStep === "manual" && (
        <ManualEntryForm
          onSubmit={onSubmit}
          onBack={() => setStockStep("search")}
        />
      )}

      {mode === "stock" && stockStep === "confirm" && selectedStock && (
        <ConfirmStep
          item={selectedStock}
          onSubmit={onSubmit}
          onBack={() => setStockStep("search")}
        />
      )}
    </div>
  );
}
