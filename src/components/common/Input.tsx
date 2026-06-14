import React from "react";
import { cn } from "@/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white font-mono shadow-sm transition-colors",
          "placeholder:text-slate-500",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
