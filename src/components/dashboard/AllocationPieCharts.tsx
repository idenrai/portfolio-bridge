import { useState, memo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/components/common";
import { formatCurrency, fromKRW, cn } from "@/utils";
import { useSettingsStore } from "@/stores";
import { useT, useExchangeRates } from "@/hooks";
import type { PortfolioSummary, Market, AssetCategory } from "@/types";

const COLORS = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#c084fc",
  "#2dd4bf",
  "#fb923c",
  "#a78bfa",
  "#f472b6",
  "#a3e635",
];

interface ChartEntry {
  name: string;
  value: number;
  percent: number;
}

interface Props {
  summary: PortfolioSummary;
}

export const AllocationPieCharts = memo(function AllocationPieCharts({
  summary,
}: Props) {
  const [activeTab, setActiveTab] = useState<"market" | "category">("market");
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();
  const t = useT();

  if (summary.totalValueKRW === 0) return null;

  const fmt = (krw: number) =>
    formatCurrency(fromKRW(krw, baseCurrency, rates), baseCurrency, true);

  // 국가(시장)별
  const marketData: ChartEntry[] = summary.marketAllocation.map((x) => ({
    name: t.market_labels[x.market as Market] ?? x.market,
    value: x.valueKRW,
    percent: x.percent,
  }));

  // 카테고리별
  const categoryData: ChartEntry[] = summary.categoryAllocation.map((x) => ({
    name: t.category_labels[x.category as AssetCategory] ?? x.category,
    value: x.valueKRW,
    percent: x.percent,
  }));

  const currentData = activeTab === "market" ? marketData : categoryData;

  return (
    <Card
      title={t.chart_allocation_title}
      action={
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("market")}
            className={cn(
              "cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors",
              activeTab === "market"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {t.chart_market}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("category")}
            className={cn(
              "cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors",
              activeTab === "category"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {t.chart_category}
          </button>
        </div>
      }
    >
      {currentData.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-zinc-400">
          {t.chart_no_data}
        </div>
      ) : (
        <div className="flex flex-col">
          {/* 도넛 차트 영역 */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={2}
                >
                  {currentData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => fmt(Number(value))}
                  itemStyle={{ fontVariantNumeric: "tabular-nums" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 커스텀 2열 그리드 범례 (Recharts SVG 충돌 및 글자 가림 원천 방지) */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-zinc-800/80 pt-3">
            {currentData.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex min-w-0 items-center gap-1.5 pr-1">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="truncate text-zinc-300" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <span className="shrink-0 font-medium text-zinc-400 tabular-nums">
                  {item.percent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
});


