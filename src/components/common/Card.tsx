import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Card({ title, children, className = "", action }: CardProps) {
  return (
    <div
      className={`bg-zinc-950 border border-zinc-800 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-zinc-800">
          {title && (
            <h3 className="font-bold text-zinc-300 text-sm">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}
