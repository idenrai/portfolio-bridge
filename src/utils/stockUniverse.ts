import type { Market } from "@/types";

/** 스크리닝용 최소 종목 정보 */
export interface UniverseStock {
  ticker: string;
  name: string;
  market: Market;
}
