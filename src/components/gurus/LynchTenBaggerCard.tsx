import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/common";
import { useT } from "@/hooks";
import { screenAll, type LynchScreenResult, type LynchCriterionKey } from "@/utils/lynchScreener";
import type { Asset, Market } from "@/types";

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const MARKET_OPTIONS: Array<{ value: "ALL" | Market; flag: string }> = [
  { value: "ALL", flag: "" },
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

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

interface Props {
  assets: Asset[];
}

export function LynchTenBaggerCard({ assets }: Props) {
  const t = useT();
  const [market, setMarket] = useState<"ALL" | Market>("ALL");
  const [results, setResults] = useState<LynchScreenResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);

  // 스크리닝 대상: 주식 + ticker 보유 + 시장 필터
  const candidates = assets.filter(
    (a) => a.type === "stock" && a.ticker && (market === "ALL" || a.market === market),
  );

  const run = useCallback(async () => {
    if (candidates.length === 0) {
      setResults([]);
      setRan(true);
      return;
    }
    setLoading(true);
    setRan(false);
    try {
      const res = await screenAll(candidates);
      setResults(res);
    } finally {
      setLoading(false);
      setRan(true);
    }
  }, [candidates]);

  // 시장 탭 변경 시 결과 초기화
  useEffect(() => {
    setResults([]);
    setRan(false);
  }, [market]);

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

  return (
    <Card title={t.lynch_tenbagger_title}>
      {/* 설명 */}
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{t.lynch_tenbagger_desc}</p>

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
                  ? "bg-green-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 스크리닝 실행 버튼 */}
      <button
        onClick={run}
        disabled={loading || candidates.length === 0}
        className="mb-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? "⏳ " + t.lynch_loading : "🔍 Screening"}
      </button>

      {/* 로딩 */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-400 animate-pulse">{t.lynch_loading}</p>
          <p className="text-xs text-slate-300 mt-1">
            {candidates.length}개 종목 조회 중…
          </p>
        </div>
      )}

      {/* 결과 없음 */}
      {!loading && ran && candidates.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-6">{t.lynch_no_stocks}</p>
      )}

      {/* 결과 테이블 */}
      {!loading && ran && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, idx) => (
            <div
              key={r.asset.id}
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
                  <p className="text-sm font-semibold text-slate-800 truncate">{r.asset.name}</p>
                  <p className="text-xs text-slate-400">{r.asset.ticker}</p>
                </div>

                {/* 10루타 배지 */}
                {r.totalScore >= 70 && (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    🚀 10루타 후보
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
      {!loading && !ran && candidates.length > 0 && (
        <p className="text-xs text-slate-400 text-center py-4">
          위 버튼을 눌러 {candidates.length}개 종목을 스크리닝하세요.
        </p>
      )}
    </Card>
  );
}
