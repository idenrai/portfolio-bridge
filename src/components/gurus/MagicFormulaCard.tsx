import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/common";
import { useT } from "@/hooks";
import { screenAllMF, type MFScreenResult, type MFCriterionKey, type MFScreenProgress } from "@/utils/magicFormulaScreener";
import type { Market } from "@/types";

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const MARKET_OPTIONS: Array<{ value: "ALL" | Market; flag: string }> = [
  { value: "ALL", flag: "" },
  { value: "KR",  flag: "🇰🇷" },
  { value: "US",  flag: "🇺🇸" },
  { value: "JP",  flag: "🇯🇵" },
  { value: "EU",  flag: "🇪🇺" },
];

const CRITERION_HINT: Record<MFCriterionKey, string> = {
  earningsYield:   "> 10% ★",
  returnOnCapital: "> 25% ★",
  operatingMargin: "> 15% ★",
  debtToEquity:    "< 80 ★",
  marketCap:       "$1B–$10B ★",
};

// ─── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-violet-500" :
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
        score >= 70 ? "text-violet-600" :
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
  criterionKey,
  noDataLabel,
}: {
  pass: boolean | null;
  label: string;
  value: number | null;
  criterionKey: MFCriterionKey;
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
    <span className={`${base} ${pass ? "bg-violet-50 text-violet-700" : "bg-red-50 text-red-600"}`}>
      {pass ? "✓" : "✗"} {label}
      {value !== null && (
        <span className="opacity-70">
          {formatValue(criterionKey, value)}
        </span>
      )}
    </span>
  );
}

function formatValue(key: MFCriterionKey, value: number): string {
  if (key === "marketCap") {
    const b = value / 1_000_000_000;
    return b >= 1 ? ` ${b.toFixed(1)}B` : ` ${(value / 1_000_000).toFixed(0)}M`;
  }
  if (key === "debtToEquity") {
    return ` ${value.toFixed(0)}`;
  }
  return ` ${(value * 100).toFixed(1)}%`;
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export function MagicFormulaCard() {
  const t = useT();
  const [market, setMarket] = useState<"ALL" | Market>("ALL");
  const [results, setResults] = useState<MFScreenResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);
  const [progress, setProgress] = useState<MFScreenProgress>({ phase: "fetch", done: 0, total: 0 });

  const run = useCallback(async () => {
    setLoading(true);
    setRan(false);
    setProgress({ phase: "fetch", done: 0, total: 1 });
    try {
      const res = await screenAllMF(market, (p) => {
        setProgress(p);
      });
      setResults(res);
    } finally {
      setLoading(false);
      setRan(true);
    }
  }, [market]);

  useEffect(() => {
    setResults([]);
    setRan(false);
    setProgress({ phase: "fetch", done: 0, total: 0 });
  }, [market]);

  const criterionLabel = (key: MFCriterionKey): string => {
    const map: Record<MFCriterionKey, string> = {
      earningsYield:   t.mf_criterion_ey,
      returnOnCapital: t.mf_criterion_roc,
      operatingMargin: t.mf_criterion_margin,
      debtToEquity:    t.mf_criterion_debt,
      marketCap:       t.mf_criterion_cap,
    };
    return map[key];
  };

  return (
    <Card title={t.mf_title}>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{t.mf_desc}</p>

      {/* 시장 필터 탭 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {MARKET_OPTIONS.map((m) => {
          const label =
            m.value === "ALL" ? t.lynch_market_all :
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
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 mb-2">
        {t.mf_cap_range_hint}
      </p>

      {/* 스크리닝 실행 버튼 */}
      <button
        onClick={run}
        disabled={loading}
        className="mb-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading
          ? progress.phase === "fetch"
            ? t.mf_progress_fetch
            : t.mf_progress_enrich(progress.done, progress.total)
          : t.mf_btn_screen}
      </button>

      {/* 로딩 — 진행률 바 */}
      {loading && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1 animate-pulse">
            {progress.phase === "fetch"
              ? t.mf_phase_fetch
              : t.mf_phase_enrich}
          </p>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress.phase === "enrich" ? "bg-violet-500" : "bg-blue-500"
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

      {/* 결과 없음 */}
      {!loading && ran && results.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-6">
          {t.mf_no_result}
        </p>
      )}

      {/* 결과 테이블 */}
      {!loading && ran && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, idx) => (
            <div
              key={r.stock.ticker}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-violet-200 hover:bg-violet-50/30 transition-colors"
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
                  <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                    {t.mf_magic_badge}
                  </span>
                )}

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
                    criterionKey={c.key}
                    noDataLabel={t.mf_no_data}
                  />
                ))}
              </div>

              {/* 기준별 힌트 */}
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                {r.criteria.map((c) => (
                  <span key={c.key} className="text-[9px] text-slate-300">
                    {criterionLabel(c.key)}: {CRITERION_HINT[c.key]} ({c.score}/{c.maxScore}pt)
                  </span>
                ))}
              </div>
            </div>
          ))}

          <p className="text-[10px] text-slate-300 pt-1">{t.mf_disclaimer}</p>
        </div>
      )}

      {/* 초기 상태 */}
      {!loading && !ran && (
        <p className="text-xs text-slate-400 text-center py-4">
          {t.mf_initial_guide}
        </p>
      )}
    </Card>
  );
}
