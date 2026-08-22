import { cn } from "@/utils";
import type { ThemeColors } from "./analyzerTheme";

interface CriterionBadgeProps<CKey extends string> {
  pass: boolean | null;
  label: string;
  value: number | null;
  criterionKey: CKey;
  noDataLabel: string;
  formatValue: (key: CKey, value: number) => string;
  colors: ThemeColors;
}

export function AnalyzerCriterionBadge<CKey extends string>({
  pass,
  label,
  value,
  criterionKey,
  noDataLabel,
  formatValue,
  colors,
}: CriterionBadgeProps<CKey>) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium leading-none";
  if (pass === null) {
    return (
      <span className={cn(base, "bg-zinc-800/50 text-zinc-400")}>
        {label}: {noDataLabel}
      </span>
    );
  }
  return (
    <span
      className={cn(
        base,
        pass ? colors.badgePass : "bg-red-500/10 text-red-600",
      )}
    >
      <span aria-hidden="true">{pass ? "✓" : "✗"}</span> {label}
      {value !== null && (
        <span className="opacity-70">{formatValue(criterionKey, value)}</span>
      )}
    </span>
  );
}
