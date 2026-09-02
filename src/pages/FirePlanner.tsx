import { useMemo } from "react";
import { useT, usePortfolio, useExchangeRates } from "@/hooks";
import { useFireStore, useSettingsStore } from "@/stores";
import { FireInputForm, FireChart, FireResultCard } from "@/components/fire";
import { calculateFire, getTargetAmountFromExpense, fromKRW } from "@/utils";

export function FirePlannerPage() {
  const t = useT();
  const { summary } = usePortfolio();
  const usePortfolioAssets = useFireStore((s) => s.usePortfolioAssets);
  const manualCurrentAssets = useFireStore((s) => s.manualCurrentAssets);
  const monthlySavings = useFireStore((s) => s.monthlySavings);
  const mode = useFireStore((s) => s.mode);
  const targetAmount = useFireStore((s) => s.targetAmount);
  const monthlyExpense = useFireStore((s) => s.monthlyExpense);
  const safeWithdrawalRate = useFireStore((s) => s.safeWithdrawalRate);
  const expectedReturnRate = useFireStore((s) => s.expectedReturnRate);
  const currentAge = useFireStore((s) => s.currentAge);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: exchangeRates } = useExchangeRates();

  // Calculate FIRE projection
  const result = useMemo(() => {
    // Convert current assets to base currency for the calculation
    const currentAssetsKRW = usePortfolioAssets ? summary.totalValueKRW : manualCurrentAssets;
    const currentAssets = fromKRW(currentAssetsKRW, baseCurrency, exchangeRates);
    const savingsInBase = fromKRW(monthlySavings, baseCurrency, exchangeRates);
    const targetInBase =
      mode === "target"
        ? fromKRW(targetAmount, baseCurrency, exchangeRates)
        : getTargetAmountFromExpense(fromKRW(monthlyExpense, baseCurrency, exchangeRates), safeWithdrawalRate);

    if (targetInBase <= 0) return null;

    const fireResult = calculateFire({
      currentAssets,
      monthlySavings: savingsInBase,
      expectedReturnRate,
      targetAmount: targetInBase,
      currentAge,
    });

    return {
      fireResult,
      targetInBase,
      currentAssets,
      savingsInBase,
    };
  }, [
    summary.totalValueKRW,
    baseCurrency,
    exchangeRates,
    usePortfolioAssets,
    manualCurrentAssets,
    monthlySavings,
    mode,
    targetAmount,
    monthlyExpense,
    safeWithdrawalRate,
    expectedReturnRate,
    currentAge,
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pt-4 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-white md:text-3xl">
          {t.fire_title}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          {t.fire_desc}
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <FireInputForm />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-7">
          <FireResultCard
            result={result?.fireResult ?? null}
            targetAmount={result?.targetInBase}
            currentAssets={result?.currentAssets}
            monthlySavings={result?.savingsInBase}
          />
          {result && result.fireResult.data.length > 0 && (
            <div className="flex flex-1 flex-col">
              <FireChart
                data={result.fireResult.data}
                successYear={result.fireResult.successYear}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
