import { NavLink } from "react-router-dom";
import { useT } from "@/hooks";

interface Props {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: Props) {
  const t = useT();

  const NAV_ITEMS = [
    { to: "/", label: t.nav_dashboard },
    { to: "/assets", label: t.nav_assets },
    { to: "/gurus", label: t.nav_gurus },
    { to: "/fire", label: t.nav_fire },
    { to: "/settings", label: t.nav_settings },
    { to: "/about", label: t.nav_about },
  ];

  return (
    <aside 
      className={`hidden md:flex h-screen sticky top-0 overflow-hidden bg-zinc-950 text-zinc-300 flex-col border-zinc-800 transition-[width] duration-300 ease-in-out shrink-0 ${
        isOpen ? "w-72 border-r" : "w-0 border-r-0"
      }`}
    >
      {/* 내부 컨텐츠가 너비 변동 시 찌그러지지 않도록 w-72 고정 래퍼 사용 */}
      <div className="w-72 flex flex-col h-full">
        {/* 로고 */}
        <div className="h-14 px-6 flex flex-col justify-center border-b border-zinc-800 shrink-0">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-zinc-500">{'> '}</span>
            <span className="text-white">PORTFOLIO BRIDGE</span>
            <span className="text-zinc-500 animate-pulse">_</span>
          </h1>
        </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors border ${
                isActive
                  ? "bg-zinc-200 text-black border-zinc-200 font-bold"
                  : "text-zinc-500 border-transparent hover:bg-zinc-900 hover:text-zinc-300"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 하단 */}
        <div className="px-6 py-4 border-t border-zinc-800 shrink-0">
          <p className="text-xs text-zinc-600">v0.2.0 · {t.app_version_info}</p>
        </div>
      </div>
    </aside>
  );
}
