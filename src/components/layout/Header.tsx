import { useLanguageStore } from "@/stores";
import { LayoutDashboard, Briefcase, Users, Target, Settings, Info, Globe } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useT } from "@/hooks";
import { CustomSelect } from "@/components/common";
import type { Lang } from "@/i18n";

const LANG_LABELS: Record<Lang, string> = {
  ko: "KR",
  en: "US",
  ja: "JP",
  de: "DE",
};

const LANG_ARIA: Record<Lang, string> = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  de: "German",
};

export function Header() {
  const { lang, setLang } = useLanguageStore();
  const t = useT();

  const NAV_ITEMS = [
    { to: "/", label: t.nav_dashboard, icon: <LayoutDashboard className="size-4" /> },
    { to: "/assets", label: t.nav_assets, icon: <Briefcase className="size-4" /> },
    { to: "/gurus", label: t.nav_gurus, icon: <Users className="size-4" /> },
    { to: "/fire", label: t.nav_fire, icon: <Target className="size-4" /> },
    { to: "/settings", label: t.nav_settings, icon: <Settings className="size-4" /> },
    { to: "/about", label: t.nav_about, icon: <Info className="size-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-zinc-800 bg-black px-4 md:px-6">
      {/* 모바일: 로고 표시 / 데스크톱: 빈 공간 */}
      <div className="md:hidden">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="size-6 rounded-md border border-zinc-800" aria-hidden="true" />
          <span className="text-lg font-bold tracking-tight text-white">
            Portfolio Bridge
          </span>
        </Link>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <Link to="/" className="group mr-6 flex shrink-0 items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="size-7 rounded-md border border-zinc-800" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight text-white">
            Portfolio Bridge
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              aria-label={label}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`
              }
            >
              {icon}
              <span className="hidden lg:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* 언어 전환 버튼 (커스텀 드롭다운) */}
        <div className="flex items-center justify-center">
          <CustomSelect<Lang>
            value={lang}
            onChange={(val) => setLang(val)}
            options={(Object.keys(LANG_LABELS) as Lang[]).map((l) => ({
              value: l,
              label: `${LANG_ARIA[l]} (${LANG_LABELS[l]})`,
            }))}
            ariaLabel="Change Language"
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-black focus-visible:outline-none"
            trigger={
              <>
                <Globe className="size-4" />
                <span className="text-xs font-bold uppercase">{LANG_LABELS[lang]}</span>
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}

