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
        <h3 className="font-mono text-base font-bold text-zinc-100">{t.fire_chart_title}</h3>
        <div className="flex items-center gap-4 font-mono text-xs font-medium text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-none bg-emerald-400" />
            {t.fire_chart_asset}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 border-t-2 border-dashed border-amber-400" />
            {t.fire_chart_target}
          </span>
        </div>
      </div>

      <div className="h-72 min-h-72 w-full sm:h-80 sm:min-h-80 lg:h-96 lg:min-h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="year"
              unit="Y"
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fontFamily: "Fira Code, monospace" }}
            />
            <YAxis
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => formatCurrency(val, baseCurrency, true)}
              width={75}
              tick={{ fontFamily: "Fira Code, monospace" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0].payload as FireDataPoint;
                return (
                  <div className="rounded-none border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs shadow-none">
                    <p className="border-b border-zinc-800/80 pb-1 font-mono text-2xs font-semibold text-zinc-300">
                      {t.fire_tooltip_year(point.year, point.age)}
                    </p>
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-zinc-400">{t.fire_chart_asset}:</span>
                        <span className="font-mono font-bold text-emerald-400 tabular-nums">
                          {formatCurrency(point.asset, baseCurrency, false)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-zinc-400">{t.fire_chart_target}:</span>
                        <span className="font-mono font-medium text-amber-400 tabular-nums">
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
                  value: `[FIRE REACHED: ${successYear}Y]`,
                  position: "top",
                  fill: "#34d399",
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "Fira Code, monospace",
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
              stroke="#f59e0b"
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
