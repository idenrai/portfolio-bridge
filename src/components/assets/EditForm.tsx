import { useState } from "react";
import { Button, Input, Label } from "@/components/common";
import { useT } from "@/hooks";
import type { Asset, AssetFormData } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

export function EditForm({
  initial,
  onSubmit,
  onCancel }: {
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
      categories: initial.categories,
      brokerId: initial.brokerId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-zinc-900/50 rounded-lg px-4 py-3 flex flex-wrap gap-x-6 gap-y-1">
        <span className="text-sm font-semibold text-zinc-100">
          {initial.name}
        </span>
        {initial.ticker && (
          <span className="text-sm text-zinc-500 font-mono">
            {initial.ticker}
          </span>
        )}
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded self-center">
          {t.asset_type_labels[initial.type]}
        </span>
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded self-center">
          {t.market_labels[initial.market]}
        </span>
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded self-center">
          {initial.currency}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="block">
          <Label>
            {t.af_quantity_label}
          </Label>
          <Input
            type="number"
            required
            min={0}
            step="any"
            value={quantity || ""}
            onChange={(e) => setQuantity(Number(e.target.value))}
            
          />
        </div>
        <div className="block">
          <Label>
            {t.af_avg_price_label} ({sym})
          </Label>
          <Input
            type="number"
            required
            min={0}
            step="any"
            value={avgBuyPrice || ""}
            onChange={(e) => setAvgBuyPrice(Number(e.target.value))}
            
          />
        </div>
      </div>

      <div className="block">
        <Label>
          {t.af_current_price_label} ({sym})
        </Label>
        <Input
          type="number"
          value={initial.currentPrice}
          readOnly
          className="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t.af_btn_cancel}
        </Button>
        <Button type="submit">{t.af_btn_submit}</Button>
      </div>
    </form>
  );
}
