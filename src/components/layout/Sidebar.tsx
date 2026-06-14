import { NavLink } from "react-router-dom";
import { useT } from "@/hooks";

export function Sidebar() {
  const t = useT();

  const NAV_ITEMS = [
    { to: "/", label: t.nav_dashboard, icon: "📊" },
    { to: "/assets", label: t.nav_assets, icon: "💼" },
    { to: "/gurus", label: t.nav_gurus, icon: "💡" },
    { to: "/fire", label: t.nav_fire, icon: "🌴" },
    { to: "/settings", label: t.nav_settings, icon: "⚙️" },
    { to: "/about", label: t.nav_about, icon: "ℹ️" },
  ];

  return (
    <aside className="hidden md:flex w-60 min-h-screen bg-zinc-950 text-zinc-300 flex-col border-r border-zinc-800">
      {/* 로고 */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-zinc-500">{'> '}</span>
          <span className="text-white">PORTFOLIO</span>
          <br />
          <span className="text-white pl-4">BRIDGE</span>
          <span className="text-zinc-500 animate-pulse">_</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">{t.app_tagline}</p>
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
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 하단 */}
      <div className="px-6 py-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-600">v0.2.0 · {t.app_version_info}</p>
      </div>
    </aside>
  );
}
