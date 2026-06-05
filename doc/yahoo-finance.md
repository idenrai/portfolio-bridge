# Yahoo Finance Integration

---

## Core Rule

**Never call `fetch()` directly against Yahoo Finance URLs from React components or utility code.**  
Always use `yahooFetch()` from `src/utils/yahoo/yahooCore.ts`.

---

## Runtime Detection

`yahooFetch()` auto-detects the environment and routes requests accordingly:

| Environment | Detection | Mechanism |
|-------------|-----------|-----------|
| Local dev (Vite) | Default (no `__TAURI__`) | Vite proxy at `/api/yahoo/…` |
| Vercel deployment | Default (no `__TAURI__`) | Serverless Function `api/proxy.ts` |
| Tauri desktop | `window.__TAURI__` present | Direct request via `tauri-plugin-http` (bypasses CORS) |

---

## Utility Files

| File | Purpose |
|------|---------|
| `yahooCore.ts` | Runtime detection + `yahooFetch()` base function |
| `yahooSearch.ts` | Ticker search (`/v1/finance/search`) |
| `yahooQuote.ts` | Single ticker current price |
| `yahooFinance.ts` | Combined search and quote helpers |
| `yahooFundamentals.ts` | Financial fundamentals (income statement, balance sheet, etc.) |
| `yahooFx.ts` | Exchange rate pairs (e.g., `USDKRW=X`) |

---

## Endpoints

| Endpoint | Usage |
|----------|-------|
| `query1.finance.yahoo.com/v1/finance/search` | Ticker search |
| `query1.finance.yahoo.com/v8/finance/chart/{ticker}` | Current price / quote |
| `query1.finance.yahoo.com/v10/finance/quoteSummary/{ticker}` | Fundamentals |

Fundamentals modules used: `financialData`, `incomeStatementHistory`, `balanceSheetHistory`, `earningsHistory`, `defaultKeyStatistics`

---

## Fundamentals Fallback Strategy

To maximize data coverage for Korean and Japanese stocks:

```text
financialData
  → incomeStatementHistory
    → balanceSheetHistory
      → earningsHistory
        → implied / calculated values
```

Applied in `yahooFundamentals.ts` and used by all 6 quantitative analyzers.

---

## Vite Proxy (Local Dev)

Configured in `vite.config.ts`. Rewrites `/api/yahoo/*` to `https://query1.finance.yahoo.com/*`.

---

## Vercel Proxy (`api/proxy.ts`)

- Routes `/api/yahoo/*` to `query1.finance.yahoo.com`
- Sets appropriate `Cache-Control` headers
- Does **not** accept or forward user portfolio data
- CORS headers restrict which origins can call the proxy

---

## Exchange Rate Caching

Rates are stored in `useSettingsStore.exchangeRates`.

| Condition | Behavior |
|-----------|----------|
| Last fetch < 1 hour ago | Use cached rates (no network call) |
| Fetch fails, cache < 24 hours | Use cached rates + show amber warning |
| Fetch fails, cache > 24 hours | Show error |

Refresh triggered automatically on app startup via `useDataRefresh`.

---

## Notes

- Uses **unofficial** Yahoo Finance API endpoints — API changes may break data fetching without notice
- Japanese investment trusts and other assets not found in search must be registered manually
- Commercial use may violate Yahoo's Terms of Service — for personal, non-commercial use only
