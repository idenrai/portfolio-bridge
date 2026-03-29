import { useT, useAnalyzer } from "@/hooks";
import { analyzeByTickersMF, type MFCriterionKey, type MFAnalyzerResult } from "@/utils/magicFormulaAnalyzer";
import { AnalyzerCard, type AnalyzerTexts } from "./AnalyzerCard";

// ─── 기준별 힌트 ──────────────────────────────────────────────────────────────

const CRITERION_HINT: Record<MFCriterionKey, string> = {
  earningsYield:   "> 10% ★",
  returnOnCapital: "> 25% ★",
  operatingMargin: "> 15% ★",
  debtToEquity:    "< 80 ★",
  marketCap:       "$1B–$10B ★",
};

// ─── 값 포매터 ────────────────────────────────────────────────────────────────

function formatValue(key: MFCriterionKey, value: number): string {
  if (key === "marketCap") {
    const b = value / 1_000_000_000;
    return b >= 1 ? ` ${b.toFixed(1)}B` : ` ${(value / 1_000_000).toFixed(0)}M`;
  }
  if (key === "debtToEquity") return ` ${value.toFixed(0)}`;
  return ` ${(value * 100).toFixed(1)}%`;
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export function MagicFormulaCard() {
  const t = useT();
  const analyzer = useAnalyzer<MFAnalyzerResult>({ analyzeByTickers: analyzeByTickersMF });

  const texts: AnalyzerTexts = {
    title:           t.mf_title,
    desc:            t.mf_desc,
    progressEnrich:  t.mf_progress_enrich,
    phaseEnrich:     t.mf_phase_enrich,
    noResult:        t.mf_no_result,
    highScoreBadge:  t.mf_magic_badge,
    initialGuide:    t.mf_initial_guide,
    noData:          t.mf_no_data,
    disclaimer:      t.mf_disclaimer,
  };

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
    <AnalyzerCard<MFCriterionKey>
      theme="violet"
      texts={texts}
      criterionHints={CRITERION_HINT}
      criterionLabel={criterionLabel}
      formatValue={formatValue}
      {...analyzer}
    />
  );
}
