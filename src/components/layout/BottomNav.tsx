import { NavLink } from "react-router-dom";
import { useT } from "@/hooks";

export function BottomNav() {
  const t = useT();

  const NAV_ITEMS = [
    { to: "/", label: t.nav_dashboard, icon: "📊" },
    { to: "/assets", label: t.nav_assets, icon: "💼" },
    { to: "/gurus", label: t.nav_gurus, icon: "💡" },
    { to: "/settings", label: t.nav_settings, icon: "⚙️" },
    { to: "/about", label: t.nav_about, icon: "ℹ️" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 md:hidden safe-bottom">
      <div className="flex justify-around items-center h-14 px-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-[10px] transition-colors ${
                isActive ? "text-blue-600 font-semibold" : "text-slate-400"
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="truncate max-w-[60px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
