import { useState } from "react";
import { Button, Input, Label, CustomSelect } from "@/components/common";
import { useT } from "@/hooks";
import type { Asset, AssetFormData, AssetVisibility } from "@/types";
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
  const [currentPrice, setCurrentPrice] = useState(initial.currentPrice);
  const [visibility, setVisibility] = useState<AssetVisibility>(
    initial.visibility ?? "all",
  );
  const sym = CURRENCY_SYMBOLS[initial.currency];
  const t = useT();

  const VISIBILITY_OPTIONS: { value: AssetVisibility; label: string }[] = [
    { value: "all", label: t.visibility_labels.all },
    { value: "dashboard_only", label: t.visibility_labels.dashboard_only },
    { value: "guru_only", label: t.visibility_labels.guru_only },
    { value: "hidden", label: t.visibility_labels.hidden },
  ];

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
      currentPrice,
      categories: initial.categories,
      brokerId: initial.brokerId,
      visibility,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-wrap gap-x-6 gap-y-1 rounded-lg bg-zinc-900/50 px-4 py-3">
        <span className="text-sm font-semibold text-zinc-100">
          {initial.name}
        </span>
        {initial.ticker && (
          <span className="font-mono text-sm text-zinc-500">
            {initial.ticker}
          </span>
        )}
        <span className="self-center rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
          {t.asset_type_labels[initial.type]}
        </span>
        <span className="self-center rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
          {t.market_labels[initial.market]}
        </span>
        <span className="self-center rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
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
          required
          min={0}
          step="any"
          value={currentPrice || ""}
          onChange={(e) => setCurrentPrice(Number(e.target.value))}
        />
        <p className="mt-1.5 text-2xs leading-relaxed text-zinc-500">
          {t.af_current_price_help}
        </p>
      </div>

      <div className="block">
        <Label>{t.af_visibility_label}</Label>
        <CustomSelect<AssetVisibility>
          value={visibility}
          onChange={(val) => setVisibility(val)}
          options={VISIBILITY_OPTIONS}
          ariaLabel={t.af_visibility_label}
        />
        <p className="mt-1.5 text-2xs leading-relaxed text-zinc-400">
          {t.visibility_descriptions[visibility]}
        </p>
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
