import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useT } from "@/hooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: Props) {
  const t = useT();

  // Escape to close & Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const NAV_ITEMS = [
    { to: "/", label: t.nav_dashboard },
    { to: "/assets", label: t.nav_assets },
    { to: "/gurus", label: t.nav_gurus },
    { to: "/fire", label: t.nav_fire },
    { to: "/settings", label: t.nav_settings },
    { to: "/about", label: t.nav_about },
  ];

  return (
    <>
      {/* 백드롭 (데스크톱에서 사이드바가 열렸을 때만 표시) */}
      {isOpen && (
        <div 
          className="hidden md:block fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 사이드바 본체 */}
      <aside 
        className={`hidden md:flex fixed inset-y-0 left-0 z-[60] w-72 bg-zinc-950 text-zinc-300 flex-col border-r border-zinc-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-2xl shadow-black/50" : "-translate-x-full"
        }`}
      >
        {/* 로고 & 닫기 버튼 */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-zinc-500">{'> '}</span>
            <span className="text-white">PORTFOLIO BRIDGE</span>
            <span className="text-zinc-500 animate-pulse">_</span>
          </h1>
          <button
            onClick={onClose}
            className="p-1.5 -mr-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            aria-label="Close menu"
          >
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
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
      </aside>
    </>
  );
}
