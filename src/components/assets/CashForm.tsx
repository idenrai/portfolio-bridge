import { useState, useMemo } from "react";
import { Button } from "@/components/common";
import { useT } from "@/hooks";
import type { AssetFormData, CurrencyCode, Market } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

export function CashForm({
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
    { code: "EUR", label: t.currency_eur },
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
      categories: [],
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
            <div className="mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg">
              <div className="p-2 border-b border-slate-100">
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="KRW, JPY, USD, EUR..."
                  className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
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
