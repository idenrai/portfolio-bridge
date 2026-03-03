import { useState } from "react";
import { Card, Button } from "@/components/common";
import {
  useSettingsStore,
  useAssetStore,
  useLanguageStore,
} from "@/pages/stores";
import { useDataRefresh, useGoogleDrive, useT } from "@/hooks";
import type { AssetCategory, CurrencyCode, TargetAllocation } from "@/types";
import { LANG_LOCALES } from "@/i18n";
import { format } from "date-fns";

export function SettingsPage() {
  const settings = useSettingsStore();
  const assetStore = useAssetStore();
  const lang = useLanguageStore((s) => s.lang);
  const langLocale = LANG_LOCALES[lang];

  const drive = useGoogleDrive();
  const baseCurrency = settings.baseCurrency;
  const baseCurrencyRate = settings.exchangeRates[baseCurrency] ?? 1;
  const currencyDisplayNames = new Intl.DisplayNames([langLocale], {
    type: "currency",
  });
  const {
    refreshAll,
    isLoading,
    lastUpdated,
    error,
    isCached,
    updatedCount,
    totalCount,
    failedAssets,
  } = useDataRefresh();
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

      {/* 환율 · 시세 통합 갱신 */}
      <Card
        title={t.settings_data_refresh_title}
        action={
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                {t.settings_data_refresh_time(
                  format(new Date(lastUpdated), "HH:mm"),
                )}
              </span>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={refreshAll}
              disabled={isLoading}
            >
              {isLoading
                ? t.settings_data_refresh_refreshing
                : t.settings_data_refresh_refresh}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">
              {error}
            </p>
          )}
          {!isLoading && failedAssets.length > 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2">
              {t.data_refresh_partial_fail(
                failedAssets.map((a) => `${a.name} (${a.ticker})`),
              )}
            </p>
          )}
          {isCached && lastUpdated && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2">
              {t.settings_data_refresh_cache_warn(
                new Date(lastUpdated).toLocaleTimeString(langLocale, {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              )}
            </p>
          )}

          {/* 환율 표시 */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">
              {t.settings_fx_title}
            </p>
            {(Object.keys(settings.exchangeRates) as CurrencyCode[])
              .filter((code) => code !== baseCurrency)
              .map((code) => {
                // 직접 호가: 1 code = X baseCurrency
                const rateInBase =
                  (settings.exchangeRates[code] ?? 1) / baseCurrencyRate;
                const currencyName = currencyDisplayNames.of(code) ?? code;
                return (
                  <div key={code} className="flex items-center gap-3 py-0.5">
                    <span className="text-sm text-slate-600 w-52">
                      {currencyName} ({code})
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">
                      1 {code} =
                    </span>
                    <span className="text-sm font-mono text-slate-800 w-28 text-right">
                      {rateInBase.toLocaleString(langLocale, {
                        maximumSignificantDigits: 4,
                      })}
                    </span>
                    <span className="text-xs text-slate-400">{baseCurrency}</span>
                  </div>
                );
              })}
          </div>

          {/* 시세 진행률 */}
          {isLoading && totalCount > 0 && (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.round((updatedCount / totalCount) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {t.settings_data_refresh_result(updatedCount, totalCount)}
              </p>
            </div>
          )}
          {!isLoading && lastUpdated && totalCount > 0 && (
            <p className="text-xs text-green-600">
              {t.settings_data_refresh_result(updatedCount, totalCount)}
            </p>
          )}
          {!isLoading && !lastUpdated && !error && !isCached && (
            <p className="text-xs text-slate-400">
              {assetStore.assets.some(
                (a) => a.ticker && !a.categories.includes("cash"),
              )
                ? t.settings_data_refresh_auto
                : t.settings_data_refresh_no_ticker}
            </p>
          )}
        </div>
      </Card>

      {/* Google Drive 동기화 */}
      <Card
        title={t.drive_title}
        action={
          drive.isConnected ? (
            <div className="flex items-center gap-2">
              {drive.isSyncing ? (
                <span className="text-xs text-blue-600 animate-pulse">
                  {t.drive_syncing}
                </span>
              ) : drive.syncedAt ? (
                <span className="text-xs text-slate-400">
                  {t.drive_synced_at(format(new Date(drive.syncedAt), "HH:mm"))}
                </span>
              ) : null}
              <Button
                size="sm"
                variant="secondary"
                onClick={drive.syncNow}
                disabled={drive.isSyncing}
              >
                {t.drive_sync_now}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={drive.disconnect}
                disabled={drive.isSyncing}
              >
                {t.drive_disconnect}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="secondary" onClick={drive.connect}>
              {t.drive_connect}
            </Button>
          )
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-500">{t.drive_desc}</p>

          {/* 연결 상태 */}
          {drive.isConnected && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-700 font-medium">
                {t.drive_connected}
              </span>
            </div>
          )}

          {/* 에러 */}
          {drive.syncError && (
            <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">
              {t.drive_error_prefix}{" "}
              {drive.syncError === "no_client_id"
                ? t.drive_error_no_client_id
                : drive.syncError === "gis_not_loaded"
                  ? t.drive_error_gis_not_loaded
                  : drive.syncError}
            </p>
          )}

          {/* 충돌 해소 UI */}
          {drive.pendingConflict && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 space-y-2">
              <p className="text-xs font-semibold text-amber-800">
                {t.drive_conflict_title}
              </p>
              <p className="text-xs text-amber-700">
                {t.drive_conflict_desc(
                  format(
                    new Date(drive.pendingConflict.syncedAt),
                    "MM/dd HH:mm",
                  ),
                  drive.syncedAt
                    ? format(new Date(drive.syncedAt), "MM/dd HH:mm")
                    : "-",
                )}
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={drive.resolveWithDrive}>
                  {t.drive_use_drive}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={drive.resolveWithLocal}
                >
                  {t.drive_use_local}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 목표 비중 */}
      <Card title={t.settings_target_title}>
        <div className="space-y-2">
          {allocations.map((a, i) => (
            <label key={a.category} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-32">
                {t.category_labels[a.category as AssetCategory] ?? a.category}
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
