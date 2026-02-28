import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/common";
import { formatCurrency, fromKRW } from "@/utils";
import { useSettingsStore } from "@/stores";
import { useT } from "@/hooks";
import type { PortfolioSummary, Market, AssetTag } from "@/types";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

interface ChartEntry {
  name: string;
  value: number;
  percent: number;
}

interface Props {
  summary: PortfolioSummary;
}

function MiniPie({
  data,
  valueLabel,
  noDataText,
}: {
  data: ChartEntry[];
  valueLabel: (v: number) => string;
  noDataText: string;
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-slate-400 text-sm">
        {noDataText}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          dataKey="value"
          nameKey="name"
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => valueLabel(Number(value))} />
        <Legend
          formatter={(value: string) => {
            const item = data.find((d) => d.name === value);
            return `${value} ${item?.percent.toFixed(1)}%`;
          }}
          wrapperStyle={{ fontSize: "11px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AllocationPieCharts({ summary }: Props) {
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);
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

  // 태그별
  const tagData: ChartEntry[] = summary.tagAllocation.map((x) => ({
    name: t.tag_labels[x.tag as AssetTag] ?? x.tag,
    value: x.valueKRW,
    percent: x.percent,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title={t.chart_market}>
        <MiniPie
          data={marketData}
          valueLabel={fmt}
          noDataText={t.chart_no_data}
        />
      </Card>
      <Card title={t.chart_tag}>
        <MiniPie data={tagData} valueLabel={fmt} noDataText={t.chart_no_data} />
      </Card>
    </div>
  );
}
