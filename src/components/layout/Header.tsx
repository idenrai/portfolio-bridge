import { useLanguageStore, useSettingsStore } from "@/stores";
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

interface Props {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: Props) {
  const { lang, setLang } = useLanguageStore();
  const setBaseCurrency = useSettingsStore((s) => s.setBaseCurrency);

  const handleLangChange = (l: Lang) => {
    setLang(l);
    setBaseCurrency(LANG_CURRENCY[l]);
  };

  return (
    <header className="h-14 bg-black border-b border-zinc-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      {/* 모바일: 로고 표시 / 데스크톱: 빈 공간 */}
      <div className="md:hidden">
        <span className="text-sm font-bold tracking-tight">
          <span className="text-zinc-500">{'> '}</span>
          <span className="text-white">PORTFOLIO_BRIDGE</span>
          <span className="text-zinc-500 animate-pulse">_</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 -ml-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
          aria-label="Open menu"
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>
        <span className="text-sm font-bold tracking-tight">
          <span className="text-zinc-500">{'> '}</span>
          <span className="text-white">PORTFOLIO_BRIDGE</span>
          <span className="text-zinc-500 animate-pulse">_</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* 언어 전환 버튼 (화폐 동시 전환) */}
        <div className="flex gap-1">
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLangChange(l)}
              className={`text-xs px-2 py-1 transition-colors cursor-pointer border rounded-sm ${
                lang === l
                  ? "bg-zinc-800 text-white border-zinc-500 font-bold shadow-sm"
                  : "text-zinc-500 border-transparent hover:bg-zinc-900 hover:text-zinc-300"
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
