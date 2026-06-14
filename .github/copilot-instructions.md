# Portfolio Bridge Copilot Instructions

Portfolio Bridge is a privacy-first portfolio management web app (React SPA & Tauri Desktop).

## 🚀 Core Rules & Conventions

You MUST follow these rules when generating or editing code:

1. **Tech Stack:**
   - React 19, TypeScript, Vite 7, Tailwind CSS v4, Zustand 5, React Router v7.

2. **React Components:**
   - Functional components only. No class components.
   - Use Tailwind CSS v4 exclusively. **Never use inline `style={{}}`**.
   - Path alias: Use `@/` for all `src/` imports. Never use `../` more than one level deep.

3. **State Management (Zustand):**
   - All global state must use Zustand in `src/stores/use<Domain>Store.ts`.
   - Must use `persist` middleware to `localStorage`.
   - Always use `STORAGE_KEYS` from `src/constants/storage.ts` for the `name` field.

4. **Data Fetching (Yahoo Finance):**
   - **Never call `fetch()` directly** against Yahoo Finance URLs.
   - Always use `yahooFetch()` from `src/utils/yahoo/yahooCore.ts`.

5. **Internationalisation (i18n):**
   - Never hardcode user-visible strings.
   - Always use `const t = useT()` from `@/hooks/useT`.
   - Update all 4 locale files (`ko.ts`, `en.ts`, `ja.ts`, `de.ts`) and `types.ts` when adding strings.
   - AI-facing prompt text must be in English.

6. **Agent Workflows:**
   - For detailed workflows, read the corresponding agent files in the workspace (e.g., `.agents/rules/agent-component-creator.md`).
