import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card } from "@/components/common";
import { useT } from "@/hooks";
import type { FireDataPoint } from "@/utils/calc/fire";
import { formatCurrency } from "@/utils/calc/currency";
import { useSettingsStore } from "@/stores";

interface FireChartProps {
  data: FireDataPoint[];
}

export function FireChart({ data }: FireChartProps) {
  const t = useT();
  const { baseCurrency } = useSettingsStore();

  if (!data || data.length === 0) return null;

  return (
    <Card className="p-5 flex flex-col gap-4 bg-slate-900 border-slate-800">
      <h3 className="text-lg font-bold text-slate-200">{t.fire_chart_title}</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 10, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => `${val}Y`}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => {
                if (val >= 100000000) return `${Math.floor(val / 100000000)}억`;
                if (val >= 10000) return `${Math.floor(val / 10000)}만`;
                return `${val}`;
              }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
              itemStyle={{ color: "#f8fafc" }}
              labelFormatter={(label, payload) => {
                const item = payload[0]?.payload as FireDataPoint;
                return t.fire_tooltip_year(Number(label), item?.age);
              }}
              formatter={(value: unknown, name: unknown) => [
                formatCurrency(Number(value), baseCurrency, false),
                name === "asset" ? t.fire_chart_asset : t.fire_chart_target,
              ]}
            />
            <Area
              type="monotone"
              dataKey="asset"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAsset)"
              name="asset"
            />
            <Line
              type="stepAfter"
              dataKey="target"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="target"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
