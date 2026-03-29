import { useT, useScreener } from "@/hooks";
import { screenAll, screenByTickers, type LynchCriterionKey, type LynchScreenResult } from "@/utils/lynchScreener";
import { ScreenerCard, type ScreenerTexts } from "./ScreenerCard";

// ─── 기준별 힌트 ──────────────────────────────────────────────────────────────

const CRITERION_HINT: Record<LynchCriterionKey, string> = {
  peg:             "< 1.0 ★",
  epsGrowth:       "> 15% ★",
  revenueGrowth:   "> 10% ★",
  debtToEquity:    "< 80 ★",
  operatingMargin: "> 10% ★",
  marketCap:       "< $10B ★",
};

// ─── 값 포매터 ────────────────────────────────────────────────────────────────

function formatValue(key: LynchCriterionKey, value: number): string {
  if (key === "marketCap") {
    const b = value / 1_000_000_000;
    return b >= 1 ? ` ${b.toFixed(1)}B` : ` ${(value / 1_000_000).toFixed(0)}M`;
  }
  if (key === "debtToEquity") return ` ${value.toFixed(0)}`;
  if (key === "peg") return ` ${value.toFixed(2)}`;
  return ` ${(value * 100).toFixed(1)}%`;
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export function LynchTenBaggerCard() {
  const t = useT();
  const screener = useScreener<LynchScreenResult>({ screenAll, screenByTickers });

  const texts: ScreenerTexts = {
    title:           t.lynch_tenbagger_title,
    desc:            t.lynch_tenbagger_desc,
    capRangeHint:    t.lynch_cap_range_hint,
    progressFetch:   t.lynch_progress_fetch,
    progressEnrich:  t.lynch_progress_enrich,
    btnScreen:       t.lynch_btn_screen,
    phaseFetch:      t.lynch_phase_fetch,
    phaseEnrich:     t.lynch_phase_enrich,
    noResult:        t.lynch_no_result,
    highScoreBadge:  t.lynch_tenbagger_badge,
    initialGuide:    t.lynch_initial_guide,
    noData:          t.lynch_no_data,
    disclaimer:      t.lynch_disclaimer,
  };

  const criterionLabel = (key: LynchCriterionKey): string => {
    const map: Record<LynchCriterionKey, string> = {
      peg:             t.lynch_criterion_peg,
      epsGrowth:       t.lynch_criterion_eps,
      revenueGrowth:   t.lynch_criterion_rev,
      debtToEquity:    t.lynch_criterion_debt,
      operatingMargin: t.lynch_criterion_margin,
      marketCap:       t.lynch_criterion_cap,
    };
    return map[key];
  };

  return (
    <ScreenerCard<LynchCriterionKey>
      theme="green"
      texts={texts}
      criterionHints={CRITERION_HINT}
      criterionLabel={criterionLabel}
      formatValue={formatValue}
      {...screener}
    />
  );
}
