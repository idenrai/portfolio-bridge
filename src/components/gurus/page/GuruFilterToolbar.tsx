import { Search, X } from "lucide-react";
import type { GuruCategoryTag } from "@/utils";
import { cn } from "@/utils";
import type { Translations } from "@/i18n";
import { CATEGORY_TABS } from "@/constants/guruCategoryTabs";

interface GuruFilterToolbarProps {
  selectedCategory: GuruCategoryTag | "all";
  onSelectCategory: (cat: GuruCategoryTag | "all") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount: number;
  t: Translations;
}

export function GuruFilterToolbar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCount,
  t,
}: GuruFilterToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* 카테고리 칩 목록 */}
      <div role="group" aria-label={t.guru_filter_all} className="flex flex-wrap items-center gap-1.5">
        {CATEGORY_TABS.map((tab) => {
          const active = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectCategory(tab.id)}
              className={cn(
                "cursor-pointer rounded-lg px-2.5 py-1 text-xs transition-all",
                active
                  ? "bg-zinc-100 font-semibold text-black shadow-sm"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
              )}
            >
              {t[tab.labelKey as keyof typeof t] as string}
            </button>
          );
        })}
      </div>

      {/* 검색 입력창 및 카운트 뱃지 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-56">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.guru_search_placeholder}
            aria-label={t.guru_search_placeholder}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-1.5 pr-7 pl-8 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-indigo-500/60 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              aria-label={t.guru_search_clear}
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <span className="shrink-0 font-mono text-3xs text-zinc-500">
          {t.guru_count_badge(totalCount)}
        </span>
      </div>
    </div>
  );
}
