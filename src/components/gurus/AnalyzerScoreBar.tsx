import { cn } from "@/utils";
import type { ThemeColors } from "./analyzerTheme";

interface ScoreBarProps {
  score: number;
  colors: ThemeColors;
}

export function AnalyzerScoreBar({ score, colors }: ScoreBarProps) {
  const barColor =
    score >= 70
      ? colors.scoreHigh
      : score >= 45
        ? "bg-amber-400"
        : "bg-zinc-300";
  const textColor =
    score >= 70
      ? colors.scoreTextHigh
      : score >= 45
        ? "text-amber-600"
        : "text-zinc-400";

  return (
    <div className="flex min-w-30 items-center gap-2">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800/50"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Score"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width,background-color] duration-500",
            barColor,
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("w-7 text-right text-xs font-bold tabular-nums", textColor)}>
        {score}
      </span>
    </div>
  );
}
