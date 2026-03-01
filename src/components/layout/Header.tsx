import { useSettingsStore, useLanguageStore } from "@/stores";
import { CURRENCY_LABELS } from "@/types";
import type { CurrencyCode } from "@/types";
import type { Lang } from "@/i18n";

const LANG_LABELS: Record<Lang, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
};

export function Header() {
  const { baseCurrency, setBaseCurrency } = useSettingsStore();
  const { lang, setLang } = useLanguageStore();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        {/* 언어 전환 버튼 */}
        <div className="flex gap-1">
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
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
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value as CurrencyCode)}
          className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white"
        >
          {(Object.entries(CURRENCY_LABELS) as [CurrencyCode, string][]).map(
            ([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>
    </header>
  );
}
