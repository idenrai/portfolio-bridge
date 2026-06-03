# Copilot Instructions for Portfolio Bridge

## Project Overview

Portfolio Bridge is a **privacy-first portfolio management web app** that lets users manage multi-country financial assets (Korea · Japan · US · Germany) in one dashboard. All data is stored in browser `localStorage` only — never sent to external servers. Market data is fetched client-side via proxy from Yahoo Finance.

The app runs as:
- A **React SPA** served locally via Vite or deployed to Vercel
- A **native desktop app** (macOS / Windows) built with Tauri v2

---

## Tech Stack

| Area | Technology |
|------|------------|
| Frontend | React 19 · TypeScript · Vite 7 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 (with `localStorage` persist middleware) |
| Charts | Recharts |
| Routing | React Router v7 |
| i18n | Custom (ko / en / ja / de) |
| Market Data | Yahoo Finance API via proxy |
| Desktop | Tauri v2 (Rust) + `tauri-plugin-http` |
| Deployment | Vercel (Serverless Functions + static CDN) |
| Linting | ESLint 9 with TypeScript ESLint + React Hooks plugin |

---

## Project Structure

```
portfolio-bridge/
├── api/                        # Vercel Serverless Functions (Yahoo Finance proxy)
│   ├── fred.ts                 # FRED API proxy
│   ├── health.ts               # Health check endpoint
│   └── proxy.ts                # Generic proxy helper
├── src/                        # React SPA source
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Root component with routing
│   ├── index.css               # Global styles (Tailwind directives)
│   ├── components/             # Reusable UI components
│   │   ├── assets/             # Asset-related components
│   │   ├── common/             # Shared primitives (Button, Card, Modal)
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── gurus/              # Guru-specific components
│   │   └── layout/             # Layout shell (Header, Sidebar, BottomNav, Layout)
│   ├── constants/              # App-wide constants (storage keys, thresholds, etc.)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAnalyzer.ts      # Investment analyzer logic
│   │   ├── useBuffettIndicator.ts
│   │   ├── useDataRefresh.ts   # Triggers price/FX refresh on startup
│   │   ├── useExchangeRates.ts
│   │   ├── useGoogleDrive.ts
│   │   ├── usePortfolio.ts     # Portfolio aggregation calculations
│   │   ├── usePriceRefresh.ts
│   │   ├── useT.ts             # i18n translation hook
│   │   └── useTickerSearch.ts
│   ├── i18n/                   # Translation files per locale
│   │   ├── en.ts, ko.ts, ja.ts, de.ts
│   │   ├── types.ts            # TranslationKeys type
│   │   └── index.ts
│   ├── pages/                  # Top-level route components
│   │   ├── Dashboard.tsx
│   │   ├── Assets.tsx
│   │   ├── Gurus.tsx
│   │   ├── Settings.tsx
│   │   └── About.tsx
│   ├── stores/                 # Zustand stores (all persist to localStorage)
│   │   ├── useAssetStore.ts
│   │   ├── useBrokerStore.ts
│   │   ├── useGoogleDriveStore.ts
│   │   ├── useGuruSessionStore.ts
│   │   ├── useLanguageStore.ts
│   │   ├── useProfileStore.ts
│   │   ├── useSettingsStore.ts
│   │   └── useSnapshotStore.ts
│   ├── types/                  # TypeScript type definitions
│   │   ├── asset.ts, currency.ts, portfolio.ts
│   │   └── index.ts
│   └── utils/                  # Pure utility functions
│       ├── ai/                 # AI prompt generation helpers
│       ├── analyzers/          # Quantitative investment analyzers
│       ├── calc/               # Portfolio calculation utilities
│       ├── gdrive/             # Google Drive integration helpers
│       ├── yahoo/              # Yahoo Finance API client
│       │   ├── yahooCore.ts    # Core fetch with runtime detection
│       │   ├── yahooFinance.ts
│       │   ├── yahooFundamentals.ts
│       │   ├── yahooFx.ts
│       │   ├── yahooQuote.ts
│       │   └── yahooSearch.ts
│       ├── csv.ts              # CSV import/export
│       ├── fx.ts               # FX rate helpers
│       ├── gurus.ts            # Guru data definitions
│       ├── sampleData.ts       # Onboarding sample portfolio
│       └── storage.ts          # localStorage helpers
├── src-tauri/                  # Tauri (Rust) desktop app
│   ├── src/
│   │   ├── main.rs             # Tauri entry point
│   │   └── lib.rs              # Tauri command handlers
│   ├── Cargo.toml
│   ├── tauri.conf.json         # Tauri app configuration
│   └── capabilities/          # Tauri capability permissions
├── public/                     # Static assets
├── index.html                  # Vite HTML entry
├── vite.config.ts              # Vite config (Yahoo Finance proxy plugin for dev)
├── eslint.config.js            # ESLint flat config
├── tsconfig.json               # Root TypeScript config
├── tsconfig.app.json           # App-specific TS config
├── tsconfig.node.json          # Node/Vite tooling TS config
├── vercel.json                 # Vercel routing and SPA fallback rules
└── package.json
```

---

## How to Build and Run

### Prerequisites

- Node.js 18+
- (Desktop only) Rust 1.77.2+, plus OS-specific Tauri requirements

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

### Desktop App (Tauri)

```bash
# Dev mode: Vite HMR + native window
npm run tauri:dev

# Production build (native installer for the current OS)
npm run tauri:build
```

Desktop build outputs:
- macOS: `src-tauri/target/release/bundle/dmg/` (`.app`, `.dmg`)
- Windows: `src-tauri/target/release/bundle/nsis/` (`.exe`) and `.../msi/` (`.msi`)

> Tauri does not support cross-compilation — build on the target OS.

### Lint

```bash
npm run lint
```

---

## Testing

There is no automated test suite in this repository at this time. All verification is done manually via the dev server or Tauri dev mode.

---

## Coding Conventions

### Language and Types

- All source files use **TypeScript** with strict settings.
- Use `interface` for object shapes, `type` for unions/intersections/aliases.
- Export types from `types/index.ts`; export utilities from `utils/index.ts`; export hooks from `hooks/index.ts`.
- Use the `@/` path alias (maps to `src/`) for all internal imports.

### React Components

- Use **functional components** with hooks only (no class components).
- One component per file, named with PascalCase matching the file name.
- Place reusable primitives in `src/components/common/`, feature-specific components in their respective subdirectory under `src/components/`.
- Page-level route components live in `src/pages/`.

### State Management (Zustand)

- All global state lives in Zustand stores under `src/stores/`.
- Each store uses the `persist` middleware to sync to `localStorage`.
- Store files are named `use<Domain>Store.ts`.
- Store state interface and `create` call are both defined in the same file.
- Always use `STORAGE_KEYS` constants (from `src/constants/`) as the `name` in `persist` options.

### Styling

- Use **Tailwind CSS v4** utility classes exclusively; no CSS Modules or inline `style` props unless absolutely necessary.
- Global base styles go in `src/index.css` using Tailwind directives.

### i18n

- All user-visible strings must be translated. Use the `useT()` hook to access the `t()` translation function.
- Translation keys are typed in `src/i18n/types.ts` (`TranslationKeys`).
- Translation files live in `src/i18n/` (one per locale: `en.ts`, `ko.ts`, `ja.ts`, `de.ts`).
- When adding new strings, add the key to **all four** locale files.
- Guru philosophy translations must keep a strict 6-line structure (5 principle bullets + 1 quote bullet).
- AI-facing prompt text must always be generated in **English**, regardless of the active UI language.

### Yahoo Finance / Data Fetching

- All Yahoo Finance requests go through `yahooCore.ts` (`yahooFetch()`), which auto-detects the runtime:
  - **Local dev**: Vite proxy at `/api/yahoo/…`
  - **Vercel**: Serverless function proxy
  - **Tauri**: Direct request via `tauri-plugin-http`
- Never call `fetch()` directly against Yahoo Finance URLs from React components.

### Vercel API Routes (`api/`)

- Each file in `api/` is a Vercel Serverless Function.
- Keep each function small and focused — proxy logic only.

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

Run `npm run lint` before committing. Fix all reported errors; warnings should be addressed where practical.
