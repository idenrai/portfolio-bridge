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
  const [searchParams] = useSearchParams();
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
  const [selectedGuruId, setSelectedGuruId] = useState<string | null>(() => {
    return guruParam || null;
  });

  // 파라미터나 상태에 따라 현재 선택된 구루 파생 (useEffect 없이 자동 동기화)
  const selectedGuru = useMemo<GuruProfile | null>(() => {
    const effectiveId = guruParam || selectedGuruId;
    if (effectiveId === "custom") {
      return customProfile;
    }
    if (effectiveId) {
      return GURU_PROFILES.find((g) => g.id === effectiveId) ?? null;
    }
    return null;
  }, [guruParam, selectedGuruId, customProfile]);

  const handleSelectGuru = (guru: GuruProfile) => {
    setSelectedGuruId(guru.id);
  };

  const handleReturnToGrid = () => {
    setSelectedGuruId(null);
    if (guruParam) {
      window.history.replaceState(null, "", "/gurus");
    }
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
              className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-95"
            >
              <LayoutGrid className="size-3.5 text-zinc-400" />
              <span>{t.guru_btn_all_grid}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsGuideModalOpen(true)}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 shadow-sm transition-all hover:bg-indigo-500/20 hover:text-white active:scale-95"
          >
            <Compass className="size-3.5" />
            <span>{t.guru_guide_btn}</span>
          </button>
          {isCustom && (
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 shadow-sm transition-all hover:bg-indigo-500/20 hover:text-white active:scale-95"
            >
              <Settings className="size-3.5" />
              <span>{t.custom_guru_settings_btn}</span>
            </button>
          )}
        </div>
      </div>

      {allAssets.length > 0 && assets.length === 0 && (
        <div className="flex items-center gap-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-indigo-300">
          <Info aria-hidden="true" className="size-4 shrink-0" />
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
          if (guruId === "custom") {
            setSelectedGuruId("custom");
          } else {
            const matched = GURU_PROFILES.find((g) => g.id === guruId);
            if (matched) {
              setSelectedGuruId(matched.id);
            }
          }
        }}
        onOpenCustomGuruConfig={() => {
          setIsGuideModalOpen(false);
          setIsCustomModalOpen(true);
        }}
      />
    </div>
  );
}
