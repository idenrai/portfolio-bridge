import { useEffect, lazy, Suspense } from "react";
import { usePortfolio, useDataRefresh, useT } from "@/hooks";
import {
  useAssetStore,
  useSettingsStore,
  useLanguageStore,
  useSnapshotStore,
} from "@/stores";
import { LANG_LOCALES } from "@/i18n";
import {
  KpiBar,
  AllocationPieCharts,
  TopHoldingsTable,
  CategoryAnalysisCard,
  CurrencyExposureCard,
  RebalanceCard,
  InsightsPanel,
} from "@/components/dashboard";
import { SAMPLE_ASSETS } from "@/utils";

const PortfolioHistoryChart = lazy(() =>
  import("@/components/dashboard/PortfolioHistoryChart").then((mod) => ({ default: mod.PortfolioHistoryChart }))
);
const PnLWaterfallChart = lazy(() =>
  import("@/components/dashboard/PnLWaterfallChart").then((mod) => ({ default: mod.PnLWaterfallChart }))
);

export function DashboardPage() {
  const { assets, summary, rebalancing } = usePortfolio();
  const { addAsset } = useAssetStore();
  const targets = useSettingsStore((s) => s.targetAllocations);
  const lang = useLanguageStore((s) => s.lang);
  const langLocale = LANG_LOCALES[lang];
  const t = useT();
  const upsertSnapshot = useSnapshotStore((s) => s.upsertSnapshot);

  const { refreshAll, isLoading, lastUpdated } = useDataRefresh();

  // 대시보드를 열 때마다 오늘 날짜 스냅샷 저장/갱신
  useEffect(() => {
    if (assets.length === 0 || summary.totalValueKRW === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    upsertSnapshot({
      date: today,
      totalValueKRW: summary.totalValueKRW,
      totalCostKRW: summary.totalCostKRW,
    });
  }, [
    summary.totalValueKRW,
    summary.totalCostKRW,
    assets.length,
    upsertSnapshot,
  ]);

  const handleLoadSample = () => {
    SAMPLE_ASSETS.forEach((data) => addAsset(data));
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 font-mono">
        <p className="text-4xl mb-4 font-bold">{"[ EMPTY ]"}</p>
        <h2 className="text-xl font-bold text-zinc-300 mb-2">
          {t.dash_empty_title}
        </h2>
        <p className="text-sm">{t.dash_empty_desc}</p>

        {/* 이용 안내 */}
        <div className="mt-8 w-full max-w-lg space-y-2">
          {[t.dash_notice_storage, t.dash_notice_csv, t.dash_notice_mobile].map(
            (notice, i) => (
              <p
                key={i}
                className="text-xs text-zinc-500 bg-black border border-zinc-800 px-4 py-2.5 text-left leading-relaxed"
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
            className="px-5 py-2 min-h-[44px] bg-black border border-zinc-500 text-zinc-300 text-sm font-bold hover:bg-white hover:text-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="opacity-40">{"["}</span> {t.dash_sample_btn} <span className="opacity-40">{"]"}</span>
          </button>
          <p className="text-xs text-zinc-500">{t.dash_sample_hint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 타이틀 + 갱신 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-balance">{t.dash_title}</h1>

        <button
          type="button"
          onClick={() => refreshAll()}
          disabled={isLoading}
          aria-live="polite"
          className="inline-flex min-h-[44px] items-center gap-2 border border-zinc-800 bg-black px-3 py-1.5 text-xs font-bold text-zinc-300 hover:bg-white hover:text-black hover:border-white disabled:opacity-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <span className="opacity-40">{"["}</span>
          <span>{t.dash_refresh}</span>
          {isLoading ? (
            <span className="text-inherit">{t.dash_refreshing}</span>
          ) : (
            lastUpdated && (
              <span className="text-inherit opacity-70">
                {t.dash_updated_at(
                  new Date(lastUpdated).toLocaleTimeString(langLocale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                )}
              </span>
            )
          )}
          <span className="opacity-40">{"]"}</span>
        </button>
      </div>

      {/* ① KPI 바 */}
      <KpiBar summary={summary} />

      {/* ② 인사이트 (상단 고정) */}
      <InsightsPanel summary={summary} assets={assets} targets={targets} />

      {/* ③ 파이 차트 (국가별 · 태그별) */}
      <AllocationPieCharts summary={summary} />

      {/* ④ 자산 구성 추이 차트 */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center border border-zinc-800 bg-black/50 text-zinc-600 font-mono text-sm">Loading Chart...</div>}>
        <PortfolioHistoryChart />
      </Suspense>

      {/* ⑤ 보유종목 테이블 */}
      <TopHoldingsTable summary={summary} />

      {/* ⑥ 하단 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CategoryAnalysisCard rebalancing={rebalancing} />
        <CurrencyExposureCard summary={summary} />
        <RebalanceCard rebalancing={rebalancing} />
      </div>

      {/* ⑦ 종목별 손익 차트 */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center border border-zinc-800 bg-black/50 text-zinc-600 font-mono text-sm">Loading Chart...</div>}>
        <PnLWaterfallChart assets={assets} />
      </Suspense>
    </div>
  );
}
