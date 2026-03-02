import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CurrencyCode,
  type TargetAllocation,
  type AssetCategory,
  DEFAULT_RATES,
} from "@/types";

interface SettingsState {
  /** 표시 기준 통화 */
  baseCurrency: CurrencyCode;
  /** 환율 (1 단위 → KRW) */
  exchangeRates: Record<CurrencyCode, number>;
  /** 환율 마지막 갱신 시각 (ISO 문자열, 영속화) */
  exchangeRatesUpdatedAt: string | null;
  /** 자산 시세 마지막 갱신 시각 (ISO 문자열, 영속화) */
  pricesUpdatedAt: string | null;
  /** 목표 비중 배분 */
  targetAllocations: TargetAllocation[];

  setBaseCurrency: (c: CurrencyCode) => void;
  setExchangeRate: (currency: CurrencyCode, rate: number) => void;
  setExchangeRatesUpdatedAt: (iso: string) => void;
  setPricesUpdatedAt: (iso: string) => void;
  setTargetAllocations: (allocations: TargetAllocation[]) => void;
}

const DEFAULT_TARGET: TargetAllocation[] = [
  { category: "dividend" as AssetCategory, targetPercent: 30 },
  { category: "growth" as AssetCategory, targetPercent: 30 },
  { category: "value" as AssetCategory, targetPercent: 15 },
  { category: "index" as AssetCategory, targetPercent: 15 },
  { category: "bond" as AssetCategory, targetPercent: 5 },
  { category: "cash" as AssetCategory, targetPercent: 5 },
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      baseCurrency: "KRW",
      exchangeRates: { ...DEFAULT_RATES },
      exchangeRatesUpdatedAt: null,
      pricesUpdatedAt: null,
      targetAllocations: DEFAULT_TARGET,

      setBaseCurrency: (baseCurrency) => set({ baseCurrency }),
      setExchangeRate: (currency, rate) =>
        set((state) => ({
          exchangeRates: { ...state.exchangeRates, [currency]: rate },
        })),
      setExchangeRatesUpdatedAt: (iso) => set({ exchangeRatesUpdatedAt: iso }),
      setPricesUpdatedAt: (iso) => set({ pricesUpdatedAt: iso }),
      setTargetAllocations: (targetAllocations) => set({ targetAllocations }),
    }),
    {
      name: "portfolio-bridge-settings",
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<SettingsState>),
        // 구버전 localStorage에 없는 통화 키를 DEFAULT_RATES로 채워 넣는다
        exchangeRates: {
          ...DEFAULT_RATES,
          ...((persistedState as Partial<SettingsState>)?.exchangeRates ?? {}),
        },
      }),
    },
  ),
);
