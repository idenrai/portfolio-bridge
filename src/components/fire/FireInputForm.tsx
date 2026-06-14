import { Card } from "@/components/common";
import { useT, usePortfolio } from "@/hooks";
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
  const { summary } = usePortfolio();

  /** Shared input style */
  const inputClass =
    "bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all text-slate-200 placeholder-slate-600";

  return (
    <Card className="p-5 flex flex-col gap-5 h-full">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-lg border border-slate-800/50">
        <button
          className={`flex-1 py-1.5 px-2 text-xs md:text-sm font-medium rounded-md transition-all border break-keep leading-tight ${
            store.mode === "expense" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800"
          }`}
          onClick={() => store.setMode("expense")}
        >
          {t.fire_tab_expense}
        </button>
        <button
          className={`flex-1 py-1.5 px-2 text-xs md:text-sm font-medium rounded-md transition-all border break-keep leading-tight ${
            store.mode === "target" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800"
          }`}
          onClick={() => store.setMode("target")}
        >
          {t.fire_tab_target}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Current Assets */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">{t.fire_current_assets} ({baseCurrency})</label>
          <div className="flex items-center gap-2 mb-0.5">
            <input
              type="checkbox"
              id="usePortfolioAssets"
              checked={store.usePortfolioAssets}
              onChange={(e) => store.setUsePortfolioAssets(e.target.checked)}
              className="w-4 h-4 text-emerald-500 bg-slate-900/50 border-slate-700 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="usePortfolioAssets" className="text-sm text-slate-400 cursor-pointer select-none">
              {t.fire_use_portfolio_assets}
            </label>
          </div>
          <input
            type="text"
            inputMode="numeric"
            className={`${inputClass} ${store.usePortfolioAssets ? 'bg-slate-900 text-slate-600 cursor-not-allowed border-slate-800' : ''}`}
            disabled={store.usePortfolioAssets}
            value={
              store.usePortfolioAssets
                ? formatWithComma(Number(fromKRW(summary.totalValueKRW, baseCurrency, exchangeRates).toFixed(0)))
                : (store.manualCurrentAssets ? formatWithComma(Number(fromKRW(store.manualCurrentAssets, baseCurrency, exchangeRates).toFixed(0))) : "")
            }
            onChange={(e) => {
              if (!store.usePortfolioAssets) {
                store.setManualCurrentAssets(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates));
              }
            }}
          />
        </div>

        {/* Monthly Savings */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">{t.fire_monthly_savings} ({baseCurrency})</label>
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
          <label className="text-sm font-medium text-slate-300">{t.fire_expected_return}</label>
          <input
            type="number"
            step="0.1"
            className={inputClass}
            value={store.expectedReturnRate || ""}
            onChange={(e) => store.setExpectedReturnRate(Number(e.target.value))}
          />
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{t.fire_helper_expected_return}</p>
        </div>

        {/* Current Age */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">{t.fire_age_label}</label>
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
            <label className="text-sm font-medium text-slate-300">{t.fire_target_amount} ({baseCurrency})</label>
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
              <label className="text-sm font-medium text-slate-300">{t.fire_monthly_expense} ({baseCurrency})</label>
              <input
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={store.monthlyExpense ? formatWithComma(Number(fromKRW(store.monthlyExpense, baseCurrency, exchangeRates).toFixed(0))) : ""}
                onChange={(e) => store.setMonthlyExpense(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">{t.fire_safe_withdrawal_rate}</label>
              <input
                type="number"
                step="0.1"
                className={inputClass}
                value={store.safeWithdrawalRate || ""}
                onChange={(e) => store.setSafeWithdrawalRate(Number(e.target.value))}
              />
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{t.fire_helper_safe_withdrawal}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
