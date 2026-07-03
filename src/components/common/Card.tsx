import type { ReactNode } from "react";

interface CardProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Card({ title, children, className = "", action }: CardProps) {
  return (
    <div
      className={`border border-zinc-800 bg-zinc-950 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 md:px-5">
          {title && (
            <h3 className="text-sm font-bold text-zinc-300">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}
