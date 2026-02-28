import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/i18n";

interface LanguageStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: "ko" as Lang,
      setLang: (lang) => set({ lang }),
    }),
    { name: "portfolio-bridge-lang" }
  )
);
