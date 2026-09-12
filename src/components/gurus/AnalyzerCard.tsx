import { Card } from "@/components/common";
import { cn } from "@/utils";
import { Loader2, Briefcase, Search } from "lucide-react";
import { useT } from "@/hooks";
import type { AnalyzerMode, AnalyzerProgress, BaseAnalyzerResult } from "@/hooks";
import { THEMES, type AnalyzerTexts } from "./analyzerTheme";
import { AnalyzerScoreBar } from "./AnalyzerScoreBar";
import { AnalyzerCriterionBadge } from "./AnalyzerCriterionBadge";

export type { AnalyzerTexts, ThemeColors } from "./analyzerTheme";

interface AnalyzerCardProps<CKey extends string> {
  theme: "green" | "cyan" | "blue" | "amber";
  texts: AnalyzerTexts;
  criterionHints: Record<CKey, string>;
  criterionLabel: (key: CKey) => string;
  formatValue: (key: CKey, value: number) => string;

  // useAnalyzer hook 결과
  mode: AnalyzerMode;
  setMode: (m: AnalyzerMode) => void;
  results: BaseAnalyzerResult[];
  loading: boolean;
  ran: boolean;
  progress: AnalyzerProgress;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchSuggestions: Array<{ ticker: string; name: string }>;
  isSearching: boolean;
  runPortfolio: () => void;
  runSearch: (ticker: string, name?: string) => void;
  handleSearch: () => void;
  portfolioStockCount: number;
}

export function AnalyzerCard<CKey extends string>(props: AnalyzerCardProps<CKey>) {
  const {
    theme,
    texts,
    criterionHints,
    criterionLabel,
    formatValue,
    mode,
    setMode,
    results,
    loading,
    ran,
    progress,
    searchQuery,
    setSearchQuery,
    searchSuggestions,
    isSearching,
    runPortfolio,
    runSearch,
    handleSearch,
    portfolioStockCount,
  } = props;

  const t = useT();
  const colors = THEMES[theme];

  return (
    <Card title={texts.title}>
      <p className="mb-3 text-xs leading-relaxed text-zinc-500">{texts.desc}</p>

      {/* 모드 탭 */}
      <div role="tablist" aria-label={texts.title} className="mb-3 flex gap-1.5">
        {(["portfolio", "search"] as const).map((m) => {
          const Icon = m === "portfolio" ? Briefcase : Search;
          const label =
            m === "portfolio"
              ? t.analyzer_mode_portfolio
              : t.analyzer_mode_search;
          return (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-none border border-zinc-800 px-3 py-1 font-mono text-xs font-medium transition-colors focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none",
                mode === m
                  ? colors.tabActive
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── 포트폴리오 모드 ─── */}
      {mode === "portfolio" && (
        <>
          <p className="mb-2 font-mono text-xs-plus text-zinc-400">
            {t.analyzer_portfolio_desc(portfolioStockCount)}
          </p>
          <button
            onClick={runPortfolio}
            disabled={loading || portfolioStockCount === 0}
            className={cn(
              "mb-4 rounded-none font-mono",
              colors.btn,
              "cursor-pointer px-4 py-2 text-xs font-semibold text-white shadow-none transition-all active:scale-98 disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                {texts.progressEnrich(progress.done, progress.total)}
              </span>
            ) : (
              t.analyzer_btn_portfolio
            )}
          </button>
        </>
      )}

      {/* ─── 검색 모드 ─── */}
      {mode === "search" && (
        <>
          <div className="mb-3 flex gap-2">
            <input
              type="search"
              name="search"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder={t.analyzer_search_placeholder}
              className={cn(
                "flex-1 rounded-none border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-200 outline-none",
                colors.inputFocus,
              )}
            />
            <button
              onClick={handleSearch}
              disabled={loading || isSearching || !searchQuery.trim()}
              className={cn(
                "rounded-none font-mono",
                colors.btn,
                "cursor-pointer px-4 py-1.5 text-xs font-semibold text-white shadow-none transition-all active:scale-98 disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              {isSearching ? (
                <Loader2 className="inline-block size-3 animate-spin" aria-hidden="true" />
              ) : (
                t.analyzer_btn_search
              )}
            </button>
          </div>
          {searchSuggestions.length > 0 && (
            <div className="mb-3 max-h-48 overflow-y-auto rounded-none border border-zinc-800 bg-zinc-950">
              <div className="divide-y divide-zinc-800">
                {searchSuggestions.map((s) => (
                  <button
                    key={s.ticker}
                    onClick={() => runSearch(s.ticker, s.name)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none focus-visible:ring-inset",
                      colors.suggestHover,
                      "cursor-pointer transition-colors",
                    )}
                  >
                    <span className="font-mono text-xs font-semibold text-zinc-300">{s.ticker}</span>
                    <span className="truncate text-xs text-zinc-400">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── 로딩 진행률 바 ─── */}
      {loading && (
        <div className="mb-4" aria-live="polite">
          <p className="mb-1 animate-pulse font-mono text-xs text-zinc-400">
            {texts.phaseEnrich}
          </p>
          <div
            className="h-1.5 w-full overflow-hidden rounded-none bg-zinc-800/50"
            role="progressbar"
            aria-valuenow={progress.done}
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-label="Analysis Progress"
          >
            <div
              className={cn(
                "h-full rounded-none transition-[width,background-color] duration-300",
                colors.progressEnrich,
              )}
              style={{
                width:
                  progress.total > 0
                    ? `${Math.round((progress.done / progress.total) * 100)}%`
                    : "0%",
              }}
            />
          </div>
          <p className="mt-0.5 text-right font-mono text-2xs text-zinc-300">
            {progress.done} / {progress.total}
          </p>
        </div>
      )}

      {/* 결과 없음 */}
      {!loading && ran && results.length === 0 && (
        <p className="py-6 text-center font-mono text-xs text-zinc-400">{texts.noResult}</p>
      )}

      {/* ─── 결과 테이블 ─── */}
      {!loading && ran && results.length > 0 && (
        <ul className="space-y-3">
          {results.map((r, idx) => (
            <li
              key={r.stock.ticker}
              className={cn(
                "rounded-none border border-zinc-800 bg-zinc-950 p-3",
                colors.resultHover,
                "transition-colors",
              )}
            >
              {/* 헤더 행 */}
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "w-5 shrink-0 font-mono text-xs font-bold",
                    idx === 0
                      ? "text-yellow-500"
                      : idx === 1
                        ? "text-zinc-300"
                        : idx === 2
                          ? "text-amber-600"
                          : "text-zinc-500",
                  )}
                >
                  {idx + 1}.
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-zinc-100">{r.stock.name}</p>
                  <p className="font-mono text-xs text-zinc-400">{r.stock.ticker}</p>
                </div>

                {r.totalScore >= 70 && (
                  <span
                    className={cn(
                      "shrink-0 rounded-none px-2 py-0.5 font-mono text-2xs font-bold",
                      colors.highScoreBadge,
                    )}
                  >
                    {texts.highScoreBadge}
                  </span>
                )}

                <div className="shrink-0">
                  <AnalyzerScoreBar score={r.totalScore} colors={colors} />
                </div>
              </div>

              {/* 기준별 배지 */}
              <div className="flex flex-wrap gap-1">
                {r.criteria.map((c) => (
                  <AnalyzerCriterionBadge
                    key={c.key}
                    pass={c.pass}
                    label={criterionLabel(c.key as CKey)}
                    value={c.value}
                    criterionKey={c.key as CKey}
                    noDataLabel={texts.noData}
                    formatValue={formatValue}
                    colors={colors}
                  />
                ))}
              </div>

              {/* 기준별 힌트 */}
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                {r.criteria.map((c) => (
                  <span key={c.key} className="text-3xs text-zinc-300">
                    {criterionLabel(c.key as CKey)}: {criterionHints[c.key as CKey]} ({c.score}/{c.maxScore}pt)
                  </span>
                ))}
              </div>
            </li>
          ))}

          <p className="pt-1 text-2xs text-zinc-300">{texts.disclaimer}</p>
        </ul>
      )}

      {/* 초기 상태 */}
      {!loading && !ran && (
        <p className="py-4 text-center text-xs text-zinc-400">{texts.initialGuide}</p>
      )}
    </Card>
  );
}
