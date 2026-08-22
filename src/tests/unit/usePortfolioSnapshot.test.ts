// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePortfolioSnapshot } from '@/hooks/usePortfolioSnapshot';
import { useSnapshotStore } from '@/stores';
import type { PortfolioSummary } from '@/types';

describe('usePortfolioSnapshot', () => {
  beforeEach(() => {
    useSnapshotStore.setState({ snapshots: [] });
  });

  const mockSummary: PortfolioSummary = {
    totalValueKRW: 50000000,
    totalCostKRW: 45000000,
    totalPnLKRW: 5000000,
    totalReturnPercent: 11.1,
    holdingCount: 5,
    assetTypeCount: 2,
    cashPercent: 5.0,
    categoryAllocation: [],
    marketAllocation: [],
    currencyAllocation: [],
    holdings: [],
    currencyExposure: [],
    currencyScenarios: [],
    insights: [],
  };

  it('saves snapshot when not filtered and assets exist', () => {
    renderHook(() =>
      usePortfolioSnapshot({
        summary: mockSummary,
        assetCount: 5,
        isFiltered: false,
        isInitialLoading: false,
      })
    );

    const snapshots = useSnapshotStore.getState().snapshots;
    expect(snapshots.length).toBe(1);
    expect(snapshots[0].totalValueKRW).toBe(50000000);
    expect(snapshots[0].totalCostKRW).toBe(45000000);
  });

  it('does NOT save snapshot when filtered', () => {
    renderHook(() =>
      usePortfolioSnapshot({
        summary: mockSummary,
        assetCount: 5,
        isFiltered: true,
        isInitialLoading: false,
      })
    );

    const snapshots = useSnapshotStore.getState().snapshots;
    expect(snapshots.length).toBe(0);
  });

  it('does NOT save snapshot during initial loading', () => {
    renderHook(() =>
      usePortfolioSnapshot({
        summary: mockSummary,
        assetCount: 5,
        isFiltered: false,
        isInitialLoading: true,
      })
    );

    const snapshots = useSnapshotStore.getState().snapshots;
    expect(snapshots.length).toBe(0);
  });
});
