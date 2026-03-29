import type { Market } from "@/types";

/** 스크리닝용 최소 종목 정보 */
export interface UniverseStock {
  ticker: string;
  name: string;
  market: Market;
}

// ─── POST Screener API 기반 동적 종목 발굴 ───────────────────────────────────
// Yahoo Finance POST /v1/finance/screener API를 사용하여
// 시가총액 범위 + 지역 필터로 실시간 종목 후보를 동적으로 가져옵니다.
// 하드코딩된 시드 티커 없이 모든 시장을 커버합니다.

/** 시가총액 필터 범위 (USD) */
export const MCAP_MIN = 300_000_000;   // $300M
export const MCAP_MAX = 30_000_000_000; // $30B

/** 시장 → Yahoo Finance Screener region 코드 매핑 */
export const MARKET_REGIONS: Record<Market, string[]> = {
  US: ["us"],
  KR: ["kr"],
  JP: ["jp"],
  EU: ["de", "fr", "nl", "be", "ch", "it", "es", "at", "fi", "ie", "pt"],
  OTHER: [],
};

/** 시장 → Yahoo Trending API region 코드 (POST Screener 실패 시 fallback) */
export const TRENDING_REGIONS: Record<Market, string[]> = {
  US: ["US"],
  KR: ["KR"],
  JP: ["JP"],
  EU: ["DE", "FR", "GB"],
  OTHER: [],
};
