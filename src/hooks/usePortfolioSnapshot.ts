import { useEffect } from "react";
import { useSnapshotStore } from "@/stores";
import type { PortfolioSummary } from "@/types";

interface UsePortfolioSnapshotOptions {
  summary: PortfolioSummary;
  assetCount: number;
  isFiltered: boolean;
  isInitialLoading?: boolean;
}

/**
 * 대시보드 진입 시 전체 자산 기준 일일 포트폴리오 스냅샷 자동 저장/갱신 훅
 *
 * - 필터가 적용된 상태이거나 자산이 없는 경우, 또는 초기 로딩 중에는 스냅샷을 덮어쓰지 않습니다.
 * - 단일 책임 원칙(SRP)에 따라 페이지 컴포넌트로부터 부수효과를 분리합니다.
 */
export function usePortfolioSnapshot({
  summary,
  assetCount,
  isFiltered,
  isInitialLoading = false,
}: UsePortfolioSnapshotOptions): void {
  const upsertSnapshot = useSnapshotStore((s) => s.upsertSnapshot);

  useEffect(() => {
    if (isFiltered) return;
    if (assetCount === 0 || summary.totalValueKRW === 0 || isInitialLoading) return;

    const today = new Date().toISOString().slice(0, 10);
    upsertSnapshot({
      date: today,
      totalValueKRW: summary.totalValueKRW,
      totalCostKRW: summary.totalCostKRW,
    });
  }, [
    summary.totalValueKRW,
    summary.totalCostKRW,
    assetCount,
    upsertSnapshot,
    isFiltered,
    isInitialLoading,
  ]);
}
