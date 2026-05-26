import { useState } from "react";
import { Button } from "@/components/common";
import { useT } from "@/hooks";
import type { AssetFormData } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";
import type { SelectedStock } from "./assetFormTypes";

export function ConfirmStep({
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
      categories: [],
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
