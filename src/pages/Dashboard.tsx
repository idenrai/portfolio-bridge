import { usePortfolio, useT } from "@/hooks";
import { KpiBar } from "@/components/dashboard/KpiBar";
import { AllocationPieCharts } from "@/components/dashboard/AllocationPieCharts";
import { TopHoldingsTable } from "@/components/dashboard/TopHoldingsTable";
import { TagAnalysisCard } from "@/components/dashboard/TagAnalysisCard";
import { CurrencyExposureCard } from "@/components/dashboard/CurrencyExposureCard";
import { RebalanceCard } from "@/components/dashboard/RebalanceCard";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";

export function DashboardPage() {
  const { assets, summary, rebalancing } = usePortfolio();
  const t = useT();

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <p className="text-6xl mb-4">📊</p>
        <h2 className="text-xl font-semibold text-slate-600 mb-2">
          {t.dash_empty_title}
        </h2>
        <p className="text-sm">{t.dash_empty_desc}</p>
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

      {/* ④ 하단 3열 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TagAnalysisCard rebalancing={rebalancing} />
        <CurrencyExposureCard summary={summary} />
        <div className="space-y-4">
          <RebalanceCard rebalancing={rebalancing} />
          <InsightsPanel summary={summary} />
        </div>
      </div>
    </div>
  );
}
