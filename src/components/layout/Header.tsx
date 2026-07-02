import { useLanguageStore, useSettingsStore } from "@/stores";
import { NavLink, Link } from "react-router-dom";
import { useT } from "@/hooks";
import type { Lang } from "@/i18n";
import type { CurrencyCode } from "@/types";

const LANG_LABELS: Record<Lang, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
  de: "🇩🇪",
};

const LANG_ARIA: Record<Lang, string> = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  de: "German",
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
  const t = useT();

  const NAV_ITEMS = [
    { to: "/", label: t.nav_dashboard },
    { to: "/assets", label: t.nav_assets },
    { to: "/gurus", label: t.nav_gurus },
    { to: "/fire", label: t.nav_fire },
    { to: "/settings", label: t.nav_settings },
    { to: "/about", label: t.nav_about },
  ];

  const handleLangChange = (l: Lang) => {
    setLang(l);
    setBaseCurrency(LANG_CURRENCY[l]);
  };

  return (
    <header className="h-14 bg-black border-b border-zinc-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      {/* 모바일: 로고 표시 / 데스크톱: 빈 공간 */}
      <div className="md:hidden">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <img src="/favicon.svg" alt="" className="w-6 h-6 rounded-md border border-zinc-800" aria-hidden="true" />
          <span className="font-bold tracking-tight text-lg text-white">
            Portfolio Bridge
          </span>
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 mr-6 shrink-0 group">
          <img src="/favicon.svg" alt="" className="w-7 h-7 rounded-md border border-zinc-800" aria-hidden="true" />
          <span className="font-bold tracking-tight text-xl text-white">
            Portfolio Bridge
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* 언어 전환 버튼 (화폐 동시 전환) */}
        <div className="flex gap-1">
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLangChange(l)}
              aria-label={LANG_ARIA[l]}
              className={`text-sm min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer border rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-black ${
                lang === l
                  ? "bg-zinc-800 text-white border-zinc-500 shadow-sm"
                  : "text-zinc-500 border-transparent hover:bg-zinc-900"
              }`}
            >
              <span aria-hidden="true">{LANG_LABELS[l]}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
