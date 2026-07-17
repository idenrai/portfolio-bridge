import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface MultiSelectProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  selectAllText?: string;
  clearText?: string;
  selectedText?: (count: number) => string;
  className?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
  selectAllText = "Select All",
  clearText = "Clear",
  selectedText = (count) => `${count} selected`,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  };

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleSelectAll = () => {
    onChange(options.map((o) => o.value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-[30px] min-w-[120px] max-w-[200px] items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-200 transition-colors hover:bg-zinc-800/80 focus-visible:border-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500/50 cursor-pointer",
          isOpen && "border-zinc-600 bg-zinc-800/80"
        )}
      >
        <span className="truncate">
          {selectedValues.length === 0
            ? placeholder
            : selectedValues.length === 1
            ? options.find((o) => o.value === selectedValues[0])?.label || placeholder
            : selectedText(selectedValues.length)}
        </span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 w-56 origin-top-left rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
          {options.length > 1 && (
            <div className="mb-1 flex items-center justify-between border-b border-zinc-800/50 px-2 pb-1.5 pt-1">
              <button
                type="button"
                onClick={handleSelectAll}
                className="cursor-pointer rounded-sm text-[10px] font-medium text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              >
                {selectAllText}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="cursor-pointer rounded-sm text-[10px] font-medium text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              >
                {clearText}
              </button>
            </div>
          )}
          <div className="custom-scrollbar max-h-60 overflow-y-auto py-1">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-zinc-800/50",
                    isSelected ? "text-white" : "text-zinc-300"
                  )}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isSelected}
                    onChange={() => handleToggle(option.value)}
                  />
                  <div
                    className={cn(
                      "flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-zinc-950",
                      isSelected
                        ? "border-violet-500 bg-violet-500 text-white"
                        : "border-zinc-700 bg-transparent text-transparent"
                    )}
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </div>
                  <span className="truncate text-[11px] leading-tight">{option.label}</span>
                </label>
              );
            })}
            {options.length === 0 && (
              <div className="px-2 py-2 text-center text-[11px] text-zinc-500">
                No options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
