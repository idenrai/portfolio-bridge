import { useSettingsStore, useAssetStore, useLanguageStore } from "@/stores";
import { useT, useDataRefresh, useExchangeRates } from "@/hooks";
import { Card, Button } from "@/components/common";
import type { CurrencyCode } from "@/types";
import { LANG_LOCALES } from "@/i18n";
import { format } from "date-fns";

export function DataRefreshSection() {
  const settings = useSettingsStore();
  const assetStore = useAssetStore();
  const lang = useLanguageStore((s) => s.lang);
  const langLocale = LANG_LOCALES[lang];
  const t = useT();

  const baseCurrency = settings.baseCurrency;
  const { data: exchangeRates } = useExchangeRates();
  const baseCurrencyRate = exchangeRates[baseCurrency] ?? 1;
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

  return (
    <Card
      title={t.settings_data_refresh_title}
      action={
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-zinc-400">
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
          <p className="rounded bg-red-500/10 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}
        {!isLoading && failedAssets.length > 0 && (
          <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {t.data_refresh_partial_fail(
              failedAssets.map((a) => `${a.name} (${a.ticker})`),
            )}
          </p>
        )}
        {isCached && lastUpdated && (
          <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-700">
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
          <p className="mb-2 text-xs font-medium text-zinc-500">
            {t.settings_fx_title}
          </p>
          <div className="space-y-1">
            {(Object.keys(exchangeRates) as CurrencyCode[])
              .filter((code) => code !== baseCurrency)
              .map((code) => {
                const UNIT: Partial<Record<CurrencyCode, number>> = {
                  KRW: 1000,
                  JPY: 100,
                };
                const unit = UNIT[code] ?? 1;
                const rateInBase =
                  ((exchangeRates[code] ?? 1) / baseCurrencyRate) *
                  unit;
                const currencyName = currencyDisplayNames.of(code) ?? code;
                return (
                  <div
                    key={code}
                    className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-1 py-0.5 sm:gap-x-2"
                  >
                    <span className="truncate text-xs text-zinc-400 sm:text-sm">
                      {currencyName} ({code})
                    </span>
                    <span className="text-right text-[10px] text-zinc-400 tabular-nums sm:text-xs">
                      {unit} {code} =
                    </span>
                    <span className="text-right font-mono text-xs text-zinc-100 tabular-nums sm:text-sm">
                      {rateInBase.toLocaleString(langLocale, {
                        maximumSignificantDigits: 4,
                      })}
                    </span>
                    <span className="text-xs text-zinc-400">
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
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/50">
              <div
                className="h-full rounded-full bg-zinc-300 transition-all duration-300"
                style={{
                  width: `${Math.round((updatedCount / totalCount) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-zinc-400">
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
          <p className="text-xs text-zinc-400">
            {assetStore.assets.some(
              (a) => a.ticker && !a.categories.includes("cash"),
            )
              ? t.settings_data_refresh_auto
              : t.settings_data_refresh_no_ticker}
          </p>
        )}
      </div>
    </Card>
  );
}
