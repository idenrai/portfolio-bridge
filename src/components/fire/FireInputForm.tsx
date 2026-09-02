import { Card } from "@/components/common";
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
    <Card className="flex h-full flex-col gap-5 border border-zinc-800 bg-zinc-950/70 p-5 shadow-sm backdrop-blur-md">
      {/* 탭: 계산 모드 선택 */}
      <div className="flex gap-2 rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-1">
        <button
          type="button"
          className={cn(
            "flex-1 cursor-pointer rounded-md border px-2 py-1.5 text-xs font-semibold break-keep transition-all md:text-sm",
            mode === "expense"
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              : "border-transparent text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200",
          )}
          onClick={() => setMode("expense")}
        >
          {t.fire_tab_expense}
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 cursor-pointer rounded-md border px-2 py-1.5 text-xs font-semibold break-keep transition-all md:text-sm",
            mode === "target"
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              : "border-transparent text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200",
          )}
          onClick={() => setMode("target")}
        >
          {t.fire_tab_target}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4.5">
        {/* 1. 현재 보유 자산 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300">
              {t.fire_current_assets}
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-400 select-none hover:text-zinc-200">
              <input
                type="checkbox"
                checked={usePortfolioAssets}
                onChange={(e) => setUsePortfolioAssets(e.target.checked)}
                className="size-3.5 cursor-pointer rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
              />
              <span>{t.fire_use_portfolio_assets}</span>
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              className={cn(
                "w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 pr-14 text-sm font-medium text-white transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none",
                usePortfolioAssets && "cursor-not-allowed bg-zinc-900/40 text-zinc-400",
              )}
              disabled={usePortfolioAssets}
              value={
                usePortfolioAssets
                  ? formatWithComma(
                      Number(
                        fromKRW(summary.totalValueKRW, baseCurrency, exchangeRates).toFixed(0),
                      ),
                    )
                  : manualCurrentAssets
                    ? formatWithComma(
                        Number(
                          fromKRW(manualCurrentAssets, baseCurrency, exchangeRates).toFixed(0),
                        ),
                      )
                    : ""
              }
              onChange={(e) => {
                if (!usePortfolioAssets) {
                  setManualCurrentAssets(
                    toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates),
                  );
                }
              }}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-2xs font-semibold text-zinc-400">
              {baseCurrency}
            </span>
          </div>
        </div>

        {/* 2. 월 저축 가능 금액 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-300">
            {t.fire_monthly_savings}
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 pr-14 text-sm font-medium text-white transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none"
              value={
                monthlySavings
                  ? formatWithComma(
                      Number(fromKRW(monthlySavings, baseCurrency, exchangeRates).toFixed(0)),
                    )
                  : ""
              }
              onChange={(e) =>
                setMonthlySavings(
                  toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates),
                )
              }
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-2xs font-semibold text-zinc-400">
              {baseCurrency}
            </span>
          </div>
        </div>

        {/* 3. 연간 기대 수익률 (%) */}
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300">
              {t.fire_expected_return}
            </label>
              <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                aria-label={t.fire_expected_return}
                className="w-16 rounded border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-right font-mono text-xs font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              />
              <span className="font-mono text-2xs text-zinc-400">%</span>
            </div>
          </div>

          {/* 슬라이더 */}
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            aria-label={t.fire_expected_return}
            aria-valuemin={1}
            aria-valuemax={20}
            aria-valuenow={expectedReturnRate}
            aria-valuetext={`${expectedReturnRate}%`}
            value={expectedReturnRate}
            onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-emerald-500"
          />

          {/* 프리셋 버튼 */}
          <div className="flex gap-1.5 pt-0.5">
            {[
              { label: t.fire_preset_conservative, val: 4 },
              { label: t.fire_preset_moderate, val: 7 },
              { label: t.fire_preset_aggressive, val: 10 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setExpectedReturnRate(p.val)}
                className={cn(
                  "flex-1 cursor-pointer rounded-md border px-2 py-1 text-3xs font-medium transition-colors",
                  expectedReturnRate === p.val
                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                    : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:text-zinc-200",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. 현재 나이 (선택) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-300">
            {t.fire_age_label}
          </label>
          <div className="relative">
            <input
              type="number"
              min="10"
              max="100"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 pr-12 text-sm font-medium text-white transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none"
              placeholder={t.fire_age_placeholder}
              value={currentAge || ""}
              onChange={(e) =>
                setCurrentAge(e.target.value ? Number(e.target.value) : null)
              }
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-zinc-400">
              {t.fire_age_unit}
            </span>
          </div>
        </div>

        {/* 5. 모드별 추가 필드 */}
        {mode === "target" ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              {t.fire_target_amount}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 pr-14 text-sm font-medium text-white transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none"
                value={
                  targetAmount
                    ? formatWithComma(
                        Number(fromKRW(targetAmount, baseCurrency, exchangeRates).toFixed(0)),
                      )
                    : ""
                }
                onChange={(e) =>
                  setTargetAmount(
                    toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates),
                  )
                }
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-2xs font-semibold text-zinc-400">
                {baseCurrency}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {t.fire_monthly_expense}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 pr-14 text-sm font-medium text-white transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none"
                  value={
                    monthlyExpense
                      ? formatWithComma(
                          Number(fromKRW(monthlyExpense, baseCurrency, exchangeRates).toFixed(0)),
                        )
                      : ""
                  }
                  onChange={(e) =>
                    setMonthlyExpense(
                      toKRW(parseCommaNumber(e.target.value), baseCurrency, exchangeRates),
                    )
                  }
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-2xs font-semibold text-zinc-400">
                  {baseCurrency}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">
                  {t.fire_safe_withdrawal_rate}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    aria-label={t.fire_safe_withdrawal_rate}
                    className="w-16 rounded border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-right font-mono text-xs font-bold text-cyan-400 focus:border-cyan-500 focus:outline-none"
                    value={safeWithdrawalRate}
                    onChange={(e) => setSafeWithdrawalRate(Number(e.target.value))}
                  />
                  <span className="font-mono text-2xs text-zinc-400">%</span>
                </div>
              </div>

              {/* 프리셋 버튼 */}
              <div className="flex gap-1.5">
                {[
                  { label: t.fire_swr_preset_conservative, val: 3.5 },
                  { label: t.fire_swr_preset_trinity, val: 4.0 },
                  { label: t.fire_swr_preset_aggressive, val: 5.0 },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setSafeWithdrawalRate(p.val)}
                    className={cn(
                      "flex-1 cursor-pointer rounded-md border px-2 py-1 text-3xs font-medium transition-colors",
                      safeWithdrawalRate === p.val
                        ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300"
                        : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:text-zinc-200",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-3xs leading-relaxed text-zinc-400">
                {t.fire_helper_safe_withdrawal}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
