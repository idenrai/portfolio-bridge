import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { ScrollToTop } from "./ScrollToTop";
import { useT } from "@/hooks";

export function Layout() {
  const t = useT();

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-300 selection:bg-zinc-800">
      <Header />
      <main className="flex-1 p-3 sm:p-4 md:p-6 pb-20 md:pb-6 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>

        {/* 데스크톱 전용 푸터 */}
        <footer className="hidden md:flex justify-center py-4 mt-8 border-t border-zinc-800 text-xs text-zinc-600 shrink-0">
          <p>v0.2.0 · {t.app_version_info}</p>
        </footer>
      </main>

      {/* 모바일 하단 네비게이션 */}
      <BottomNav />
      {/* 화면 우측 하단 플로팅 스크롤 맨위로 버튼 */}
      <ScrollToTop />
    </div>
  );
}
