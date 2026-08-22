import { cn } from "@/utils/cn";

interface ChartSkeletonProps {
  title?: string;
  className?: string;
  heightClassName?: string;
}

export function ChartSkeleton({
  title,
  className,
  heightClassName = "h-64",
}: ChartSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading chart"
      className={cn(
        "animate-pulse border border-zinc-800 bg-zinc-950",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 md:px-5">
        {title ? (
          <h3 className="text-sm font-bold text-zinc-400">{title}</h3>
        ) : (
          <div className="h-4 w-32 rounded-sm bg-zinc-800" />
        )}
        <div className="h-3 w-12 rounded-sm bg-zinc-800/60" />
      </div>

      <div className={cn("flex flex-col justify-end p-4 md:p-5", heightClassName)}>
        {/* Mock Chart Area */}
        <div className="relative flex size-full items-end gap-3 pb-4">
          {/* Subtle Grid lines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-30">
            <div className="border-b border-zinc-800" />
            <div className="border-b border-zinc-800" />
            <div className="border-b border-zinc-800" />
          </div>

          {/* Skeleton Bars / Lines */}
          <div className="h-2/5 w-full rounded-xs bg-zinc-800/40" />
          <div className="h-3/5 w-full rounded-xs bg-zinc-800/50" />
          <div className="h-1/2 w-full rounded-xs bg-zinc-800/40" />
          <div className="h-4/5 w-full rounded-xs bg-zinc-800/60" />
          <div className="h-3/5 w-full rounded-xs bg-zinc-800/45" />
          <div className="h-3/4 w-full rounded-xs bg-zinc-800/55" />
          <div className="h-2/5 w-full rounded-xs bg-zinc-800/40" />
        </div>

        {/* Legend Placeholder */}
        <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-16 rounded-xs bg-zinc-800/60" />
            <div className="h-2.5 w-16 rounded-xs bg-zinc-800/60" />
          </div>
          <div className="h-2.5 w-20 rounded-xs bg-zinc-800/40" />
        </div>
      </div>
    </div>
  );
}
