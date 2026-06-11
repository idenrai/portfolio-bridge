# Component Scaffolding Workflow

Follow these steps when creating a new component, page, hook, or store to ensure it aligns with project conventions.

## 1. File placement & naming
- Reusable primitive: `src/components/common/PascalCase.tsx`
- Feature component: `src/components/<feature>/PascalCase.tsx`
- Page (route): `src/pages/PascalCase.tsx`
- Custom hook: `src/hooks/useCamelCase.ts`
- Zustand store: `src/stores/use<Domain>Store.ts`
- Utility function: `src/utils/camelCase.ts`

## 2. Component Structure
- Functional components only.
- Tailwind CSS v4 utility classes only. No inline styles.
- Use `@/` for imports.

## 3. i18n Scaffold Requirement
If the component contains user-visible strings:
1. Identify all string keys needed.
2. Add them to `src/i18n/types.ts`.
3. Add translations to all four locale files (`ko.ts`, `en.ts`, `ja.ts`, `de.ts`) in the exact same relative position.

## 4. Barrel Exports
- After creating a new file, update the `index.ts` in the same directory (e.g., `export { MyComponent } from "./MyComponent";`).
