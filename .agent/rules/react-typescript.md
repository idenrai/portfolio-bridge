---
applyTo: "src/**/*.{ts,tsx}"
---

# React · TypeScript Coding Standards

## TypeScript

- Enable and respect strict mode (`"strict": true` in `tsconfig.app.json`).
- Use `interface` for object shapes; use `type` for unions, intersections, and aliases.
- Export shared types from `src/types/index.ts`; utilities from `src/utils/index.ts`; hooks from `src/hooks/index.ts`.
- Always use the `@/` path alias (maps to `src/`) for internal imports — never use relative `../` chains more than one level deep.

## React Components

- Use **functional components** with hooks only. No class components.
- One component per file, named with PascalCase matching the file name.
- Page-level route components live in `src/pages/`.
- Reusable primitives go in `src/components/common/`; feature-specific components in their subdirectory under `src/components/`.
- Extract expensive calculations into `useMemo`/`useCallback` only when profiling confirms a bottleneck — do not pre-optimise.
- Keep component files focused: split into sub-components once a file exceeds ~200 lines.

## Zustand State Management

- All global state must live in a Zustand store under `src/stores/`.
- Every store must use the `persist` middleware to sync to `localStorage`.
- Use a constant from `src/constants/storage.ts` (`STORAGE_KEYS`) as the `name` field in `persist` options.
- Store files are named `use<Domain>Store.ts` and export a single `use<Domain>Store` hook.

**Template structure:**
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

interface MyState {
  foo: string;
  setFoo: (value: string) => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      foo: "default",
      setFoo: (value) => set({ foo: value }),
    }),
    { name: STORAGE_KEYS.MY_KEY }
  )
);
```

## Styling

- Use **Tailwind CSS v4** utility classes exclusively.
- No CSS Modules, no inline `style` props, no `styled-components`.
- Global base styles go in `src/index.css` using Tailwind directives (`@import "tailwindcss"`).

## Internationalisation (i18n)

- All user-visible strings **must** be translated. Use the `useT()` hook to get the `t()` function.
- Translation keys are typed in `src/i18n/types.ts` (`TranslationKeys`).
- When adding new strings, add the key to **all four** locale files: `ko.ts`, `en.ts`, `ja.ts`, `de.ts`.
- AI-facing prompt text must always be generated in **English** regardless of the active UI language.

## Data Fetching (Yahoo Finance)

- All Yahoo Finance requests **must** go through `yahooFetch()` from `src/utils/yahoo/yahooCore.ts`.
- Never call `fetch()` directly against `query1.finance.yahoo.com` or `query2.finance.yahoo.com` in components or hooks.
- `yahooFetch()` auto-detects the runtime (Vite dev proxy / Vercel serverless / Tauri HTTP plugin).

## Custom Hooks

- Name custom hooks with the `use` prefix.
- A hook that calls an external API must handle loading and error states explicitly.
- Hooks that fetch data on mount must be safe to call multiple times without side-effects (idempotent).
