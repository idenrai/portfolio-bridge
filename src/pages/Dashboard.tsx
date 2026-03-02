import { usePortfolio, useDataRefresh, useT } from "@/hooks";
import {
  useAssetStore,
  useSettingsStore,
  useLanguageStore,
} from "@/pages/stores";
import { LANG_LOCALES } from "@/i18n";
import { KpiBar } from "@/components/dashboard/KpiBar";
import { AllocationPieCharts } from "@/components/dashboard/AllocationPieCharts";
import { TopHoldingsTable } from "@/components/dashboard/TopHoldingsTable";
import { TagAnalysisCard } from "@/components/dashboard/TagAnalysisCard";
import { CurrencyExposureCard } from "@/components/dashboard/CurrencyExposureCard";
import { RebalanceCard } from "@/components/dashboard/RebalanceCard";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { SAMPLE_ASSETS } from "@/utils/sampleData";

export function DashboardPage() {
  const { assets, summary, rebalancing } = usePortfolio();
  const { addAsset } = useAssetStore();
  const targets = useSettingsStore((s) => s.targetAllocations);
  const lang = useLanguageStore((s) => s.lang);
  const langLocale = LANG_LOCALES[lang];
  const t = useT();

  const { refreshAll, isLoading, lastUpdated } = useDataRefresh();

  const handleLoadSample = () => {
    SAMPLE_ASSETS.forEach((data) => addAsset(data));
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <p className="text-6xl mb-4">📊</p>
        <h2 className="text-xl font-semibold text-slate-600 mb-2">
          {t.dash_empty_title}
        </h2>
        <p className="text-sm">{t.dash_empty_desc}</p>

        {/* 이용 안내 */}
        <div className="mt-8 w-full max-w-lg space-y-2">
          {[t.dash_notice_storage, t.dash_notice_csv, t.dash_notice_mobile].map(
            (notice, i) => (
              <p
                key={i}
                className="text-xs text-slate-500 bg-slate-100 rounded-lg px-4 py-2.5 text-left leading-relaxed"
              >
                {notice}
              </p>
            ),
          )}
        </div>

        {/* 샘플 데이터 온보딩 */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {t.dash_sample_btn}
          </button>
          <p className="text-xs text-slate-400">{t.dash_sample_hint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 타이틀 + 갱신 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-800">{t.dash_title}</h2>

        <button
          type="button"
          onClick={() => refreshAll()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <span>🔄</span>
          <span>{t.dash_refresh}</span>
          {isLoading ? (
            <span className="text-blue-500">{t.dash_refreshing}</span>
          ) : (
            lastUpdated && (
              <span className="text-slate-400">
                {t.dash_updated_at(
                  new Date(lastUpdated).toLocaleTimeString(langLocale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                )}
              </span>
            )
          )}
        </button>
      </div>

      {/* ① KPI 바 */}
      <KpiBar summary={summary} />

      {/* ② 인사이트 (상단 고정) */}
      <InsightsPanel summary={summary} assets={assets} targets={targets} />

      {/* ③ 파이 차트 (국가별 · 태그별) */}
      <AllocationPieCharts summary={summary} />

      {/* ④ 보유종목 테이블 */}
      <TopHoldingsTable summary={summary} />

      {/* ⑤ 하단 3열 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TagAnalysisCard rebalancing={rebalancing} />
        <CurrencyExposureCard summary={summary} />
        <RebalanceCard rebalancing={rebalancing} />
      </div>
    </div>
  );
}
