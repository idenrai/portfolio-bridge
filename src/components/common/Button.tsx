import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-zinc-200 text-black hover:bg-white border border-zinc-200 hover:border-white",
  secondary: "bg-black text-zinc-300 hover:bg-zinc-900 border border-zinc-800",
  danger: "bg-black text-zinc-500 hover:bg-white hover:text-black border border-zinc-800 hover:border-white",
  ghost: "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${VARIANT_CLASSES[variant]} ${sizeClass} ${className}`}
      {...rest}
    >
      <span className="text-inherit opacity-40">{"["}</span>
      {children}
      <span className="text-inherit opacity-40">{"]"}</span>
    </button>
  );
}
