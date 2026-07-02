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
} from "@/components/gurus";
import { usePortfolio, useT } from "@/hooks";
import { calculateRebalancing } from "@/utils";
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
      <div className="flex flex-col items-center justify-center min-h-[40vh] md:min-h-[60vh] text-zinc-400 px-4">
        <p className="text-5xl md:text-6xl mb-4">💡</p>
        <h2 className="text-lg md:text-xl font-semibold text-zinc-400 mb-2 text-center">
          {t.guru_empty_title}
        </h2>
        <p className="text-xs md:text-sm text-center">{t.guru_empty_desc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-balance">{t.guru_title}</h1>
      <GuruSelector
        selectedGuru={selectedGuru}
        onSelect={setSelectedGuru}
      />

      {selectedGuru && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mt-8">
            {/* 좌측 고정 패널 (철학 및 프로필) */}
            <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-20">
              <div className="bg-black/40 border border-zinc-800/60 p-6 rounded-xl shadow-sm">
                <div className="mb-6 flex flex-col gap-4">
                  <img 
                    src={selectedGuru.avatar || "/fallback-avatar.svg"} 
                    alt={selectedGuru.name} 
                    width={320}
                    height={320}
                    className="w-full aspect-square max-w-[320px] rounded-2xl object-cover shrink-0 border border-zinc-800 bg-zinc-900 mx-auto lg:mx-0 shadow-lg" 
                  />
                  <div className="pt-2 text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{guruName(selectedGuru)}</h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">{selectedGuru.firm}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t.guru_philosophy_label}</h3>
                  </div>
                  <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line text-pretty break-words">
                    {principles.join('\n')}
                  </div>
                </div>

                {quotes.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-zinc-800/60 flex flex-col gap-5">
                    {quotes.map((quote, idx) => (
                      <blockquote key={idx} className="relative">
                        <span aria-hidden="true" className="absolute -left-2 -top-2 text-3xl text-zinc-800 font-serif leading-none select-none">"</span>
                        <p className="relative z-10 text-sm font-medium text-zinc-300/90 italic leading-relaxed pl-3 border-l-2 border-indigo-500/30">
                          {quote}
                        </p>
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 우측 스크롤 패널 (지표, 차트, 스크리너) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
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
