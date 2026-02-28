import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyCode, TargetAllocation, AssetTag } from "@/types";
import { DEFAULT_RATES } from "@/types";

interface SettingsState {
  /** 표시 기준 통화 */
  baseCurrency: CurrencyCode;
  /** 환율 (1 단위 → KRW) */
  exchangeRates: Record<CurrencyCode, number>;
  /** 목표 비중 배분 */
  targetAllocations: TargetAllocation[];
  /** 언어 */
  locale: "ko" | "ja" | "en";

  setBaseCurrency: (c: CurrencyCode) => void;
  setExchangeRate: (currency: CurrencyCode, rate: number) => void;
  setTargetAllocations: (allocations: TargetAllocation[]) => void;
  setLocale: (l: "ko" | "ja" | "en") => void;
}

const DEFAULT_TARGET: TargetAllocation[] = [
  { tag: "dividend" as AssetTag, targetPercent: 30 },
  { tag: "growth" as AssetTag, targetPercent: 30 },
  { tag: "value" as AssetTag, targetPercent: 15 },
  { tag: "index" as AssetTag, targetPercent: 15 },
  { tag: "bond" as AssetTag, targetPercent: 5 },
  { tag: "cash" as AssetTag, targetPercent: 5 },
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      baseCurrency: "KRW",
      exchangeRates: { ...DEFAULT_RATES },
      targetAllocations: DEFAULT_TARGET,
      locale: "ko",

      setBaseCurrency: (baseCurrency) => set({ baseCurrency }),
      setExchangeRate: (currency, rate) =>
        set((state) => ({
          exchangeRates: { ...state.exchangeRates, [currency]: rate },
        })),
      setTargetAllocations: (targetAllocations) => set({ targetAllocations }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: "portfolio-bridge-settings" },
  ),
);
