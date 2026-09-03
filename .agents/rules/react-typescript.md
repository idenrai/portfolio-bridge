---
applyTo: "src/**/*.{ts,tsx}"
---

# React · TypeScript Coding Standards

## TypeScript

- Enable and respect strict mode (`"strict": true` in `tsconfig.app.json`).
- Use `interface` for object shapes; use `type` for unions, intersections, and aliases.
- Follow type-safe idioms and advanced typing patterns from `.agents/skills/typescript-advanced-types/SKILL.md` (generics, conditional/mapped types, type guards) and `.agents/skills/typescript-best-practices/SKILL.md` (discriminated unions, exhaustive switch checks, branded types).
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
- Global base styles go in `src/style.css` using Tailwind directives (`@import "tailwindcss"`).
- When conditionally joining Tailwind classes, use the `cn()` utility (`import { cn } from "@/utils/cn"`) which leverages `clsx` and `tailwind-merge` to prevent class conflicts.
- **Tailwind Linting**: `eslint-plugin-tailwindcss` is configured. Always run `npm run lint -- --fix` before committing to auto-sort classes and remove duplicates.

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

## Fail-Fast & Testing Pipeline (크레딧 & 에러 방지 필수 규칙)

- **검증 실행 순서 (Fail-Fast, Fail-Cheap 원칙)**:
  1. `npx tsc --noEmit`: 코드/컴포넌트 수정 후 **가장 먼저** 실행하여 Props 불일치, 타입 에러, 오타를 1초 내에 전수 검출한다. (이 단계 통과 전 Playwright 실행 금지!)
  2. `npm run lint`: Hook 의존성 및 린트 검사.
  3. `npx vitest run`: 비즈니스 로직 및 계산 함수 검증.
  4. `npx playwright test`: 최종 E2E 플로우 단 1회 클린 실행.
- **Playwright E2E 스토리지 모킹**:
  - 테스트 작성 시 반드시 `src/tests/e2e/helpers/mockStorage.ts`의 `setupTestPortfolio(page, options)`를 사용하여 Zustand persist 규약(`{ state, version: 0 }`)과 언어 설정을 주입한다.
- **E2E 로케이터 스코핑**:
  - 모달이나 특정 섹션 내부 요소를 조회할 때는 `page.getByRole('dialog')` 등으로 범위를 한정하여 Strict Mode 위반(중복 요소 에러)을 방지한다.

