import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import React from "react";

interface FeedbackIconTextProps {
  icon: LucideIcon;
  text: React.ReactNode;
  animate?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function FeedbackIconText({
  icon: Icon,
  text,
  animate = false,
  className,
  iconClassName,
  textClassName,
}: FeedbackIconTextProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        animate && "animate-in fade-in zoom-in-95 duration-200",
        className,
      )}
    >
      <Icon className={cn("size-3.5 shrink-0", iconClassName)} />
      {text && <span className={textClassName}>{text}</span>}
    </span>
  );
}
