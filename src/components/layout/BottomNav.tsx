import { NavLink } from "react-router-dom";
import { useT } from "@/hooks";

export function BottomNav() {
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
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-black border-t border-zinc-800 md:hidden safe-bottom">
      <div className="flex justify-around items-center h-14 px-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-[10px] transition-colors border-r last:border-r-0 border-zinc-800 ${
                isActive ? "bg-zinc-200 text-black font-bold" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
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
