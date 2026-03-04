import { Card, Button } from "@/components/common";
import {
  useSettingsStore,
  useAssetStore,
  useLanguageStore,
} from "@/pages/stores";
import { useDataRefresh, useT } from "@/hooks";
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
                      className="grid py-0.5 items-center gap-x-2"
                      style={{ gridTemplateColumns: "1fr 6rem 7rem 2.5rem" }}
                    >
                      <span className="text-sm text-slate-600 truncate">
                        {currencyName} ({code})
                      </span>
                      <span className="text-xs text-slate-400 text-right tabular-nums">
                        {unit} {code} =
                      </span>
                      <span className="text-sm font-mono text-slate-800 text-right tabular-nums">
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
