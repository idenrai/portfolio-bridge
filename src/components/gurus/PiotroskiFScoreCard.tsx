import { useT, useAnalyzer } from "@/hooks";
import { analyzeByTickersPiotroski, type PiotroskiCriterionKey, type PiotroskiAnalyzerResult } from "@/utils/analyzers/piotroskiAnalyzer";
import { AnalyzerCard, type AnalyzerTexts } from "./AnalyzerCard";

// ─── 기준별 힌트 ──────────────────────────────────────────────────────────────

const CRITERION_HINT: Record<PiotroskiCriterionKey, string> = {
  roa:             "ROA > 0 ★",
  cfo:             "CFO > 0 ★",
  deltaRoa:        "ΔROA > 0 ★",
  accruals:        "CFO > NI ★",
  deltaLeverage:   "ΔDebt ≤ 0 ★",
  deltaLiquidity:  "ΔCR > 0 ★",
  equityDilution:  "No Dilution ★",
  deltaMargin:     "ΔGM > 0 ★",
  deltaTurnover:   "ΔAT > 0 ★",
};

// ─── 값 포매터 ────────────────────────────────────────────────────────────────

function formatValue(key: PiotroskiCriterionKey, value: number): string {
  if (key === "cfo" || key === "accruals" || key === "deltaLeverage" || key === "equityDilution") {
    if (Math.abs(value) >= 1e9) return ` ${(value / 1e9).toFixed(1)}B`;
    if (Math.abs(value) >= 1e6) return ` ${(value / 1e6).toFixed(0)}M`;
    return ` ${value.toFixed(0)}`;
  }
  if (key === "roa" || key === "deltaRoa" || key === "deltaMargin" || key === "deltaTurnover" || key === "deltaLiquidity") {
    return ` ${(value * 100).toFixed(2)}%`;
  }
  return ` ${value.toFixed(2)}`;
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export function PiotroskiFScoreCard() {
  const t = useT();
  const analyzer = useAnalyzer<PiotroskiAnalyzerResult>({ analyzeByTickers: analyzeByTickersPiotroski });

  const texts: AnalyzerTexts = {
    title:           t.piotroski_analyzer_title,
    desc:            t.piotroski_analyzer_desc,
    progressEnrich:  t.piotroski_progress_enrich,
    phaseEnrich:     t.piotroski_phase_enrich,
    noResult:        t.piotroski_no_result,
    highScoreBadge:  t.piotroski_fscore_badge,
    initialGuide:    t.piotroski_initial_guide,
    noData:          t.piotroski_no_data,
    disclaimer:      t.piotroski_disclaimer,
  };

  const criterionLabel = (key: PiotroskiCriterionKey): string => {
    const map: Record<PiotroskiCriterionKey, string> = {
      roa:             t.piotroski_criterion_roa,
      cfo:             t.piotroski_criterion_cfo,
      deltaRoa:        t.piotroski_criterion_delta_roa,
      accruals:        t.piotroski_criterion_accruals,
      deltaLeverage:   t.piotroski_criterion_delta_leverage,
      deltaLiquidity:  t.piotroski_criterion_delta_liquidity,
      equityDilution:  t.piotroski_criterion_equity_dilution,
      deltaMargin:     t.piotroski_criterion_delta_margin,
      deltaTurnover:   t.piotroski_criterion_delta_turnover,
    };
    return map[key];
  };

  return (
    <AnalyzerCard<PiotroskiCriterionKey>
      theme="amber"
      texts={texts}
      criterionHints={CRITERION_HINT}
      criterionLabel={criterionLabel}
      formatValue={formatValue}
      {...analyzer}
    />
  );
}
