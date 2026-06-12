import { Card } from "@/components/common";
import { useT } from "@/hooks";
import { useFireStore, useSettingsStore } from "@/stores";
import { fromKRW, toKRW } from "@/utils";

/** Format a number with thousand-separator commas for display */
function formatWithComma(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/** Parse a comma-formatted string back to a plain number */
function parseCommaNumber(str: string): number {
  return Number(str.replace(/,/g, ""));
}

export function FireInputForm() {
  const t = useT();
  const { baseCurrency, exchangeRates } = useSettingsStore();
  const store = useFireStore();

  /** Shared input style */
  const inputClass =
    "bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800";

  return (
    <Card className="p-5 flex flex-col gap-5 h-full">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
        <button
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
            store.mode === "expense" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => store.setMode("expense")}
        >
          {t.fire_tab_expense}
        </button>
        <button
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
            store.mode === "target" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => store.setMode("target")}
        >
          {t.fire_tab_target}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Monthly Savings */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.fire_monthly_savings} ({baseCurrency})</label>
          <input
            type="text"
            inputMode="numeric"
            className={inputClass}
            value={store.monthlySavings ? formatWithComma(Number(fromKRW(store.monthlySavings, baseCurrency, exchangeRates).toFixed(0))) : ""}
            onChange={(e) => store.setMonthlySavings(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates))}
          />
        </div>

        {/* Expected Return */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.fire_expected_return}</label>
          <input
            type="number"
            step="0.1"
            className={inputClass}
            value={store.expectedReturnRate || ""}
            onChange={(e) => store.setExpectedReturnRate(Number(e.target.value))}
          />
        </div>

        {/* Current Age */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.fire_age_label}</label>
          <input
            type="number"
            className={inputClass}
            placeholder={t.fire_age_placeholder}
            value={store.currentAge || ""}
            onChange={(e) => store.setCurrentAge(e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        {/* Conditional Fields based on mode */}
        {store.mode === "target" ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">{t.fire_target_amount} ({baseCurrency})</label>
            <input
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={store.targetAmount ? formatWithComma(Number(fromKRW(store.targetAmount, baseCurrency, exchangeRates).toFixed(0))) : ""}
              onChange={(e) => store.setTargetAmount(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates))}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">{t.fire_monthly_expense} ({baseCurrency})</label>
              <input
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={store.monthlyExpense ? formatWithComma(Number(fromKRW(store.monthlyExpense, baseCurrency, exchangeRates).toFixed(0))) : ""}
                onChange={(e) => store.setMonthlyExpense(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">{t.fire_safe_withdrawal_rate}</label>
              <input
                type="number"
                step="0.1"
                className={inputClass}
                value={store.safeWithdrawalRate || ""}
                onChange={(e) => store.setSafeWithdrawalRate(Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
