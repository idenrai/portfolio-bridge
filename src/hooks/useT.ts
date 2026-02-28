import { TRANSLATIONS } from "@/i18n";
import { useLanguageStore } from "@/stores/useLanguageStore";

export function useT() {
  const lang = useLanguageStore((s) => s.lang);
  return TRANSLATIONS[lang];
}
