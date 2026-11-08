import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Lightbulb,
  Info,
  Compass,
  LayoutGrid,
  Settings,
} from "lucide-react";

import {
  CustomGuruModal,
  GuruGuideModal,
  GuruFilterToolbar,
  GuruGridSection,
  GuruDetailView,
} from "@/components/gurus";
import { usePortfolio, useT, useGuruFilter } from "@/hooks";
import { useCustomGuruStore, useSettingsStore } from "@/stores";
import {
  calculateRebalancing,
  GURU_PROFILES,
  createCustomGuruProfile,
} from "@/utils";
import type { GuruProfile } from "@/types";

export function GurusPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { assets, summary } = usePortfolio({ scope: "guru" });
  const { assets: allAssets } = usePortfolio({ scope: "all" });
  const t = useT();

  const customGuruConfig = useCustomGuruStore((s) => s.config);
  const targetAllocations = useSettingsStore((s) => s.targetAllocations);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // ── 필터링 및 검색 훅 ────────────────────────────────────────────────────
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredGurus,
    showCustomGuruCard,
    guruName,
    totalCount,
  } = useGuruFilter(t, customGuruConfig);

  const customProfile = useMemo(
    () => createCustomGuruProfile(customGuruConfig, targetAllocations),
    [customGuruConfig, targetAllocations],
  );

  const guruParam = searchParams.get("guru");

  // URL 파라미터가 유일한 진실 공급원(SSoT)으로 동작하여 쿼리 우선순위 충돌 방지
  const selectedGuru = useMemo<GuruProfile | null>(() => {
    if (!guruParam) return null;
    if (guruParam === "custom") {
      return customProfile;
    }
    return GURU_PROFILES.find((g) => g.id === guruParam) ?? null;
  }, [guruParam, customProfile]);

  const handleSelectGuru = (guru: GuruProfile) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("guru", guru.id);
      return next;
    });
  };

  const handleReturnToGrid = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("guru");
      return next;
    });
  };

  const isCustom = selectedGuru?.id === "custom";

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

  if (allAssets.length === 0) {
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
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-white md:text-3xl">
          {t.guru_title}
        </h1>
        <div className="flex items-center gap-2">
          {selectedGuru && (
            <button
              type="button"
              onClick={handleReturnToGrid}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-none border border-zinc-800 bg-black px-3 py-1.5 font-mono text-xs font-bold text-zinc-300 transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none"
            >
              <LayoutGrid className="size-3.5 text-inherit" />
              <span className="opacity-50">{"["}</span>
              <span>{t.guru_btn_all_grid}</span>
              <span className="opacity-50">{"]"}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsGuideModalOpen(true)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-none border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-bold text-amber-400 transition-colors hover:border-amber-400 hover:bg-amber-400 hover:text-black focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <Compass className="size-3.5" />
            <span className="opacity-50">{"["}</span>
            <span>{t.guru_guide_btn}</span>
            <span className="opacity-50">{"]"}</span>
          </button>
          {isCustom && (
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-none border border-zinc-800 bg-black px-3 py-1.5 font-mono text-xs font-bold text-zinc-300 transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none"
            >
              <Settings className="size-3.5" />
              <span className="opacity-50">{"["}</span>
              <span>{t.custom_guru_settings_btn}</span>
              <span className="opacity-50">{"]"}</span>
            </button>
          )}
        </div>
      </div>

      {allAssets.length > 0 && assets.length === 0 && (
        <div className="flex items-center gap-2.5 rounded-none border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-xs text-amber-300">
          <Info aria-hidden="true" className="size-4 shrink-0 text-amber-400" />
          <span>{t.guru_all_scoped_out_notice}</span>
        </div>
      )}

      {/* Grid View or Detail View */}
      {!selectedGuru ? (
        <div className="space-y-5">
          <GuruFilterToolbar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={totalCount}
            t={t}
          />

          <GuruGridSection
            showCustomGuruCard={showCustomGuruCard}
            customGuruConfig={customGuruConfig}
            customProfile={customProfile}
            filteredGurus={filteredGurus}
            guruName={guruName}
            onSelectGuru={handleSelectGuru}
            onResetFilters={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            t={t}
          />
        </div>
      ) : (
        <GuruDetailView
          selectedGuru={selectedGuru}
          customGuruConfig={customGuruConfig}
          summary={summary}
          assets={assets}
          allAssets={allAssets}
          guruRebalancing={guruRebalancing}
          radarData={radarData}
          onSelectGuru={handleSelectGuru}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          guruName={guruName}
          t={t}
        />
      )}

      {/* Dialog Modals */}
      <CustomGuruModal
        open={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

      <GuruGuideModal
        open={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onSelectGuru={(guruId) => {
          setSearchParams({ guru: guruId });
        }}
        onOpenCustomGuruConfig={() => {
          setIsGuideModalOpen(false);
          setIsCustomModalOpen(true);
        }}
      />
    </div>
  );
}
