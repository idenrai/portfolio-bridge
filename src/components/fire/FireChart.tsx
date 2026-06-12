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
    <Card className="p-5 flex flex-col gap-4 h-full flex-1">
      <h3 className="text-lg font-bold text-slate-800">{t.fire_chart_title}</h3>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
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
              tickFormatter={(val) => formatCurrency(val, baseCurrency, true)}
              tickLine={false}
              axisLine={false}
              width={65}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "#334155" }}
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
