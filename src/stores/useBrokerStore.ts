import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { BrokerAccount } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface BrokerState {
  accounts: BrokerAccount[];
  addAccount: (data: Omit<BrokerAccount, "id">) => void;
  updateAccount: (id: string, data: Partial<Omit<BrokerAccount, "id">>) => void;
  deleteAccount: (id: string) => void;
}

export const useBrokerStore = create<BrokerState>()(
  persist(
    (set) => ({
      accounts: [],

      addAccount: (data) =>
        set((state) => ({
          accounts: [...state.accounts, { ...data, id: uuidv4() }],
        })),

      updateAccount: (id, data) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, ...data } : a,
          ),
        })),

      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),
    }),
    { name: STORAGE_KEYS.BROKERS },
  ),
);
