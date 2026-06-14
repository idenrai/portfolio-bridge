import { useState } from "react";
import { Card } from "@/components/common";
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

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] md:min-h-[60vh] text-slate-400 px-4">
        <p className="text-5xl md:text-6xl mb-4">💡</p>
        <h2 className="text-lg md:text-xl font-semibold text-slate-600 mb-2 text-center">
          {t.guru_empty_title}
        </h2>
        <p className="text-xs md:text-sm text-center">{t.guru_empty_desc}</p>
      </div>
    );
  }

  const guruRebalancing = selectedGuru
    ? calculateRebalancing(summary, selectedGuru.idealAllocation)
    : [];

  // 레이더 차트용 데이터: 내 포트폴리오 vs 선택 구루 (합집합)
  const radarData = selectedGuru
    ? (() => {
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
      })()
    : [];

  const selectedPhilosophyKey = selectedGuru
    ? (`guru_philosophy_${selectedGuru.id}` as keyof typeof en)
    : null;

  const localizedPhilosophy = selectedPhilosophyKey
    ? ((t[selectedPhilosophyKey as keyof typeof t] as string | undefined) ??
      (en[selectedPhilosophyKey] as string | undefined) ??
      "")
    : "";

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{t.guru_title}</h1>
      <GuruSelector
        selectedGuru={selectedGuru}
        onSelect={setSelectedGuru}
      />

      {selectedGuru && (
        <>
          {/* 철학 */}
          <Card title={t.guru_philosophy_title(guruName(selectedGuru))}>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {localizedPhilosophy}
            </p>
          </Card>

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
            selectedGuru={selectedGuru}
            guruRebalancing={guruRebalancing}
          />

          {/* 피터 린치 전용: 10루타 후보 스크리너 */}
          {selectedGuru.id === "lynch" && (
            <LynchTenBaggerCard />
          )}

          {/* 워렌 버핏 전용: 버핏 지수 */}
          {selectedGuru.id === "buffett" && (
            <BuffettIndicatorCard />
          )}

          {/* 그린블라트 전용: 마법 공식 스크리너 */}
          {selectedGuru.id === "greenblatt" && (
            <MagicFormulaCard />
          )}
          {/* 그레이엄 전용: 방어적 투자 채점기 */}
          {selectedGuru.id === "graham" && (
            <GrahamDefensiveCard />
          )}

          {/* 테리 스미스 전용: 퀄리티 컴파운더 채점기 */}
          {selectedGuru.id === "smith" && (
            <SmithQualityCard />
          )}

          {/* 피오트로스키 전용: F-Score 채점기 */}
          {selectedGuru.id === "piotroski" && (
            <PiotroskiFScoreCard />
          )}

          {/* 윌리엄 오닐 전용: CAN SLIM 채점기 */}
          {selectedGuru.id === "oneil" && (
            <OneilCanSlimCard />
          )}        </>
      )}
    </div>
  );
}
