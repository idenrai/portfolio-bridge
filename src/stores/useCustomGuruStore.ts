import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

export type CustomGuruRisk = "conservative" | "balanced" | "aggressive";
export type CustomGuruStrategy =
  | "dividend_cashflow"
  | "tech_growth"
  | "deep_value"
  | "all_weather"
  | "quant_momentum";
export type CustomGuruTone =
  | "direct_unfiltered"
  | "supportive_mentor"
  | "analytical_quant";

export interface CustomGuruConfig {
  name: string;
  avatarIcon: string;
  riskTolerance: CustomGuruRisk;
  strategy: CustomGuruStrategy;
  tone: CustomGuruTone;
  customPhilosophy?: string;
  isConfigured: boolean;
}

export const CUSTOM_GURU_RISK_KEYS = {
  conservative: "custom_guru_risk_conservative",
  balanced: "custom_guru_risk_balanced",
  aggressive: "custom_guru_risk_aggressive",
} as const;

export const CUSTOM_GURU_STRATEGY_KEYS = {
  all_weather: "custom_guru_strat_all_weather",
  dividend_cashflow: "custom_guru_strat_dividend",
  tech_growth: "custom_guru_strat_tech",
  deep_value: "custom_guru_strat_value",
  quant_momentum: "custom_guru_strat_momentum",
} as const;

export const CUSTOM_GURU_TONE_KEYS = {
  direct_unfiltered: "custom_guru_tone_direct",
  supportive_mentor: "custom_guru_tone_mentor",
  analytical_quant: "custom_guru_tone_quant",
} as const;

export const DEFAULT_CUSTOM_GURU: CustomGuruConfig = {
  name: "나만의 맞춤 구루",
  avatarIcon: "sparkles",
  riskTolerance: "balanced",
  strategy: "all_weather",
  tone: "supportive_mentor",
  customPhilosophy: "",
  isConfigured: false,
};

interface CustomGuruState {
  config: CustomGuruConfig;
  updateConfig: (partial: Partial<CustomGuruConfig>) => void;
  resetConfig: () => void;
  setConfig: (config: CustomGuruConfig) => void;
}

export const useCustomGuruStore = create<CustomGuruState>()(
  persist(
    (set) => ({
      config: DEFAULT_CUSTOM_GURU,

      updateConfig: (partial) =>
        set((state) => ({
          config: {
            ...state.config,
            ...partial,
            isConfigured: true,
          },
        })),

      resetConfig: () =>
        set({
          config: DEFAULT_CUSTOM_GURU,
        }),

      setConfig: (config) =>
        set({
          config,
        }),
    }),
    {
      name: STORAGE_KEYS.CUSTOM_GURU,
    },
  ),
);
