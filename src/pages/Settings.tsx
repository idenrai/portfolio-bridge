import { Card, Button } from "@/components/common";
import {
  useSettingsStore,
  useAssetStore,
  useLanguageStore,
} from "@/pages/stores";
import { useDataRefresh, useT, useGoogleDrive } from "@/hooks";
import type { CurrencyCode } from "@/types";
import { LANG_LOCALES } from "@/i18n";
import { format } from "date-fns";

export function SettingsPage() {
  const settings = useSettingsStore();
  const assetStore = useAssetStore();
  const lang = useLanguageStore((s) => s.lang);
  const langLocale = LANG_LOCALES[lang];

  const t = useT();
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
  const drive = useGoogleDrive();

  const handleResetAll = () => {
    if (window.confirm(t.settings_data_reset_confirm)) {
      localStorage.removeItem("portfolio-bridge-assets");
      localStorage.removeItem("portfolio-bridge-settings");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl">
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
            <p className="text-xs font-medium text-slate-500 mb-2">
              {t.settings_fx_title}
            </p>
            <div className="space-y-1">
              {(Object.keys(settings.exchangeRates) as CurrencyCode[])
                .filter((code) => code !== baseCurrency)
                .map((code) => {
                  const UNIT: Partial<Record<CurrencyCode, number>> = {
                    KRW: 1000,
                    JPY: 100,
                  };
                  const unit = UNIT[code] ?? 1;
                  const rateInBase =
                    ((settings.exchangeRates[code] ?? 1) / baseCurrencyRate) *
                    unit;
                  const currencyName = currencyDisplayNames.of(code) ?? code;
                  return (
                    <div
                      key={code}
                      className="grid py-0.5 items-center gap-x-1 sm:gap-x-2"
                      style={{ gridTemplateColumns: "1fr auto auto auto" }}
                    >
                      <span className="text-xs sm:text-sm text-slate-600 truncate">
                        {currencyName} ({code})
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-400 text-right tabular-nums">
                        {unit} {code} =
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-slate-800 text-right tabular-nums">
                        {rateInBase.toLocaleString(langLocale, {
                          maximumSignificantDigits: 4,
                        })}
                      </span>
                      <span className="text-xs text-slate-400">
                        {baseCurrency}
                      </span>
                    </div>
                  );
                })}
            </div>
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

      {/* 데이터 관리 */}
      <Card title={t.settings_data_title}>
        <div className="space-y-5">
          {/* Google Drive 연동 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 tracking-wide">
              Google Drive
            </p>
            {drive.isConnected ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={drive.loadFromDrive}
                    disabled={drive.isSyncing}
                  >
                    {drive.isLoading ? (
                      <span className="animate-pulse">{t.drive_syncing}</span>
                    ) : (
                      t.drive_load_from_drive
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={drive.syncNow}
                    disabled={drive.isSyncing}
                  >
                    {drive.isSaving ? (
                      <span className="animate-pulse">{t.drive_saving}</span>
                    ) : (
                      t.drive_save_to_drive
                    )}
                  </Button>
                  {drive.syncedAt && (
                    <span className="text-xs text-slate-400">
                      {t.drive_synced_at(
                        format(new Date(drive.syncedAt), "HH:mm"),
                      )}
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={drive.disconnect}
                    disabled={drive.isSyncing}
                  >
                    {t.drive_disconnect}
                  </Button>
                </div>
                {drive.syncError && (
                  <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-1.5">
                    {t.drive_error_prefix}{" "}
                    {drive.syncError === "no_client_id"
                      ? t.drive_error_no_client_id
                      : drive.syncError === "gis_not_loaded"
                        ? t.drive_error_gis_not_loaded
                        : drive.syncError}
                  </p>
                )}
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
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-slate-500">{t.drive_desc}</p>
                <Button size="sm" variant="secondary" onClick={drive.connect}>
                  {t.drive_connect}
                </Button>
              </div>
            )}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 space-y-1">
              <p className="text-xs font-medium text-slate-600">
                💡 Google Drive 데이터 삭제
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.settings_data_drive_note}
              </p>
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-blue-600 hover:underline mt-0.5"
              >
                myaccount.google.com/permissions →
              </a>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* 로컬 스토리지 초기화 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 tracking-wide">
              {t.settings_data_local_title}
            </p>
            <p className="text-sm text-slate-500">{t.settings_data_desc}</p>
            <Button variant="danger" size="sm" onClick={handleResetAll}>
              {t.settings_data_reset}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
