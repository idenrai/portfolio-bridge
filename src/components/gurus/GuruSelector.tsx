import { useRef, useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Terminal,
  Bot,
  Shield,
  Rocket,
  Scale,
  Settings,
} from "lucide-react";
import { useT } from "@/hooks";
import {
  useCustomGuruStore,
  useSettingsStore,
  CUSTOM_GURU_STRATEGY_KEYS,
} from "@/stores";
import {
  GURU_PROFILES,
  GURU_SINCE_YEARS,
  GURU_METADATA,
  createCustomGuruProfile,
  cn,
} from "@/utils";
import { GuruFirm } from "./GuruFirm";
import type { GuruProfile } from "@/types";

interface GuruSelectorProps {
  selectedGuru: GuruProfile | null;
  onSelect: (guru: GuruProfile) => void;
  onOpenCustomModal?: () => void;
  onOpenGuideModal?: () => void;
}

function CustomGuruAvatarIcon({
  iconId,
  className,
}: {
  iconId: string;
  className?: string;
}) {
  switch (iconId) {
    case "bot":
      return <Bot className={className} />;
    case "shield":
      return <Shield className={className} />;
    case "rocket":
      return <Rocket className={className} />;
    case "scale":
      return <Scale className={className} />;
    default:
      return <Terminal className={className} />;
  }
}

export function GuruSelector({
  selectedGuru,
  onSelect,
  onOpenCustomModal,
}: GuruSelectorProps) {
  const t = useT();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const customGuruConfig = useCustomGuruStore((s) => s.config);
  const targetAllocations = useSettingsStore((s) => s.targetAllocations);
  const customProfile = useMemo(
    () => createCustomGuruProfile(customGuruConfig, targetAllocations),
    [customGuruConfig, targetAllocations],
  );
  const isCustomSelected = selectedGuru?.id === "custom";
  const strategyKey = CUSTOM_GURU_STRATEGY_KEYS[customGuruConfig.strategy];
  const strategyLabel = (t[strategyKey] as string) ?? customGuruConfig.strategy;

  const guruName = (guru: GuruProfile) =>
    guru.id === "custom"
      ? customGuruConfig.name || t.custom_guru_default_name
      : ((t[`guru_name_${guru.id}` as keyof typeof t] as string) ?? guru.name);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
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
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
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
        <div className="pointer-events-none absolute inset-y-0 left-0 z-0 w-8 bg-linear-to-r from-black to-transparent sm:w-12" />
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex snap-x snap-mandatory scroll-px-12 gap-3 overflow-x-auto pt-1 pb-4 sm:gap-4 lg:pb-6 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-800/80 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {/* ── Slot 0: Custom Guru Card ── */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect(customProfile)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(customProfile);
            }
          }}
          aria-label={`${customGuruConfig.name || t.custom_guru_default_name}, Custom AI Guru`}
          className={cn(
            "relative flex aspect-card w-48 shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-none border p-4 text-left transition-colors focus-visible:border-transparent focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:outline-none sm:w-56",
            isCustomSelected
              ? "border-amber-400 bg-zinc-900 text-white"
              : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-amber-400/40",
          )}
        >
          {/* Inner dashed border */}
          <div
            className={cn(
              "pointer-events-none absolute inset-1.5 rounded-none border border-dashed transition-colors",
              isCustomSelected ? "border-amber-400/40" : "border-zinc-800/40",
            )}
          />

          {/* Top Branding & Settings button */}
          <div className="relative z-10 flex w-full items-center justify-between font-mono">
            <span className="inline-flex items-center gap-1 text-3xs font-bold tracking-widest text-amber-400 uppercase">
              <Terminal className="size-2.5" />
              <span>{t.custom_guru_selector_badge}</span>
            </span>
            {onOpenCustomModal && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCustomModal();
                }}
                className="cursor-pointer rounded-none p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                aria-label={t.custom_guru_settings_btn}
              >
                <Settings className="size-3.5" />
              </button>
            )}
          </div>

          {/* Center Large Icon */}
          <div className="relative z-10 my-auto flex w-full justify-center">
            <div
              className={cn(
                "rounded-none border p-1 transition-colors",
                isCustomSelected
                  ? "border-amber-400 bg-amber-500/10 text-amber-300"
                  : "border-zinc-800 bg-black text-zinc-400",
              )}
            >
              <div className="flex size-10 items-center justify-center rounded-none border border-zinc-900 sm:size-12">
                <CustomGuruAvatarIcon
                  iconId={customGuruConfig.avatarIcon}
                  className="size-5 sm:size-6"
                />
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="relative z-10 flex w-full min-w-0 items-end justify-between font-mono">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-2.5">
              <p
                className={cn(
                  "truncate text-xs font-bold tracking-wider uppercase transition-colors",
                  isCustomSelected ? "text-white" : "text-zinc-200",
                )}
              >
                {customGuruConfig.name || t.custom_guru_default_name}
              </p>
              <p className="truncate text-3xs tracking-wider text-zinc-400">
                {strategyLabel}
              </p>
            </div>

            <div
              className={cn(
                "flex shrink-0 flex-col items-end text-3xs leading-tight transition-colors",
                isCustomSelected ? "text-amber-400" : "text-zinc-500",
              )}
            >
              <span className="text-4xs tracking-wider uppercase opacity-70">
                AI
              </span>
              <span className="font-bold">GURU</span>
            </div>
          </div>
        </div>

        {/* ── 20 Historical Gurus ── */}
        {GURU_PROFILES.map((guru) => {
          const avatarUrl = guru.avatar || "/fallback-avatar.svg";
          const isSelected = selectedGuru?.id === guru.id;
          return (
            <button
              key={guru.id}
              onClick={() => onSelect(guru)}
              aria-label={`${guruName(guru)}, ${guru.firm}`}
              className={cn(
                "relative flex aspect-card w-48 shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-none border p-4 text-left transition-colors focus-visible:border-transparent focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:outline-none sm:w-56",
                isSelected
                  ? "border-zinc-400 bg-zinc-900 text-white"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600",
              )}
            >
              {/* Inner dashed border */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-1.5 rounded-none border border-dashed transition-colors",
                  isSelected ? "border-zinc-400/40" : "border-zinc-800/40",
                )}
              />

              {/* Top Center Branding & Category Tag */}
              <div className="relative z-10 flex w-full items-center justify-between">
                <span
                  className={cn(
                    "font-mono text-4xs font-medium tracking-widest uppercase transition-colors duration-300",
                    isSelected ? "text-zinc-400" : "text-zinc-500",
                  )}
                >
                  Portfolio Bridge
                </span>
                <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-4xs text-zinc-400">
                  {t[GURU_METADATA[guru.id]?.tagKey as keyof typeof t] as string}
                </span>
              </div>

              {/* Center Large Avatar */}
              <div className="relative z-10 my-auto flex w-full justify-center">
                <div
                  className={cn(
                    "rounded-full border p-0.5 transition-[border-color,background-color] duration-300",
                    isSelected
                      ? "border-zinc-500/80 bg-zinc-800/50"
                      : "border-zinc-800/80 bg-black/20",
                  )}
                >
                  <div className="size-10 overflow-hidden rounded-full border border-zinc-900 sm:size-12">
                    <img
                      src={avatarUrl}
                      alt={guru.name}
                      width={48}
                      height={48}
                      className={cn(
                        "size-full object-cover transition-[filter] duration-300",
                        isSelected
                          ? "brightness-100 contrast-100 grayscale-0"
                          : "brightness-90 contrast-125 grayscale",
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Info: Left Name/Firm, Right Member Since */}
              <div className="relative z-10 flex w-full min-w-0 items-end justify-between">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-2.5">
                  <p
                    className={cn(
                      "truncate font-mono text-xs font-bold tracking-wider uppercase transition-colors duration-300",
                      isSelected ? "text-white" : "text-zinc-200",
                    )}
                  >
                    {guruName(guru)}
                  </p>
                  <GuruFirm
                    firm={guru.firm}
                    className={cn(
                      "text-3xs tracking-wider transition-colors duration-300",
                      isSelected ? "text-zinc-400" : "text-zinc-500",
                    )}
                  />
                </div>

                <div
                  className={cn(
                    "flex shrink-0 flex-col items-end font-mono text-3xs leading-tight transition-colors duration-300",
                    isSelected ? "text-zinc-400" : "text-zinc-500",
                  )}
                >
                  <span className="text-4xs tracking-wider uppercase opacity-60">
                    Since
                  </span>
                  <span className="font-bold">
                    ’{GURU_SINCE_YEARS[guru.id] || "26"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right fade gradient */}
      {showRightScroll && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-8 bg-linear-to-l from-black to-transparent sm:w-16" />
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
