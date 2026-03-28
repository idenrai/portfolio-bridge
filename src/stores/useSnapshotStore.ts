import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

export interface PortfolioSnapshot {
  date: string; // YYYY-MM-DD
  totalValueKRW: number;
  totalCostKRW: number;
}

interface SnapshotState {
  snapshots: PortfolioSnapshot[];
  /** 오늘 날짜 기준으로 스냅샷 추가/갱신 */
  upsertSnapshot: (snapshot: PortfolioSnapshot) => void;
  clearSnapshots: () => void;
}

export const useSnapshotStore = create<SnapshotState>()(
  persist(
    (set) => ({
      snapshots: [],

      upsertSnapshot: (snapshot) =>
        set((state) => {
          const others = state.snapshots.filter(
            (s) => s.date !== snapshot.date,
          );
          const next = [...others, snapshot]
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-365);
          return { snapshots: next };
        }),

      clearSnapshots: () => set({ snapshots: [] }),
    }),
    {
      name: STORAGE_KEYS.SNAPSHOTS,
    },
  ),
);
