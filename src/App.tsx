import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import { DashboardPage } from "@/pages/Dashboard";
import { AssetsPage } from "@/pages/Assets";
import { GurusPage } from "@/pages/Gurus";
import { SettingsPage } from "@/pages/Settings";
import { AboutPage } from "@/pages/About";
import { FirePlannerPage } from "@/pages/FirePlanner";
import { useDataRefresh } from "@/hooks";
import { initGoogleDriveService } from "@/utils";

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
          <Route index element={<DashboardPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="gurus" element={<GurusPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="fire" element={<FirePlannerPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
