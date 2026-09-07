import { useT } from "@/hooks";
import {
  ProfileSection,
  DisplaySection,
  TargetAllocationSection,
  DataRefreshSection,
  DataManagementSection,
} from "@/components/settings";

export function SettingsPage() {
  const t = useT();

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-balance text-white md:text-3xl">
        {t.settings_title}
      </h1>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
        {/* 좌측 컬럼: 시스템 및 자산 관리 설정 */}
        <div className="order-2 flex flex-col gap-4 lg:order-1 lg:col-span-5 lg:gap-6">
          <DisplaySection />
          <TargetAllocationSection />
          <DataRefreshSection />
          <DataManagementSection />
        </div>

        {/* 우측 컬럼: 투자자 프로필 & 장기 계획 */}
        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:col-span-7 lg:gap-6">
          <ProfileSection />
        </div>
      </div>
    </div>
  );
}
