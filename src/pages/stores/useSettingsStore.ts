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
  { category: "reit" as AssetCategory, targetPercent: 0 },
  { category: "cash" as AssetCategory, targetPercent: 5 },
  { category: "crypto" as AssetCategory, targetPercent: 0 },
  { category: "commodity" as AssetCategory, targetPercent: 0 },
];

/** 기본 카테고리 집합 (순서 포함) */
const DEFAULT_CATEGORIES = DEFAULT_TARGET.map((t) => t.category);

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
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let s = persistedState as any;
        if (version === 0) {
          // tag → category 마이그레이션
          s = {
            ...s,
            targetAllocations: (s.targetAllocations ?? []).map((a: any) => ({
              ...a,
              category: a.category ?? a.tag ?? "",
              tag: undefined,
            })),
          };
        }
        if (version <= 1) {
          // reit / crypto / commodity 기본값 추가 (없는 항목만)
          const existing: string[] = (s.targetAllocations ?? []).map(
            (a: any) => a.category,
          );
          const toAdd = DEFAULT_CATEGORIES.filter(
            (cat) => !existing.includes(cat),
          ).map((cat) => ({
            category: cat,
            targetPercent: DEFAULT_TARGET.find((d) => d.category === cat)
              ?.targetPercent ?? 0,
          }));
          s = {
            ...s,
            targetAllocations: [...(s.targetAllocations ?? []), ...toAdd],
          };
        }
        return s;
      },
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
