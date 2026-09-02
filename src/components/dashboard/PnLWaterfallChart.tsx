import { useState, useMemo } from "react";
import { Card } from "@/components/common";
import { useSettingsStore } from "@/stores";
import { formatCurrency, formatPercent, fromKRW, cn } from "@/utils";
import { useT, useExchangeRates } from "@/hooks";
import type { HoldingDetail } from "@/types";

interface Props {
  holdings: HoldingDetail[];
}

type SortBy = "abs" | "profit" | "return";

export function PnLWaterfallChart({ holdings }: Props) {
  const t = useT();
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const { data: rates } = useExchangeRates();

  const [sortBy, setSortBy] = useState<SortBy>("abs");
  const [showAll, setShowAll] = useState(false);

  // 현금·예금은 손익 0이므로 제외
  const nonCashHoldings = useMemo(
    () => holdings.filter((h) => h.type !== "cash"),
    [holdings],
  );

  // 손익 계산 및 데이터 정규화
  const processedData = useMemo(() => {
    return nonCashHoldings.map((h) => {
      const pnl = Math.round(fromKRW(h.pnlKRW, baseCurrency, rates));
      return {
        id: h.id,
        name: h.name,
        ticker: h.ticker,
        type: h.type,
        market: h.market,
        currency: h.currency,
        fullName: h.ticker ? `${h.name} (${h.ticker})` : h.name,
        pnlKRW: h.pnlKRW,
        pnl,
        returnPercent: h.returnPercent,
      };
    });
  }, [nonCashHoldings, baseCurrency, rates]);

  // 정렬 로직
  const sortedData = useMemo(() => {
    const list = [...processedData];
    switch (sortBy) {
      case "profit":
        return list.sort((a, b) => b.pnlKRW - a.pnlKRW);
      case "return":
        return list.sort((a, b) => b.returnPercent - a.returnPercent);
      case "abs":
      default:
        return list.sort((a, b) => Math.abs(b.pnlKRW) - Math.abs(a.pnlKRW));
    }
  }, [processedData, sortBy]);

  // 요약 통계 (수익 종목 수 vs 손실 종목 수)
  const summaryStats = useMemo(() => {
    let profitCount = 0;
    let lossCount = 0;
    for (const item of processedData) {
      if (item.pnl >= 0) profitCount++;
      else lossCount++;
    }
    return { profitCount, lossCount };
  }, [processedData]);

  if (processedData.length === 0) return null;

  const displayedItems = showAll ? sortedData : sortedData.slice(0, 10);
  const maxAbsPnl = Math.max(
    ...displayedItems.map((d) => Math.abs(d.pnl)),
    1,
  );

  const sortOptions: { id: SortBy; label: string }[] = [
    { id: "abs", label: t.pnl_sort_abs },
    { id: "profit", label: t.pnl_sort_profit },
    { id: "return", label: t.pnl_sort_return },
  ];

  return (
    <Card
      title={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-zinc-100">
              {t.pnl_chart_title}
            </span>
            <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-3xs font-medium text-zinc-400">
              {t.pnl_summary_win_loss(
                summaryStats.profitCount,
                summaryStats.lossCount,
              )}
            </span>
          </div>
          {/* 정렬 세그먼트 버튼 */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5">
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortBy(opt.id)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-3xs font-medium transition-colors",
                  sortBy === opt.id
                    ? "bg-zinc-800 font-semibold text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* 양방향 바 리스트 */}
      <div className="space-y-2.5 pt-1">
        {displayedItems.map((item) => {
          const isProfit = item.pnl >= 0;
          const barWidthPct = Math.min(
            Math.round((Math.abs(item.pnl) / maxAbsPnl) * 100),
            100,
          );

          return (
            <div
              key={item.id}
              className="group flex items-center gap-3 rounded-lg border border-transparent p-1.5 transition-colors hover:border-zinc-800/80 hover:bg-zinc-900/40"
            >
              {/* 1. 좌측: 종목명 및 메타데이터 */}
              <div className="w-36 min-w-0 shrink-0 sm:w-48">
                <div
                  className="truncate text-xs font-medium text-zinc-200 group-hover:text-white"
                  title={item.fullName}
                >
                  {item.name}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 font-mono text-3xs text-zinc-400">
                  <span className="rounded border border-zinc-800 bg-zinc-900 px-1 py-0.5 font-mono text-4xs uppercase">
                    {item.market}
                  </span>
                  {item.ticker && (
                    <span className="truncate">{item.ticker}</span>
                  )}
                </div>
              </div>

              {/* 2. 중앙: 제로 라인 중심 양방향 게이지 바 */}
              <div className="relative flex h-5 flex-1 items-center">
                {/* 중앙 제로 기준선 */}
                <div className="absolute inset-y-0 left-1/2 z-10 w-px bg-zinc-700/80" />

                {/* 좌측: 손실 바 (중앙에서 왼쪽으로 채워짐) */}
                <div className="flex h-full w-1/2 items-center justify-end pr-0.5">
                  {!isProfit && (
                    <div
                      className="h-2.5 rounded-l-sm bg-blue-500/80 transition-all group-hover:bg-blue-400"
                      style={{ width: `${barWidthPct}%` }}
                    />
                  )}
                </div>

                {/* 우측: 수익 바 (중앙에서 오른쪽으로 채워짐) */}
                <div className="flex h-full w-1/2 items-center justify-start pl-0.5">
                  {isProfit && (
                    <div
                      className="h-2.5 rounded-r-sm bg-red-500/80 transition-all group-hover:bg-red-400"
                      style={{ width: `${barWidthPct}%` }}
                    />
                  )}
                </div>
              </div>

              {/* 3. 우측: 손익 및 수익률 고정 컬럼 */}
              <div className="w-28 shrink-0 text-right tabular-nums sm:w-32">
                <div
                  className={cn(
                    "text-xs font-semibold",
                    isProfit ? "text-red-400" : "text-blue-400",
                  )}
                >
                  {formatCurrency(item.pnl, baseCurrency, false, true)}
                </div>
                <div
                  className={cn(
                    "font-mono text-2xs font-medium",
                    isProfit ? "text-red-400/90" : "text-blue-400/90",
                  )}
                >
                  {formatPercent(item.returnPercent)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 푸터: 범례 & 개수 토글 버튼 */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3 text-2xs text-zinc-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-sm bg-red-500" />
            {t.pnl_chart_profit}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-sm bg-blue-500" />
            {t.pnl_chart_loss}
          </span>
        </div>

        {processedData.length > 10 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            {showAll
              ? t.pnl_show_top10
              : t.pnl_show_all(processedData.length)}
          </button>
        )}
      </div>
    </Card>
  );
}
