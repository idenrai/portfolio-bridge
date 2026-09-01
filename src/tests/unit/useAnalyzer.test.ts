// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAnalyzer } from "@/hooks/useAnalyzer";
import { useAssetStore } from "@/stores";
import { analyzeByTickersGeneric, normalizeTicker } from "@/utils/yahoo/yahooCore";
import type { Asset } from "@/types";

describe("useAnalyzer deduplication & normalization", () => {
  beforeEach(() => {
    useAssetStore.setState({ assets: [] });
  });

  it("normalizeTicker trims whitespace and converts to uppercase", () => {
    expect(normalizeTicker(" 8136.t ")).toBe("8136.T");
    expect(normalizeTicker("aapl")).toBe("AAPL");
    expect(normalizeTicker("005930.ks ")).toBe("005930.KS");
  });

  const mockAssets: Asset[] = [
    {
      id: "asset-1",
      name: "8136.T", // 티커명만 등록된 첫 번째 계좌
      ticker: "8136.T",
      type: "stock",
      market: "JP",
      currency: "JPY",
      quantity: 100,
      avgBuyPrice: 3000,
      currentPrice: 4000,
      categories: ["growth"],
      brokerId: "broker-1",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "asset-2",
      name: "Sanrio Company, Ltd.", // 정식 사명이 등록된 두 번째 계좌
      ticker: "8136.T", // 동일 티커
      type: "stock",
      market: "JP",
      currency: "JPY",
      quantity: 50,
      avgBuyPrice: 3500,
      currentPrice: 4000,
      categories: ["growth"],
      brokerId: "broker-2",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "asset-3",
      name: "Apple Inc.",
      ticker: "AAPL",
      type: "stock",
      market: "US",
      currency: "USD",
      quantity: 10,
      avgBuyPrice: 150,
      currentPrice: 200,
      categories: ["growth"],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "asset-4",
      name: "Cash",
      type: "cash",
      market: "KR",
      currency: "KRW",
      quantity: 1000000,
      avgBuyPrice: 1,
      currentPrice: 1,
      categories: ["cash"],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ];

  it("calculates portfolioStockCount using unique tickers", () => {
    useAssetStore.setState({ assets: mockAssets });

    const analyzeByTickersMock = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() =>
      useAnalyzer({ analyzeByTickers: analyzeByTickersMock }),
    );

    // 전체 주식 레코드는 3개지만 고유 티커는 2개(8136.T, AAPL)
    expect(result.current.portfolioStockCount).toBe(2);
  });

  it("passes deduplicated tickers with preferred descriptive name to analyzeByTickers", async () => {
    useAssetStore.setState({ assets: mockAssets });

    const analyzeByTickersMock = vi.fn().mockResolvedValue([
      {
        stock: { ticker: "8136.T", name: "Sanrio Company, Ltd." },
        totalScore: 55,
        criteria: [],
      },
      {
        stock: { ticker: "AAPL", name: "Apple Inc." },
        totalScore: 70,
        criteria: [],
      },
    ]);

    const { result } = renderHook(() =>
      useAnalyzer({ analyzeByTickers: analyzeByTickersMock }),
    );

    await act(async () => {
      await result.current.runPortfolio();
    });

    expect(analyzeByTickersMock).toHaveBeenCalledTimes(1);
    const passedTickers = analyzeByTickersMock.mock.calls[0][0];
    expect(passedTickers).toHaveLength(2);
    // 티커명("8136.T") 대신 정식 사명("Sanrio Company, Ltd.")이 우선 선택되었는지 확인
    expect(passedTickers).toEqual([
      { ticker: "8136.T", name: "Sanrio Company, Ltd." },
      { ticker: "AAPL", name: "Apple Inc." },
    ]);
    expect(result.current.results).toHaveLength(2);
  });

  it("analyzeByTickersGeneric defensively deduplicates input tickers", async () => {
    const fetchDataMock = vi.fn().mockResolvedValue({ pe: 15 });
    const scoreStockMock = vi.fn().mockImplementation((stock) => ({
      stock,
      totalScore: 80,
    }));
    const onProgressMock = vi.fn();

    const duplicateTickers = [
      { ticker: "8136.T", name: "Sanrio" },
      { ticker: "8136.t", name: "Sanrio Dup" }, // case insensitive
      { ticker: "AAPL", name: "Apple" },
    ];

    const res = await analyzeByTickersGeneric({
      tickers: duplicateTickers,
      fetchData: fetchDataMock,
      defaultRaw: { pe: 0 },
      scoreStock: scoreStockMock,
      onProgress: onProgressMock,
    });

    expect(res).toHaveLength(2);
    expect(fetchDataMock).toHaveBeenCalledTimes(2);
    expect(fetchDataMock).toHaveBeenCalledWith("8136.T");
    expect(fetchDataMock).toHaveBeenCalledWith("AAPL");
  });
});
