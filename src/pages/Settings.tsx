import { useState } from "react";
import { Card, Button } from "@/components/common";
import { useSettingsStore, useAssetStore, useLanguageStore } from "@/stores";
import { useExchangeRates, useT } from "@/hooks";
import { CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/types";
import type { AssetTag, TargetAllocation } from "@/types";
import { LANG_LOCALES } from "@/i18n";
import { format } from "date-fns";

export function SettingsPage() {
  const settings = useSettingsStore();
  const assetStore = useAssetStore();
  const lang = useLanguageStore((s) => s.lang);
  const langLocale = LANG_LOCALES[lang];
  const {
    refreshRates,
    isLoading,
    lastUpdated,
    error: rateError,
    isCached,
  } = useExchangeRates();
  const [allocations, setAllocations] = useState<TargetAllocation[]>([
    ...settings.targetAllocations,
  ]);
  const [saved, setSaved] = useState(false);

  const handleAllocationChange = (index: number, value: string) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], targetPercent: Number(value) || 0 };
    setAllocations(updated);
    setSaved(false);
  };

  const saveAllocations = () => {
    settings.setTargetAllocations(allocations);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalPercent = allocations.reduce((s, a) => s + a.targetPercent, 0);
  const isExact = Math.abs(totalPercent - 100) < 0.01;
  const t = useT();

  const handleResetAll = () => {
    if (window.confirm(t.settings_data_reset_confirm)) {
      localStorage.removeItem("portfolio-bridge-assets");
      localStorage.removeItem("portfolio-bridge-settings");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold text-slate-800">{t.settings_title}</h2>

      {/* 환율 */}
      <Card
        title={t.settings_fx_title}
        action={
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                {t.settings_fx_time(format(new Date(lastUpdated), "HH:mm"))}
              </span>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={refreshRates}
              disabled={isLoading}
            >
              {isLoading ? t.settings_fx_refreshing : t.settings_fx_refresh}
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {rateError && (
            <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">
              {rateError}
            </p>
          )}
          {isCached && lastUpdated && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2">
              {t.settings_fx_cache_warn(
                new Date(lastUpdated).toLocaleTimeString(langLocale, {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              )}
            </p>
          )}
          {(
            Object.entries(CURRENCY_LABELS).filter(([k]) => k !== "KRW") as [
              keyof typeof CURRENCY_SYMBOLS,
              string,
            ][]
          ).map(([code, label]) => (
            <div key={code} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-32">{label}</span>
              <span className="text-sm font-mono text-slate-800 w-24 text-right">
                {settings.exchangeRates[code]?.toLocaleString(langLocale, {
                  maximumFractionDigits: 2,
                }) ?? "—"}
              </span>
              <span className="text-xs text-slate-400">KRW</span>
            </div>
          ))}
          {!lastUpdated && !rateError && !isCached && (
            <p className="text-xs text-slate-400">{t.settings_fx_auto}</p>
          )}
        </div>
      </Card>

      {/* 목표 비중 */}
      <Card title={t.settings_target_title}>
        <div className="space-y-2">
          {allocations.map((a, i) => (
            <label key={a.tag} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-32">
                {t.tag_labels[a.tag as AssetTag] ?? a.tag}
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={a.targetPercent}
                onChange={(e) => handleAllocationChange(i, e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              />
              <span className="text-xs text-slate-400">%</span>
            </label>
          ))}

          {/* 합계 + 저장 */}
          <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
            <span
              className={`text-sm font-medium ${
                isExact ? "text-green-600" : "text-red-600"
              }`}
            >
              {t.settings_target_sum(totalPercent.toFixed(0))}
            </span>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="text-xs text-green-600 font-medium animate-pulse">
                  ✓ {t.settings_target_saved}
                </span>
              )}
              <Button size="sm" onClick={saveAllocations} disabled={!isExact}>
                {t.settings_target_save}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 데이터 관리 */}
      <Card title={t.settings_data_title}>
        <div className="space-y-3">
          <p className="text-sm text-slate-500">{t.settings_data_desc}</p>
          <p className="text-sm text-slate-500">
            {t.settings_data_count(assetStore.assets.length)}
          </p>
          <Button variant="danger" size="sm" onClick={handleResetAll}>
            {t.settings_data_reset}
          </Button>
        </div>
      </Card>
    </div>
  );
}
