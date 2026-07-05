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
import { calculateRebalancing, GURU_PROFILES } from "@/utils";
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
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GURU_PROFILES.map((guru) => (
            <button
              key={guru.id}
              onClick={() => setSelectedGuru(guru)}
              aria-label={`${guruName(guru)}, ${guru.firm}`}
              className="group relative flex aspect-[1.586/1] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-5 text-left transition-all duration-300 hover:border-zinc-600 hover:shadow-xl hover:shadow-white/5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none"
            >
              <div className="flex w-full items-start justify-between">
                <img 
                  src={guru.avatar || "/fallback-avatar.svg"} 
                  alt={guru.name}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-full border border-zinc-700/50 bg-zinc-900/80 object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
                <div className="mt-1 text-[10px] font-medium tracking-[0.2em] text-zinc-600 uppercase">
                  Bridge
                </div>
              </div>
              <div className="mt-auto flex min-w-0 flex-col gap-1">
                <h3 className="truncate text-lg font-bold tracking-tight text-zinc-100">{guruName(guru)}</h3>
                <GuruFirm firm={guru.firm} className="text-[10px] sm:text-xs" />
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
                    className="mx-auto aspect-square w-full max-w-[320px] shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900 object-cover shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-shadow hover:shadow-[0_0_50px_rgba(255,255,255,0.08)]" 
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
                  <div className="text-sm leading-relaxed text-pretty break-words whitespace-pre-line text-zinc-300">
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
