
import { useT } from "@/hooks";
import {
  ProfileSection,
  DataRefreshSection,
  DataManagementSection,
} from "@/components/settings";

export function SettingsPage() {
  const t = useT();

  return (
    <div className="mx-auto max-w-2xl space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-balance text-white md:text-3xl">{t.settings_title}</h1>

      <ProfileSection />
      <DataRefreshSection />
      <DataManagementSection />
    </div>
  );
}
