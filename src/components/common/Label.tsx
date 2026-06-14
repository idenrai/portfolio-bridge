import React from "react";
import { cn } from "@/utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium text-slate-400 mb-1.5",
          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";
