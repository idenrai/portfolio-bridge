import { useState, useMemo, useCallback } from "react";
import { GURU_PROFILES, GURU_METADATA, type GuruCategoryTag } from "@/utils";
import type { GuruProfile } from "@/types";
import { type CustomGuruConfig, CUSTOM_GURU_STRATEGY_KEYS } from "@/stores";
import type { Translations } from "@/i18n";

export function useGuruFilter(
  t: Translations,
  customGuruConfig: CustomGuruConfig,
) {
  const [selectedCategory, setSelectedCategory] = useState<GuruCategoryTag | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  /** i18n 구루 이름 조회 */
  const guruName = useCallback(
    (guru: GuruProfile) =>
      guru.id === "custom"
        ? customGuruConfig.name || t.custom_guru_default_name
        : ((t[`guru_name_${guru.id}` as keyof typeof t] as string) ?? guru.name),
    [customGuruConfig.name, t],
  );

  // 카테고리 및 검색어 기반 구루 필터링
  const filteredGurus = useMemo(() => {
    return GURU_PROFILES.filter((guru) => {
      const meta = GURU_METADATA[guru.id];
      if (selectedCategory !== "all") {
        if (meta.category !== selectedCategory && meta.secondaryCategory !== selectedCategory) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const localizedName = guruName(guru).toLowerCase();
        const rawName = guru.name.toLowerCase();
        const firm = guru.firm.toLowerCase();
        const tagLabel = (t[meta.tagKey as keyof typeof t] as string | undefined)?.toLowerCase() ?? "";
        const secTagLabel = meta.secondaryCategory
          ? ((t[`guru_tag_${meta.secondaryCategory}` as keyof typeof t] as string | undefined)?.toLowerCase() ?? "")
          : "";
        const style = guru.style.toLowerCase();

        const matches =
          localizedName.includes(q) ||
          rawName.includes(q) ||
          firm.includes(q) ||
          tagLabel.includes(q) ||
          secTagLabel.includes(q) ||
          style.includes(q) ||
          meta.category.toLowerCase().includes(q) ||
          (meta.secondaryCategory?.toLowerCase().includes(q) ?? false);

        if (!matches) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery, guruName, t]);

  const showCustomGuruCard = useMemo(() => {
    if (selectedCategory !== "all" && selectedCategory !== "value") {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const customName = (customGuruConfig.name || t.custom_guru_default_name).toLowerCase();
      const strategyKey = CUSTOM_GURU_STRATEGY_KEYS[customGuruConfig.strategy];
      const strategyLabel = (t[strategyKey] as string | undefined)?.toLowerCase() ?? "";

      const matches =
        customName.includes(q) ||
        strategyLabel.includes(q) ||
        customGuruConfig.strategy.toLowerCase().includes(q) ||
        q.includes("ai") ||
        q.includes("커스텀") ||
        q.includes("custom");

      if (!matches) {
        return false;
      }
    }
    return true;
  }, [selectedCategory, searchQuery, customGuruConfig.name, customGuruConfig.strategy, t]);

  const totalCount = filteredGurus.length + (showCustomGuruCard ? 1 : 0);

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredGurus,
    showCustomGuruCard,
    guruName,
    totalCount,
  };
}
