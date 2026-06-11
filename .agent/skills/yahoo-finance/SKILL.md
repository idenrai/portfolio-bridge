---
name: yahoo-finance
description: Yahoo Finance API proxy routing and data fetching integration guidelines.
---

# Yahoo Finance Integration Skill

You implement Yahoo Finance API integrations that seamlessly work across all three runtimes: local dev (Vite proxy), Vercel (serverless function), and Tauri (native HTTP plugin).

## Runtime Architecture

All Yahoo Finance requests MUST go through `yahooFetch()` from `src/utils/yahoo/yahooCore.ts`. Never call `fetch()` directly against Yahoo Finance URLs from components.

```
Local Dev  → Vite proxy → /api/yahoo/:path* → https://query1.finance.yahoo.com/:path*
Vercel     → /api/proxy?__path=:path*       → https://query1.finance.yahoo.com/:path*
Tauri      → tauri-plugin-http direct fetch → https://query1.finance.yahoo.com/:path*
```

The `yahooFetch(proxyUrl)` function handles runtime detection automatically. Always pass a proxy-relative URL starting with `/api/yahoo/`.

## Existing Yahoo Finance Modules

| File | Purpose |
|------|---------|
| `src/utils/yahoo/yahooCore.ts` | Core fetch + runtime detection + cookie/crumb auth |
| `src/utils/yahoo/yahooQuote.ts` | Single ticker quote (price, name, currency) |
| `src/utils/yahoo/yahooSearch.ts` | Ticker symbol search |
| `src/utils/yahoo/yahooFundamentals.ts` | P/E, EPS, market cap, etc. |
| `src/utils/yahoo/yahooFx.ts` | FX rate fetching (e.g. USDJPY=X) |
| `src/utils/yahoo/yahooFinance.ts` | High-level wrapper / barrel |

## Implementing a New Endpoint

### Step 1 — Choose the Yahoo Finance URL
Common endpoints:
- Quote: `/v8/finance/chart/{ticker}?interval=1d&range=5d`
- Search: `/v1/finance/search?q={query}&quotesCount=10`
- Fundamentals: `/v10/finance/quoteSummary/{ticker}?modules=financialData,defaultKeyStatistics`
- Historical: `/v8/finance/chart/{ticker}?interval=1d&range=1y`

### Step 2 — Create the utility function
```typescript
// src/utils/yahoo/yahooNewFeature.ts
import { yahooFetch } from "./yahooCore";

export interface NewFeatureData {
  // typed response fields
}

export async function fetchNewFeature(ticker: string): Promise<NewFeatureData | null> {
  try {
    const data = await yahooFetch(
      `/api/yahoo/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`
    );
    return { /* parsed fields */ };
  } catch {
    return null;
  }
}
```

### Step 3 — Create the custom hook
```typescript
// src/hooks/useNewFeature.ts
import { useState, useEffect } from "react";
import { fetchNewFeature, type NewFeatureData } from "@/utils/yahoo/yahooNewFeature";

export function useNewFeature(ticker: string) {
  const [data, setData] = useState<NewFeatureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    fetchNewFeature(ticker)
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [ticker]);

  return { data, loading, error };
}
```

### Step 4 — Update barrel exports
- Add to `src/utils/yahoo/yahooFinance.ts` (re-export)
- Add to `src/hooks/index.ts`

## Rules
- **Always use `yahooFetch()`** — never raw `fetch()` against Yahoo Finance
- **Always handle null returns** — Yahoo Finance can return incomplete data
- **Encode ticker symbols** — use `encodeURIComponent()` for tickers in URLs
- **Type all response fields** — no `any`, parse only what you need
- **Proxy URL prefix** — always `/api/yahoo/` not `https://query1.finance.yahoo.com/`

## Known Limitations
- FRED API (`api.stlouisfed.org`) times out on Vercel Edge Runtime — use World Bank instead for macro data
- Yahoo Finance crumb/cookie auth is handled by `yahooCore.ts` — don't re-implement it
- Wilshire 5000 index (`^W5000`) is the best available market-cap proxy; actual trillions require a multiplier
