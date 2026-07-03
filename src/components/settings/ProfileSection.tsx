import { useState } from "react";
import { useProfileStore, useSettingsStore } from "@/stores";
import { useT } from "@/hooks";
import { Card, AutoResizeTextarea, Button, Input } from "@/components/common";
import { User } from "lucide-react";

export function ProfileSection() {
  const profile = useProfileStore();
  const settings = useSettingsStore();
  const t = useT();
  const [profileSaved, setProfileSaved] = useState(false);

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const inputCls =
    "w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors";

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <User className="size-4 text-indigo-500" />
          {t.profile_title}
        </div>
      }
      action={
        <Button size="sm" variant="secondary" onClick={handleProfileSave}>
          {profileSaved ? t.profile_saved : t.profile_save}
        </Button>
      }
    >
      <div className="space-y-4">
        {/* 설명 */}
        <p className="text-sm leading-relaxed text-zinc-500">
          {t.profile_desc}
        </p>

        {/* 닉네임 / 나이 */}
        <div className="grid grid-cols-[1fr_100px] gap-3">
          <div className="space-y-1">
            <div className="text-xs font-medium text-zinc-400">
              {t.profile_nickname_label}
            </div>
            <Input
              type="text"
              
              placeholder={t.profile_nickname_placeholder}
              value={profile.nickname ?? ""}
              onChange={(e) =>
                profile.setProfile({ nickname: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-zinc-400">
              {t.profile_age_label}
            </div>
            <Input
              type="number"
              min={0}
              
              placeholder={t.profile_age_placeholder}
              value={profile.age ?? ""}
              onChange={(e) =>
                profile.setProfile({
                  age: e.target.value ? Number(e.target.value) : null })
              }
            />
          </div>
        </div>

        {/* 연봉 / 월 투자 가능 금액 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs font-medium text-zinc-400">
              {t.profile_annual_income_label}
              <span className="ml-1 text-zinc-400">({settings.baseCurrency})</span>
            </div>
            <Input
              type="number"
              min={0}
              
              placeholder={t.profile_annual_income_placeholder}
              value={profile.annualIncome ?? ""}
              onChange={(e) =>
                profile.setProfile({
                  annualIncome: e.target.value ? Number(e.target.value) : null })
              }
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-zinc-400">
              {t.profile_monthly_budget_label}
              <span className="ml-1 text-zinc-400">({settings.baseCurrency})</span>
            </div>
            <Input
              type="number"
              min={0}
              
              placeholder={t.profile_monthly_budget_placeholder}
              value={profile.monthlyBudget ?? ""}
              onChange={(e) =>
                profile.setProfile({
                  monthlyBudget: e.target.value ? Number(e.target.value) : null })
              }
            />
          </div>
        </div>

        {/* 투자 계획 */}
        {(
          [
            { key: "plan3y", labelKey: "profile_plan3y_label", placeholderKey: "profile_plan3y_placeholder" },
            { key: "plan5y", labelKey: "profile_plan5y_label", placeholderKey: "profile_plan5y_placeholder" },
            { key: "plan10y", labelKey: "profile_plan10y_label", placeholderKey: "profile_plan10y_placeholder" },
            { key: "notes", labelKey: "profile_notes_label", placeholderKey: "profile_notes_placeholder" },
          ] as const
        ).map(({ key, labelKey, placeholderKey }) => (
          <div key={key} className="space-y-1">
            <div className="text-xs font-medium text-zinc-400">
              {t[labelKey as keyof typeof t] as string}
            </div>
            <AutoResizeTextarea
              className={`${inputCls} resize-none`}
              placeholder={t[placeholderKey as keyof typeof t] as string}
              value={profile[key] ?? ""}
              onChange={(e) => profile.setProfile({ [key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
