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

// ─── API 함수 ─────────────────────────────────────────────────────────────────

/**
 * 티커/종목명/ISIN으로 Yahoo Finance 검색
 * 검색되지 않는 종목(일본 투자신탁 등)은 수동 입력으로 등록하세요.
 */
export async function searchTicker(query: string): Promise<TickerSearchItem[]> {
  const q = query.trim();
  const enhanced = isISIN(q);

  const usUrl =
    `/api/yahoo/v1/finance/search?q=${encodeURIComponent(q)}` +
    `&quotesCount=20&newsCount=0` +
    `&enableFuzzyQuery=true&enableCb=false` +
    `&enableNavLinks=false&enableEnhancedTrivialQuery=${enhanced}`;

  const usResult = await yahooFetch(usUrl)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

  if (!usResult) return [];

  const quotes: YahooQuoteResult[] = usResult.quotes ?? [];
  return quotes
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
 * 특정 심볼의 현재가 조회 (Yahoo Finance US)
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

  // US Yahoo Finance 조회
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

// ─── 펀더멘털 조회 ────────────────────────────────────────────────────────────

/** fetchFundamentals 반환 타입 */
export interface FundamentalsData {
  /** PEG 비율 (P/E ÷ EPS 성장률) */
  pegRatio: number | null;
  /** 전년 대비 EPS 성장률 (0.25 = 25%) */
  epsGrowth: number | null;
  /** 전년 대비 매출 성장률 (0.15 = 15%) */
  revenueGrowth: number | null;
  /** 부채비율 — Yahoo 기준 (50 = D/E 0.5x) */
  debtToEquity: number | null;
  /** 영업이익률 (0.20 = 20%) */
  operatingMargin: number | null;
  /** 시가총액 (현지 통화) */
  marketCap: number | null;
  /** 현지 통화 코드 (예: "USD") */
  currency: string | null;
}

/**
 * Yahoo Finance quoteSummary 기반 재무 펀더멘털 조회
 *
 * 모듈 구성:
 *  - defaultKeyStatistics : pegRatio, enterpriseValue 등
 *  - summaryDetail        : marketCap (defaultKeyStatistics에 없는 경우가 많음)
 *  - financialData        : debtToEquity, operatingMargins, earningsGrowth, revenueGrowth
 *  - incomeStatementHistory: totalRevenue, dilutedEPS (연간) → 성장률 직접 계산
 *
 * earningsGrowth / revenueGrowth 는 비미국 종목에서 null인 경우가 많아
 * incomeStatementHistory 에서 전년 대비 직접 계산한 값으로 대체합니다.
 */
export async function fetchFundamentals(
  symbol: string,
): Promise<FundamentalsData | null> {
  const encoded = encodeURIComponent(symbol);
  // 주의: 쉼표는 URL-encode 하지 않음 (Yahoo Finance 호환성)
  const modules = "defaultKeyStatistics,summaryDetail,financialData,incomeStatementHistory";

  type RawVal = { raw?: number };
  type RawStr = { raw?: number } | string;

  /** quoteSummary JSON → FundamentalsData 변환 */
  const parseQuoteSummary = (data: unknown): FundamentalsData | null => {
    const result = (data as { quoteSummary?: { result?: unknown[] } })
      ?.quoteSummary?.result?.[0] as Record<string, unknown> | undefined;
    if (!result) return null;

    const ks = (result.defaultKeyStatistics ?? {}) as Record<string, RawVal>;
    const sd = (result.summaryDetail        ?? {}) as Record<string, RawVal>;
    const fd = (result.financialData        ?? {}) as Record<string, RawStr>;

    // ── 성장률: financialData 값을 우선, null이면 연간 재무제표에서 직접 계산 ──
    let epsGrowth     = (fd.earningsGrowth as RawVal | undefined)?.raw ?? null;
    let revenueGrowth = (fd.revenueGrowth  as RawVal | undefined)?.raw ?? null;

    type Stmt = { totalRevenue?: RawVal; dilutedEPS?: RawVal };
    const stmts = (result.incomeStatementHistory as
      { incomeStatementHistory?: Stmt[] } | undefined
    )?.incomeStatementHistory;

    if (stmts && stmts.length >= 2) {
      const curr = stmts[0];
      const prev = stmts[1];
      if (
        epsGrowth === null &&
        curr.dilutedEPS?.raw != null && prev.dilutedEPS?.raw != null &&
        prev.dilutedEPS.raw !== 0
      ) {
        epsGrowth = (curr.dilutedEPS.raw - prev.dilutedEPS.raw) / Math.abs(prev.dilutedEPS.raw);
      }
      if (
        revenueGrowth === null &&
        curr.totalRevenue?.raw != null && prev.totalRevenue?.raw != null &&
        prev.totalRevenue.raw !== 0
      ) {
        revenueGrowth = (curr.totalRevenue.raw - prev.totalRevenue.raw) / Math.abs(prev.totalRevenue.raw);
      }
    }

    // ── marketCap: summaryDetail 우선, 없으면 defaultKeyStatistics ──
    const marketCap = sd.marketCap?.raw ?? ks.marketCap?.raw ?? null;

    return {
      pegRatio:       ks.pegRatio?.raw ?? null,
      epsGrowth,
      revenueGrowth,
      debtToEquity:   (fd.debtToEquity   as RawVal | undefined)?.raw ?? null,
      operatingMargin:(fd.operatingMargins as RawVal | undefined)?.raw ?? null,
      marketCap,
      currency: typeof fd.financialCurrency === "string" ? fd.financialCurrency : null,
    };
  };

  // 1) v10 시도
  for (const ver of ["v10", "v11"] as const) {
    try {
      const res = await yahooFetch(
        `/api/yahoo/${ver}/finance/quoteSummary/${encoded}?modules=${modules}`,
      );
      if (res.ok) {
        const json = await res.json();
        const parsed = parseQuoteSummary(json);
        if (parsed) return parsed;
        // DEV 환경: 응답이 왔지만 파싱 실패 시 실제 응답을 출력
        if (import.meta.env.DEV) {
          console.warn(`[Lynch] ${symbol} ${ver} 파싱 실패:`, JSON.stringify(json).slice(0, 400));
        }
      } else if (import.meta.env.DEV) {
        console.warn(`[Lynch] ${symbol} ${ver} HTTP ${res.status}`);
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn(`[Lynch] ${symbol} ${ver} 오류:`, e);
    }
  }

  // 3) v8 chart 폴백 — meta에서 marketCap만 구출
  try {
    const res = await yahooFetch(
      `/api/yahoo/v8/finance/chart/${encoded}?interval=1d&range=1d`,
    );
    if (res.ok) {
      const data = await res.json() as {
        chart?: { result?: Array<{ meta?: Record<string, number | string> }> }
      };
      const meta = data.chart?.result?.[0]?.meta;
      if (meta?.marketCap) {
        return {
          pegRatio: null, epsGrowth: null, revenueGrowth: null,
          debtToEquity: null, operatingMargin: null,
          marketCap: typeof meta.marketCap === "number" ? meta.marketCap : null,
          currency: typeof meta.currency === "string" ? meta.currency : null,
        };
      }
    }
  } catch { /* ignore */ }

  return null;
}

// ─── 배치 quote API ───────────────────────────────────────────────────────────

/**
 * Yahoo Finance `/v7/finance/quote` 배치 엔드포인트로
 * 여러 종목의 기본 재무 데이터를 **한 번의 요청**으로 가져옵니다.
 *
 * 반환 필드:
 *  - marketCap ✓ (거의 항상)
 *  - pegRatio  ✓ (key statistics에 있을 때)
 *  - earningsQuarterlyGrowth (분기 EPS 성장 → epsGrowth 대용)
 *  - 추가 필드는 있으면 사용, 없으면 null
 *
 * @param symbols 티커 배열 (최대 ~20개씩 청크)
 * @param chunkDelay  청크 간 딜레이 ms (기본 1500)
 * @param onChunkDone 청크 완료 콜백
 */
export async function fetchBatchQuote(
  symbols: string[],
  chunkDelay = 1500,
  onChunkDone?: (done: number, total: number) => void,
): Promise<Map<string, FundamentalsData>> {
  const CHUNK_SIZE = 15;
  const map = new Map<string, FundamentalsData>();
  let done = 0;

  for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
    const chunk = symbols.slice(i, i + CHUNK_SIZE);
    const joined = chunk.map(s => encodeURIComponent(s)).join(",");

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await yahooFetch(
          `/api/yahoo/v7/finance/quote?formatted=false&lang=en-US&region=US&symbols=${joined}`,
        );

        if (res.status === 429) {
          console.warn(`[BatchQuote] 429 rate limit, attempt ${attempt + 1}`);
          await new Promise(r => setTimeout(r, 2000 * 2 ** attempt));
          continue;
        }

        if (!res.ok) {
          console.warn(`[BatchQuote] HTTP ${res.status} for chunk`, chunk.join(","));
          break;
        }

        const data = await res.json() as {
          quoteResponse?: {
            result?: Array<Record<string, unknown>>;
          };
        };

        const results = data.quoteResponse?.result ?? [];
        console.log(`[BatchQuote] chunk got ${results.length} results for ${chunk.length} symbols`);

        for (const q of results) {
          const sym = q.symbol as string;
          if (!sym) continue;

          const num = (v: unknown) => typeof v === "number" ? v : null;
          const str = (v: unknown) => typeof v === "string" ? v : null;

          map.set(sym, {
            pegRatio:       num(q.pegRatio),
            epsGrowth:      num(q.earningsQuarterlyGrowth),
            revenueGrowth:  num(q.revenueQuarterlyGrowth) ?? null,
            debtToEquity:   null,
            operatingMargin:null,
            marketCap:      num(q.marketCap),
            currency:       str(q.financialCurrency) ?? str(q.currency),
          });
        }
        break;
      } catch (e) {
        console.warn(`[BatchQuote] error attempt ${attempt + 1}:`, e);
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    done += chunk.length;
    onChunkDone?.(Math.min(done, symbols.length), symbols.length);

    if (i + CHUNK_SIZE < symbols.length) {
      await new Promise(r => setTimeout(r, chunkDelay));
    }
  }

  // v7 배치가 전혀 데이터를 못 가져온 경우 → 개별 quoteSummary 폴백
  if (map.size === 0 && symbols.length > 0) {
    console.warn(`[BatchQuote] v7 batch returned 0 data, falling back to individual quoteSummary`);
    let fallbackDone = 0;
    for (const sym of symbols) {
      try {
        const detail = await fetchFundamentals(sym);
        if (detail) map.set(sym, detail);
      } catch { /* ignore */ }
      fallbackDone++;
      onChunkDone?.(fallbackDone, symbols.length);
      // rate limit 딜레이
      if (fallbackDone < symbols.length) {
        await new Promise(r => setTimeout(r, 1200));
      }
    }
  }

  return map;
}

/**
 * 단일 종목 quoteSummary 보강 (debtToEquity, operatingMargins, 정밀 성장률)
 *
 * 기존 batch 데이터 위에 덮어씌우되, batch에서 이미 있는 값은 유지합니다.
 */
export async function enrichFundamentals(
  symbol: string,
  base: FundamentalsData,
): Promise<FundamentalsData> {
  const detail = await fetchFundamentals(symbol);
  if (!detail) return base;

  return {
    pegRatio:       detail.pegRatio       ?? base.pegRatio,
    epsGrowth:      detail.epsGrowth      ?? base.epsGrowth,
    revenueGrowth:  detail.revenueGrowth  ?? base.revenueGrowth,
    debtToEquity:   detail.debtToEquity   ?? base.debtToEquity,
    operatingMargin:detail.operatingMargin ?? base.operatingMargin,
    marketCap:      detail.marketCap      ?? base.marketCap,
    currency:       detail.currency       ?? base.currency,
  };
}

// ─── GET 기반 동적 종목 발굴 ──────────────────────────────────────────────────

import type { UniverseStock } from "./stockUniverse";
import { TRENDING_REGIONS, MARKET_SEEDS, MCAP_MIN, MCAP_MAX } from "./stockUniverse";

export interface ScreenerResult {
  stock: UniverseStock;
  data: FundamentalsData;
}

/**
 * Yahoo Finance Trending API (GET)에서 해당 지역의 인기 종목 가져오기.
 * GET /v1/finance/trending/{region}?count=N
 */
async function fetchTrendingTickers(region: string, count: number): Promise<string[]> {
  try {
    const res = await yahooFetch(
      `/api/yahoo/v1/finance/trending/${region}?count=${count}`,
    );
    if (!res.ok) {
      console.warn(`[Trending] ${region} HTTP ${res.status}`);
      return [];
    }
    const json = await res.json() as {
      finance?: {
        result?: Array<{
          quotes?: Array<{ symbol?: string }>;
        }>;
      };
    };
    return (json.finance?.result?.[0]?.quotes ?? [])
      .map((q) => q.symbol)
      .filter((s): s is string => !!s);
  } catch (e) {
    console.warn(`[Trending] ${region} error:`, e);
    return [];
  }
}

/**
 * v7 배치 시세 조회 → mapQuote 변환
 */
async function fetchQuoteBatch(
  symbols: string[],
  mapQuote: (q: Record<string, unknown>) => ScreenerResult | null,
  results: ScreenerResult[],
): Promise<void> {
  for (let i = 0; i < symbols.length; i += 50) {
    const chunk = symbols.slice(i, i + 50);
    const joined = chunk.join(",");
    try {
      const res = await yahooFetch(
        `/api/yahoo/v7/finance/quote?formatted=false&lang=en-US&symbols=${joined}`,
      );
      if (res.ok) {
        const json = await res.json() as {
          quoteResponse?: { result?: Array<Record<string, unknown>> };
        };
        for (const q of json.quoteResponse?.result ?? []) {
          const r = mapQuote(q);
          if (r) results.push(r);
        }
      }
    } catch (e) {
      console.warn("[Screener] batch error:", e);
    }
    if (i + 50 < symbols.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

/**
 * 동적 종목 발굴
 *
 * **US 시장:** Yahoo Trending API → v7 배치 시세 → 시가총액 필터링
 * **KR/JP/EU 시장:** 시드 티커 풀 → v7 배치 시세 → 실시간 데이터 기반 필터링
 * **ALL:** US Trending + 각 시장 시드 티커 병합
 *
 * EQUITY만 선별, 시가총액 $300M–$30B 범위로 필터링합니다.
 */
export async function fetchScreenerStocks(
  market: "ALL" | Market,
  count = 30,
): Promise<ScreenerResult[]> {
  const seen = new Set<string>();
  const all: ScreenerResult[] = [];

  /** quote 객체 → ScreenerResult 변환 (종목 유형 + 시가총액 필터 포함) */
  const mapQuote = (q: Record<string, unknown>): ScreenerResult | null => {
    const sym = q.symbol as string | undefined;
    if (!sym || seen.has(sym)) return null;

    // EQUITY만 허용 (암호화폐, ETF 등 제외)
    if (q.quoteType !== "EQUITY") return null;

    const num = (v: unknown) => (typeof v === "number" ? v : null);
    const str = (v: unknown) => (typeof v === "string" ? v : null);
    const cap = num(q.marketCap);

    // 시가총액 필터: $300M – $30B (USD 기준, 비USD는 근사 환산)
    if (cap !== null) {
      let capUSD = cap;
      const cur = str(q.financialCurrency) ?? str(q.currency);
      if (cur === "KRW") capUSD = cap / 1350;
      else if (cur === "JPY") capUSD = cap / 150;
      else if (cur === "EUR") capUSD = cap / 0.92;
      if (capUSD < MCAP_MIN || capUSD > MCAP_MAX) return null;
    }

    // 시장 필터
    const stockMarket = toMarket(
      q.exchange as string | undefined,
      q.currency as string | undefined,
      sym,
    );
    if (market !== "ALL" && market !== "OTHER" && stockMarket !== market) return null;

    seen.add(sym);
    return {
      stock: {
        ticker: sym,
        name: (q.longName ?? q.shortName ?? sym) as string,
        market: stockMarket,
      },
      data: {
        pegRatio: num(q.pegRatio),
        epsGrowth: num(q.earningsQuarterlyGrowth),
        revenueGrowth: num(q.revenueQuarterlyGrowth),
        debtToEquity: null,
        operatingMargin: null,
        marketCap: cap,
        currency: str(q.financialCurrency) ?? str(q.currency),
      },
    };
  };

  const needsUS = market === "ALL" || market === "US";
  const needsSeeds = market === "ALL" || market === "OTHER" || market in MARKET_SEEDS;

  // ─── US: Trending API ──────────────────────────────────────
  if (needsUS) {
    console.log(`[Screener] Fetching US trending tickers`);
    const tickers = await fetchTrendingTickers(TRENDING_REGIONS.US, 50);
    const unique = [...new Set(tickers.filter((t) => !seen.has(t)))];
    if (unique.length > 0) {
      await fetchQuoteBatch(unique, mapQuote, all);
    }
    console.log(`[Screener] US trending → ${all.length} equities`);
  }

  // ─── KR/JP/EU: 시드 티커 풀 ──────────────────────────────
  if (needsSeeds) {
    const seedMarkets =
      market === "ALL" || market === "OTHER"
        ? Object.keys(MARKET_SEEDS)
        : [market];

    for (const m of seedMarkets) {
      const seeds = MARKET_SEEDS[m];
      if (!seeds?.length) continue;

      console.log(`[Screener] Fetching ${m} seed tickers (${seeds.length})`);
      const unseen = seeds.filter((t) => !seen.has(t));
      await fetchQuoteBatch(unseen, mapQuote, all);
      console.log(`[Screener] ${m} seeds → total ${all.length} equities`);
    }
  }

  console.log(`[Screener] Final: ${all.length} stocks for market=${market}`);
  return all.slice(0, count);
}
