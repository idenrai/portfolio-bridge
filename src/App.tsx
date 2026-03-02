import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DashboardPage } from "@/pages/Dashboard";
import { AssetsPage } from "@/pages/Assets";
import { GurusPage } from "@/pages/Gurus";
import { SettingsPage } from "@/pages/Settings";
import { AboutPage } from "@/pages/About";
import { useDataRefresh } from "@/hooks";

function AppInitializer() {
  const { refreshAll } = useDataRefresh();
  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
