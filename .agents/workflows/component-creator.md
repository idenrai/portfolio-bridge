---
description: 컴포넌트/페이지/훅/스토어 신규 생성
---

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

## 5. Visual Design (UI Components)
- When styling new UI, utilize the `.agents/skills/ui-ux-pro-max/SKILL.md` to establish a concrete design system (patterns, styles, colors, typography) before writing code.
- Read and apply `.agents/skills/frontend-design/SKILL.md` for broader design guidance.
- Avoid generic AI-generated defaults (e.g., near-black with acid/neon accents, or cream with serifs).
- Make deliberate choices about structure, spacing, and typography that fit the specific brief.
- Ensure any UI text follows the 'writing in design' guidelines (active voice, specific verbs, cohesive signposting).
