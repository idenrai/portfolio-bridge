import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAssetFilterSort } from "@/hooks/useAssetFilterSort";
import type { PortfolioAsset } from "@/types";

const mockAssets: PortfolioAsset[] = [
  {
    id: "1",
    name: "Apple Inc.",
    ticker: "AAPL",
    market: "US",
    type: "stock",
    currency: "USD",
    quantity: 10,
    avgBuyPrice: 150,
    currentPrice: 180,
    categories: ["growth"],
    brokerId: "broker-1",
    visibility: "all",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Samsung Electronics",
    ticker: "005930.KS",
    market: "KR",
    type: "stock",
    currency: "KRW",
    quantity: 50,
    avgBuyPrice: 60000,
    currentPrice: 70000,
    categories: ["dividend"],
    brokerId: "broker-2",
    visibility: "dashboard_only",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Toyota Motor",
    ticker: "7203.T",
    market: "JP",
    type: "stock",
    currency: "JPY",
    quantity: 100,
    avgBuyPrice: 2000,
    currentPrice: 2500,
    categories: ["value"],
    brokerId: "broker-1",
    visibility: "hidden",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "US Dollar Cash",
    market: "US",
    type: "cash",
    currency: "USD",
    quantity: 5000,
    avgBuyPrice: 1,
    currentPrice: 1,
    categories: ["cash"],
    visibility: "all",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("useAssetFilterSort", () => {
  it("초기 상태에서는 모든 자산이 반환되고 기본 정렬이 설정되어야 한다", () => {
    const { result } = renderHook(() =>
      useAssetFilterSort({ assets: mockAssets }),
    );

    expect(result.current.filteredAssets.length).toBe(4);
    expect(result.current.sortKey).toBe("value");
    expect(result.current.sortDir).toBe("desc");
    expect(result.current.availableMarkets).toEqual(["US", "KR", "JP"]);
    expect(result.current.availableTypes).toEqual(["stock", "cash"]);
  });

  it("시장(market) 필터를 적용하면 해당 시장 자산만 필터링되어야 한다", () => {
    const { result } = renderHook(() =>
      useAssetFilterSort({ assets: mockAssets }),
    );

    act(() => {
      result.current.setFilterMarkets(["US"]);
    });

    expect(result.current.filteredAssets.length).toBe(2);
    expect(result.current.filteredAssets.every((a) => a.market === "US")).toBe(true);
  });

  it("브로커 및 카테고리 복합 필터가 올바르게 작동해야 한다", () => {
    const { result } = renderHook(() =>
      useAssetFilterSort({ assets: mockAssets }),
    );

    act(() => {
      result.current.setFilterBrokerIds(["broker-1"]);
      result.current.setFilterCategories(["growth"]);
    });

    expect(result.current.filteredAssets.length).toBe(1);
    expect(result.current.filteredAssets[0].name).toBe("Apple Inc.");
  });

  it("노출 여부(visibility) 필터가 올바르게 작동해야 한다", () => {
    const { result } = renderHook(() =>
      useAssetFilterSort({ assets: mockAssets }),
    );

    act(() => {
      result.current.setFilterVisibilities(["hidden"]);
    });

    expect(result.current.filteredAssets.length).toBe(1);
    expect(result.current.filteredAssets[0].name).toBe("Toyota Motor");
  });

  it("정렬 키와 정렬 방향 토글이 정상 작동해야 한다", () => {
    const { result } = renderHook(() =>
      useAssetFilterSort({ assets: mockAssets }),
    );

    // 같은 키 클릭 시 방향 토글 (desc -> asc)
    act(() => {
      result.current.handleSort("value");
    });
    expect(result.current.sortKey).toBe("value");
    expect(result.current.sortDir).toBe("asc");

    // 다른 키 클릭 시 새 키로 설정되고 방향은 desc로 초기화
    act(() => {
      result.current.handleSort("name");
    });
    expect(result.current.sortKey).toBe("name");
    expect(result.current.sortDir).toBe("desc");
  });

  it("handleClearFilters 호출 시 모든 필터가 초기화되어야 한다", () => {
    const { result } = renderHook(() =>
      useAssetFilterSort({ assets: mockAssets }),
    );

    act(() => {
      result.current.setFilterMarkets(["KR"]);
      result.current.setFilterTypes(["stock"]);
      result.current.setFilterCategories(["dividend"]);
      result.current.setFilterBrokerIds(["broker-2"]);
      result.current.setFilterVisibilities(["dashboard_only"]);
    });

    expect(result.current.filteredAssets.length).toBe(1);

    act(() => {
      result.current.handleClearFilters();
    });

    expect(result.current.filterMarkets).toEqual([]);
    expect(result.current.filterTypes).toEqual([]);
    expect(result.current.filterCategories).toEqual([]);
    expect(result.current.filterBrokerIds).toEqual([]);
    expect(result.current.filterVisibilities).toEqual([]);
    expect(result.current.filteredAssets.length).toBe(4);
  });
});
