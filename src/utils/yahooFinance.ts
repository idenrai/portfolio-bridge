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

/** 프록시 URL → 실제 Yahoo URL + 필요한 헤더 변환 */
function resolveUrl(proxyUrl: string): {
  url: string;
  headers?: Record<string, string>;
} {
  if (proxyUrl.startsWith("/api/yahoo-jp/")) {
    const path = proxyUrl.replace("/api/yahoo-jp", "");
    return {
      url: `https://finance.yahoo.co.jp${path}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    };
  }
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
async function yahooFetch(
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
// Yahoo Finance는 같은 거래소에 대해 다양한 코드를 사용할 수 있음
const EXCHANGE_MARKET_MAP: Record<string, Market> = {
  // 한국
  KSE: "KR",
  KOQ: "KR",
  KSC: "KR",
  KSQ: "KR",
  // 일본 (TYO / TSE / T / OSA / JPX 등 다양한 코드 모두 처리)
  TYO: "JP",
  OSA: "JP",
  NGO: "JP",
  FKA: "JP",
  SAP: "JP",
  TSE: "JP",
  JPX: "JP",
  TKS: "JP",
  OSE: "JP",
  // 일본 투자신탁 (펀드)
  TKM: "JP",
  FPA: "JP",
  JPF: "JP",
  TIF: "JP",
  JMF: "JP",
  XTKS: "JP",
  // 유럽
  GER: "EU",
  FRA: "EU",
  ETR: "EU",
  STU: "EU",
  EBS: "EU",
  AMS: "EU",
  MCE: "EU",
  MIL: "EU",
  XETRA: "EU",
  // 미국
  NYQ: "US",
  NMS: "US",
  NGM: "US",
  NCM: "US",
  PCX: "US",
  ASE: "US",
  PNK: "US",
  CXI: "US",
  BTS: "US",
  CBT: "US",
  CME: "US",
  NYB: "US",
  NYM: "US",
  NAS: "US",
  NASDAQ: "US",
  NYSE: "US",
};

// 심볼 suffix → Market (예: "9432.T" → ".T" → JP)
const SYMBOL_SUFFIX_MARKET_MAP: Record<string, Market> = {
  // 일본
  ".T": "JP",
  ".OS": "JP",
  ".N": "JP",
  ".S": "JP",
  // 한국
  ".KS": "KR",
  ".KQ": "KR",
  // 유럽/기타
  ".L": "OTHER",
  ".PA": "EU",
  ".DE": "EU",
  ".F": "EU",
  ".AS": "EU",
  ".MC": "EU",
  ".MI": "EU",
  ".VI": "EU",
  ".HK": "OTHER",
};

// Market → 기본 통화
const MARKET_DEFAULT_CURRENCY: Record<Market, CurrencyCode> = {
  KR: "KRW",
  JP: "JPY",
  US: "USD",
  EU: "EUR",
  OTHER: "USD",
};

function toAssetType(quoteType?: string): AssetType {
  return QUOTE_TYPE_MAP[quoteType ?? ""] ?? "other";
}

/** 심볼 suffix에서 Market 감지 (예: "9432.T" → "JP") */
function marketFromSymbol(symbol?: string): Market | null {
  if (!symbol) return null;
  for (const [suffix, market] of Object.entries(SYMBOL_SUFFIX_MARKET_MAP)) {
    if (symbol.endsWith(suffix)) return market;
  }
  return null;
}

function toMarket(
  exchange?: string,
  currency?: string,
  symbol?: string,
): Market {
  // 1순위: exchange 코드
  if (exchange) {
    const upper = exchange.toUpperCase();
    if (EXCHANGE_MARKET_MAP[upper]) return EXCHANGE_MARKET_MAP[upper];
  }
  // 2순위: 심볼 suffix
  const fromSuffix = marketFromSymbol(symbol);
  if (fromSuffix) return fromSuffix;
  // 3순위: 통화
  if (currency === "KRW") return "KR";
  if (currency === "JPY") return "JP";
  if (currency === "EUR") return "EU";
  if (currency === "USD") return "US";
  return "OTHER";
}

function toCurrency(currency?: string, market?: Market): CurrencyCode {
  if (currency === "KRW") return "KRW";
  if (currency === "JPY") return "JPY";
  if (currency === "USD") return "USD";
  if (currency === "EUR") return "EUR";
  // currency 필드가 없거나 알 수 없는 경우 → market 기반 기본값 사용
  if (market) return MARKET_DEFAULT_CURRENCY[market];
  return "USD";
}

// ─── API 함수 ─────────────────────────────────────────────────────────────────

/** ISIN 패턴 감지 (예: JP90C000KRC0, US38259P5089) */
function isISIN(query: string): boolean {
  return /^[A-Z]{2}[A-Z0-9]{10}$/.test(query.trim());
}

/** 일본어 문자(히라가나·가타카나·한자) 포함 여부 */
function containsJapanese(text: string): boolean {
  return /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]/.test(
    text,
  );
}

// ─── Yahoo Finance Japan HTML 스크래핑 ──────────────────────────────────────

/** finance.yahoo.co.jp HTML에서 __PRELOADED_STATE__ JSON 추출 */
function extractPreloadedState(html: string): Record<string, unknown> | null {
  const match = html.match(/window\.__PRELOADED_STATE__\s*=\s*(\{.+)/);
  if (!match) return null;
  const raw = match[1];
  let depth = 0;
  let end = 0;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "{") depth++;
    else if (raw[i] === "}") depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
  try {
    return JSON.parse(raw.slice(0, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// Yahoo JP 검색 결과에서 marketName → AssetType 매핑
const JP_MARKET_TYPE_MAP: Record<string, AssetType> = {
  投資信託: "fund",
  東証ETF: "etf",
  東証PRM: "stock",
  東証STD: "stock",
  東証GRT: "stock",
  名証PRM: "stock",
  名証MRN: "stock",
  福証: "stock",
  札証: "stock",
};

interface YahooJPSearchResult {
  code: string;
  name: string;
  marketName: string;
  price: string;
  detailLink: string;
}

/**
 * Yahoo Finance Japan HTML 스크래핑으로 검색 (투자신탁·일본 주식 특화)
 * finance.yahoo.co.jp/search/?query=... → __PRELOADED_STATE__ 파싱
 */
async function searchTickerJP(query: string): Promise<TickerSearchItem[]> {
  const url = `/api/yahoo-jp/search/?query=${encodeURIComponent(query)}`;

  try {
    const res = await yahooFetch(url);
    if (!res.ok) return [];
    const html = await res.text();
    const state = extractPreloadedState(html);
    if (!state) return [];

    const searchList = state.mainSearchList as
      | { results?: YahooJPSearchResult[] }
      | undefined;
    const results = searchList?.results ?? [];

    return results
      .filter((r) => Boolean(r.code))
      .map((r) => {
        // detailLink에서 .T 같은 suffix 추출
        const linkMatch = r.detailLink?.match(/quote\/([^/]+)/);
        const ticker = linkMatch ? linkMatch[1] : r.code;
        const type: AssetType = JP_MARKET_TYPE_MAP[r.marketName] ?? "other";
        const market: Market = "JP";
        return {
          ticker,
          name: r.name,
          type,
          market,
          currency: "JPY" as CurrencyCode,
          exchange: r.marketName ?? "",
        };
      });
  } catch {
    return [];
  }
}

/**
 * 티커/종목명/ISIN으로 Yahoo Finance 검색
 * - 일본어 쿼리이면 US + JP 병렬 조회, JP 결과 우선 배치
 * - US 실패해도 JP 결과가 있으면 그것만 반환 (에러 throw 하지 않음)
 */
export async function searchTicker(query: string): Promise<TickerSearchItem[]> {
  const q = query.trim();
  const enhanced = isISIN(q);
  const runJP = containsJapanese(q) || isISIN(q);

  const usUrl =
    `/api/yahoo/v1/finance/search?q=${encodeURIComponent(q)}` +
    `&quotesCount=20&newsCount=0` +
    `&enableFuzzyQuery=true&enableCb=false` +
    `&enableNavLinks=false&enableEnhancedTrivialQuery=${enhanced}`;

  const [usResult, jpResults] = await Promise.all([
    yahooFetch(usUrl)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    runJP ? searchTickerJP(q) : Promise.resolve([] as TickerSearchItem[]),
  ]);

  let usResults: TickerSearchItem[] = [];
  if (usResult) {
    const quotes: YahooQuoteResult[] = usResult.quotes ?? [];
    usResults = quotes
      .filter((q) => Boolean(q.symbol))
      .map((q) => {
        const market = toMarket(q.exchange, q.currency, q.symbol);
        return {
          ticker: q.symbol,
          name: q.longname ?? q.shortname ?? q.symbol,
          type: toAssetType(q.quoteType),
          market,
          currency: toCurrency(q.currency, market),
          exchange: q.exchange ?? "",
        };
      });
  }

  // JP 결과 우선, 중복 제거
  const seen = new Set<string>();
  const merged: TickerSearchItem[] = [];
  for (const item of [...jpResults, ...usResults]) {
    if (!seen.has(item.ticker)) {
      seen.add(item.ticker);
      merged.push(item);
    }
  }

  // US·JP 모두 결과 없고 JP를 아직 시도 안 했으면 추가 시도
  if (merged.length === 0 && !runJP) {
    return searchTickerJP(q);
  }

  return merged;
}

// ─── 현재가 조회 ──────────────────────────────────────────────────────────────

export interface QuoteData {
  ticker: string;
  name: string;
  price: number;
  currency: CurrencyCode;
  market: Market;
  type: AssetType;
  exchange: string;
}

/**
/**
 * 특정 심볼의 현재가 조회
 * - US Yahoo 실패 시 JP Yahoo로 폴백 (일본 투자신탁·펀드 대응)
 */
export async function fetchCurrentPrice(
  symbol: string,
): Promise<QuoteData | null> {
  const chartPath = `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

  const parseChart = (
    data: unknown,
    fallbackMarket?: Market,
  ): QuoteData | null => {
    const result = (
      data as {
        chart?: { result?: { meta: Record<string, string | number> }[] };
      }
    )?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta as Record<string, string | number | undefined>;
    const market =
      toMarket(
        meta.exchangeName as string | undefined,
        meta.currency as string | undefined,
        meta.symbol as string | undefined,
      ) ??
      fallbackMarket ??
      "OTHER";
    return {
      ticker: (meta.symbol as string) ?? symbol,
      name: (meta.longName ??
        meta.shortName ??
        meta.symbol ??
        symbol) as string,
      price: (meta.regularMarketPrice as number) ?? 0,
      currency: toCurrency(meta.currency as string | undefined, market),
      market,
      type: "stock",
      exchange: (meta.exchangeName as string) ?? "",
    };
  };

  // 1차: US Yahoo Finance
  try {
    const res = await yahooFetch(`/api/yahoo${chartPath}`);
    if (res.ok) {
      const data = await res.json();
      const parsed = parseChart(data);
      if (parsed && parsed.price > 0) return parsed;
    }
  } catch {
    /* ignore */
  }

  // 2차: Yahoo Finance Japan — HTML 스크래핑 (투자신탁 등 JP 전용 심볼)
  try {
    const jpRes = await yahooFetch(
      `/api/yahoo-jp/quote/${encodeURIComponent(symbol)}`,
    );
    if (jpRes.ok) {
      const html = await jpRes.text();
      const state = extractPreloadedState(html);
      if (state) {
        // 펀드의 경우
        const fundBoard = state.mainFundPriceBoard as
          | { fundPrices?: { code: string; name: string; price: string } }
          | undefined;
        if (fundBoard?.fundPrices?.price) {
          const rawPrice = fundBoard.fundPrices.price.replace(/,/g, "");
          const price = Number(rawPrice);
          if (price > 0) {
            return {
              ticker: symbol,
              name: fundBoard.fundPrices.name ?? symbol,
              price,
              currency: "JPY",
              market: "JP",
              type: "fund",
              exchange: "投資信託",
            };
          }
        }
        // 주식/ETF의 경우
        const stockBoard = state.mainStocksPriceBoard as
          | {
              priceBoard?: {
                code: string;
                name: string;
                price: string;
                marketName: string;
                typeDetail: string;
              };
            }
          | undefined;
        if (stockBoard?.priceBoard?.price) {
          const rawPrice = stockBoard.priceBoard.price.replace(/,/g, "");
          const price = Number(rawPrice);
          if (price > 0) {
            const typeDetail = stockBoard.priceBoard.typeDetail ?? "";
            const assetType: AssetType = typeDetail === "ETF" ? "etf" : "stock";
            return {
              ticker: symbol,
              name: stockBoard.priceBoard.name ?? symbol,
              price,
              currency: "JPY",
              market: "JP",
              type: assetType,
              exchange: stockBoard.priceBoard.marketName ?? "",
            };
          }
        }
      }
    }
  } catch {
    /* ignore */
  }

  return null;
}

// ─── 환율 조회 ────────────────────────────────────────────────────────────────

/**
 * Yahoo Finance에서 환율을 KRW 기준으로 조회
 * - JPY → KRW: JPYKRW=X
 * - USD → KRW: USDKRW=X
 */
export async function fetchExchangeRate(
  fromCurrency: string,
  toCurrency = "KRW",
): Promise<number | null> {
  if (fromCurrency === toCurrency) return 1;

  const symbol = `${fromCurrency}${toCurrency}=X`;
  const url = `/api/yahoo/v8/finance/chart/${symbol}?interval=1d&range=1d`;

  const res = await yahooFetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const result = data.chart?.result?.[0];
  if (!result) return null;

  return result.meta?.regularMarketPrice ?? null;
}

/**
 * KRW 기준 환율 전체 갱신 (JPY, USD, EUR → KRW)
 * 반환: { JPY: number, USD: number, EUR: number }
 */
export async function fetchAllExchangeRates(): Promise<
  Partial<Record<CurrencyCode, number>>
> {
  const [jpy, usd, eur] = await Promise.all([
    fetchExchangeRate("JPY", "KRW"),
    fetchExchangeRate("USD", "KRW"),
    fetchExchangeRate("EUR", "KRW"),
  ]);

  const result: Partial<Record<CurrencyCode, number>> = {};
  if (jpy !== null) result.JPY = jpy;
  if (usd !== null) result.USD = usd;
  if (eur !== null) result.EUR = eur;
  return result;
}
