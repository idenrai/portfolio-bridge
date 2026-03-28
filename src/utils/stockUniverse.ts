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
  { ticker: "BROS",  name: "Dutch Bros",            market: "US" },
  { ticker: "DKNG",  name: "DraftKings",            market: "US" },
  { ticker: "ENPH",  name: "Enphase Energy",        market: "US" },
  { ticker: "UPST",  name: "Upstart Holdings",      market: "US" },
  { ticker: "GTLB",  name: "GitLab",                market: "US" },
  { ticker: "DOCN",  name: "DigitalOcean",          market: "US" },
  { ticker: "IOT",   name: "Samsara",               market: "US" },
  { ticker: "PCOR",  name: "Procore Technologies",  market: "US" },
  { ticker: "BILL",  name: "Bill Holdings",         market: "US" },
  { ticker: "FRSH",  name: "Freshworks",            market: "US" },
  { ticker: "SOFI",  name: "SoFi Technologies",     market: "US" },
  { ticker: "GLBE",  name: "Global-e Online",       market: "US" },
  { ticker: "CFLT",  name: "Confluent",             market: "US" },
  { ticker: "MNDY",  name: "monday.com",            market: "US" },
  { ticker: "RXRX",  name: "Recursion Pharma",      market: "US" },
];

const KR: UniverseStock[] = [
  { ticker: "247540.KQ", name: "에코프로비엠",       market: "KR" },
  { ticker: "086520.KQ", name: "에코프로",           market: "KR" },
  { ticker: "196170.KQ", name: "알테오젠",           market: "KR" },
  { ticker: "042700.KQ", name: "한미반도체",         market: "KR" },
  { ticker: "022100.KS", name: "포스코DX",          market: "KR" },
  { ticker: "214150.KQ", name: "클래시스",           market: "KR" },
  { ticker: "352480.KQ", name: "씨앤씨인터내셔널",   market: "KR" },
  { ticker: "357780.KQ", name: "솔브레인",           market: "KR" },
  { ticker: "058470.KQ", name: "리노공업",           market: "KR" },
  { ticker: "007660.KS", name: "이수페타시스",       market: "KR" },
  { ticker: "328130.KQ", name: "루닛",              market: "KR" },
  { ticker: "067160.KQ", name: "아프리카TV",         market: "KR" },
  { ticker: "214450.KQ", name: "파마리서치",         market: "KR" },
  { ticker: "041510.KQ", name: "에스엠",            market: "KR" },
  { ticker: "094280.KQ", name: "HLB",              market: "KR" },
];

const JP: UniverseStock[] = [
  { ticker: "4385.T",  name: "メルカリ (Mercari)",           market: "JP" },
  { ticker: "4478.T",  name: "フリー (freee)",               market: "JP" },
  { ticker: "3697.T",  name: "SHIFT",                       market: "JP" },
  { ticker: "6532.T",  name: "ベイカレント (BayCurrent)",     market: "JP" },
  { ticker: "6526.T",  name: "ソシオネクスト (Socionext)",     market: "JP" },
  { ticker: "3769.T",  name: "GMOペイメントG",               market: "JP" },
  { ticker: "9552.T",  name: "M&A総合研究所",                market: "JP" },
  { ticker: "3923.T",  name: "ラクス (RAKUS)",               market: "JP" },
  { ticker: "3994.T",  name: "マネーフォワード (MoneyForward)", market: "JP" },
  { ticker: "6254.T",  name: "野村マイクロサイエンス",         market: "JP" },
  { ticker: "4816.T",  name: "東映アニメーション",             market: "JP" },
  { ticker: "2158.T",  name: "FRONTEO",                     market: "JP" },
  { ticker: "7342.T",  name: "ウェルスナビ (WealthNavi)",     market: "JP" },
  { ticker: "6920.T",  name: "レーザーテック",                market: "JP" },
  { ticker: "4420.T",  name: "イーソル (eSOL)",              market: "JP" },
];

const EU: UniverseStock[] = [
  { ticker: "ADYEN.AS",  name: "Adyen",                 market: "EU" },
  { ticker: "IFX.DE",    name: "Infineon Technologies", market: "EU" },
  { ticker: "HAG.DE",    name: "Hensoldt",              market: "EU" },
  { ticker: "RHM.DE",    name: "Rheinmetall",           market: "EU" },
  { ticker: "DSY.PA",    name: "Dassault Systèmes",     market: "EU" },
  { ticker: "CAP.PA",    name: "Capgemini",             market: "EU" },
  { ticker: "NEXI.MI",   name: "Nexi",                  market: "EU" },
  { ticker: "PRX.AS",    name: "Prosus",                market: "EU" },
  { ticker: "SRT3.DE",   name: "Sartorius (Pref.)",     market: "EU" },
  { ticker: "DHL.DE",    name: "DHL Group",             market: "EU" },
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
