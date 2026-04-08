import { useT, useAnalyzer } from "@/hooks";
import { analyzeByTickersOneil, type OneilCriterionKey, type OneilAnalyzerResult } from "@/utils/oneilAnalyzer";
import { AnalyzerCard, type AnalyzerTexts } from "./AnalyzerCard";

// ─── 기준별 힌트 ──────────────────────────────────────────────────────────────

const CRITERION_HINT: Record<OneilCriterionKey, string> = {
  currentEarnings: "QoQ EPS ≥ 25% ★",
  annualEarnings:  "YoY EPS ≥ 25% ★",
  newHighs:        "Near 52w High ★",
  supplyDemand:    "Float < 50M ★",
  leader:          "RS ≥ 80 ★",
  institutional:   "30–70% ★",
  marketCap:       "$2B–$50B ★",
};

// ─── 값 포매터 ────────────────────────────────────────────────────────────────

function formatValue(key: OneilCriterionKey, value: number): string {
  if (key === "currentEarnings" || key === "annualEarnings") {
    return ` ${(value * 100).toFixed(1)}%`;
  }
  if (key === "newHighs") {
    return ` ${(value * 100).toFixed(1)}%`;
  }
  if (key === "supplyDemand") {
    if (value >= 1e9) return ` ${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return ` ${(value / 1e6).toFixed(0)}M`;
    return ` ${(value / 1e3).toFixed(0)}K`;
  }
  if (key === "leader") {
    return ` ${(value * 100).toFixed(0)}%`;
  }
  if (key === "institutional") {
    return ` ${(value * 100).toFixed(1)}%`;
  }
  if (key === "marketCap") {
    if (value >= 1e12) return ` $${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9)  return ` $${(value / 1e9).toFixed(1)}B`;
    return ` $${(value / 1e6).toFixed(0)}M`;
  }
  return ` ${value.toFixed(2)}`;
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export function OneilCanSlimCard() {
  const t = useT();
  const analyzer = useAnalyzer<OneilAnalyzerResult>({ analyzeByTickers: analyzeByTickersOneil });

  const texts: AnalyzerTexts = {
    title:           t.oneil_analyzer_title,
    desc:            t.oneil_analyzer_desc,
    progressEnrich:  t.oneil_progress_enrich,
    phaseEnrich:     t.oneil_phase_enrich,
    noResult:        t.oneil_no_result,
    highScoreBadge:  t.oneil_canslim_badge,
    initialGuide:    t.oneil_initial_guide,
    noData:          t.oneil_no_data,
    disclaimer:      t.oneil_disclaimer,
  };

  const criterionLabel = (key: OneilCriterionKey): string => {
    const map: Record<OneilCriterionKey, string> = {
      currentEarnings: t.oneil_criterion_current,
      annualEarnings:  t.oneil_criterion_annual,
      newHighs:        t.oneil_criterion_newhigh,
      supplyDemand:    t.oneil_criterion_supply,
      leader:          t.oneil_criterion_leader,
      institutional:   t.oneil_criterion_institutional,
      marketCap:       t.oneil_criterion_cap,
    };
    return map[key];
  };

  return (
    <AnalyzerCard<OneilCriterionKey>
      theme="violet"
      texts={texts}
      criterionHints={CRITERION_HINT}
      criterionLabel={criterionLabel}
      formatValue={formatValue}
      {...analyzer}
    />
  );
}
