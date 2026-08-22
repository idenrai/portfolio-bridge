import { Card, Input } from "@/components/common";
import { useT, usePortfolio, useExchangeRates } from "@/hooks";
import { useFireStore, useSettingsStore } from "@/stores";
import { fromKRW, toKRW, cn } from "@/utils";

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
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: exchangeRates } = useExchangeRates();
  const mode = useFireStore((s) => s.mode);
  const setMode = useFireStore((s) => s.setMode);
  const usePortfolioAssets = useFireStore((s) => s.usePortfolioAssets);
  const setUsePortfolioAssets = useFireStore((s) => s.setUsePortfolioAssets);
  const manualCurrentAssets = useFireStore((s) => s.manualCurrentAssets);
  const setManualCurrentAssets = useFireStore((s) => s.setManualCurrentAssets);
  const monthlySavings = useFireStore((s) => s.monthlySavings);
  const setMonthlySavings = useFireStore((s) => s.setMonthlySavings);
  const expectedReturnRate = useFireStore((s) => s.expectedReturnRate);
  const setExpectedReturnRate = useFireStore((s) => s.setExpectedReturnRate);
  const currentAge = useFireStore((s) => s.currentAge);
  const setCurrentAge = useFireStore((s) => s.setCurrentAge);
  const targetAmount = useFireStore((s) => s.targetAmount);
  const setTargetAmount = useFireStore((s) => s.setTargetAmount);
  const monthlyExpense = useFireStore((s) => s.monthlyExpense);
  const setMonthlyExpense = useFireStore((s) => s.setMonthlyExpense);
  const safeWithdrawalRate = useFireStore((s) => s.safeWithdrawalRate);
  const setSafeWithdrawalRate = useFireStore((s) => s.setSafeWithdrawalRate);
  const { summary } = usePortfolio();

  return (
    <Card className="flex h-full flex-col gap-5 border border-zinc-800/60 bg-black/40 p-5 shadow-sm backdrop-blur-sm">
      {/* Tabs */}
      <div className="flex gap-2 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-1">
        <button
          className={cn(
            "flex-1 rounded-md border px-2 py-1.5 text-xs leading-tight font-medium break-keep transition-all md:text-sm",
            mode === "expense"
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              : "border-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300",
          )}
          onClick={() => setMode("expense")}
        >
          {t.fire_tab_expense}
        </button>
        <button
          className={cn(
            "flex-1 rounded-md border px-2 py-1.5 text-xs leading-tight font-medium break-keep transition-all md:text-sm",
            mode === "target"
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              : "border-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300",
          )}
          onClick={() => setMode("target")}
        >
          {t.fire_tab_target}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Current Assets */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-300">{t.fire_current_assets} ({baseCurrency})</label>
          <div className="mb-0.5 flex items-center gap-2">
            <input
              type="checkbox"
              id="usePortfolioAssets"
              checked={usePortfolioAssets}
              onChange={(e) => setUsePortfolioAssets(e.target.checked)}
              className="size-4 cursor-pointer rounded border-zinc-700 bg-zinc-900/50 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="usePortfolioAssets" className="cursor-pointer text-sm text-zinc-400 select-none">
              {t.fire_use_portfolio_assets}
            </label>
          </div>
          <Input
            type="text"
            inputMode="numeric"
            className={usePortfolioAssets ? 'cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-400' : 'focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50'}
            disabled={usePortfolioAssets}
            value={
              usePortfolioAssets
                ? formatWithComma(Number(fromKRW(summary.totalValueKRW, baseCurrency, exchangeRates).toFixed(0)))
                : (manualCurrentAssets ? formatWithComma(Number(fromKRW(manualCurrentAssets, baseCurrency, exchangeRates).toFixed(0))) : "")
            }
            onChange={(e) => {
              if (!usePortfolioAssets) {
                setManualCurrentAssets(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates));
              }
            }}
          />
        </div>

        {/* Monthly Savings */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">{t.fire_monthly_savings} ({baseCurrency})</label>
          <Input
            type="text"
            inputMode="numeric"
            className="focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50"
            value={monthlySavings ? formatWithComma(Number(fromKRW(monthlySavings, baseCurrency, exchangeRates).toFixed(0))) : ""}
            onChange={(e) => setMonthlySavings(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates))}
          />
        </div>

        {/* Expected Return */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">{t.fire_expected_return}</label>
          <Input
            type="number"
            step="0.1"
            className="focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50"
            value={expectedReturnRate}
            onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
          />
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{t.fire_helper_expected_return}</p>
        </div>

        {/* Current Age */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">{t.fire_age_label}</label>
          <Input
            type="number"
            className="focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50"
            placeholder={t.fire_age_placeholder}
            value={currentAge || ""}
            onChange={(e) => setCurrentAge(e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        {/* Conditional Fields based on mode */}
        {mode === "target" ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">{t.fire_target_amount} ({baseCurrency})</label>
            <Input
              type="text"
              inputMode="numeric"
              className="focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50"
              value={targetAmount ? formatWithComma(Number(fromKRW(targetAmount, baseCurrency, exchangeRates).toFixed(0))) : ""}
              onChange={(e) => setTargetAmount(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates))}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">{t.fire_monthly_expense} ({baseCurrency})</label>
              <Input
                type="text"
                inputMode="numeric"
                className="focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50"
                value={monthlyExpense ? formatWithComma(Number(fromKRW(monthlyExpense, baseCurrency, exchangeRates).toFixed(0))) : ""}
                onChange={(e) => setMonthlyExpense(toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">{t.fire_safe_withdrawal_rate}</label>
              <Input
                type="number"
                step="0.1"
                className="focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50"
                value={safeWithdrawalRate || ""}
                onChange={(e) => setSafeWithdrawalRate(Number(e.target.value))}
              />
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{t.fire_helper_safe_withdrawal}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
