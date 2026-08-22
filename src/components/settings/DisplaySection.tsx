import { useSettingsStore } from "@/stores";
import { useT } from "@/hooks";
import { Card, CustomSelect } from "@/components/common";
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
          <CustomSelect<CurrencyCode>
            value={settings.baseCurrency}
            onChange={(val) =>
              settings.setBaseCurrency(val, true)
            }
            ariaLabel={t.settings_display_currency_title}
            options={[
              { value: "KRW", label: t.currency_krw },
              { value: "USD", label: t.currency_usd },
              { value: "JPY", label: t.currency_jpy },
              { value: "EUR", label: t.currency_eur },
            ]}
          />
        </div>
      </div>
    </Card>
  );
}
