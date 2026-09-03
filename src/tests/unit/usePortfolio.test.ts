// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useAssetStore } from "@/stores";
import type { Asset } from "@/types";
import { vi } from "vitest";

vi.mock("@/hooks/usePriceRefresh", () => ({
  usePriceRefresh: () => ({
    data: [],
    isLoading: false,
    isInitialLoading: false,
    refreshPrices: vi.fn(),
    lastUpdated: null,
    error: null,
  }),
}));

describe("usePortfolio hook visibility scoping", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const mockAssets: Asset[] = [
      {
        id: "asset-all",
        name: "Apple Inc.",
        ticker: "AAPL",
        type: "stock",
        market: "US",
        currency: "USD",
        quantity: 10,
        avgBuyPrice: 150,
        currentPrice: 180,
        categories: ["growth"],
        visibility: "all",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "asset-dash-only",
        name: "Gold ETF",
        ticker: "GLD",
        type: "etf",
        market: "US",
        currency: "USD",
        quantity: 5,
        avgBuyPrice: 180,
        currentPrice: 200,
        categories: ["commodity"],
        visibility: "dashboard_only",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "asset-guru-only",
        name: "Berkshire Hathaway",
        ticker: "BRK-B",
        type: "stock",
        market: "US",
        currency: "USD",
        quantity: 2,
        avgBuyPrice: 300,
        currentPrice: 350,
        categories: ["value"],
        visibility: "guru_only",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "asset-hidden",
        name: "Penny Stock",
        ticker: "PNNY",
        type: "stock",
        market: "US",
        currency: "USD",
        quantity: 1000,
        avgBuyPrice: 1,
        currentPrice: 0.1,
        categories: ["other"],
        visibility: "hidden",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "asset-legacy-default",
        name: "Legacy Stock Without Visibility",
        ticker: "LEG",
        type: "stock",
        market: "US",
        currency: "USD",
        quantity: 20,
        avgBuyPrice: 50,
        currentPrice: 60,
        categories: ["dividend"],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ];

    useAssetStore.setState({ assets: mockAssets });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  it("defaults to scope: dashboard, including 'all', 'dashboard_only', and legacy undefined visibility", () => {
    const { result } = renderHook(() => usePortfolio(), { wrapper });

    const ids = result.current.assets.map((a) => a.id);
    expect(ids).toContain("asset-all");
    expect(ids).toContain("asset-dash-only");
    expect(ids).toContain("asset-legacy-default");
    expect(ids).not.toContain("asset-guru-only");
    expect(ids).not.toContain("asset-hidden");
    expect(result.current.assets.length).toBe(3);
  });

  it("filters correctly for scope: guru, including 'all', 'guru_only', and legacy undefined visibility", () => {
    const { result } = renderHook(() => usePortfolio({ scope: "guru" }), { wrapper });

    const ids = result.current.assets.map((a) => a.id);
    expect(ids).toContain("asset-all");
    expect(ids).toContain("asset-guru-only");
    expect(ids).toContain("asset-legacy-default");
    expect(ids).not.toContain("asset-dash-only");
    expect(ids).not.toContain("asset-hidden");
    expect(result.current.assets.length).toBe(3);
  });

  it("includes all assets when scope: all is passed", () => {
    const { result } = renderHook(() => usePortfolio({ scope: "all" }), { wrapper });

    const ids = result.current.assets.map((a) => a.id);
    expect(ids).toEqual([
      "asset-all",
      "asset-dash-only",
      "asset-guru-only",
      "asset-hidden",
      "asset-legacy-default",
    ]);
    expect(result.current.assets.length).toBe(5);
  });

  it("filters strictly by visibilities when visibilities array is specified without needing scope: all", () => {
    const { result } = renderHook(
      () => usePortfolio({ visibilities: ["hidden"] }),
      { wrapper },
    );

    const ids = result.current.assets.map((a) => a.id);
    expect(ids).toEqual(["asset-hidden"]);
  });
});
