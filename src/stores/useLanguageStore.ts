import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/i18n";

interface LanguageStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

/** 브라우저 언어 설정에서 초기 표시 언어를 결정한다 (최초 방문 시에만 사용) */
function detectLang(): Lang {
  const bl = navigator.language ?? navigator.languages?.[0] ?? "en";
  if (bl.startsWith("ko")) return "ko";
  if (bl.startsWith("ja")) return "ja";
  return "en";
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: detectLang(),
      setLang: (lang) => set({ lang }),
    }),
    { name: "portfolio-bridge-lang" },
  ),
);
