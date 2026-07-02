
import { useT } from "@/hooks";
import {
  ProfileSection,
  DataRefreshSection,
  DataManagementSection,
} from "@/components/settings";

export function SettingsPage() {
  const t = useT();

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-balance">{t.settings_title}</h1>

      <ProfileSection />
      <DataRefreshSection />
      <DataManagementSection />
    </div>
  );
}
