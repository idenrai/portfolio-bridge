import { Card } from "@/components/common";
import { useT } from "@/hooks";
import { useFireStore } from "@/stores";
import { useSettingsStore } from "@/stores";

export function FireInputForm() {
  const t = useT();
  const { baseCurrency } = useSettingsStore();
  const store = useFireStore();

  return (
    <Card className="p-5 flex flex-col gap-5 bg-slate-900 border-slate-800">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800 rounded-lg">
        <button
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
            store.mode === "expense" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => store.setMode("expense")}
        >
          {t.fire_tab_expense}
        </button>
        <button
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
            store.mode === "target" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => store.setMode("target")}
        >
          {t.fire_tab_target}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Savings */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-400">{t.fire_monthly_savings} ({baseCurrency})</label>
          <input
            type="number"
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-200"
            value={store.monthlySavings || ""}
            onChange={(e) => store.setMonthlySavings(Number(e.target.value))}
          />
        </div>

        {/* Expected Return */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-400">{t.fire_expected_return}</label>
          <input
            type="number"
            step="0.1"
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-200"
            value={store.expectedReturnRate || ""}
            onChange={(e) => store.setExpectedReturnRate(Number(e.target.value))}
          />
        </div>

        {/* Current Age */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-400">{t.fire_age_label}</label>
          <input
            type="number"
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-200"
            placeholder={t.fire_age_placeholder}
            value={store.currentAge || ""}
            onChange={(e) => store.setCurrentAge(e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        {/* Conditional Fields based on mode */}
        {store.mode === "target" ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-400">{t.fire_target_amount} ({baseCurrency})</label>
            <input
              type="number"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-200"
              value={store.targetAmount || ""}
              onChange={(e) => store.setTargetAmount(Number(e.target.value))}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">{t.fire_monthly_expense} ({baseCurrency})</label>
              <input
                type="number"
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-200"
                value={store.monthlyExpense || ""}
                onChange={(e) => store.setMonthlyExpense(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">{t.fire_safe_withdrawal_rate}</label>
              <input
                type="number"
                step="0.1"
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-200"
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
