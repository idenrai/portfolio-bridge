import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/common";
import { useT } from "@/hooks";
import { screenAll, screenByTickers, type LynchScreenResult, type LynchCriterionKey, type ScreenProgress } from "@/utils/lynchScreener";
import { searchTicker } from "@/utils/yahooFinance";
import { useAssetStore } from "@/stores";
import type { Market } from "@/types";

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const MARKET_OPTIONS: Array<{ value: Market; flag: string }> = [
  { value: "KR",  flag: "🇰🇷" },
  { value: "US",  flag: "🇺🇸" },
  { value: "JP",  flag: "🇯🇵" },
  { value: "EU",  flag: "🇪🇺" },
];

/** 기준별 표시 임계값 텍스트 */
const CRITERION_HINT: Record<LynchCriterionKey, string> = {
  peg:            "< 1.0 ★",
  epsGrowth:      "> 15% ★",
  revenueGrowth:  "> 10% ★",
  debtToEquity:   "< 80 ★",
  operatingMargin:"> 10% ★",
  marketCap:      "< $10B ★",
};

// ─── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-emerald-500" :
    score >= 45 ? "bg-amber-400" :
                  "bg-slate-300";
  return (
    <div className="flex items-center gap-2 min-w-30">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums w-7 text-right ${
        score >= 70 ? "text-emerald-600" :
        score >= 45 ? "text-amber-600" :
                      "text-slate-400"
      }`}>
        {score}
      </span>
    </div>
  );
}

function CriterionBadge({
  pass,
  label,
  value,
  noDataLabel,
}: {
  pass: boolean | null;
  label: string;
  value: number | null;
  noDataLabel: string;
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
    <span className={`${base} ${pass ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
      {pass ? "✓" : "✗"} {label}
      {value !== null && (
        <span className="opacity-70">
          {formatValue(label, value)}
        </span>
      )}
    </span>
  );
}

function formatValue(label: string, value: number): string {
  if (label.includes("시가총액") || label.includes("Market Cap") || label.includes("時価") || label.includes("Kapital")) {
    const b = value / 1_000_000_000;
    return b >= 1 ? ` ${b.toFixed(1)}B` : ` ${(value / 1_000_000).toFixed(0)}M`;
  }
  if (label.includes("D/E") || label.includes("Verschuldung") || label.includes("負債") || label.includes("부채")) {
    return ` ${value.toFixed(0)}`;
  }
  // 비율 값 (소수 → %)
  if (Math.abs(value) < 10) {
    return ` ${(value * 100).toFixed(1)}%`;
  }
  return ` ${value.toFixed(2)}`;
}

// ─── 모드 타입 ─────────────────────────────────────────────────────────────

type ScreenMode = "market" | "portfolio" | "search";

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export function LynchTenBaggerCard() {
  const t = useT();
  const assets = useAssetStore((s) => s.assets);

  const [mode, setMode] = useState<ScreenMode>("portfolio");
  const [market, setMarket] = useState<Market>("US");
  const [results, setResults] = useState<LynchScreenResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);
  const [progress, setProgress] = useState<ScreenProgress>({ phase: "fetch", done: 0, total: 0 });

  // 티커 검색
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{ ticker: string; name: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setRan(false);
    setProgress({ phase: "fetch", done: 0, total: 1 });
    try {
      const res = await screenAll(market, (p) => {
        setProgress(p);
      });
      setResults(res);
    } finally {
      setLoading(false);
      setRan(true);
    }
  }, [market]);

  const runPortfolio = useCallback(async () => {
    const stockAssets = assets.filter((a) => a.ticker && (a.type === "stock" || a.type === "etf"));
    if (stockAssets.length === 0) return;

    setLoading(true);
    setRan(false);
    setProgress({ phase: "enrich", done: 0, total: stockAssets.length });
    try {
      const tickers = stockAssets.map((a) => ({ ticker: a.ticker!, name: a.name }));
      const res = await screenByTickers(tickers, (p) => setProgress(p));
      setResults(res);
    } finally {
      setLoading(false);
      setRan(true);
    }
  }, [assets]);

  const runSearch = useCallback(async (ticker: string, name?: string) => {
    setLoading(true);
    setRan(false);
    setProgress({ phase: "enrich", done: 0, total: 1 });
    setSearchSuggestions([]);
    try {
      const res = await screenByTickers([{ ticker, name }], (p) => setProgress(p));
      setResults(res);
    } finally {
      setLoading(false);
      setRan(true);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearching(true);
    try {
      const items = await searchTicker(q);
      if (items.length === 1) {
        await runSearch(items[0].ticker, items[0].name);
      } else if (items.length > 1) {
        setSearchSuggestions(items.map((i) => ({ ticker: i.ticker, name: i.name })));
      }
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, runSearch]);

  // 모드·시장 변경 시 결과 초기화
  useEffect(() => {
    setResults([]);
    setRan(false);
    setProgress({ phase: "fetch", done: 0, total: 0 });
    setSearchSuggestions([]);
  }, [mode, market]);

  const criterionLabel = (key: LynchCriterionKey): string => {
    const map: Record<LynchCriterionKey, string> = {
      peg:            t.lynch_criterion_peg,
      epsGrowth:      t.lynch_criterion_eps,
      revenueGrowth:  t.lynch_criterion_rev,
      debtToEquity:   t.lynch_criterion_debt,
      operatingMargin:t.lynch_criterion_margin,
      marketCap:      t.lynch_criterion_cap,
    };
    return map[key];
  };

  const portfolioTickers = assets.filter((a) => a.ticker && (a.type === "stock" || a.type === "etf"));

  return (
    <Card title={t.lynch_tenbagger_title}>
      {/* 설명 */}
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{t.lynch_tenbagger_desc}</p>

      {/* 모드 탭 */}
      <div className="flex gap-1.5 mb-3">
        {(["portfolio", "market", "search"] as const).map((m) => {
          const label =
            m === "market"    ? `📊 ${t.screener_mode_market}` :
            m === "portfolio" ? `💼 ${t.screener_mode_portfolio}` :
                                `🔍 ${t.screener_mode_search}`;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                mode === m
                  ? "bg-green-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 시장 모드 */}
      {mode === "market" && (
        <>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {MARKET_OPTIONS.map((m) => {
              const label =
                m.value === "KR"  ? `🇰🇷 ${t.market_kr}` :
                m.value === "US"  ? `🇺🇸 ${t.market_us}` :
                m.value === "JP"  ? `🇯🇵 ${t.market_jp}` :
                                    `🇪🇺 ${t.market_eu}`;
              return (
                <button
                  key={m.value}
                  onClick={() => setMarket(m.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    market === m.value
                      ? "bg-green-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mb-2">{t.lynch_cap_range_hint}</p>
          <button
            onClick={run}
            disabled={loading}
            className="mb-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? progress.phase === "fetch"
                ? t.lynch_progress_fetch
                : t.lynch_progress_enrich(progress.done, progress.total)
              : t.lynch_btn_screen}
          </button>
        </>
      )}

      {/* 포트폴리오 모드 */}
      {mode === "portfolio" && (
        <>
          <p className="text-[11px] text-slate-400 mb-2">
            {t.screener_portfolio_desc(portfolioTickers.length)}
          </p>
          <button
            onClick={runPortfolio}
            disabled={loading || portfolioTickers.length === 0}
            className="mb-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? t.lynch_progress_enrich(progress.done, progress.total)
              : t.screener_btn_portfolio}
          </button>
        </>
      )}

      {/* 검색 모드 */}
      {mode === "search" && (
        <>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder={t.screener_search_placeholder}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200"
            />
            <button
              onClick={handleSearch}
              disabled={loading || isSearching || !searchQuery.trim()}
              className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSearching ? "..." : t.screener_btn_search}
            </button>
          </div>
          {searchSuggestions.length > 0 && (
            <div className="mb-3 rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {searchSuggestions.map((s) => (
                <button
                  key={s.ticker}
                  onClick={() => runSearch(s.ticker, s.name)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-700">{s.ticker}</span>
                  <span className="text-xs text-slate-400 truncate">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* 로딩 — 진행률 바 */}
      {loading && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1 animate-pulse">
            {progress.phase === "fetch"
              ? t.lynch_phase_fetch
              : t.lynch_phase_enrich}
          </p>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress.phase === "enrich" ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{
                width: progress.total > 0
                  ? `${Math.round((progress.done / progress.total) * 100)}%`
                  : "0%",
              }}
            />
          </div>
          {progress.phase === "enrich" && (
            <p className="text-[10px] text-slate-300 mt-0.5 text-right">
              {progress.done} / {progress.total}
            </p>
          )}
        </div>
      )}

      {/* 결과 없음 — 스크리닝 완료했지만 결과 0 */}
      {!loading && ran && results.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-6">
          {t.lynch_no_result}
        </p>
      )}

      {/* 결과 테이블 */}
      {!loading && ran && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, idx) => (
            <div
              key={r.stock.ticker}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-green-200 hover:bg-green-50/30 transition-colors"
            >
              {/* 헤더 행 */}
              <div className="flex items-center gap-2 mb-2">
                {/* 순위 */}
                <span className={`text-xs font-bold w-5 shrink-0 ${
                  idx === 0 ? "text-yellow-500" :
                  idx === 1 ? "text-slate-400" :
                  idx === 2 ? "text-amber-600" :
                              "text-slate-300"
                }`}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                </span>

                {/* 종목명/티커 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{r.stock.name}</p>
                  <p className="text-xs text-slate-400">{r.stock.ticker}</p>
                </div>

                {/* 10루타 배지 */}
                {r.totalScore >= 70 && (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {t.lynch_tenbagger_badge}
                  </span>
                )}

                {/* 점수 바 */}
                <div className="shrink-0">
                  <ScoreBar score={r.totalScore} />
                </div>
              </div>

              {/* 기준별 배지 */}
              <div className="flex flex-wrap gap-1">
                {r.criteria.map((c) => (
                  <CriterionBadge
                    key={c.key}
                    pass={c.pass}
                    label={criterionLabel(c.key)}
                    value={c.value}
                    noDataLabel={t.lynch_no_data}
                  />
                ))}
              </div>

              {/* 기준별 힌트 (툴팁 대용) */}
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                {r.criteria.map((c) => (
                  <span key={c.key} className="text-[9px] text-slate-300">
                    {criterionLabel(c.key)}: {CRITERION_HINT[c.key]} ({c.score}/{c.maxScore}pt)
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* 면책 문구 */}
          <p className="text-[10px] text-slate-300 pt-1">{t.lynch_disclaimer}</p>
        </div>
      )}

      {/* 초기 상태 (아직 실행 전) */}
      {!loading && !ran && (
        <p className="text-xs text-slate-400 text-center py-4">
          {t.lynch_initial_guide}
        </p>
      )}
    </Card>
  );
}
