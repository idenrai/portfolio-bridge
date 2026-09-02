import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/common";
import { useT } from "@/hooks";
import type { FireDataPoint } from "@/utils/calc/fire";
import { formatCurrency } from "@/utils/calc/currency";
import { useSettingsStore } from "@/stores";

interface FireChartProps {
  data: FireDataPoint[];
  successYear?: number | null;
}

export function FireChart({ data, successYear }: FireChartProps) {
  const t = useT();
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);

  if (!data || data.length === 0) return null;

  return (
    <Card className="flex h-full flex-1 flex-col gap-4 border border-zinc-800 bg-zinc-950/70 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-zinc-100">{t.fire_chart_title}</h3>
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-emerald-400" />
            {t.fire_chart_asset}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 border-t-2 border-dashed border-indigo-400" />
            {t.fire_chart_target}
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#71717a"
              fontSize={11}
              tickFormatter={(val) => `${val}Y`}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickFormatter={(val) => formatCurrency(val, baseCurrency, true)}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const point = payload[0]?.payload as FireDataPoint;
                if (!point) return null;

                const isMilestone = successYear !== null && point.year === successYear;

                return (
                  <div className="min-w-44 rounded-xl border border-zinc-700/80 bg-zinc-900/95 p-3 shadow-xl backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                      <span className="font-semibold text-zinc-200">
                        {t.fire_tooltip_year(point.year, point.age)}
                      </span>
                      {isMilestone && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-3xs font-bold text-emerald-400">
                          FIRE 🎉
                        </span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-zinc-400">{t.fire_chart_asset}:</span>
                        <span className="font-mono font-bold text-emerald-400 tabular-nums">
                          {formatCurrency(point.asset, baseCurrency, false)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-zinc-400">{t.fire_chart_target}:</span>
                        <span className="font-mono font-medium text-indigo-300 tabular-nums">
                          {formatCurrency(point.target, baseCurrency, false)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {/* FIRE 달성 연도 수직선 하이라이트 */}
            {successYear != null && successYear > 0 && (
              <ReferenceLine
                x={successYear}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `🎯 FIRE (${successYear}Y)`,
                  position: "top",
                  fill: "#34d399",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="asset"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAsset)"
              name="asset"
            />
            <Line
              type="stepAfter"
              dataKey="target"
              stroke="#818cf8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              name="target"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
