import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/common";
import { useSettingsStore } from "@/pages/stores";
import { formatCurrency, fromKRW, assetPnL, toKRW } from "@/utils";
import { useT } from "@/hooks";
import type { Asset } from "@/types";

interface Props {
  assets: Asset[];
}

export function PnLWaterfallChart({ assets }: Props) {
  const t = useT();
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);

  const convert = (krw: number) => fromKRW(krw, baseCurrency, rates);

  // 손익 절댓값 기준 상위 10개만 표시
  const data = assets
    .map((a) => ({
      name: a.ticker ?? a.name,
      fullName: a.name,
      pnlKRW: toKRW(assetPnL(a), a.currency, rates),
    }))
    .sort((a, b) => Math.abs(b.pnlKRW) - Math.abs(a.pnlKRW))
    .slice(0, 12)
    .map((d) => ({
      ...d,
      pnl: Math.round(convert(d.pnlKRW)),
    }));

  if (data.length === 0) return null;

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.pnl)), 1);

  const barHeight = 34;
  const chartHeight = data.length * barHeight + 24;

  return (
    <Card title={t.pnl_chart_title}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[-maxAbs * 1.1, maxAbs * 1.1]}
            tickFormatter={(v) => formatCurrency(v, baseCurrency, true)}
            tick={{ fontSize: 9, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: "#475569" }}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value: number | undefined) => [
              formatCurrency(value ?? 0, baseCurrency, false),
              t.pnl_chart_pnl,
            ]}
            labelFormatter={(_label, payload) =>
              payload?.[0]?.payload?.fullName ?? _label
            }
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
            }}
          />
          <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1} />
          <Bar dataKey="pnl" radius={[0, 3, 3, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.pnl >= 0 ? "#ef4444" : "#3b82f6"}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />
          {t.pnl_chart_profit}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />
          {t.pnl_chart_loss}
        </span>
        <span className="ml-auto">{t.pnl_chart_top12}</span>
      </div>
    </Card>
  );
}
