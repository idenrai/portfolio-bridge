import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { ScrollToTop } from "./ScrollToTop";
export function Layout() {

  return (
    <div className="flex min-h-screen flex-col bg-black text-zinc-300 selection:bg-zinc-800">
      <Header />
      <main className="flex flex-1 flex-col p-3 pb-20 sm:p-4 md:p-6 md:pb-6">
        <div className="flex-1">
          <Outlet />
        </div>

        {/* 데스크톱 전용 푸터 */}
        <footer className="mt-8 hidden shrink-0 justify-center border-t border-zinc-800 py-4 text-xs text-zinc-500 md:flex">
          <p>© 2026 Portfolio Bridge. Crafted for independent investors.</p>
        </footer>
      </main>

      {/* 모바일 하단 네비게이션 */}
      <BottomNav />
      {/* 화면 우측 하단 플로팅 스크롤 맨위로 버튼 */}
      <ScrollToTop />
    </div>
  );
}
