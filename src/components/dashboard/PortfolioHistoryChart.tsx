import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/common";
import { useSettingsStore } from "@/pages/stores";
import { useSnapshotStore } from "@/pages/stores/useSnapshotStore";
import { formatCurrency, fromKRW } from "@/utils";
import { useT } from "@/hooks";
import { useLanguageStore } from "@/pages/stores";
import { LANG_LOCALES } from "@/i18n";

export function PortfolioHistoryChart() {
  const t = useT();
  const snapshots = useSnapshotStore((s) => s.snapshots);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const lang = useLanguageStore((s) => s.lang);
  const locale = LANG_LOCALES[lang];

  if (snapshots.length < 2) {
    return (
      <Card title={t.history_title}>
        <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">
          {t.history_no_data}
        </div>
      </Card>
    );
  }

  const data = snapshots.map((s) => ({
    date: s.date,
    value: Math.round(fromKRW(s.totalValueKRW, baseCurrency, rates)),
    cost: Math.round(fromKRW(s.totalCostKRW, baseCurrency, rates)),
  }));

  const formatDate = (d: string) => {
    const [, m, day] = d.split("-");
    return `${m}/${day}`;
  };

  const formatValue = (v: number) => formatCurrency(v, baseCurrency, true);

  return (
    <Card title={t.history_title}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v, baseCurrency, true)}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            formatter={(
              value: number | undefined,
              name: string | undefined,
            ) => [
              formatValue(value ?? 0),
              name === "value" ? t.history_value : t.history_cost,
            ]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              })
            }
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
            }}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#94a3b8"
            strokeWidth={1.5}
            fill="url(#gradCost)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#gradValue)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" />
          {t.history_value}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-slate-400 inline-block rounded" />
          {t.history_cost}
        </span>
      </div>
    </Card>
  );
}
