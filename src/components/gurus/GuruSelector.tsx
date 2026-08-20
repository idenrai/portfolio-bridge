import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/hooks";
import { GURU_PROFILES, GURU_SINCE_YEARS } from "@/utils";
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
          className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-zinc-800 bg-black/80 p-1.5 text-zinc-400 shadow-md backdrop-blur-sm transition-colors hover:bg-zinc-800 hover:text-white md:flex"
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
        className="flex snap-x snap-mandatory scroll-px-12 gap-3 overflow-x-auto pt-1 pb-4 sm:gap-4 lg:pb-6 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-800/80 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {GURU_PROFILES.map((guru) => {
          const avatarUrl = guru.avatar || "/fallback-avatar.svg";
          return (
            <button
              key={guru.id}
              onClick={() => onSelect(guru)}
              aria-label={`${guruName(guru)}, ${guru.firm}`}
              className={`relative flex aspect-[1.586/1] w-48 shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-[border-color,box-shadow] duration-300 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none sm:w-56 ${
                selectedGuru?.id === guru.id
                  ? "border-zinc-600 text-white shadow-lg shadow-white/5"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              {/* Base Obsidian Black Background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black transition-opacity duration-300 ${selectedGuru?.id === guru.id ? "opacity-0" : "opacity-100"}`} />
              
              {/* Active Dark Metallic Background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black transition-opacity duration-300 ${selectedGuru?.id === guru.id ? "opacity-100" : "opacity-0"}`} />

              {/* Inner dashed border */}
              <div className={`pointer-events-none absolute inset-1.5 rounded-lg border border-dashed transition-colors duration-300 ${
                selectedGuru?.id === guru.id ? "border-zinc-400/40" : "border-zinc-800/30"
              }`} />

              {/* Top Center Branding */}
              <div className="relative z-10 w-full text-center">
                <span className={`font-mono text-[8px] font-medium tracking-[0.25em] uppercase transition-colors duration-300 ${
                  selectedGuru?.id === guru.id ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Portfolio Bridge
                </span>
              </div>

              {/* Center Large Avatar */}
              <div className="relative z-10 my-auto flex w-full justify-center">
                <div className={`rounded-full border p-0.5 transition-[border-color,background-color] duration-300 ${
                  selectedGuru?.id === guru.id 
                    ? "border-zinc-500/80 bg-zinc-800/50" 
                    : "border-zinc-800/80 bg-black/20"
                }`}>
                  <div className="size-10 overflow-hidden rounded-full border border-zinc-900 sm:size-12">
                    <img
                      src={avatarUrl}
                      alt={guru.name}
                      width={48}
                      height={48}
                      className={`size-full object-cover transition-[filter] duration-300 ${
                        selectedGuru?.id === guru.id 
                          ? "brightness-100 contrast-100 grayscale-0" 
                          : "brightness-90 contrast-125 grayscale"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Info: Left Name/Firm, Right Member Since */}
              <div className="relative z-10 flex w-full min-w-0 items-end justify-between">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-2.5">
                  <p className={`truncate font-mono text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${
                    selectedGuru?.id === guru.id ? "text-white" : "text-zinc-200"
                  }`}>
                    {guruName(guru)}
                  </p>
                  <GuruFirm
                    firm={guru.firm}
                    className={`text-[8px] tracking-wider transition-colors duration-300 sm:text-[9px] ${
                      selectedGuru?.id === guru.id ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  />
                </div>
                
                <div className={`flex shrink-0 flex-col items-end font-mono text-[8px] leading-tight transition-colors duration-300 ${
                  selectedGuru?.id === guru.id ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  <span className="text-[6px] tracking-wider uppercase opacity-60">Since</span>
                  <span className="font-bold">’{GURU_SINCE_YEARS[guru.id] || "26"}</span>
                </div>
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
          className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-zinc-800 bg-black/80 p-1.5 text-zinc-400 shadow-md backdrop-blur-sm transition-colors hover:bg-zinc-800 hover:text-white md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}
