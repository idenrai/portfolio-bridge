import { NavLink } from "react-router-dom";
import { useT } from "@/hooks";

export function BottomNav() {
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
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-black border-t border-zinc-800 md:hidden safe-bottom">
      <div className="flex justify-around items-center h-14 px-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center justify-center flex-1 py-0 h-full text-[11px] transition-colors border-r last:border-r-0 border-zinc-800 ${
                isActive ? "bg-zinc-200 text-black font-bold" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`
            }
          >
            <span className="truncate px-1 text-center w-full">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
