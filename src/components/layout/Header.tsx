import { useLanguageStore } from "@/stores";
import { LayoutDashboard, Briefcase, Users, Target, Settings, Info, Globe, WifiOff } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useT, useNetworkStatus } from "@/hooks";
import { CustomSelect } from "@/components/common";
import { cn } from "@/utils/cn";
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
  const lang = useLanguageStore((s) => s.lang);
  const setLang = useLanguageStore((s) => s.setLang);
  const t = useT();
  const { isOnline } = useNetworkStatus();

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
          <img src="/favicon.svg" alt="" className="size-6 rounded-none border border-zinc-800" aria-hidden="true" />
          <span className="font-mono text-lg font-bold tracking-tight text-white">
            Portfolio Bridge
          </span>
        </Link>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <Link to="/" className="group mr-6 flex shrink-0 items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="size-7 rounded-none border border-zinc-800" aria-hidden="true" />
          <span className="font-mono text-xl font-bold tracking-tight text-white">
            Portfolio Bridge
          </span>
        </Link>
        <nav className="flex items-center gap-1 font-mono">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-none px-3 py-1.5 text-xs font-bold transition-colors",
                  isActive
                    ? "border border-zinc-200 bg-zinc-200 text-black"
                    : "border border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                )
              }
            >
              {icon}
              <span className="hidden lg:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 font-mono">
        {/* 오프라인 상태 인디케이터 배지 */}
        {!isOnline && (
          <div
            className="flex items-center gap-1.5 rounded-none border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400"
            title={t.offline_badge_tooltip}
            role="status"
            aria-live="polite"
          >
            <span className="size-1.5 animate-pulse rounded-none bg-amber-400" aria-hidden="true" />
            <WifiOff className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t.offline_badge_title}</span>
          </div>
        )}

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
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-none border border-transparent px-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200 focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none"
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

