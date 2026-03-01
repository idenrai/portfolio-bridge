import { NavLink } from "react-router-dom";
import { useT } from "@/hooks";

export function Sidebar() {
  const t = useT();

  const NAV_ITEMS = [
    { to: "/", label: t.nav_dashboard, icon: "📊" },
    { to: "/assets", label: t.nav_assets, icon: "💼" },
    { to: "/gurus", label: t.nav_gurus, icon: "💡" },
    { to: "/settings", label: t.nav_settings, icon: "⚙️" },
    { to: "/about", label: t.nav_about, icon: "ℹ️" },
  ];

  return (
    <aside className="w-60 min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      {/* 로고 */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-blue-400">Portfolio</span>
          <span className="text-slate-400">Bridge</span>
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
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 font-medium"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 하단 */}
      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-600">v0.2.0 · {t.app_version_info}</p>
      </div>
    </aside>
  );
}
