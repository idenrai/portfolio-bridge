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
      <div className="flex h-55 items-center justify-center text-sm text-zinc-400">
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
        <Tooltip 
          formatter={(value) => valueLabel(Number(value))}
          itemStyle={{ fontVariantNumeric: "tabular-nums" }}
        />
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card title={t.chart_market}>
        <MiniPie
          data={marketData}
          valueLabel={fmt}
          noDataText={t.chart_no_data}
        />
      </Card>
      <Card title={t.chart_category}>
        <MiniPie
          data={categoryData}
          valueLabel={fmt}
          noDataText={t.chart_no_data}
        />
      </Card>
    </div>
  );
}
