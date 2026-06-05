# Portfolio Bridge — Application Overview

## Purpose

Portfolio Bridge is a privacy-first, multi-currency portfolio management web application.  
Users can track and analyze financial assets across Korea, Japan, the US, and Germany from a single dashboard.  
All user data is stored in browser `localStorage` only — no server-side storage, no account required.

## Key Features

| Feature | Description |
|---------|-------------|
| Unified Dashboard | KPI bar, allocation charts, holdings table, rebalance suggestions, auto insights |
| Asset Management | Yahoo Finance ticker search, manual entry, AI classification, CSV import/export |
| Investment Gurus | 20 guru personas, ideal allocation comparison, 6 quantitative analyzers, AI prompt generation |
| AI Portfolio Analysis | Structured prompts for ChatGPT / Claude / Gemini / Grok |
| Auto Insights | Alerts for overweight, large losses, low cash, currency overexposure |
| Multi-language | Korean / English / 日本語 / Deutsch with instant switch |
| Google Drive Backup | Optional sync of localStorage data to the user's own Google Drive |

## Architecture

The app runs in three distinct environments:

```text
Local dev (Vite)          Vercel deployment           Tauri desktop
┌────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ React SPA      │    │ React SPA (CDN)    │    │ React SPA (WebView)│
│ Vite proxy     │    │ Serverless Fn      │    │ tauri-plugin-http  │
└──────┬─────────┘    └────────┬───────────┘    └─────────┬──────────┘
       └──────────────────────┴─────────────────────────┘
                               ↓
                        Yahoo Finance API
```

`yahooFetch()` in `src/utils/yahoo/yahooCore.ts` auto-detects the runtime and routes requests accordingly.

## Routing

| Route | Page | Component |
|-------|------|-----------|
| `/` | Dashboard | `src/pages/Dashboard.tsx` |
| `/assets` | Asset Management | `src/pages/Assets.tsx` |
| `/gurus` | Investment Gurus | `src/pages/Gurus.tsx` |
| `/settings` | Settings | `src/pages/Settings.tsx` |
| `/about` | About | `src/pages/About.tsx` |

## State Management

All global state uses Zustand with `persist` middleware (localStorage). Store files live in `src/stores/`:

| Store | File | Purpose |
|-------|------|---------|
| `useAssetStore` | `useAssetStore.ts` | Asset list |
| `useBrokerStore` | `useBrokerStore.ts` | Broker accounts |
| `useSettingsStore` | `useSettingsStore.ts` | Currency, exchange rates, target allocations |
| `useProfileStore` | `useProfileStore.ts` | User profile (name, age, financial goals) |
| `useLanguageStore` | `useLanguageStore.ts` | Active locale |
| `useSnapshotStore` | `useSnapshotStore.ts` | Portfolio value history snapshots |
| `useGuruSessionStore` | `useGuruSessionStore.ts` | Guru AI chat session history |
| `useGoogleDriveStore` | `useGoogleDriveStore.ts` | Google Drive auth state |

Storage keys are defined in `src/constants/storage.ts`.

## App Layout

| Component | Location | Role |
|-----------|----------|------|
| `Layout` | `components/layout/Layout.tsx` | Root shell (sidebar + content area) |
| `Header` | `components/layout/Header.tsx` | Top bar (language selector, currency, nav on mobile) |
| `Sidebar` | `components/layout/Sidebar.tsx` | Desktop navigation |
| `BottomNav` | `components/layout/BottomNav.tsx` | Mobile bottom navigation |

## Privacy Model

- No backend, no database, no user accounts
- All data lives in browser `localStorage`
- Yahoo Finance requests are proxied — the proxy does **not** receive or store portfolio data
- Google Drive integration is optional; data is stored in the user's own Drive folder
- AI prompts are generated client-side and placed in clipboard — never transmitted by the app
