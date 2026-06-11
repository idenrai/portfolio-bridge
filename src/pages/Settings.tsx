
import { useT } from "@/hooks";
import {
  ProfileSection,
  DataRefreshSection,
  DataManagementSection,
} from "@/components/settings";

export function SettingsPage() {
  const t = useT();

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold text-slate-800">{t.settings_title}</h2>

      <ProfileSection />
      <DataRefreshSection />
      <DataManagementSection />
    </div>
  );
}
