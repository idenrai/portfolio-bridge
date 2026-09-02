import { useState, useMemo } from "react";
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
import {
  useSettingsStore,
  useSnapshotStore,
  useLanguageStore,
} from "@/stores";
import { useT, useExchangeRates } from "@/hooks";
import { formatCurrency, formatPercent, fromKRW, cn } from "@/utils";
import { LANG_LOCALES } from "@/i18n";

type HistoryRange = "1M" | "3M" | "6M" | "1Y" | "ALL";

const RANGE_DAYS: Record<Exclude<HistoryRange, "ALL">, number> = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
};

export function PortfolioHistoryChart() {
  const t = useT();
  const snapshots = useSnapshotStore((s) => s.snapshots);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();
  const lang = useLanguageStore((s) => s.lang);
  const locale = LANG_LOCALES[lang];

  const [range, setRange] = useState<HistoryRange>("ALL");

  const ranges: { id: HistoryRange; label: string }[] = useMemo(
    () => [
      { id: "1M", label: t.history_range_1m },
      { id: "3M", label: t.history_range_3m },
      { id: "6M", label: t.history_range_6m },
      { id: "1Y", label: t.history_range_1y },
      { id: "ALL", label: t.history_range_all },
    ],
    [t],
  );

  const data = useMemo(() => {
    if (snapshots.length === 0) return [];
    const source =
      range === "ALL" ? snapshots : snapshots.slice(-RANGE_DAYS[range]);
    // 필터링 후 1개 이하로 떨어지면 최소한 전체를 보여주도록 Fallback
    const targetSnapshots =
      source.length >= 2 ? source : snapshots.slice(-2);

    return targetSnapshots.map((s) => ({
      date: s.date,
      value: Math.round(fromKRW(s.totalValueKRW, baseCurrency, rates)),
      cost: Math.round(fromKRW(s.totalCostKRW, baseCurrency, rates)),
    }));
  }, [snapshots, range, baseCurrency, rates]);

  // 기간 성과 (시작점 대비 종료점 평가액 변동)
  const periodPerformance = useMemo(() => {
    if (data.length < 2) return null;
    const first = data[0];
    const last = data[data.length - 1];
    const diff = last.value - first.value;
    const pct = first.value > 0 ? (diff / first.value) * 100 : 0;
    return { diff, pct };
  }, [data]);

  if (snapshots.length < 2) {
    return (
      <Card title={t.history_title}>
        <div className="flex h-50 items-center justify-center text-sm text-zinc-400">
          {t.history_no_data}
        </div>
      </Card>
    );
  }

  const formatDate = (d: string) => {
    const [, m, day] = d.split("-");
    return `${m}/${day}`;
  };

  return (
    <Card
      title={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-zinc-100">
              {t.history_title}
            </span>
            {periodPerformance && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-mono text-2xs font-semibold tabular-nums",
                  periodPerformance.diff >= 0
                    ? "border border-red-500/20 bg-red-500/10 text-red-400"
                    : "border border-blue-500/20 bg-blue-500/10 text-blue-400",
                )}
              >
                {formatCurrency(
                  periodPerformance.diff,
                  baseCurrency,
                  true,
                  true,
                )}{" "}
                ({formatPercent(periodPerformance.pct)})
              </span>
            )}
          </div>
          {/* 기간 필터 세그먼트 버튼 */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5">
            {ranges.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-3xs font-medium transition-colors",
                  range === r.id
                    ? "bg-zinc-800 font-semibold text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 9, fill: "#71717a" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v, baseCurrency, true)}
            tick={{ fontSize: 9, fill: "#71717a" }}
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const item = payload[0].payload as (typeof data)[0];
              const pnl = item.value - item.cost;
              const returnPct =
                item.cost > 0 ? (pnl / item.cost) * 100 : 0;
              const formattedDate = new Date(item.date).toLocaleDateString(
                locale,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              );

              return (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/95 p-3 text-xs shadow-xl backdrop-blur-md">
                  <p className="mb-2 border-b border-zinc-800/80 pb-1 font-mono text-3xs text-zinc-400">
                    {formattedDate}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 tabular-nums">
                    <span className="text-zinc-400">{t.history_value}:</span>
                    <span className="text-right font-medium text-indigo-300">
                      {formatCurrency(item.value, baseCurrency)}
                    </span>
                    <span className="text-zinc-400">{t.history_cost}:</span>
                    <span className="text-right font-medium text-zinc-300">
                      {formatCurrency(item.cost, baseCurrency)}
                    </span>
                    <span className="text-zinc-400">{t.history_pnl}:</span>
                    <span
                      className={cn(
                        "text-right font-semibold",
                        pnl >= 0 ? "text-red-400" : "text-blue-400",
                      )}
                    >
                      {formatCurrency(pnl, baseCurrency, false, true)}
                    </span>
                    <span className="text-zinc-400">{t.history_return}:</span>
                    <span
                      className={cn(
                        "text-right font-semibold",
                        pnl >= 0 ? "text-red-400" : "text-blue-400",
                      )}
                    >
                      {formatPercent(returnPct)}
                    </span>
                  </div>
                </div>
              );
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
      <div className="mt-2 flex items-center justify-between gap-4 text-2xs text-zinc-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-3 rounded-full bg-indigo-500" />
            {t.history_value}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-3 rounded-full bg-zinc-400" />
            {t.history_cost}
          </span>
        </div>
        <span className="rounded border border-zinc-800 bg-zinc-900/60 px-1.5 py-0.5 font-mono text-4xs text-zinc-400">
          {t.history_all_portfolio_badge}
        </span>
      </div>
    </Card>
  );
}
