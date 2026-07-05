import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/hooks";
import { GURU_PROFILES } from "@/utils";
import { GuruFirm } from "./GuruFirm";
import type { GuruProfile } from "@/types";

interface GuruSelectorProps {
  selectedGuru: GuruProfile | null;
  onSelect: (guru: GuruProfile) => void;
}

export function GuruSelector({ selectedGuru, onSelect }: GuruSelectorProps) {
  const t = useT();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const guruName = (guru: GuruProfile) =>
    (t[`guru_name_${guru.id}` as keyof typeof t] as string) ?? guru.name;

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="group relative -mx-4 px-4 md:mx-0 md:px-0">
      {/* Left Scroll Button */}
      {showLeftScroll && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-zinc-800 bg-black/80 p-1.5 text-zinc-400 shadow-md backdrop-blur-sm transition-colors hover:bg-zinc-800 hover:text-white md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      {/* Fade left gradient */}
      {showLeftScroll && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-0 w-8 bg-gradient-to-r from-black to-transparent sm:w-12" />
      )}

      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex snap-x snap-mandatory scroll-pl-12 scroll-pr-12 gap-3 overflow-x-auto pb-4 pt-1 sm:gap-4 lg:pb-6 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-800/80 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700"
      >
        {GURU_PROFILES.map((guru) => {
          const avatarUrl = guru.avatar || "/fallback-avatar.svg";
          return (
            <button
              key={guru.id}
              onClick={() => onSelect(guru)}
              aria-label={`${guruName(guru)}, ${guru.firm}`}
              className={`relative flex w-48 shrink-0 snap-start cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none sm:w-56 aspect-[1.586/1] ${
                selectedGuru?.id === guru.id
                  ? "border-zinc-500 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white shadow-lg shadow-white/5"
                  : "border-zinc-800 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/50"
              }`}
            >
              <div className="flex w-full items-start justify-between">
                <img 
                  src={avatarUrl} 
                  alt={guru.name} 
                  width={48}
                  height={48}
                  className={`size-10 shrink-0 rounded-full object-cover transition-colors sm:size-12 ${selectedGuru?.id === guru.id ? "border border-zinc-500 bg-zinc-800" : "border border-zinc-800 bg-zinc-900"}`} 
                />
              </div>
              <div className="mt-auto flex min-w-0 flex-col gap-0.5">
                <p className={`truncate text-sm font-bold tracking-tight ${selectedGuru?.id === guru.id ? "text-zinc-100" : "text-zinc-300"}`}>
                  {guruName(guru)}
                </p>
                <GuruFirm 
                  firm={guru.firm} 
                  className={`text-[9px] tracking-wider sm:text-[10px] ${selectedGuru?.id === guru.id ? "text-zinc-400" : "text-zinc-500"}`} 
                />
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Right fade gradient */}
      {showRightScroll && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-8 bg-gradient-to-l from-black to-transparent sm:w-16" />
      )}

      {/* Right Scroll Button */}
      {showRightScroll && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-zinc-800 bg-black/80 p-1.5 text-zinc-400 shadow-md backdrop-blur-sm transition-colors hover:bg-zinc-800 hover:text-white md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}
