import React from "react";
import { cn } from "@/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 font-mono text-sm text-white shadow-sm transition-colors",
          "placeholder:text-zinc-500",
          "focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500/50 focus-visible:outline-none",
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
