import { useSettingsStore } from "@/stores";
import { useT } from "@/hooks";
import { Card, Select } from "@/components/common";
import { Monitor } from "lucide-react";
import type { CurrencyCode } from "@/types";

export function DisplaySection() {
  const settings = useSettingsStore();
  const t = useT();

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Monitor className="size-4 text-emerald-500" />
          {t.settings_display_currency_title}
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-zinc-500">
          {t.settings_display_currency_desc}
        </p>

        <div className="space-y-1 md:w-1/2">
          <Select
            value={settings.baseCurrency}
            onChange={(e) => settings.setBaseCurrency(e.target.value as CurrencyCode)}
            aria-label={t.settings_display_currency_title}
          >
            <option value="KRW">KRW - {t.currency_krw ?? "대한민국 원"}</option>
            <option value="USD">USD - {t.currency_usd ?? "미국 달러"}</option>
            <option value="JPY">JPY - {t.currency_jpy ?? "일본 엔"}</option>
            <option value="EUR">EUR - {t.currency_eur ?? "유로"}</option>
          </Select>
        </div>
      </div>
    </Card>
  );
}
