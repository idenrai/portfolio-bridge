import type { Market } from "@/types";

/** 스크리닝용 최소 종목 정보 */
export interface UniverseStock {
  ticker: string;
  name: string;
  market: Market;
}

// ─── GET 기반 동적 종목 발굴 ─────────────────────────────────────────────────
// Yahoo Finance Predefined Screener (GET) + Trending API 조합으로
// 하드코딩 없이 종목을 동적으로 가져옵니다.

/**
 * Yahoo 사전정의 스크리너 이름 목록.
 * GET /v1/finance/screener/predefined/saved/{name}?count=N 으로 호출.
 */
export const PREDEFINED_SCREENERS = [
  "small_cap_gainers",
  "undervalued_growth_stocks",
  "growth_technology_stocks",
  "aggressive_small_caps",
  "most_actives",
] as const;

/** 시장별 Yahoo trending region 코드 */
export const TRENDING_REGIONS: Record<string, string> = {
  US: "US",
  KR: "KR",
  JP: "JP",
  EU: "DE",
};

/** 시가총액 필터 범위 (USD) */
export const MCAP_MIN = 300_000_000;   // $300M
export const MCAP_MAX = 30_000_000_000; // $30B
