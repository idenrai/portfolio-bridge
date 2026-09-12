import { useState, useMemo } from "react";
import type {
  PortfolioAsset,
  Market,
  AssetType,
  AssetCategory,
  AssetVisibility,
} from "@/types";

export type AssetSortKey = "name" | "value" | "pnl" | "return";
export type AssetSortDir = "asc" | "desc";

export interface UseAssetFilterSortOptions {
  assets: PortfolioAsset[];
  categoryLabels?: Record<string, string>;
}

/**
 * 자산 목록 필터링 및 정렬 상태 관리 커스텀 훅
 * - 5대 필터(시장, 유형, 카테고리, 브로커, 노출범위)에 기반한 `filteredAssets` 필터링 파이프라인 및 가용 옵션을 산출합니다.
 * - 정렬 상태(`sortKey`, `sortDir`)와 토글 핸들러를 관리합니다.
 *   (참고: 불필요한 이중 정렬 오버헤드를 방지하기 위해, 최종 테이블 정렬 렌더링은 `AssetTable` 뷰 컴포넌트에 위임합니다.)
 */
export function useAssetFilterSort({
  assets,
  categoryLabels = {},
}: UseAssetFilterSortOptions) {
  const [filterMarkets, setFilterMarkets] = useState<Market[]>([]);
  const [filterTypes, setFilterTypes] = useState<AssetType[]>([]);
  const [filterCategories, setFilterCategories] = useState<AssetCategory[]>([]);
  const [filterBrokerIds, setFilterBrokerIds] = useState<string[]>([]);
  const [filterVisibilities, setFilterVisibilities] = useState<AssetVisibility[]>([]);

  const [sortKey, setSortKey] = useState<AssetSortKey>("value");
  const [sortDir, setSortDir] = useState<AssetSortDir>("desc");

  const handleSort = (key: AssetSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleClearFilters = () => {
    setFilterMarkets([]);
    setFilterTypes([]);
    setFilterCategories([]);
    setFilterBrokerIds([]);
    setFilterVisibilities([]);
  };

  const filteredAssets = useMemo(() => {
    return assets
      .filter(
        (a) => filterMarkets.length === 0 || filterMarkets.includes(a.market),
      )
      .filter((a) => filterTypes.length === 0 || filterTypes.includes(a.type))
      .filter(
        (a) =>
          filterCategories.length === 0 ||
          a.categories.some((c) => filterCategories.includes(c)),
      )
      .filter(
        (a) =>
          filterBrokerIds.length === 0 ||
          (a.brokerId && filterBrokerIds.includes(a.brokerId)),
      )
      .filter(
        (a) =>
          filterVisibilities.length === 0 ||
          filterVisibilities.includes(a.visibility ?? "all"),
      );
  }, [
    assets,
    filterMarkets,
    filterTypes,
    filterCategories,
    filterBrokerIds,
    filterVisibilities,
  ]);

  const availableMarkets = useMemo(
    () => Array.from(new Set(assets.map((a) => a.market))),
    [assets],
  );

  const availableTypes = useMemo(
    () => Array.from(new Set(assets.map((a) => a.type))),
    [assets],
  );

  const availableCategories = useMemo(
    () =>
      Array.from(new Set(assets.flatMap((a) => a.categories))).map(
        (cat) => [cat, categoryLabels[cat] ?? cat] as [AssetCategory, string],
      ),
    [assets, categoryLabels],
  );

  return {
    // 상태
    filterMarkets,
    filterTypes,
    filterCategories,
    filterBrokerIds,
    filterVisibilities,
    sortKey,
    sortDir,

    // 세터
    setFilterMarkets,
    setFilterTypes,
    setFilterCategories,
    setFilterBrokerIds,
    setFilterVisibilities,

    // 액션
    handleSort,
    handleClearFilters,

    // 파생 데이터
    filteredAssets,
    availableMarkets,
    availableTypes,
    availableCategories,
  };
}
