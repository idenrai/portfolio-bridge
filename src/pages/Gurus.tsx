import { Lightbulb } from "lucide-react";
import { useState, useMemo } from "react";

import {
  LynchTenBaggerCard,
  MagicFormulaCard,
  GrahamDefensiveCard,
  SmithQualityCard,
  PiotroskiFScoreCard,
  OneilCanSlimCard,
  BuffettIndicatorCard,
  GuruSelector,
  GuruRebalanceTable,
  GuruCharts,
  GuruAIPromptBanner,
  GuruFirm,
} from "@/components/gurus";
import { usePortfolio, useT } from "@/hooks";
import { calculateRebalancing, GURU_PROFILES, GURU_SINCE_YEARS } from "@/utils";
import type { GuruProfile } from "@/types";
import { en } from "@/i18n";

export function GurusPage() {
  const { assets, summary } = usePortfolio();
  const [selectedGuru, setSelectedGuru] = useState<GuruProfile | null>(null);
  const t = useT();

  /** i18n 구루 이름 */
  const guruName = (guru: GuruProfile) =>
    (t[`guru_name_${guru.id}` as keyof typeof t] as string) ?? guru.name;



  const guruRebalancing = useMemo(() => {
    return selectedGuru
      ? calculateRebalancing(summary, selectedGuru.idealAllocation)
      : [];
  }, [selectedGuru, summary]);

  // 레이더 차트용 데이터: 내 포트폴리오 vs 선택 구루 (합집합)
  const radarData = useMemo(() => {
    if (!selectedGuru) return [];
    
    const allCategories = new Set([
      ...selectedGuru.idealAllocation.map((a) => a.category),
      ...summary.categoryAllocation.map((a) => a.category),
    ]);
    return [...allCategories].map((cat) => {
      const guruAlloc = selectedGuru.idealAllocation.find(
        (a) => a.category === cat,
      );
      const myAlloc = summary.categoryAllocation.find(
        (a) => a.category === cat,
      );
      return {
        category: t.category_labels[cat] ?? cat,
        guru: guruAlloc ? guruAlloc.targetPercent : 0,
        mine: myAlloc ? Number(myAlloc.percent.toFixed(1)) : 0,
      };
    });
  }, [selectedGuru, summary.categoryAllocation, t.category_labels]);

  const selectedPhilosophyKey = selectedGuru
    ? (`guru_philosophy_${selectedGuru.id}` as keyof typeof en)
    : null;

  const selectedQuotesKey = selectedGuru
    ? (`guru_quotes_${selectedGuru.id}` as keyof typeof en)
    : null;

  const localizedPhilosophy = selectedPhilosophyKey
    ? ((t[selectedPhilosophyKey as keyof typeof t] as string | undefined) ??
      (en[selectedPhilosophyKey] as string | undefined) ??
      "")
    : "";

  const localizedQuotes = selectedQuotesKey
    ? ((t[selectedQuotesKey as keyof typeof t] as string | undefined) ??
      (en[selectedQuotesKey] as string | undefined) ??
      "")
    : "";

  const principles = localizedPhilosophy.split('\n').map(l => l.trim()).filter(Boolean);
  const quotes = localizedQuotes.split('\n').map(l => l.trim()).filter(Boolean);

  if (assets.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-zinc-400 md:min-h-[60vh]">
        <Lightbulb className="mb-4 size-12 text-yellow-500/80 drop-shadow-lg" />
        <h2 className="mb-2 text-center text-lg font-semibold text-zinc-400 md:text-xl">
          {t.guru_empty_title}
        </h2>
        <p className="text-center text-xs md:text-sm">{t.guru_empty_desc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-balance text-white md:text-3xl">{t.guru_title}</h1>

      {!selectedGuru ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {GURU_PROFILES.map((guru) => (
            <button
              key={guru.id}
              onClick={() => setSelectedGuru(guru)}
              aria-label={`${guruName(guru)}, ${guru.firm}`}
              className="group relative block aspect-[1.586/1] w-full cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-left transition-[transform,box-shadow,border-color] duration-500 hover:scale-[1.02] hover:border-zinc-700 hover:shadow-2xl hover:shadow-white/5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none sm:rounded-2xl"
            >
              {/* Base Obsidian Black Background */}
              <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-950 to-black transition-opacity duration-500" />
              
              {/* Hover Dark Metallic Background */}
              <div className="absolute inset-0 bg-linear-to-br from-zinc-800/80 via-zinc-900/80 to-black opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Inner dashed border */}
              <div className="pointer-events-none absolute inset-2 rounded-lg border border-dashed border-zinc-800/30 transition-colors duration-500 group-hover:border-zinc-400/40 sm:inset-2.5 sm:rounded-xl" />

              {/* Top Center Branding */}
              <div className="absolute top-3 left-0 z-10 w-full text-center sm:top-5">
                <span className="font-mono text-[8px] leading-none font-medium tracking-[0.25em] text-zinc-500 uppercase transition-colors duration-500 group-hover:text-zinc-400 sm:text-[9px]">
                  Portfolio Bridge
                </span>
              </div>

              {/* Center Large Avatar */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="aspect-square w-[28%] rounded-full border border-zinc-800/80 bg-black/20 p-0.5 shadow-inner transition-[border-color,background-color] duration-500 group-hover:border-zinc-600/60 group-hover:bg-zinc-800/50">
                  <div className="size-full overflow-hidden rounded-full border border-zinc-900">
                    <img
                      src={guru.avatar || "/fallback-avatar.svg"}
                      alt={guru.name}
                      width={112}
                      height={112}
                      className="size-full object-cover brightness-90 contrast-125 grayscale transition-[filter] duration-500 group-hover:brightness-100 group-hover:contrast-100 group-hover:grayscale-0"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Info: Left Name/Firm, Right Member Since */}
              <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between sm:inset-x-5 sm:bottom-5">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-2">
                  <h3 className="truncate font-mono text-xs leading-none font-bold tracking-wider text-zinc-200 uppercase transition-colors duration-500 group-hover:text-white sm:text-sm md:text-base">
                    {guruName(guru)}
                  </h3>
                  <GuruFirm
                    firm={guru.firm}
                    className="text-[9px] leading-tight tracking-wider text-zinc-500 transition-colors duration-500 group-hover:text-zinc-400 sm:text-[10px]"
                  />
                </div>
                
                <div className="flex shrink-0 flex-col items-end font-mono leading-tight text-zinc-500 transition-colors duration-500 group-hover:text-zinc-400">
                  <span className="text-[6px] tracking-wider uppercase opacity-60 sm:text-[7px]">Since</span>
                  <span className="text-[8px] font-bold sm:text-[10px]">’{GURU_SINCE_YEARS[guru.id] || "26"}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <GuruSelector
            selectedGuru={selectedGuru}
            onSelect={setSelectedGuru}
          />

          <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            {/* 좌측 고정 패널 (철학 및 프로필) */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:col-span-4">
              <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4">
                  <img 
                    src={selectedGuru.avatar || "/fallback-avatar.svg"} 
                    alt={selectedGuru.name} 
                    width={320}
                    height={320}
                    fetchPriority="high"
                    className="mx-auto aspect-square w-full max-w-80 shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900 object-cover shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-shadow hover:shadow-[0_0_50px_rgba(255,255,255,0.08)]" 
                  />
                  <div className="pt-2 text-center lg:text-left">
                    <h2 className="mb-1 text-2xl font-bold tracking-tight text-white">{guruName(selectedGuru)}</h2>
                    <p className="text-xs tracking-widest text-zinc-500 uppercase">{selectedGuru.firm}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 lg:justify-start">
                    <div className="h-4 w-1 rounded-full bg-indigo-500" />
                    <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">{t.guru_philosophy_label}</h3>
                  </div>
                  <div className="text-sm leading-relaxed text-pretty wrap-break-word whitespace-pre-line text-zinc-300">
                    {principles.join('\n')}
                  </div>
                </div>

                {quotes.length > 0 && (
                  <div className="mt-8 flex flex-col gap-5 border-t border-zinc-800/60 pt-6">
                    {quotes.map((quote, idx) => (
                      <blockquote key={idx} className="relative">
                        <p className="relative z-10 border-l-2 border-indigo-500/30 pl-3 text-sm leading-relaxed font-medium text-zinc-300/90 italic">
                          {quote}
                        </p>
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 우측 스크롤 패널 (지표, 차트, 스크리너) */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              {/* 구루에게 묻기 (메인 기능 상단 배치) */}
              <GuruAIPromptBanner
                selectedGuru={selectedGuru}
                summary={summary}
                assets={assets}
              />

              <GuruCharts
                selectedGuru={selectedGuru}
                radarData={radarData}
              />

              <GuruRebalanceTable
                guruRebalancing={guruRebalancing}
              />

              {/* 피터 린치 전용: 10루타 후보 스크리너 */}
              {selectedGuru.id === "lynch" && <LynchTenBaggerCard />}

              {/* 워렌 버핏 전용: 버핏 지수 */}
              {selectedGuru.id === "buffett" && <BuffettIndicatorCard />}

              {/* 그린블라트 전용: 마법 공식 스크리너 */}
              {selectedGuru.id === "greenblatt" && <MagicFormulaCard />}

              {/* 그레이엄 전용: 방어적 투자 채점기 */}
              {selectedGuru.id === "graham" && <GrahamDefensiveCard />}

              {/* 테리 스미스 전용: 퀄리티 컴파운더 채점기 */}
              {selectedGuru.id === "smith" && <SmithQualityCard />}

              {/* 피오트로스키 전용: F-Score 채점기 */}
              {selectedGuru.id === "piotroski" && <PiotroskiFScoreCard />}

              {/* 윌리엄 오닐 전용: CAN SLIM 채점기 */}
              {selectedGuru.id === "oneil" && <OneilCanSlimCard />}
            </div>
          </div>

        </>
      )}
    </div>
  );
}
