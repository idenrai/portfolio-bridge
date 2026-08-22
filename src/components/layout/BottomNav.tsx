import { NavLink } from "react-router-dom";
import { useT } from "@/hooks";
import { cn } from "@/utils/cn";

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
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-black safe-bottom md:hidden">
      <div className="flex h-14 items-center justify-around px-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex h-full flex-1 items-center justify-center border-r border-zinc-800 py-0 text-[11px] transition-colors last:border-r-0",
                isActive
                  ? "bg-zinc-200 font-bold text-black"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )
            }
          >
            <span className="w-full truncate px-1 text-center">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

