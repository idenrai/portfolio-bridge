import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { ScrollToTop } from "./ScrollToTop";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-zinc-300 font-mono selection:bg-zinc-800">
      {/* 데스크톱 사이드바 (md 이상) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      {/* 모바일 하단 탭바 (md 미만) */}
      <BottomNav />
      {/* 화면 우측 하단 플로팅 스크롤 맨위로 버튼 */}
      <ScrollToTop />
    </div>
  );
}
