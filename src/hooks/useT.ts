import { TRANSLATIONS } from "@/i18n";
import { useLanguageStore } from "@/pages/stores/useLanguageStore";

export function useT() {
  const lang = useLanguageStore((s) => s.lang);
  return TRANSLATIONS[lang];
}
