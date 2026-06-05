# Yahoo Finance Integration

Yahoo Finance 연동 시스템입니다.

## Core Rule

**Never call `fetch()` directly against Yahoo Finance URLs from React components or utility code.**
Always use `yahooFetch()` from `src/utils/yahoo/yahooCore.ts`.

**React 컴포넌트나 유틸리티 코드에서 Yahoo Finance URL로 `fetch()`를 직접 호출하지 마세요.**
항상 `src/utils/yahoo/yahooCore.ts`의 `yahooFetch()`를 사용하세요.

## Runtime Detection

`yahooFetch()` auto-detects the environment and routes requests accordingly.

`yahooFetch()`는 실행 환경을 자동 감지하여 적절한 경로로 요청을 라우팅합니다.

| Environment / 환경 | Detection / 감지 방법 | Mechanism / 메커니즘 |
| --- | --- | --- |
| Local dev (Vite) | Default (no `__TAURI__`) | Vite proxy at `/api/yahoo/…` |
| Vercel deployment | Default (no `__TAURI__`) | Serverless Function `api/proxy.ts` |
| Tauri desktop | `window.__TAURI__` present | Direct request via `tauri-plugin-http` (bypasses CORS) |

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

Configured in `vite.config.ts`. Rewrites `/api/yahoo/*` to `https://query1.finance.yahoo.com/*`.

`vite.config.ts`에 설정됩니다. `/api/yahoo/*`를 Yahoo Finance URL로 리라이트합니다.

## Vercel Proxy (`api/proxy.ts`)

- Routes `/api/yahoo/*` to `query1.finance.yahoo.com`. / `/api/yahoo/*`를 Yahoo Finance로 라우팅합니다.
- Sets appropriate `Cache-Control` headers. / 적절한 `Cache-Control` 헤더를 설정합니다.
- Does **not** accept or forward user portfolio data. / 사용자 포트폴리오 데이터를 수신하거나 전달하지 않습니다.
- CORS headers restrict which origins can call the proxy. / CORS 헤더로 프록시를 호출할 수 있는 출처를 제한합니다.

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
