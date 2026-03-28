import type { Market } from "@/types";

/** 스크리닝용 최소 종목 정보 */
export interface UniverseStock {
  ticker: string;
  name: string;
  market: Market;
}

// ─── 시장별 종목 유니버스 ────────────────────────────────────────────────────────
// 피터 린치 10루타 후보는 대형주가 아닌 **소·중형 성장주**에서 나옵니다.
// 시가총액 $1B–$30B 범위의 고성장 기업 위주로 선별합니다.

const US: UniverseStock[] = [
  { ticker: "DUOL",  name: "Duolingo",              market: "US" },
  { ticker: "CELH",  name: "Celsius Holdings",      market: "US" },
  { ticker: "HIMS",  name: "Hims & Hers Health",    market: "US" },
  { ticker: "CAVA",  name: "CAVA Group",            market: "US" },
  { ticker: "TOST",  name: "Toast",                 market: "US" },
  { ticker: "DKNG",  name: "DraftKings",            market: "US" },
  { ticker: "UPST",  name: "Upstart Holdings",      market: "US" },
  { ticker: "SOFI",  name: "SoFi Technologies",     market: "US" },
];

const KR: UniverseStock[] = [
  { ticker: "247540.KQ", name: "에코프로비엠",       market: "KR" },
  { ticker: "196170.KQ", name: "알테오젠",           market: "KR" },
  { ticker: "042700.KQ", name: "한미반도체",         market: "KR" },
  { ticker: "214150.KQ", name: "클래시스",           market: "KR" },
  { ticker: "352480.KQ", name: "씨앤씨인터내셔널",   market: "KR" },
  { ticker: "058470.KQ", name: "리노공업",           market: "KR" },
  { ticker: "328130.KQ", name: "루닛",              market: "KR" },
  { ticker: "094280.KQ", name: "HLB",              market: "KR" },
];

const JP: UniverseStock[] = [
  { ticker: "4385.T",  name: "メルカリ (Mercari)",           market: "JP" },
  { ticker: "4478.T",  name: "フリー (freee)",               market: "JP" },
  { ticker: "3697.T",  name: "SHIFT",                       market: "JP" },
  { ticker: "6532.T",  name: "ベイカレント (BayCurrent)",     market: "JP" },
  { ticker: "6526.T",  name: "ソシオネクスト (Socionext)",     market: "JP" },
  { ticker: "9552.T",  name: "M&A総合研究所",                market: "JP" },
  { ticker: "3923.T",  name: "ラクス (RAKUS)",               market: "JP" },
  { ticker: "6920.T",  name: "レーザーテック",                market: "JP" },
];

const EU: UniverseStock[] = [
  { ticker: "ADYEN.AS",  name: "Adyen",                 market: "EU" },
  { ticker: "IFX.DE",    name: "Infineon Technologies", market: "EU" },
  { ticker: "HAG.DE",    name: "Hensoldt",              market: "EU" },
  { ticker: "RHM.DE",    name: "Rheinmetall",           market: "EU" },
  { ticker: "DSY.PA",    name: "Dassault Systèmes",     market: "EU" },
  { ticker: "NEXI.MI",   name: "Nexi",                  market: "EU" },
];

export const STOCK_UNIVERSE: Record<Market, UniverseStock[]> = {
  US,
  KR,
  JP,
  EU,
  OTHER: [],
};

/** 선택한 시장의 유니버스 반환 (ALL = 전 시장 합산) */
export function getUniverse(market: "ALL" | Market): UniverseStock[] {
  if (market === "ALL") return [...US, ...KR, ...JP, ...EU];
  return STOCK_UNIVERSE[market] ?? [];
}
