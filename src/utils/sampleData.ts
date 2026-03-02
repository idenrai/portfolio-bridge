import type { AssetFormData } from "@/types";

/**
 * 온보딩 데모용 샘플 자산 데이터
 * 한국, 미국, 일본 시장을 아우르는 6개 자산으로 구성
 */
export const SAMPLE_ASSETS: AssetFormData[] = [
  {
    name: "삼성전자",
    ticker: "005930.KS",
    type: "stock",
    market: "KR",
    currency: "KRW",
    quantity: 50,
    avgBuyPrice: 68000,
    currentPrice: 71500,
    tags: ["value"],
    memo: "샘플 데이터",
  },
  {
    name: "Apple Inc.",
    ticker: "AAPL",
    type: "stock",
    market: "US",
    currency: "USD",
    quantity: 10,
    avgBuyPrice: 178,
    currentPrice: 193,
    tags: ["growth"],
    memo: "샘플 데이터",
  },
  {
    name: "SPDR S&P 500 ETF Trust",
    ticker: "SPY",
    type: "etf",
    market: "US",
    currency: "USD",
    quantity: 5,
    avgBuyPrice: 450,
    currentPrice: 472,
    tags: ["index"],
    memo: "샘플 데이터",
  },
  {
    name: "달러 예금",
    ticker: undefined,
    type: "cash",
    market: "US",
    currency: "USD",
    quantity: 3000,
    avgBuyPrice: 1,
    currentPrice: 1,
    tags: ["cash"],
    memo: "샘플 데이터",
  },
  {
    name: "원화 예금",
    ticker: undefined,
    type: "cash",
    market: "KR",
    currency: "KRW",
    quantity: 5000000,
    avgBuyPrice: 1,
    currentPrice: 1,
    tags: ["cash"],
    memo: "샘플 데이터",
  },
];
