import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

export type FireCalculationMode = "target" | "expense";

interface FireState {
  mode: FireCalculationMode;
  monthlySavings: number;
  expectedReturnRate: number; // in percentage (e.g., 7)
  targetAmount: number;
  monthlyExpense: number;
  safeWithdrawalRate: number; // in percentage (e.g., 4)
  currentAge: number | null;
  usePortfolioAssets: boolean; // whether to sync with portfolio total value
  manualCurrentAssets: number; // fallback manual input if usePortfolioAssets is false
  setMode: (mode: FireCalculationMode) => void;
  setMonthlySavings: (val: number) => void;
  setExpectedReturnRate: (val: number) => void;
  setTargetAmount: (val: number) => void;
  setMonthlyExpense: (val: number) => void;
  setSafeWithdrawalRate: (val: number) => void;
  setCurrentAge: (val: number | null) => void;
  setUsePortfolioAssets: (val: boolean) => void;
  setManualCurrentAssets: (val: number) => void;
}

export const useFireStore = create<FireState>()(
  persist(
    (set) => ({
      mode: "expense",
      monthlySavings: 1000000,
      expectedReturnRate: 7,
      targetAmount: 1000000000, // 10억
      monthlyExpense: 3000000,  // 300만
      safeWithdrawalRate: 4,
      currentAge: null,
      usePortfolioAssets: true,
      manualCurrentAssets: 0,
      setMode: (mode) => set({ mode }),
      setMonthlySavings: (val) => set({ monthlySavings: val }),
      setExpectedReturnRate: (val) => set({ expectedReturnRate: val }),
      setTargetAmount: (val) => set({ targetAmount: val }),
      setMonthlyExpense: (val) => set({ monthlyExpense: val }),
      setSafeWithdrawalRate: (val) => set({ safeWithdrawalRate: val }),
      setCurrentAge: (val) => set({ currentAge: val }),
      setUsePortfolioAssets: (val) => set({ usePortfolioAssets: val }),
      setManualCurrentAssets: (val) => set({ manualCurrentAssets: val }),
    }),
    {
      name: STORAGE_KEYS.FIRE,
    }
  )
);
