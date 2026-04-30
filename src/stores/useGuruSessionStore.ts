import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

/** 구루 세션 스냅샷: 첫 번째 프롬프트 생성 시점의 포트폴리오 상태 */
export interface GuruSessionSnapshot {
  guruId: string;
  /** 스냅샷 생성 날짜 (YYYY-MM-DD) */
  date: string;
  totalValueKRW: number;
  totalCostKRW: number;
  totalPnLKRW: number;
  totalReturnPercent: number;
  holdingCount: number;
  cashPercent: number;
  categoryAllocation: { category: string; percent: number }[];
  marketAllocation: { market: string; percent: number }[];
  currencyAllocation: { currency: string; percent: number }[];
  holdings: {
    id: string;
    ticker?: string;
    name: string;
    weightPercent: number;
    returnPercent: number;
    category: string | null;
  }[];
  baseCurrency: string;
  rates: Record<string, number>;
}

interface GuruSessionState {
  /** 구루별 세션 스냅샷 (guruId → snapshot) */
  sessions: Record<string, GuruSessionSnapshot>;
  /** 세션 저장 (첫 번째 프롬프트 복사 시 호출) */
  saveSession: (snapshot: GuruSessionSnapshot) => void;
  /** 특정 구루의 세션 삭제 (새 대화 시작) */
  clearSession: (guruId: string) => void;
  /** 모든 세션 초기화 */
  clearAllSessions: () => void;
}

export const useGuruSessionStore = create<GuruSessionState>()(
  persist(
    (set) => ({
      sessions: {},

      saveSession: (snapshot) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [snapshot.guruId]: snapshot,
          },
        })),

      clearSession: (guruId) =>
        set((state) => {
          const { [guruId]: _, ...rest } = state.sessions;
          return { sessions: rest };
        }),

      clearAllSessions: () => set({ sessions: {} }),
    }),
    {
      name: STORAGE_KEYS.GURU_SESSIONS ?? "portfolio-bridge-guru-sessions",
    },
  ),
);
