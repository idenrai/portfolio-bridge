import { Card } from "@/components/common";
import { useT } from "@/hooks";
import type { AnalyzerMode, AnalyzerProgress, BaseAnalyzerResult } from "@/hooks";

// ─── 컬러 테마 ─────────────────────────────────────────────────────────────────

interface ThemeColors {
  btn: string;
  tabActive: string;
  scoreHigh: string;
  scoreTextHigh: string;
  badgePass: string;
  highScoreBadge: string;
  resultHover: string;
  suggestHover: string;
  inputFocus: string;
  progressEnrich: string;
}

const THEMES: Record<"green" | "violet" | "blue" | "amber", ThemeColors> = {
  green: {
    btn: "bg-green-600 hover:bg-green-700",
    tabActive: "bg-green-600 text-white",
    scoreHigh: "bg-emerald-500",
    scoreTextHigh: "text-emerald-600",
    badgePass: "bg-emerald-50 text-emerald-700",
    highScoreBadge: "bg-emerald-100 text-emerald-700",
    resultHover: "hover:border-green-200 hover:bg-green-50/30",
    suggestHover: "hover:bg-green-50",
    inputFocus: "focus:border-green-400 focus:ring-1 focus:ring-green-200",
    progressEnrich: "bg-green-500",
  },
  violet: {
    btn: "bg-violet-600 hover:bg-violet-700",
    tabActive: "bg-violet-600 text-white",
    scoreHigh: "bg-violet-500",
    scoreTextHigh: "text-violet-600",
    badgePass: "bg-violet-50 text-violet-700",
    highScoreBadge: "bg-violet-100 text-violet-700",
    resultHover: "hover:border-violet-200 hover:bg-violet-50/30",
    suggestHover: "hover:bg-violet-50",
    inputFocus: "focus:border-violet-400 focus:ring-1 focus:ring-violet-200",
    progressEnrich: "bg-violet-500",
  },
  blue: {
    btn: "bg-blue-600 hover:bg-blue-700",
    tabActive: "bg-blue-600 text-white",
    scoreHigh: "bg-blue-500",
    scoreTextHigh: "text-blue-600",
    badgePass: "bg-blue-50 text-blue-700",
    highScoreBadge: "bg-blue-100 text-blue-700",
    resultHover: "hover:border-blue-200 hover:bg-blue-50/30",
    suggestHover: "hover:bg-blue-50",
    inputFocus: "focus:border-blue-400 focus:ring-1 focus:ring-blue-200",
    progressEnrich: "bg-blue-500",
  },
  amber: {
    btn: "bg-amber-600 hover:bg-amber-700",
    tabActive: "bg-amber-600 text-white",
    scoreHigh: "bg-amber-500",
    scoreTextHigh: "text-amber-600",
    badgePass: "bg-amber-50 text-amber-700",
    highScoreBadge: "bg-amber-100 text-amber-700",
    resultHover: "hover:border-amber-200 hover:bg-amber-50/30",
    suggestHover: "hover:bg-amber-50",
    inputFocus: "focus:border-amber-400 focus:ring-1 focus:ring-amber-200",
    progressEnrich: "bg-amber-500",
  },
};

// ─── 텍스트 인터페이스 ──────────────────────────────────────────────────────────

export interface AnalyzerTexts {
  title: string;
  desc: string;
  progressEnrich: (done: number, total: number) => string;
  phaseEnrich: string;
  noResult: string;
  highScoreBadge: string;
  initialGuide: string;
  noData: string;
  disclaimer: string;
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface AnalyzerCardProps<CKey extends string> {
  theme: "green" | "violet" | "blue" | "amber";
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

// ─── 서브 컴포넌트 ──────────────────────────────────────────────────────────────

function ScoreBar({ score, colors }: { score: number; colors: ThemeColors }) {
  const barColor =
    score >= 70 ? colors.scoreHigh :
    score >= 45 ? "bg-amber-400" :
                  "bg-slate-300";
  const textColor =
    score >= 70 ? colors.scoreTextHigh :
    score >= 45 ? "text-amber-600" :
                  "text-slate-400";
  return (
    <div className="flex items-center gap-2 min-w-30">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums w-7 text-right ${textColor}`}>
        {score}
      </span>
    </div>
  );
}

function CriterionBadge<CKey extends string>({
  pass,
  label,
  value,
  criterionKey,
  noDataLabel,
  formatValue,
  colors,
}: {
  pass: boolean | null;
  label: string;
  value: number | null;
  criterionKey: CKey;
  noDataLabel: string;
  formatValue: (key: CKey, value: number) => string;
  colors: ThemeColors;
}) {
  const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium leading-none";
  if (pass === null) {
    return (
      <span className={`${base} bg-slate-100 text-slate-400`}>
        {label}: {noDataLabel}
      </span>
    );
  }
  return (
    <span className={`${base} ${pass ? colors.badgePass : "bg-red-50 text-red-600"}`}>
      {pass ? "✓" : "✗"} {label}
      {value !== null && (
        <span className="opacity-70">{formatValue(criterionKey, value)}</span>
      )}
    </span>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export function AnalyzerCard<CKey extends string>(props: AnalyzerCardProps<CKey>) {
  const {
    theme, texts, criterionHints, criterionLabel, formatValue,
    mode, setMode,
    results, loading, ran, progress,
    searchQuery, setSearchQuery, searchSuggestions, isSearching,
    runPortfolio, runSearch, handleSearch,
    portfolioStockCount,
  } = props;

  const t = useT();
  const colors = THEMES[theme];

  return (
    <Card title={texts.title}>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{texts.desc}</p>

      {/* 모드 탭 */}
      <div className="flex gap-1.5 mb-3">
        {(["portfolio", "search"] as const).map((m) => {
          const label =
            m === "portfolio" ? `💼 ${t.analyzer_mode_portfolio}` :
                                `🔍 ${t.analyzer_mode_search}`;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                mode === m ? colors.tabActive : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ─── 포트폴리오 모드 ─── */}
      {mode === "portfolio" && (
        <>
          <p className="text-[11px] text-slate-400 mb-2">
            {t.analyzer_portfolio_desc(portfolioStockCount)}
          </p>
          <button
            onClick={runPortfolio}
            disabled={loading || portfolioStockCount === 0}
            className={`mb-4 rounded-lg ${colors.btn} px-4 py-2 text-sm font-semibold text-white shadow-sm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
          >
            {loading
              ? texts.progressEnrich(progress.done, progress.total)
              : t.analyzer_btn_portfolio}
          </button>
        </>
      )}

      {/* ─── 검색 모드 ─── */}
      {mode === "search" && (
        <>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder={t.analyzer_search_placeholder}
              className={`flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none ${colors.inputFocus}`}
            />
            <button
              onClick={handleSearch}
              disabled={loading || isSearching || !searchQuery.trim()}
              className={`rounded-lg ${colors.btn} px-4 py-1.5 text-sm font-semibold text-white shadow-sm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
            >
              {isSearching ? "..." : t.analyzer_btn_search}
            </button>
          </div>
          {searchSuggestions.length > 0 && (
            <div className="mb-3 rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {searchSuggestions.map((s) => (
                <button
                  key={s.ticker}
                  onClick={() => runSearch(s.ticker, s.name)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left ${colors.suggestHover} transition-colors cursor-pointer`}
                >
                  <span className="text-xs font-semibold text-slate-700">{s.ticker}</span>
                  <span className="text-xs text-slate-400 truncate">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ─── 로딩 진행률 바 ─── */}
      {loading && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1 animate-pulse">
            {texts.phaseEnrich}
          </p>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${colors.progressEnrich}`}
              style={{
                width: progress.total > 0
                  ? `${Math.round((progress.done / progress.total) * 100)}%`
                  : "0%",
              }}
            />
          </div>
          <p className="text-[10px] text-slate-300 mt-0.5 text-right">
            {progress.done} / {progress.total}
          </p>
        </div>
      )}

      {/* 결과 없음 */}
      {!loading && ran && results.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-6">{texts.noResult}</p>
      )}

      {/* ─── 결과 테이블 ─── */}
      {!loading && ran && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, idx) => (
            <div
              key={r.stock.ticker}
              className={`rounded-xl border border-slate-100 bg-slate-50 p-3 ${colors.resultHover} transition-colors`}
            >
              {/* 헤더 행 */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold w-5 shrink-0 ${
                  idx === 0 ? "text-yellow-500" :
                  idx === 1 ? "text-slate-400" :
                  idx === 2 ? "text-amber-600" :
                              "text-slate-300"
                }`}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{r.stock.name}</p>
                  <p className="text-xs text-slate-400">{r.stock.ticker}</p>
                </div>

                {r.totalScore >= 70 && (
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${colors.highScoreBadge}`}>
                    {texts.highScoreBadge}
                  </span>
                )}

                <div className="shrink-0">
                  <ScoreBar score={r.totalScore} colors={colors} />
                </div>
              </div>

              {/* 기준별 배지 */}
              <div className="flex flex-wrap gap-1">
                {r.criteria.map((c) => (
                  <CriterionBadge
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
                  <span key={c.key} className="text-[9px] text-slate-300">
                    {criterionLabel(c.key as CKey)}: {criterionHints[c.key as CKey]} ({c.score}/{c.maxScore}pt)
                  </span>
                ))}
              </div>
            </div>
          ))}

          <p className="text-[10px] text-slate-300 pt-1">{texts.disclaimer}</p>
        </div>
      )}

      {/* 초기 상태 */}
      {!loading && !ran && (
        <p className="text-xs text-slate-400 text-center py-4">{texts.initialGuide}</p>
      )}
    </Card>
  );
}
