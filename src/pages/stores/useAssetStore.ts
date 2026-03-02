import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Asset, AssetFormData } from "@/types";

interface AssetState {
  assets: Asset[];
  addAsset: (data: AssetFormData) => void;
  updateAsset: (id: string, data: Partial<AssetFormData>) => void;
  deleteAsset: (id: string) => void;
  getAsset: (id: string) => Asset | undefined;
  /** 현재가 일괄 업데이트 */
  updatePrices: (updates: { id: string; currentPrice: number }[]) => void;
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: [],

      addAsset: (data) => {
        const now = new Date().toISOString();
        const newAsset: Asset = {
          ...data,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ assets: [...state.assets, newAsset] }));
      },

      updateAsset: (id, data) => {
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id
              ? { ...a, ...data, updatedAt: new Date().toISOString() }
              : a,
          ),
        }));
      },

      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        }));
      },

      getAsset: (id) => get().assets.find((a) => a.id === id),

      updatePrices: (updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          assets: state.assets.map((a) => {
            const update = updates.find((u) => u.id === a.id);
            return update
              ? { ...a, currentPrice: update.currentPrice, updatedAt: now }
              : a;
          }),
        }));
      },
    }),
    {
      name: "portfolio-bridge-assets",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // tags → categories 마이그레이션
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const s = persistedState as any;
          return {
            ...s,
            assets: (s.assets ?? []).map((a: any) => ({
              ...a,
              categories: a.categories ?? a.tags ?? [],
              tags: undefined,
            })),
          };
        }
        return persistedState;
      },
    },
  ),
);
