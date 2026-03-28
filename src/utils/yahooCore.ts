import type { AssetType, Market, CurrencyCode } from "@/types";

// ─── Tauri 환경 감지 및 CORS-free fetch 래퍼 ──────────────────────────────────

const isTauri =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

let _tauriFetch: typeof globalThis.fetch | null = null;

async function getTauriFetch(): Promise<typeof globalThis.fetch> {
  if (!_tauriFetch) {
    const mod = await import("@tauri-apps/plugin-http");
    _tauriFetch = mod.fetch;
  }
  return _tauriFetch;
}

/** 프록시 URL → 실제 Yahoo URL 변환 */
function resolveUrl(proxyUrl: string): {
  url: string;
  headers?: Record<string, string>;
} {
  if (proxyUrl.startsWith("/api/yahoo/")) {
    const path = proxyUrl.replace("/api/yahoo", "");
    return { url: `https://query1.finance.yahoo.com${path}` };
  }
  return { url: proxyUrl };
}

/**
 * Yahoo Finance API 호출용 통합 fetch
 * - 브라우저(Vite dev): 프록시 URL 그대로 사용
 * - Tauri 데스크톱 앱: 실제 URL로 변환 + tauri-plugin-http fetch (CORS 우회)
 */
export async function yahooFetch(
  proxyUrl: string,
  init?: RequestInit,
): Promise<Response> {
  if (!isTauri) {
    return fetch(proxyUrl, init);
  }
  const { url, headers } = resolveUrl(proxyUrl);
  const doFetch = await getTauriFetch();
  return doFetch(url, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
  });
}

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export interface YahooQuoteResult {
  symbol: string;
  shortname?: string;
  longname?: string;
  quoteType?: string;
  exchange?: string;
  currency?: string;
  score?: number;
}

export interface TickerSearchItem {
  ticker: string;
  name: string;
  type: AssetType;
  market: Market;
  currency: CurrencyCode;
  exchange: string;
}

export interface QuoteData {
  ticker: string;
  name: string;
  price: number;
  currency: CurrencyCode;
  market: Market;
  type: AssetType;
  exchange: string;
}

/** fetchFundamentals 반환 타입 */
export interface FundamentalsData {
  pegRatio: number | null;
  epsGrowth: number | null;
  revenueGrowth: number | null;
  debtToEquity: number | null;
  operatingMargin: number | null;
  marketCap: number | null;
  currency: string | null;
}

// ─── 내부 매핑 ────────────────────────────────────────────────────────────────

// Yahoo Finance quoteType → 우리 AssetType
const QUOTE_TYPE_MAP: Record<string, AssetType> = {
  EQUITY: "stock",
  ETF: "etf",
  MUTUALFUND: "fund",
  BOND: "bond",
  FIXEDINCOME: "bond",
  CRYPTOCURRENCY: "crypto",
};

// Yahoo Finance exchange 코드 → 우리 Market
const EXCHANGE_MARKET_MAP: Record<string, Market> = {
  // 한국
  KSE: "KR", KOQ: "KR", KSC: "KR", KSQ: "KR",
  // 일본
  TYO: "JP", OSA: "JP", NGO: "JP", FKA: "JP", SAP: "JP",
  TSE: "JP", JPX: "JP", TKS: "JP", OSE: "JP",
  TKM: "JP", FPA: "JP", JPF: "JP", TIF: "JP", JMF: "JP", XTKS: "JP",
  // 유럽
  GER: "EU", FRA: "EU", ETR: "EU", STU: "EU", EBS: "EU",
  AMS: "EU", MCE: "EU", MIL: "EU", XETRA: "EU",
  // 미국
  NYQ: "US", NMS: "US", NGM: "US", NCM: "US", PCX: "US", ASE: "US",
  PNK: "US", CXI: "US", BTS: "US", CBT: "US", CME: "US",
  NYB: "US", NYM: "US", NAS: "US", NASDAQ: "US", NYSE: "US",
};

// 심볼 suffix → Market
const SYMBOL_SUFFIX_MARKET_MAP: Record<string, Market> = {
  ".T": "JP", ".OS": "JP", ".N": "JP", ".S": "JP",
  ".KS": "KR", ".KQ": "KR",
  ".L": "OTHER", ".PA": "EU", ".DE": "EU", ".F": "EU",
  ".AS": "EU", ".MC": "EU", ".MI": "EU", ".VI": "EU", ".HK": "OTHER",
};

// Market → 기본 통화
const MARKET_DEFAULT_CURRENCY: Record<Market, CurrencyCode> = {
  KR: "KRW", JP: "JPY", US: "USD", EU: "EUR", OTHER: "USD",
};

export function toAssetType(quoteType?: string): AssetType {
  return QUOTE_TYPE_MAP[quoteType ?? ""] ?? "other";
}

/** 심볼 suffix에서 Market 감지 */
function marketFromSymbol(symbol?: string): Market | null {
  if (!symbol) return null;
  for (const [suffix, market] of Object.entries(SYMBOL_SUFFIX_MARKET_MAP)) {
    if (symbol.endsWith(suffix)) return market;
  }
  return null;
}

export function toMarket(
  exchange?: string,
  currency?: string,
  symbol?: string,
): Market {
  if (exchange) {
    const upper = exchange.toUpperCase();
    if (EXCHANGE_MARKET_MAP[upper]) return EXCHANGE_MARKET_MAP[upper];
  }
  const fromSuffix = marketFromSymbol(symbol);
  if (fromSuffix) return fromSuffix;
  if (currency === "KRW") return "KR";
  if (currency === "JPY") return "JP";
  if (currency === "EUR") return "EU";
  if (currency === "USD") return "US";
  return "OTHER";
}

export function toCurrency(currency?: string, market?: Market): CurrencyCode {
  if (currency === "KRW") return "KRW";
  if (currency === "JPY") return "JPY";
  if (currency === "USD") return "USD";
  if (currency === "EUR") return "EUR";
  if (market) return MARKET_DEFAULT_CURRENCY[market];
  return "USD";
}

/** ISIN 패턴 감지 */
export function isISIN(query: string): boolean {
  return /^[A-Z]{2}[A-Z0-9]{10}$/.test(query.trim());
}
