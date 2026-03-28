import { useState } from "react";
import { Button } from "@/components/common";
import { useT } from "@/hooks";
import type { Asset, AssetFormData } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

export function EditForm({
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
      categories: initial.categories,
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
