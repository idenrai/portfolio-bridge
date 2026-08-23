# Yahoo Finance & FRED Proxy Integration

Yahoo Finance 및 FRED API 연동 프록시 시스템입니다.

## Core Rule

**Never call `fetch()` directly against external market or economic API URLs from React components or utility code.**
Always route requests through the proxy layer via `yahooFetch()` from `src/utils/yahoo/yahooCore.ts` or FRED proxy endpoints.

**React 컴포넌트나 유틸리티 코드에서 외부 시세/경제 API URL로 `fetch()`를 직접 호출하지 마세요.**
항상 `src/utils/yahoo/yahooCore.ts`의 `yahooFetch()` 또는 FRED 프록시 엔드포인트를 통해 요청하세요.

## Runtime Detection

`yahooFetch()` auto-detects the environment and routes requests accordingly.

`yahooFetch()`는 실행 환경을 자동 감지하여 적절한 경로로 요청을 라우팅합니다.

| Environment / 환경 | Detection / 감지 방법 | Mechanism / 메커니즘 |
| --- | --- | --- |
| Local dev (Vite) | `import.meta.env.DEV` | Vite dev proxy plugin at `/api/yahoo/…` |
| Vercel deployment | Production runtime | Vercel Edge Runtime proxy (`api/proxy.ts`, `api/fred.ts`) |

## Utility Files

| File | Purpose |
| --- | --- |
| `yahooCore.ts` | Runtime detection + `yahooFetch()` base function / 런타임 감지 + 기본 함수 |
| `yahooSearch.ts` | Ticker search (`/v1/finance/search`) / 종목 검색 |
| `yahooQuote.ts` | Single ticker current price / 단일 종목 현재가 |
| `yahooFinance.ts` | Combined search and quote helpers / 검색·시세 통합 헬퍼 |
| `yahooFundamentals.ts` | Financial fundamentals / 재무 기초 데이터 |
| `yahooFx.ts` | Exchange rate pairs (e.g., `USDKRW=X`) / 환율 쌍 |

## Endpoints

| Endpoint | Usage |
| --- | --- |
| `query1.finance.yahoo.com/v1/finance/search` | Ticker search / 종목 검색 |
| `query1.finance.yahoo.com/v8/finance/chart/{ticker}` | Current price / 현재가 |
| `query1.finance.yahoo.com/v10/finance/quoteSummary/{ticker}` | Fundamentals / 재무 데이터 |
| `fred.stlouisfed.org/graph/fredgraph.csv` | Economic data series (via `api/fred.ts`) / 거시경제 지표 데이터 |

Fundamentals modules used: `financialData`, `incomeStatementHistory`, `balanceSheetHistory`,
`earningsHistory`, `defaultKeyStatistics`.

사용하는 펀더멘털 모듈: 위 목록과 동일합니다.

## Fundamentals Fallback Strategy

To maximize data coverage for Korean and Japanese stocks.

한국·일본 종목의 데이터 커버리지를 최대화하기 위한 폴백 전략입니다.

```text
financialData
  → incomeStatementHistory
    → balanceSheetHistory
      → earningsHistory
        → implied / calculated values
```

Applied in `yahooFundamentals.ts` and used by all 6 quantitative analyzers.

`yahooFundamentals.ts`에 적용되며 6종 정량 채점기 모두가 사용합니다.

## Vite Proxy (Local Dev)

Configured in `vite.config.ts`. Intercepts `/api/yahoo/*`, `/api/fred`, and `/api/health`, providing full local development parity with Vercel Edge functions. Handles cookie/crumb lifecycle, timeout guards (`AbortSignal.timeout(10s)`), and request routing.

`vite.config.ts`에 설정됩니다. `/api/yahoo/*`, `/api/fred`, `/api/health` 요청을 가로채 쿠키/크럼 라이프사이클을 관리하고 타임아웃 방어 및 에러 처리를 프로덕션 Vercel Edge와 동일하게 제공합니다.

## Vercel Edge Proxies

### 1. Yahoo Finance Proxy (`api/proxy.ts`)
- **Runtime**: Vercel Edge Runtime (`export const config = { runtime: "edge" };`).
- **Routing**: `vercel.json` rewrite maps `/api/yahoo/:path*` to `/api/proxy?__path=:path*`.
- **Zero-Trust Validation**: Restricts methods to `GET`, `POST`, `OPTIONS` (returns `405 Method Not Allowed` with `Allow` header otherwise). Enforces path validation regex (`/^[a-zA-Z0-9/_.-]+$/`), blocks path traversal (`..`, `//`), and restricts prefixes to allowed namespaces (`^(v[0-9]+|ws)/finance/`).
- **Resilience & Timeout Guard**: Upstream fetches use `AbortSignal.timeout(10_000)` to eliminate hanging edge executions (returns `504 Gateway Timeout` on timeout).
- **Smart Edge Caching**:
  - `chart` (historical/range): `public, s-maxage=300, stale-while-revalidate=600` (5 minutes)
  - `quoteSummary` / `search`: `public, s-maxage=60, stale-while-revalidate=120` (1 minute)
  - Real-time quote: `public, s-maxage=15, stale-while-revalidate=30` (15 seconds)
- Does **not** accept or store user portfolio data.

### 2. FRED Economic Data Proxy (`api/fred.ts`)
- **Runtime**: Vercel Edge Runtime (`export const config = { runtime: "edge" };`).
- **Endpoint**: `/api/fred?id={seriesId}`.
- **Validation**: Rejects non-GET/OPTIONS with `405 Method Not Allowed`. Enforces regex check (`/^[A-Z0-9_]{3,30}$/`) and whitelist matching (`WILL5000INDFC`, `GDP`).
- **Resilience & Timeout Guard**: Uses `AbortSignal.timeout(10_000)` to guard upstream FRED CSV requests.
- **Edge Caching**: Applies 1-day public edge cache (`Cache-Control: public, s-maxage=86400, stale-while-revalidate=43200`).

### 3. Health Check (`api/health.ts`)
- **Runtime**: Vercel Edge Runtime.
- **Endpoint**: `/api/health`.
- **Validation**: Rejects non-GET/OPTIONS with `405 Method Not Allowed`.
- **Cache Control**: `no-store, no-cache, must-revalidate, proxy-revalidate`.
- **Payload**: `{ status: "healthy", ok: true, timestamp: Date.now(), runtime: "edge" }`.

## Crumb Fetching Strategy

To bypass 429 Too Many Requests errors and cookie restrictions, the proxies (Vercel and local Vite) maintain a warm in-memory crumb cache (with exponential backoff retries and auto-refresh on 401/403) by fetching from `fc.yahoo.com` and `finance.yahoo.com`.

429 Too Many Requests 및 쿠키 제한을 우회하기 위해, Vercel 및 로컬 Vite 프록시는 `fc.yahoo.com`과 `finance.yahoo.com`에서 쿠키/크럼을 발급받아 메모리에 캐시하며 401/403 또는 429 감지 시 지수 백오프로 자동 재시도합니다.

## Exchange Rate Caching

Rates are stored in `useSettingsStore.exchangeRates`.

환율은 `useSettingsStore.exchangeRates`에 저장됩니다.

| Condition / 조건 | Behavior / 동작 |
| --- | --- |
| Last fetch < 1 hour ago / 마지막 조회 1시간 이내 | Use cached rates / 캐시 사용 |
| Fetch fails, cache < 24 hours / 조회 실패, 24시간 이내 캐시 | Cached + amber warning / 캐시 + 경고 |
| Fetch fails, cache > 24 hours / 조회 실패, 24시간 초과 캐시 | Show error / 오류 표시 |

Refresh is triggered automatically on app startup via `useDataRefresh`.

앱 시작 시 `useDataRefresh`를 통해 자동으로 새로고침이 실행됩니다.

## Notes

- Uses **unofficial** Yahoo Finance API endpoints — API changes may break data fetching without notice. / **비공식** Yahoo Finance API 엔드포인트를 사용하므로 API 변경 시 예고 없이 조회가 실패할 수 있습니다.
- Japanese investment trusts and other assets not found in search must be registered manually. / 일본 투자신탁 등 검색되지 않는 자산은 수동으로 등록해야 합니다.
- Commercial use may violate Yahoo's Terms of Service — for personal, non-commercial use only. / 상업적 이용은 Yahoo 이용약관에 따라 제한될 수 있으므로 개인 비상업적 용도로만 사용하세요.
