import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Asset, AssetFormData } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface AssetState {
  assets: Asset[];
  addAsset: (data: AssetFormData) => void;
  updateAsset: (id: string, data: Partial<AssetFormData>) => void;
  deleteAsset: (id: string) => void;
  getAsset: (id: string) => Asset | undefined;
  /** 현재가 일괄 업데이트 (PER/PBR 포함) */
  updatePrices: (updates: { id: string; currentPrice: number; peRatio?: number | null; pbRatio?: number | null; dividendYield?: number | null }[]) => void;
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
            if (!update) return a;
            return {
              ...a,
              currentPrice: update.currentPrice,
              ...(update.peRatio !== undefined ? { peRatio: update.peRatio } : {}),
              ...(update.pbRatio !== undefined ? { pbRatio: update.pbRatio } : {}),
              ...(update.dividendYield !== undefined ? { dividendYield: update.dividendYield } : {}),
              updatedAt: now,
            };
          }),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.ASSETS,
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // tags → categories 마이그레이션
          const s = persistedState as Record<string, unknown>;
          const assets = (s.assets ?? []) as Record<string, unknown>[];
          return {
            ...s,
            assets: assets.map((a) => ({
              ...a,
              categories:
                (a.categories as string[]) ?? (a.tags as string[]) ?? [],
              tags: undefined,
            })),
          };
        }
        return persistedState;
      },
    },
  ),
);
