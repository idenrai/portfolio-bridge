import { usePortfolio, useT } from "@/hooks";
import { useAssetStore } from "@/stores";
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
  const t = useT();

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
      <h2 className="text-lg font-bold text-slate-800">{t.dash_title}</h2>

      {/* ① KPI 바 */}
      <KpiBar summary={summary} />

      {/* ② 파이 차트 (국가별 · 태그별) */}
      <AllocationPieCharts summary={summary} />

      {/* ③ 보유종목 테이블 */}
      <TopHoldingsTable summary={summary} />

      {/* ④ 하단 2열 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TagAnalysisCard rebalancing={rebalancing} />
        <CurrencyExposureCard summary={summary} />
        <RebalanceCard rebalancing={rebalancing} />
      </div>

      {/* ⑤ 인사이트 (단독) */}
      <InsightsPanel summary={summary} />
    </div>
  );
}
