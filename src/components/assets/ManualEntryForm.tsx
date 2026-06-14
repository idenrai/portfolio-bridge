import { useState } from "react";
import { Button } from "@/components/common";
import { useT } from "@/hooks";
import { fetchCurrentPrice } from "@/utils";
import type {
  AssetFormData,
  AssetType,
  Market,
  CurrencyCode,
} from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

export function ManualEntryForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: AssetFormData) => void;
  onBack: () => void;
}) {
  const [isSimple, setIsSimple] = useState(false);

  // 공통 필드
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("JPY");

  // 간이입력 전용
  const [simpleAmount, setSimpleAmount] = useState<number | "">("");

  // 상세입력 전용
  const [ticker, setTicker] = useState("");
  const [assetType, setAssetType] = useState<AssetType>("fund");
  const [market, setMarket] = useState<Market>("JP");
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
    if (isSimple) {
      const amount = Number(simpleAmount) || 0;
      onSubmit({
        name: name.trim(),
        type: "other",
        market: "OTHER",
        currency,
        quantity: 1,
        avgBuyPrice: amount,
        currentPrice: amount,
        categories: [],
      });
    } else {
      onSubmit({
        name: name.trim(),
        ticker: ticker.trim() || undefined,
        type: assetType,
        market,
        currency,
        quantity: Number(quantity) || 0,
        avgBuyPrice: Number(avgBuyPrice) || 0,
        currentPrice: Number(currentPrice) || 0,
        categories: [],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 모드 토글 */}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => setIsSimple(false)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              !isSimple
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.af_entry_mode_detail}
          </button>
          <button
            type="button"
            onClick={() => setIsSimple(true)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isSimple
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.af_entry_mode_simple}
          </button>
        </div>
      </div>

      <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg px-4 py-3">
        <p className="text-xs text-amber-400">{t.af_manual_hint}</p>
      </div>

      {/* 종목명 (공통) */}
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
          placeholder={t.af_manual_name_placeholder}
          className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
        />
      </label>

      {/* 통화 (공통) */}
      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          {t.af_currency_label}
        </span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
        >
          {CURRENCY_INPUT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      {isSimple ? (
        /* 간이입력 */
        <label className="block">
          <span className="text-xs font-medium text-slate-600">
            {t.af_simple_amount_label} ({sym})
          </span>
          <input
            type="number"
            required
            min={0}
            step="any"
            value={simpleAmount}
            onChange={(e) =>
              setSimpleAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder={t.af_simple_amount_placeholder}
            className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
          />
        </label>
      ) : (
        /* 상세입력 */
        <>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">
              {t.af_ticker_label}
            </span>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder={t.af_manual_ticker_placeholder}
                className="flex-1 rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
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

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">
                {t.af_asset_type_label}
              </span>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
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
                className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              >
                {MARKET_OPTIONS.map((o) => (
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
                className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">
                {t.af_avg_price_label} ({sym})
              </span>
              <input
                type="number"
                min={0}
                step="any"
                value={avgBuyPrice}
                onChange={(e) =>
                  setAvgBuyPrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="0"
                className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
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
                className="mt-1 block w-full rounded-lg border border-slate-800 bg-slate-900/50 text-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              />
            </label>
          </div>
        </>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          {t.af_back_to_search}
        </Button>
        <Button type="submit">{t.af_btn_submit}</Button>
      </div>
    </form>
  );
}
