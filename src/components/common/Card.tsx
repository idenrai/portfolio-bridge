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
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-slate-100">
          {title && (
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}
