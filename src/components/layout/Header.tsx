import { useSettingsStore } from "@/stores";
import { CURRENCY_LABELS } from "@/types";
import type { CurrencyCode } from "@/types";

export function Header() {
  const { baseCurrency, setBaseCurrency } = useSettingsStore();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value as CurrencyCode)}
          className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white"
        >
          {(Object.entries(CURRENCY_LABELS) as [CurrencyCode, string][]).map(
            ([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>
    </header>
  );
}
