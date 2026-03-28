import type { Market } from "@/types";

/** 스크리닝용 최소 종목 정보 */
export interface UniverseStock {
  ticker: string;
  name: string;
  market: Market;
}

// ─── Yahoo Screener API 연동 ─────────────────────────────────────────────────
// 하드코딩 종목이 아닌, Yahoo Finance Screener API를 통해
// 시가총액 $300M–$30B 범위의 종목을 실시간으로 가져옵니다.

/** 시장별 Yahoo screener region 코드 */
const SCREENER_REGIONS: Record<string, string[]> = {
  US: ["us"],
  KR: ["kr"],
  JP: ["jp"],
  EU: ["de", "fr", "nl", "it", "es", "ch", "be", "at"],
};

/** Screener POST body 생성 */
export function buildScreenerBody(
  market: "ALL" | Market,
  count = 30,
): Record<string, unknown> {
  const operands: unknown[] = [
    { operator: "gt", operands: ["intradaymarketcap", 300_000_000] },
    { operator: "lt", operands: ["intradaymarketcap", 30_000_000_000] },
  ];

  if (market !== "ALL" && market !== "OTHER") {
    const regions = SCREENER_REGIONS[market] ?? [];
    if (regions.length === 1) {
      operands.push({ operator: "EQ", operands: ["region", regions[0]] });
    } else if (regions.length > 1) {
      operands.push({
        operator: "OR",
        operands: regions.map((r) => ({
          operator: "EQ",
          operands: ["region", r],
        })),
      });
    }
  }

  return {
    size: count,
    offset: 0,
    sortField: "intradaymarketcap",
    sortType: "DESC",
    quoteType: "EQUITY",
    query: { operator: "AND", operands },
  };
}
