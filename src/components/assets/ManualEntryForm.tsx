import { useState } from "react";
import { Button, Input, CustomSelect, Label } from "@/components/common";
import { useT } from "@/hooks";
import { fetchCurrentPrice, cn } from "@/utils";
import type {
  AssetFormData,
  AssetType,
  Market,
  CurrencyCode,
} from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";
import { DetailAssetFields } from "./DetailAssetFields";

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

  const CURRENCY_INPUT_OPTIONS: { value: CurrencyCode; label: string }[] = [
    { value: "JPY", label: t.currency_jpy },
    { value: "USD", label: t.currency_usd },
    { value: "KRW", label: t.currency_krw },
  ];

  const sym = CURRENCY_SYMBOLS[currency];

  const handleFetchPrice = async () => {
    const symbol = ticker.trim();
    if (!symbol) return;
    setIsFetchingPrice(true);
    const data = await fetchCurrentPrice(symbol).catch(() => null);
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
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-800/50 p-0.5">
          <button
            type="button"
            onClick={() => setIsSimple(false)}
            className={cn(
              "rounded-md px-4 py-1.5 text-xs font-medium transition-colors",
              !isSimple
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            {t.af_entry_mode_detail}
          </button>
          <button
            type="button"
            onClick={() => setIsSimple(true)}
            className={cn(
              "rounded-md px-4 py-1.5 text-xs font-medium transition-colors",
              isSimple
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            {t.af_entry_mode_simple}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 px-4 py-3">
        <p className="text-xs text-amber-400">{t.af_manual_hint}</p>
      </div>

      {/* 종목명 (공통) */}
      <div className="block">
        <Label>{t.af_name_label} *</Label>
        <Input
          type="text"
          required
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          placeholder={t.af_manual_name_placeholder}
        />
      </div>

      {/* 통화 (공통) */}
      <div className="block">
        <Label>{t.af_currency_label}</Label>
        <CustomSelect<CurrencyCode>
          value={currency}
          onChange={(val) => setCurrency(val)}
          options={CURRENCY_INPUT_OPTIONS}
        />
      </div>

      {isSimple ? (
        /* 간이입력 */
        <div className="block">
          <Label>
            {t.af_simple_amount_label} ({sym})
          </Label>
          <Input
            type="number"
            required
            min={0}
            step="any"
            value={simpleAmount}
            onChange={(e) =>
              setSimpleAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder={t.af_simple_amount_placeholder}
          />
        </div>
      ) : (
        /* 상세입력 */
        <DetailAssetFields
          ticker={ticker}
          setTicker={setTicker}
          assetType={assetType}
          setAssetType={setAssetType}
          market={market}
          setMarket={setMarket}
          quantity={quantity}
          setQuantity={setQuantity}
          avgBuyPrice={avgBuyPrice}
          setAvgBuyPrice={setAvgBuyPrice}
          currentPrice={currentPrice}
          setCurrentPrice={setCurrentPrice}
          isFetchingPrice={isFetchingPrice}
          handleFetchPrice={handleFetchPrice}
          sym={sym}
        />
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
