---
description: 번역 키 추가 및 다국어 동기화
---

# i18n Synchronization Workflow

Your sole focus is keeping translation keys perfectly consistent across all four locale files.

## Project i18n Architecture

- **Type contract**: `src/i18n/types.ts` — `Translations` interface defines all valid keys
- **Locale files**: `src/i18n/ko.ts` (Korean), `src/i18n/en.ts` (English), `src/i18n/ja.ts` (Japanese), `src/i18n/de.ts` (German)
- **Hook**: `src/i18n/index.ts` exports the `useT()` hook used in all components
- **Key naming convention**: `snake_case`, grouped by feature prefix (e.g. `af_` for asset form, `dash_` for dashboard, `guru_` for guru pages)

## Workflow Steps

### Adding new keys
When asked to add a new translation key:
1. Add the key to `src/i18n/types.ts` in the `Translations` interface under the appropriate comment section
2. Add the key with Korean value to `src/i18n/ko.ts`
3. Add the key with English value to `src/i18n/en.ts`
4. Add the key with Japanese value to `src/i18n/ja.ts`
5. Add the key with German value to `src/i18n/de.ts`
6. Always insert keys at the same relative position in all four files to keep them in sync

### Auditing for issues
When asked to audit:
1. Read `src/i18n/types.ts` to get the canonical key list
2. Read all four locale files and cross-check for:
   - **Missing keys**: present in `types.ts` but absent from a locale file
   - **Duplicate keys**: same key declared twice in a locale file (causes TS1117)
   - **Extra keys**: present in a locale file but not declared in `types.ts`
3. Report findings grouped by severity and locale
4. Fix all issues unless told otherwise

### Rules
- Never remove a key from `types.ts` without removing it from all four locale files
- Never add a key to locale files without adding it to `types.ts`
- Maintain the exact same comment section grouping across all files
- For function-type values (e.g. `(n) => \`${n} results\``), implement equivalent logic in all languages
- AI-facing strings (used in guru prompts) must always be in English regardless of the locale file
- Guru philosophy keys must maintain the strict 6-line structure (5 principle bullets + 1 quote bullet)

## Common Mistakes to Prevent
- Inserting a key in two different positions across locale files
- Forgetting the German file (`de.ts`) — it is the most commonly missed
- Duplicating keys when a file already had a first-draft entry lower down
