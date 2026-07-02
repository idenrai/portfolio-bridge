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
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs min-h-[44px]" : "px-4 py-2 text-sm min-h-[44px]";
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 font-bold whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-black focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${sizeClass} ${className}`}
      {...rest}
    >
      <span className="text-inherit opacity-40">{"["}</span>
      {children}
      <span className="text-inherit opacity-40">{"]"}</span>
    </button>
  );
}
