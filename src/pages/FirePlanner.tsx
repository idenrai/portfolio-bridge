import { useMemo } from "react";
import { useT, usePortfolio } from "@/hooks";
import { useFireStore, useSettingsStore } from "@/stores";
import { FireInputForm, FireChart, FireResultCard } from "@/components/fire";
import { calculateFire, getTargetAmountFromExpense, fromKRW } from "@/utils";

export function FirePlannerPage() {
  const t = useT();
  const { summary } = usePortfolio();
  const store = useFireStore();
  const { baseCurrency, exchangeRates } = useSettingsStore();

  // Calculate FIRE projection
  const result = useMemo(() => {
    // Convert current assets to base currency for the calculation
    const currentAssets = fromKRW(summary.totalValueKRW, baseCurrency, exchangeRates);
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
    <div className="max-w-5xl mx-auto space-y-6 pb-20 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
          {t.fire_title}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          {t.fire_desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1 flex">
          <FireInputForm />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FireResultCard result={result} />
          {result && result.data.length > 0 && (
            <div className="flex-1 flex flex-col">
              <FireChart data={result.data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
