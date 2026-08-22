import type React from "react";

export interface ThemeColors {
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

export const THEMES: Record<"green" | "violet" | "blue" | "amber", ThemeColors> = {
  green: {
    btn: "bg-green-600 hover:bg-green-700",
    tabActive: "bg-green-600 text-white",
    scoreHigh: "bg-emerald-500",
    scoreTextHigh: "text-emerald-400",
    badgePass: "bg-emerald-500/10 text-emerald-400",
    highScoreBadge: "bg-emerald-500/20 text-emerald-300",
    resultHover: "hover:border-emerald-500/20 hover:bg-emerald-500/10",
    suggestHover: "hover:bg-emerald-500/10",
    inputFocus: "focus-visible:border-green-400 focus-visible:ring-1 focus-visible:ring-green-500/30",
    progressEnrich: "bg-emerald-500",
  },
  violet: {
    btn: "bg-violet-600 hover:bg-violet-700",
    tabActive: "bg-violet-600 text-white",
    scoreHigh: "bg-violet-500",
    scoreTextHigh: "text-violet-400",
    badgePass: "bg-violet-500/10 text-violet-400",
    highScoreBadge: "bg-violet-500/20 text-violet-300",
    resultHover: "hover:border-violet-500/20 hover:bg-violet-500/10",
    suggestHover: "hover:bg-violet-500/10",
    inputFocus: "focus-visible:border-violet-400 focus-visible:ring-1 focus-visible:ring-violet-500/30",
    progressEnrich: "bg-violet-500",
  },
  blue: {
    btn: "bg-blue-600 hover:bg-blue-700",
    tabActive: "bg-blue-600 text-white",
    scoreHigh: "bg-blue-500",
    scoreTextHigh: "text-blue-400",
    badgePass: "bg-blue-500/10 text-blue-400",
    highScoreBadge: "bg-blue-500/20 text-blue-300",
    resultHover: "hover:border-blue-500/20 hover:bg-blue-500/10",
    suggestHover: "hover:bg-blue-500/10",
    inputFocus: "focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500/30",
    progressEnrich: "bg-blue-500",
  },
  amber: {
    btn: "bg-amber-600 hover:bg-amber-700",
    tabActive: "bg-amber-600 text-white",
    scoreHigh: "bg-amber-500",
    scoreTextHigh: "text-amber-400",
    badgePass: "bg-amber-500/10 text-amber-400",
    highScoreBadge: "bg-amber-500/20 text-amber-300",
    resultHover: "hover:border-amber-500/20 hover:bg-amber-500/10",
    suggestHover: "hover:bg-amber-500/10",
    inputFocus: "focus-visible:border-amber-400 focus-visible:ring-1 focus-visible:ring-amber-500/30",
    progressEnrich: "bg-amber-500",
  },
};

export interface AnalyzerTexts {
  title: string;
  desc: string;
  progressEnrich: (done: number, total: number) => string;
  phaseEnrich: string;
  noResult: string;
  highScoreBadge: React.ReactNode;
  initialGuide: string;
  noData: string;
  disclaimer: string;
}
