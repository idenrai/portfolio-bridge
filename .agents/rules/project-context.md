---
trigger: always_on
---

# Instructions for Portfolio Bridge

## Project Overview

Portfolio Bridge is a **privacy-first portfolio management web app** that lets users manage multi-country financial assets (Korea · Japan · US · Germany) in one dashboard. All data is stored in browser `localStorage` only — never sent to external servers. Market and economic data are fetched client-side via proxy from Yahoo Finance and FRED (Federal Reserve Economic Data).

The app runs as a **React SPA** served locally via Vite or deployed to Vercel (Edge Runtime API proxies + static CDN).

---

## Tech Stack

| Area | Technology |
|------|------------|
| Frontend | React 19 · TypeScript 5.9 · Vite 7 · Lucide React · date-fns · Fontsource (Inter, Fira Code) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, `@theme` design tokens, `@utility`) |
| State & Async Data | Zustand 5 (Granular Selector pattern + `localStorage` persist) · TanStack Query v5 |
| Charts | Recharts 3 |
| Routing | React Router v7 (`react-router-dom` v7 with `React.lazy` & `Suspense`) |
| i18n | Custom (ko / en / ja / de) |
| Market & Economic Data | Yahoo Finance API & FRED API via Vercel Edge Runtime Proxy (Zero-Trust + smart edge caching) |
| Deployment | Vercel (Edge Runtime Functions + static CDN) |
| Testing | Vitest 4 · React Testing Library · Playwright E2E · JSDOM |
| Linting | ESLint 9 with TypeScript ESLint + React Hooks + React Refresh + Tailwind CSS plugin |

---

## Project Structure

```
portfolio-bridge/
├── api/                        # Vercel Edge Runtime Functions (API proxies)
│   ├── fred.ts                 # FRED API proxy (Series whitelist, timeout guard, 1-day edge cache)
│   ├── health.ts               # Health check endpoint (no-cache, uptime & status metadata)
│   ├── proxy.ts                # Yahoo Finance proxy (cookie/crumb auth, timeout guard, smart edge cache)
│   └── tsconfig.json           # TS config for serverless/edge API
├── src/                        # React SPA source
│   ├── main.tsx                # App entry point (QueryProvider & Fontsource imports)
│   ├── App.tsx                 # Root component (Lazy routes & Suspense fallback)
│   ├── style.css               # Global styles (Tailwind v4 @theme, micro typography, card aspect)
│   ├── vite-env.d.ts           # Vite client type declarations
│   ├── components/             # Reusable UI components
│   │   ├── assets/             # Asset management components & modals
│   │   ├── common/             # Shared primitives (Button, Card, Modal, Input, CustomSelect, MultiSelect, etc.)
│   │   ├── dashboard/          # Dashboard analytics & charts (KPI, PnL, Exposure, Rebalance, etc.)
│   │   ├── fire/               # FIRE planner components (FireChart, FireInputForm, FireResultCard)
│   │   ├── gurus/              # Guru investment framework analyzers & cards (Buffett, Lynch, Graham, etc.)
│   │   ├── layout/             # Layout shell (Header, BottomNav, Layout, ScrollToTop)
│   │   └── settings/           # Settings view sections (Profile, Display, DataRefresh, DataManagement)
│   ├── constants/              # App-wide constants (fx, storage keys, thresholds)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAnalyzer.ts      # Guru investment analyzer logic
│   │   ├── useBuffettIndicator.ts # Buffett indicator FRED/Yahoo data logic
│   │   ├── useDataRefresh.ts   # Price & FX auto-refresh trigger on startup
│   │   ├── useExchangeRates.ts # FX rate fetching hook
│   │   ├── useGoogleDrive.ts   # Google Drive backup/restore hook
│   │   ├── usePortfolio.ts     # Portfolio aggregation & metric calculations
│   │   ├── usePortfolioSnapshot.ts # Portfolio snapshot comparison hook
│   │   ├── usePriceRefresh.ts  # Quote batch refreshing
│   │   ├── useT.ts             # i18n translation hook
│   │   ├── useTickerSearch.ts  # Yahoo search hook with debounce
│   │   └── index.ts
│   ├── i18n/                   # Translation files per locale
│   │   ├── en.ts, ko.ts, ja.ts, de.ts
│   │   ├── types.ts            # TranslationKeys type
│   │   └── index.ts
│   ├── pages/                  # Top-level route components (Code-split with React.lazy)
│   │   ├── Dashboard.tsx       # Main portfolio overview
│   │   ├── Assets.tsx          # Asset inventory & manual/CSV/AI entry
│   │   ├── Gurus.tsx           # Guru philosophy matching & analyzers
│   │   ├── FirePlanner.tsx     # Financial Independence / Early Retirement simulator
│   │   ├── Settings.tsx        # App settings & Google Drive sync
│   │   └── About.tsx           # About & privacy declaration
│   ├── providers/              # React context & query providers
│   │   └── QueryProvider.tsx   # TanStack Query Client provider
│   ├── stores/                 # Zustand stores with granular selectors (persisted to localStorage)
│   │   ├── useAssetStore.ts
│   │   ├── useBrokerStore.ts
│   │   ├── useFireStore.ts
│   │   ├── useGoogleDriveStore.ts
│   │   ├── useGuruSessionStore.ts
│   │   ├── useLanguageStore.ts
│   │   ├── useProfileStore.ts
│   │   ├── useSettingsStore.ts
│   │   ├── useSnapshotStore.ts
│   │   └── index.ts
│   ├── tests/                  # Automated test suites
│   │   ├── e2e/                # Playwright end-to-end tests (home.spec.ts)
│   │   ├── setup.ts            # Vitest testing setup (jest-dom extensions)
│   │   └── unit/               # Vitest unit & component tests
│   ├── types/                  # TypeScript type definitions
│   │   ├── asset.ts, currency.ts, portfolio.ts
│   │   └── index.ts
│   └── utils/                  # Pure utility functions
│       ├── ai/                 # AI prompt generation (Guru evaluation & classification)
│       ├── analyzers/          # Quantitative investment analyzers (Graham, Lynch, Piotroski, etc.)
│       ├── calc/               # Portfolio, currency conversion, FIRE, & insight calculations
│       ├── gdrive/             # Google Drive backup/restore service integration
│       ├── yahoo/              # Yahoo Finance API client (Quotes, FX, Fundamentals, Search)
│       ├── cn.ts               # Tailwind class merging utility (clsx + tailwind-merge)
│       ├── csv.ts              # CSV import/export utilities
│       ├── gurus.ts            # Guru master profiles & rules
│       ├── sampleData.ts       # Onboarding sample portfolio
│       └── index.ts
├── public/                     # Static assets
├── index.html                  # Vite HTML entry
├── vite.config.ts              # Vite config (dev API proxy plugin, image optimizer, bundle splitting)
├── vitest.config.ts            # Vitest test configuration
├── playwright.config.ts        # Playwright E2E configuration
├── eslint.config.js            # ESLint flat config
├── cspell.json                 # Spell checker configuration
├── tsconfig.json               # Root TypeScript config
├── tsconfig.app.json           # App-specific TS config
├── tsconfig.node.json          # Node/Vite tooling TS config
├── vercel.json                 # Vercel routing, Edge Function rewrites, & SPA fallback
└── package.json
```

---

## How to Build, Run and Test

### Prerequisites

- Node.js 18+

### Web App

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Type-check + production build (output: dist/)
npm run build

# Preview production build locally
npm run preview
```

### Automated Testing

```bash
# Run unit & component tests (Vitest)
npx vitest run

# Run unit tests in watch mode
npx vitest

# Run E2E tests (Playwright)
npx playwright test
```

### Lint

```bash
npm run lint
```

---

## Testing Conventions

- **Unit & Component Testing (Vitest + React Testing Library)**:
  - Place unit tests under `src/tests/unit/`.
  - Validate core calculation logic (`calculations.ts`, `currency.ts`, `fire.ts`), custom hooks, and isolated UI components (e.g. `KpiBar.test.tsx`).
- **E2E Testing (Playwright)**:
  - Place E2E test specs under `src/tests/e2e/`.
  - Validate critical user flows: page navigation, asset creation/editing, and responsive layout integrity.

---

## Coding Conventions

### Language and Types

- All source files use **TypeScript** with strict settings.
- Use `interface` for object shapes, `type` for unions/intersections/aliases.
- Export types from `types/index.ts`; export utilities from `utils/index.ts`; export hooks from `hooks/index.ts`; export stores from `stores/index.ts`.
- Use the `@/` path alias (maps to `src/`) for all internal imports.

### React Components & Pages

- Use **functional components** with hooks only (no class components).
- One component per file, named with PascalCase matching the file name.
- Place reusable primitives in `src/components/common/`, feature-specific components in their respective subdirectory under `src/components/`.
- Page-level route components live in `src/pages/` and are dynamically loaded with `React.lazy` and `Suspense` in `src/App.tsx`.
- Layout uses a responsive Top Header + Bottom Navigation Bar pattern (`Header.tsx` + `BottomNav.tsx`).

### State Management & Data Fetching

- **Client State**: Global application state lives in Zustand stores under `src/stores/` using `persist` middleware for `localStorage` persistence. Store files follow `use<Domain>Store.ts`.
- **Granular Selectors**: Always subscribe to state with granular selector functions (e.g. `const baseCurrency = useSettingsStore((s) => s.baseCurrency);`) instead of whole-store destructuring to prevent unnecessary component re-renders.
- **Async Server State**: TanStack Query (`@tanstack/react-query`) is initialized in `src/providers/QueryProvider.tsx` for caching and managing async server state.
- Always use `STORAGE_KEYS` constants (from `src/constants/`) as the `name` in Zustand `persist` options.

### Styling

- Use **Tailwind CSS v4** utility classes exclusively; avoid inline `style` props unless computing purely dynamic values.
- Global base styles and Tailwind v4 `@theme` tokens (micro typography `text-4xs`, `text-3xs`, `text-2xs`, `text-xs-plus`, aspect ratio `aspect-card`) live in `src/style.css`.
- Merge component class names safely using `@/utils/cn` (`tailwind-merge` + `clsx`).

### i18n

- All user-visible strings must be translated. Use the `useT()` hook to access the `t()` translation function.
- Translation keys are typed in `src/i18n/types.ts` (`TranslationKeys`).
- Translation files live in `src/i18n/` (one per locale: `en.ts`, `ko.ts`, `ja.ts`, `de.ts`).
- When adding new strings, add the key to **all four** locale files.
- Guru philosophy translations must keep a strict 6-line structure (5 principle bullets + 1 quote bullet).
- AI-facing prompt text must always be generated in **English**, regardless of the active UI language.

### Yahoo Finance & FRED Data Fetching

- All Yahoo Finance requests go through `yahooCore.ts` (`yahooFetch()`), which auto-detects the runtime:
  - **Local dev**: Vite dev API proxy at `/api/yahoo/…` (configured in `vite.config.ts` with cookie/crumb auth handling & timeout protection)
  - **Vercel**: Vercel Edge Runtime proxy (`api/proxy.ts`) with smart edge caching (`chart`: 5m, `quoteSummary`/`search`: 1m, realtime: 15s)
- FRED economic series requests go through `api/fred.ts` proxy to bypass CORS with series whitelist validation & 1-day edge caching.
- Never call external market APIs directly from browser components without going through the proxy layer.

### Vercel API Routes (`api/`)

- Each file in `api/` is a **Vercel Edge Runtime Function** (`export const config = { runtime: "edge" };`).
- Follow **Zero-Trust Input Validation**: reject disallowed HTTP methods with `405 Method Not Allowed` (`Allow` header), validate paths and query parameters with strict regex.
- Apply **Resilience & Timeout Protection**: use `AbortSignal.timeout(10_000)` on all upstream fetch operations.
- Apply **Smart Edge Caching**: set appropriate `Cache-Control` (`s-maxage`, `stale-while-revalidate`) headers to protect against rate limits and optimize response latency.

### File and Naming Conventions

- Files: `camelCase.ts` for utilities/hooks/stores, `PascalCase.tsx` for components/pages.
- Constants: `UPPER_SNAKE_CASE`.
- Hooks: prefixed with `use` (e.g., `usePortfolio`).
- Stores: `use<Domain>Store` pattern.
- Keep barrel exports (`index.ts`) up to date when adding new exports to a directory.

### ESLint

The project uses ESLint 9 flat config (`eslint.config.js`) with:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` (enforces Rules of Hooks)
- `eslint-plugin-react-refresh` (Vite fast refresh compatibility)
- `eslint-plugin-tailwindcss` (Tailwind CSS class validation and sorting)

Run `npm run lint` before committing. Fix all reported errors; warnings should be addressed where practical.

---