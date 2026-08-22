export function PageSkeleton() {
  return (
    <div
      data-testid="page-skeleton"
      className="animate-pulse space-y-6 px-4 py-6 sm:px-6 lg:px-8"
      role="status"
      aria-label="Loading page content"
    >
      {/* Header bar placeholder */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-sm bg-zinc-800" />
          <div className="h-4 w-64 rounded-sm bg-zinc-900" />
        </div>
        <div className="h-9 w-24 rounded-sm bg-zinc-800" />
      </div>

      {/* KPI Cards placeholder */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-sm border border-zinc-800/80 bg-zinc-950 p-4"
          >
            <div className="h-3 w-20 rounded-sm bg-zinc-800" />
            <div className="mt-3 h-6 w-32 rounded-sm bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Main Content / Table placeholder */}
      <div className="rounded-sm border border-zinc-800/80 bg-zinc-950 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-5 w-32 rounded-sm bg-zinc-800" />
          <div className="h-4 w-16 rounded-sm bg-zinc-900" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-zinc-900/60 pb-3"
            >
              <div className="h-4 w-36 rounded-sm bg-zinc-800/80" />
              <div className="h-4 w-24 rounded-sm bg-zinc-900" />
              <div className="h-4 w-20 rounded-sm bg-zinc-900" />
              <div className="h-4 w-16 rounded-sm bg-zinc-800/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
