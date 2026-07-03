import { Sparkles } from "lucide-react";
import { useT, useAnalyzer } from "@/hooks";
import { analyzeByTickersSmith, type SmithCriterionKey, type SmithAnalyzerResult } from "@/utils/analyzers";
import { AnalyzerCard, type AnalyzerTexts } from "./AnalyzerCard";

// ─── 기준별 힌트 ──────────────────────────────────────────────────────────────

const CRITERION_HINT: Record<SmithCriterionKey, string> = {
  returnOnEquity:  "> 20% ★",
  operatingMargin: "> 15% ★",
  fcfConversion:   "> 80% ★",
  revenueGrowth:   "> 10% ★",
  debtToEquity:    "< 60 ★",
};

// ─── 값 포매터 ────────────────────────────────────────────────────────────────

function formatValue(key: SmithCriterionKey, value: number): string {
  if (key === "debtToEquity") return ` ${value.toFixed(0)}`;
  return ` ${(value * 100).toFixed(1)}%`;
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export function SmithQualityCard() {
  const t = useT();
  const analyzer = useAnalyzer<SmithAnalyzerResult>({ analyzeByTickers: analyzeByTickersSmith });

  const texts: AnalyzerTexts = {
    title:           t.smith_analyzer_title,
    desc:            t.smith_analyzer_desc,
    progressEnrich:  t.smith_progress_enrich,
    phaseEnrich:     t.smith_phase_enrich,
    noResult:        t.smith_no_result,
    highScoreBadge: (
      <span className="inline-flex items-center gap-1">
        <Sparkles className="size-3" />
        {t.smith_quality_badge}
      </span>
    ),
    initialGuide:    t.smith_initial_guide,
    noData:          t.smith_no_data,
    disclaimer:      t.smith_disclaimer,
  };

  const criterionLabel = (key: SmithCriterionKey): string => {
    const map: Record<SmithCriterionKey, string> = {
      returnOnEquity:  t.smith_criterion_roe,
      operatingMargin: t.smith_criterion_margin,
      fcfConversion:   t.smith_criterion_fcf,
      revenueGrowth:   t.smith_criterion_rev,
      debtToEquity:    t.smith_criterion_debt,
    };
    return map[key];
  };

  return (
    <AnalyzerCard<SmithCriterionKey>
      theme="amber"
      texts={texts}
      criterionHints={CRITERION_HINT}
      criterionLabel={criterionLabel}
      formatValue={formatValue}
      {...analyzer}
    />
  );
}
