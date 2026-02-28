import { usePortfolio } from "@/hooks";
import { KpiBar } from "@/components/dashboard/KpiBar";
import { AllocationPieCharts } from "@/components/dashboard/AllocationPieCharts";
import { TopHoldingsTable } from "@/components/dashboard/TopHoldingsTable";
import { TagAnalysisCard } from "@/components/dashboard/TagAnalysisCard";
import { CurrencyExposureCard } from "@/components/dashboard/CurrencyExposureCard";
import { RebalanceCard } from "@/components/dashboard/RebalanceCard";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";

export function DashboardPage() {
  const { assets, summary, rebalancing } = usePortfolio();

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <p className="text-6xl mb-4">📊</p>
        <h2 className="text-xl font-semibold text-slate-600 mb-2">
          포트폴리오를 시작하세요
        </h2>
        <p className="text-sm">
          &quot;자산 관리&quot; 메뉴에서 보유 자산을 등록하면 여기에 요약이
          표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">대시보드</h2>

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
