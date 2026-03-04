import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 데스크톱 사이드바 (md 이상) */}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      {/* 모바일 하단 탭바 (md 미만) */}
      <BottomNav />
    </div>
  );
}
