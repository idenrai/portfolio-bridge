import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import { PageSkeleton } from "@/components/common";
import { useDataRefresh } from "@/hooks";
import { initGoogleDriveService } from "@/utils";

const DashboardPage = lazy(() =>
  import("@/pages/Dashboard").then((m) => ({ default: m.DashboardPage })),
);
const AssetsPage = lazy(() =>
  import("@/pages/Assets").then((m) => ({ default: m.AssetsPage })),
);
const GurusPage = lazy(() =>
  import("@/pages/Gurus").then((m) => ({ default: m.GurusPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/Settings").then((m) => ({ default: m.SettingsPage })),
);
const FirePlannerPage = lazy(() =>
  import("@/pages/FirePlanner").then((m) => ({ default: m.FirePlannerPage })),
);
const AboutPage = lazy(() =>
  import("@/pages/About").then((m) => ({ default: m.AboutPage })),
);

function AppInitializer() {
  const { refreshAll } = useDataRefresh();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      refreshAll();
      initGoogleDriveService(); // Drive 서비스 초기화 (앱 전체에서 1회)
    }
  }, [refreshAll]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer />
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageSkeleton />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="assets"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AssetsPage />
              </Suspense>
            }
          />
          <Route
            path="gurus"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <GurusPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="fire"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <FirePlannerPage />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AboutPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
