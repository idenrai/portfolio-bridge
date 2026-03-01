import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CurrencyCode,
  type TargetAllocation,
  type AssetTag,
  DEFAULT_RATES,
} from "@/types";

interface SettingsState {
  /** 표시 기준 통화 */
  baseCurrency: CurrencyCode;
  /** 환율 (1 단위 → KRW) */
  exchangeRates: Record<CurrencyCode, number>;
  /** 환율 마지막 갱신 시각 (ISO 문자열, 영속화) */
  exchangeRatesUpdatedAt: string | null;
  /** 목표 비중 배분 */
  targetAllocations: TargetAllocation[];

  setBaseCurrency: (c: CurrencyCode) => void;
  setExchangeRate: (currency: CurrencyCode, rate: number) => void;
  setExchangeRatesUpdatedAt: (iso: string) => void;
  setTargetAllocations: (allocations: TargetAllocation[]) => void;
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
      exchangeRatesUpdatedAt: null,
      targetAllocations: DEFAULT_TARGET,

      setBaseCurrency: (baseCurrency) => set({ baseCurrency }),
      setExchangeRate: (currency, rate) =>
        set((state) => ({
          exchangeRates: { ...state.exchangeRates, [currency]: rate },
        })),
      setExchangeRatesUpdatedAt: (iso) => set({ exchangeRatesUpdatedAt: iso }),
      setTargetAllocations: (targetAllocations) => set({ targetAllocations }),
    }),
    { name: "portfolio-bridge-settings" },
  ),
);
