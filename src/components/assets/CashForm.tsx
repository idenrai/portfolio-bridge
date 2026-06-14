import { useState } from "react";
import { Button, Input, Label } from "@/components/common";
import { useT } from "@/hooks";
import type { AssetFormData, CurrencyCode, Market } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

export function CashForm({
  onSubmit,
  onCancel }: {
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
    { code: "EUR", label: t.currency_eur },
  ];

  const filtered = CURRENCY_OPTIONS.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = CURRENCY_OPTIONS.find((c) => c.code === currency);

  const marketFromCurrency = (c: CurrencyCode): Market =>
    c === "KRW" ? "KR" : c === "JPY" ? "JP" : c === "EUR" ? "EU" : "US";

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
      categories: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label>
          {t.af_currency_label}
        </Label>
        <div className="relative mt-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            
          >
            <span className={currency ? "text-white" : "text-zinc-500"}>
              {selected ? selected.label : t.af_currency_placeholder}
            </span>
            <span className="text-zinc-400 text-xs">▼</span>
          </button>
          {open && (
            <div >
              <div className="p-2 border-b border-zinc-800">
                <Input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="KRW, JPY, USD, EUR..."
                  
                />
              </div>
              <div>
                {filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800/50 text-zinc-700"
                  >
                    {c.label}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-zinc-400 py-3">
                    {t.af_currency_no_result}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="block">
        <Label>
          {t.af_cash_amount_label}
          {currency ? ` (${CURRENCY_SYMBOLS[currency]})` : ""} *
        </Label>
        <Input
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
          
        />
      </div>

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
