import { useT, useAnalyzer } from "@/hooks";
import { analyzeByTickersGraham, type GrahamCriterionKey, type GrahamAnalyzerResult } from "@/utils/analyzers";
import { AnalyzerCard, type AnalyzerTexts } from "./AnalyzerCard";

// ─── 기준별 힌트 ──────────────────────────────────────────────────────────────

const CRITERION_HINT: Record<GrahamCriterionKey, string> = {
  peRatio:       "< 15 ★",
  pbRatio:       "< 1.5 ★",
  grahamNumber:  "P/E×P/B < 22.5 ★",
  currentRatio:  "> 2.0 ★",
  debtToEquity:  "< 50 ★",
  dividendYield: "> 3% ★",
};

// ─── 값 포매터 ────────────────────────────────────────────────────────────────

function formatValue(key: GrahamCriterionKey, value: number): string {
  if (key === "dividendYield") return ` ${(value * 100).toFixed(1)}%`;
  if (key === "debtToEquity") return ` ${value.toFixed(0)}`;
  return ` ${value.toFixed(2)}`;
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export function GrahamDefensiveCard() {
  const t = useT();
  const analyzer = useAnalyzer<GrahamAnalyzerResult>({ analyzeByTickers: analyzeByTickersGraham });

  const texts: AnalyzerTexts = {
    title:           t.graham_analyzer_title,
    desc:            t.graham_analyzer_desc,
    progressEnrich:  t.graham_progress_enrich,
    phaseEnrich:     t.graham_phase_enrich,
    noResult:        t.graham_no_result,
    highScoreBadge:  t.graham_defensive_badge,
    initialGuide:    t.graham_initial_guide,
    noData:          t.graham_no_data,
    disclaimer:      t.graham_disclaimer,
  };

  const criterionLabel = (key: GrahamCriterionKey): string => {
    const map: Record<GrahamCriterionKey, string> = {
      peRatio:       t.graham_criterion_pe,
      pbRatio:       t.graham_criterion_pb,
      grahamNumber:  t.graham_criterion_gn,
      currentRatio:  t.graham_criterion_cr,
      debtToEquity:  t.graham_criterion_debt,
      dividendYield: t.graham_criterion_div,
    };
    return map[key];
  };

  return (
    <AnalyzerCard<GrahamCriterionKey>
      theme="blue"
      texts={texts}
      criterionHints={CRITERION_HINT}
      criterionLabel={criterionLabel}
      formatValue={formatValue}
      {...analyzer}
    />
  );
}
