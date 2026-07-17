import { useEffect, lazy, Suspense, useState, useMemo } from "react";
import { usePortfolio, useDataRefresh, useT } from "@/hooks";
import {
  useAssetStore,
  useSettingsStore,
  useLanguageStore,
  useSnapshotStore,
  useBrokerStore,
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
import { FilterBar } from "@/components/common";
import { SAMPLE_ASSETS } from "@/utils";
import type { Market, AssetType, AssetCategory } from "@/types";

const PortfolioHistoryChart = lazy(() =>
  import("@/components/dashboard/PortfolioHistoryChart").then((mod) => ({ default: mod.PortfolioHistoryChart }))
);
const PnLWaterfallChart = lazy(() =>
  import("@/components/dashboard/PnLWaterfallChart").then((mod) => ({ default: mod.PnLWaterfallChart }))
);

export function DashboardPage() {
  const [filterMarkets, setFilterMarkets] = useState<Market[]>([]);
  const [filterTypes, setFilterTypes] = useState<AssetType[]>([]);
  const [filterCategories, setFilterCategories] = useState<AssetCategory[]>([]);
  const [filterBrokerIds, setFilterBrokerIds] = useState<string[]>([]);

  const filters = useMemo(
    () => ({
      markets: filterMarkets,
      types: filterTypes,
      categories: filterCategories,
      brokerIds: filterBrokerIds,
    }),
    [filterMarkets, filterTypes, filterCategories, filterBrokerIds]
  );

  const { assets, summary, rebalancing } = usePortfolio(filters);
  const baseAssets = useAssetStore((s) => s.assets);
  const { addAsset } = useAssetStore();
  const brokers = useBrokerStore((s) => s.accounts);
  const targets = useSettingsStore((s) => s.targetAllocations);
  const lang = useLanguageStore((s) => s.lang);
  const langLocale = LANG_LOCALES[lang];
  const t = useT();
  const upsertSnapshot = useSnapshotStore((s) => s.upsertSnapshot);

  const { refreshAll, isLoading, lastUpdated } = useDataRefresh();

  // 대시보드를 열 때마다 오늘 날짜 스냅샷 저장/갱신
  // (단, 필터가 적용되지 않은 전체 자산 기준으로 스냅샷을 저장하는 것이 맞으므로 summary는 필터 적용 전이어야 하나
  // 여기서는 편의상 그대로 둡니다. 실제로는 필터가 없을 때만 스냅샷을 갱신하거나 별도로 갱신해야 합니다.
  // 필터 적용 상태에서 스냅샷이 덮어써지는 것을 방지하기 위해 필터가 없을 때만 갱신하도록 수정)
  const isFiltered = filterMarkets.length > 0 || filterTypes.length > 0 || filterCategories.length > 0 || filterBrokerIds.length > 0;
  
  useEffect(() => {
    if (isFiltered) return; // 필터 적용 중에는 스냅샷 갱신 안 함
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
    isFiltered,
  ]);

  const handleLoadSample = () => {
    SAMPLE_ASSETS.forEach((data) => addAsset(data));
  };

  const handleClearFilters = () => {
    setFilterMarkets([]);
    setFilterTypes([]);
    setFilterCategories([]);
    setFilterBrokerIds([]);
  };

  if (baseAssets.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center font-mono text-zinc-500">
        <p className="mb-4 text-4xl font-bold">{"[ EMPTY ]"}</p>
        <h2 className="mb-2 text-xl font-bold text-zinc-300">
          {t.dash_empty_title}
        </h2>
        <p className="text-sm">{t.dash_empty_desc}</p>

        {/* 이용 안내 */}
        <div className="mt-8 w-full max-w-lg space-y-2">
          {[t.dash_notice_storage, t.dash_notice_csv, t.dash_notice_mobile].map(
            (notice, i) => (
              <p
                key={i}
                className="border border-zinc-800 bg-black px-4 py-2.5 text-left text-xs leading-relaxed text-zinc-500"
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
            className="min-h-[44px] cursor-pointer border border-zinc-500 bg-black px-5 py-2 text-sm font-bold text-zinc-300 transition-colors hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
          >
            <span className="opacity-40">{"["}</span> {t.dash_sample_btn} <span className="opacity-40">{"]"}</span>
          </button>
          <p className="text-xs text-zinc-500">{t.dash_sample_hint}</p>
        </div>
      </div>
    );
  }

  // 필터 바 옵션 추출 (전체 자산 기준)
  const availableMarkets = Array.from(new Set(baseAssets.map((a) => a.market)));
  const availableTypes = Array.from(new Set(baseAssets.map((a) => a.type)));
  const availableCategories = Array.from(
    new Set(baseAssets.flatMap((a) => a.categories))
  ).map((cat) => [cat, t.category_labels[cat] ?? cat] as [AssetCategory, string]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 타이틀 + 갱신 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-white md:text-3xl">{t.dash_title}</h1>

        <button
          type="button"
          onClick={() => refreshAll()}
          disabled={isLoading}
          aria-live="polite"
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-zinc-800 bg-black px-3 py-1.5 text-xs font-bold text-zinc-300 transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none disabled:opacity-50"
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

      <FilterBar
        markets={availableMarkets}
        types={availableTypes}
        categoryOptions={availableCategories}
        brokers={brokers}
        filterMarkets={filterMarkets}
        filterTypes={filterTypes}
        filterCategories={filterCategories}
        filterBrokerIds={filterBrokerIds}
        onFilterMarkets={setFilterMarkets}
        onFilterTypes={setFilterTypes}
        onFilterCategories={setFilterCategories}
        onFilterBrokerIds={setFilterBrokerIds}
        onClearFilters={handleClearFilters}
      />

      {/* ① KPI 바 */}
      <KpiBar summary={summary} />

      {/* 2단 메인 레이아웃 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 mt-2">
        
        {/* 좌측 메인 영역 (테이블 및 뷰어 위주) */}
        <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-6">
          {/* 보유종목 테이블 */}
          <TopHoldingsTable summary={summary} />
          
          {/* 자산 구성 추이 차트 */}
          <Suspense fallback={<div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-black/50 font-mono text-sm text-zinc-500">Loading Chart…</div>}>
            <PortfolioHistoryChart />
          </Suspense>

          {/* 종목별 손익 차트 */}
          <Suspense fallback={<div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-black/50 font-mono text-sm text-zinc-500">Loading Chart…</div>}>
            <PnLWaterfallChart assets={assets} />
          </Suspense>
        </div>
        
        {/* 우측 사이드바 영역 (요약 및 분석 위주) */}
        <div className="flex flex-col gap-4 lg:gap-6">
          <InsightsPanel summary={summary} assets={assets} targets={targets} />
          <AllocationPieCharts summary={summary} />
          <CurrencyExposureCard summary={summary} />
          <CategoryAnalysisCard rebalancing={rebalancing} />
          <RebalanceCard rebalancing={rebalancing} />
        </div>

      </div>
    </div>
  );
}
