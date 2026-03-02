import { useLanguageStore, useSettingsStore } from "@/pages/stores";
import type { Lang } from "@/i18n";
import type { CurrencyCode } from "@/types";

const LANG_LABELS: Record<Lang, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
  de: "🇩🇪",
};

/**
 * 언어 전환 시 기본으로 설정되는 표시 화폐
 *
 * 설계 원칙:
 *   EUR은 독일어(de)에만 국한된 통화가 아니라 유럽 20개국이 공유하는 통화입니다.
 *   추후 프랑스어(fr)·스페인어(es)·이탈리아어(it) 등 유로권 언어를 추가할 때는
 *   해당 Lang: "EUR" 엔트리를 이 맵에 추가하면 됩니다.
 */
const LANG_CURRENCY: Record<Lang, CurrencyCode> = {
  ko: "KRW",
  en: "USD",
  ja: "JPY",
  de: "EUR", // EUR 통화권 첫 번째 언어 — 프랑스어·스페인어 등 추가 시도 EUR 매핑
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
              className={`text-xs px-2 py-1 rounded transition-colors cursor-pointer ${
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
