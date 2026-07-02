import { useMemo } from "react";
import { useT, usePortfolio, useExchangeRates } from "@/hooks";
import { useFireStore, useSettingsStore } from "@/stores";
import { FireInputForm, FireChart, FireResultCard } from "@/components/fire";
import { calculateFire, getTargetAmountFromExpense, fromKRW } from "@/utils";

export function FirePlannerPage() {
  const t = useT();
  const { summary } = usePortfolio();
  const store = useFireStore();
  const { baseCurrency } = useSettingsStore();
  const { data: exchangeRates } = useExchangeRates();

  // Calculate FIRE projection
  const result = useMemo(() => {
    // Convert current assets to base currency for the calculation
    const currentAssetsKRW = store.usePortfolioAssets ? summary.totalValueKRW : store.manualCurrentAssets;
    const currentAssets = fromKRW(currentAssetsKRW, baseCurrency, exchangeRates);
    const savingsInBase = fromKRW(store.monthlySavings, baseCurrency, exchangeRates);
    const targetInBase =
      store.mode === "target"
        ? fromKRW(store.targetAmount, baseCurrency, exchangeRates)
        : getTargetAmountFromExpense(fromKRW(store.monthlyExpense, baseCurrency, exchangeRates), store.safeWithdrawalRate);

    if (targetInBase <= 0) return null;

    return calculateFire({
      currentAssets,
      monthlySavings: savingsInBase,
      expectedReturnRate: store.expectedReturnRate,
      targetAmount: targetInBase,
      currentAge: store.currentAge,
    });
  }, [summary.totalValueKRW, baseCurrency, exchangeRates, store]);

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
          <FireResultCard result={result} />
          {result && result.data.length > 0 && (
            <div className="flex flex-1 flex-col">
              <FireChart data={result.data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
