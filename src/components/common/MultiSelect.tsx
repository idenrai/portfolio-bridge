import { useState, useRef, useEffect, useCallback, useId } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
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
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const rafRef = useRef<number | null>(null);

  const updatePopupPosition = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const estimatedHeight = Math.min(options.length * 36 + 40, 240);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = rect.bottom + window.scrollY + 6;
      if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
        top = rect.top + window.scrollY - estimatedHeight - 6;
      }

      const style: React.CSSProperties = {
        top: `${top}px`,
        minWidth: `${Math.max(rect.width, 224)}px`,
      };

      if (rect.left > window.innerWidth / 2) {
        style.right = `${document.documentElement.clientWidth - rect.right - window.scrollX}px`;
      } else {
        style.left = `${rect.left + window.scrollX}px`;
      }

      setPopupStyle(style);
    });
  }, [options.length]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePopupPosition();
      window.addEventListener("scroll", updatePopupPosition, true);
      window.addEventListener("resize", updatePopupPosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePopupPosition, true);
      window.removeEventListener("resize", updatePopupPosition);
    };
  }, [isOpen, updatePopupPosition]);

  useEffect(() => {
    if (isOpen && listRef.current && focusedIndex >= 0) {
      const items = Array.from(listRef.current.querySelectorAll('label[role="option"]')) as HTMLElement[];
      const el = items[focusedIndex];
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex, isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      if (listRef.current?.parentElement?.contains(e.target as Node)) return;
      
      setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex(0);
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        containerRef.current?.querySelector("button")?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleToggle(options[focusedIndex].value);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
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

  const portalContent = isOpen && typeof document !== "undefined" ? createPortal(
    <div
      className={cn(
        "animate-popup absolute z-[100] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 p-1 shadow-xl backdrop-blur-xl"
      )}
      style={popupStyle}
    >
      {options.length > 1 && (
        <div className="mb-1 flex items-center justify-between border-b border-zinc-800/50 px-2 pt-1 pb-1.5">
          <button
            type="button"
            onClick={handleSelectAll}
            className="cursor-pointer rounded-sm text-[10px] font-medium text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            {selectAllText}
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="cursor-pointer rounded-sm text-[10px] font-medium text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            {clearText}
          </button>
        </div>
      )}
      <div 
        className="custom-scrollbar max-h-60 overflow-y-auto py-1"
        ref={listRef}
        role="listbox"
        aria-multiselectable="true"
        id={listboxId}
      >
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.value);
          const isFocused = index === focusedIndex;
          
          return (
            <label
              key={option.value}
              role="option"
              aria-selected={isSelected}
              id={`${listboxId}-option-${index}`}
              onMouseEnter={() => setFocusedIndex(index)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
                isFocused ? "bg-zinc-800/80" : "hover:bg-zinc-800/50",
                isSelected ? "text-white" : "text-zinc-300"
              )}
            >
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                tabIndex={-1}
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
              <span className="min-w-0 truncate text-[11px] leading-tight">{option.label}</span>
            </label>
          );
        })}
        {options.length === 0 && (
          <div className="p-2 text-center text-[11px] text-zinc-500">
            No options
          </div>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)} onKeyDown={handleKeyDown}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-owns={isOpen ? listboxId : undefined}
        aria-activedescendant={isOpen && focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
        onClick={() => {
          if (!isOpen) {
            setFocusedIndex(0);
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
        className={cn(
          "flex h-[30px] max-w-[200px] min-w-[120px] cursor-pointer items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-200 transition-colors hover:bg-zinc-800/80 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500/50 focus-visible:outline-none",
          isOpen && "border-zinc-600 bg-zinc-800/80"
        )}
      >
        <span className="min-w-0 truncate">
          {selectedValues.length === 0
            ? placeholder
            : selectedValues.length === 1
            ? options.find((o) => o.value === selectedValues[0])?.label || placeholder
            : selectedText(selectedValues.length)}
        </span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {portalContent}
    </div>
  );
}
