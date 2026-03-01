import { useLanguageStore, useSettingsStore } from "@/stores";
import type { Lang } from "@/i18n";
import type { CurrencyCode } from "@/types";

const LANG_LABELS: Record<Lang, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
};

/** 언어별 기본 표시 화폐 */
const LANG_CURRENCY: Record<Lang, CurrencyCode> = {
  ko: "KRW",
  en: "USD",
  ja: "JPY",
};

export function Header() {
  const { lang, setLang } = useLanguageStore();
  const setBaseCurrency = useSettingsStore((s) => s.setBaseCurrency);

  const handleLangChange = (l: Lang) => {
    setLang(l);
    setBaseCurrency(LANG_CURRENCY[l]);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        {/* 언어 전환 버튼 (화폐 동시 전환) */}
        <div className="flex gap-1">
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLangChange(l)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                lang === l
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
