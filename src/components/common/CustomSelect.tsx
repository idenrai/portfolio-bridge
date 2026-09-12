import { useState, useRef, useEffect, useId } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { useDropdownPosition } from "@/hooks";

export interface SelectOption<T extends string | number> {
  label: string;
  value: T;
}

interface CustomSelectProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
  dropdownClassName?: string;
  trigger?: React.ReactNode;
  ariaLabel?: string;
}

export function CustomSelect<T extends string | number>({
  value,
  onChange,
  options,
  className = "",
  dropdownClassName = "",
  trigger,
  ariaLabel
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const searchStringRef = useRef("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOption = options.find((o) => o.value === value);

  const { popupStyle } = useDropdownPosition({
    containerRef,
    isOpen,
    itemCount: options.length,
    extraHeight: 16,
  });

  useEffect(() => {
    if (isOpen && listRef.current && focusedIndex >= 0) {
      const el = listRef.current.children[focusedIndex] as HTMLElement;
      if (el) {
        const container = listRef.current;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        const elTop = el.offsetTop;
        const elBottom = elTop + el.offsetHeight;

        if (elTop < containerTop) {
          container.scrollTop = elTop;
        } else if (elBottom > containerBottom) {
          container.scrollTop = elBottom - container.clientHeight;
        }
      }
    }
  }, [focusedIndex, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      if (listRef.current?.parentElement?.contains(e.target as Node)) return;
      
      setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const openDropdown = () => {
    if (typeof document !== 'undefined') {
      setPortalTarget(containerRef.current?.closest('dialog') || document.body);
    }
    const currentIdx = options.findIndex(o => o.value === value);
    setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
    setIsOpen(true);
  };

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    // Type-ahead logic
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const char = e.key.toLowerCase();
      searchStringRef.current += char;
      
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        searchStringRef.current = "";
      }, 500);

      const searchStr = searchStringRef.current;
      const matchIndex = options.findIndex(o => o.label.toLowerCase().startsWith(searchStr));
      
      if (matchIndex >= 0) {
        if (!isOpen) {
          onChange(options[matchIndex].value);
        } else {
          setFocusedIndex(matchIndex);
        }
      }
      return;
    }

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        containerRef.current?.querySelector('button')?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          containerRef.current?.querySelector('button')?.focus();
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const portalContent = isOpen && portalTarget ? createPortal(
    <div 
      className={cn(
        "fixed z-100 overflow-hidden rounded-none border border-zinc-800 bg-zinc-950 p-1 shadow-2xl",
        "animate-popup",
        dropdownClassName
      )}
      style={popupStyle}
    >
      <ul 
        id={listboxId}
        ref={listRef}
        className="relative max-h-60 custom-scrollbar overflow-y-auto" 
        role="listbox"
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isFocused = index === focusedIndex;
          return (
            <li
              key={option.value.toString()}
              id={`${listboxId}-option-${option.value}`}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setFocusedIndex(index)}
              onClick={(e) => {
                e.stopPropagation();
                onChange(option.value);
                setIsOpen(false);
                containerRef.current?.querySelector('button')?.focus();
              }}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-none px-3 py-2 font-mono text-xs font-medium transition-colors",
                isFocused
                  ? isSelected ? "bg-amber-500/20 text-amber-300" : "bg-zinc-800 text-white"
                  : isSelected ? "bg-amber-500/10 text-amber-400" : "text-zinc-300"
              )}
            >
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              {isSelected && <Check className="size-3.5 shrink-0 text-amber-400" />}
            </li>
          );
        })}
      </ul>
    </div>,
    portalTarget
  ) : null;

  return (
    <div className="relative inline-block w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-owns={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-activedescendant={isOpen && focusedIndex >= 0 ? `${listboxId}-option-${options[focusedIndex].value}` : undefined}
        onClick={() => {
          if (!isOpen) {
            openDropdown();
          } else {
            setIsOpen(false);
          }
        }}
        className={className || cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-none border border-zinc-800 bg-zinc-900/50 px-3 py-2 font-mono text-sm text-white shadow-sm transition-colors",
          "hover:bg-zinc-800/80 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500/50 focus-visible:outline-none"
        )}
      >
        {trigger ? trigger : (
          <>
            <span className="min-w-0 truncate text-left">{selectedOption?.label}</span>
            <ChevronDown className={cn("size-4 shrink-0 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
          </>
        )}
      </button>

      {portalContent}
    </div>
  );
}
