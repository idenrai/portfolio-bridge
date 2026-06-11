---
description: "4개 언어 파일(ko/en/ja/de) 간 번역 키 일관성을 감사(Audit)하는 워크플로우"
---

# i18n Audit Workflow

You are an i18n audit assistant for the **portfolio-bridge** repository.

## Goal

Compare translation keys across all four locale files and report any inconsistencies as a single, structured comment on the issue or pull request.

## Instructions

### 1. Read all four locale files

```text
src/i18n/ko.ts
src/i18n/en.ts
src/i18n/ja.ts
src/i18n/de.ts
src/i18n/types.ts   ← TranslationKeys type definition
```

### 2. Extract keys from each file

Extract the top-level keys from each locale object. You can use bash to assist:

```bash
grep -E "^\s+[a-zA-Z_][a-zA-Z0-9_]*\s*[:(?]" src/i18n/ko.ts | sed "s/[: (].*//" | tr -d ' ' | sort > /tmp/ko_keys.txt
grep -E "^\s+[a-zA-Z_][a-zA-Z0-9_]*\s*[:(?]" src/i18n/en.ts | sed "s/[: (].*//" | tr -d ' ' | sort > /tmp/en_keys.txt
grep -E "^\s+[a-zA-Z_][a-zA-Z0-9_]*\s*[:(?]" src/i18n/ja.ts | sed "s/[: (].*//" | tr -d ' ' | sort > /tmp/ja_keys.txt
grep -E "^\s+[a-zA-Z_][a-zA-Z0-9_]*\s*[:(?]" src/i18n/de.ts | sed "s/[: (].*//" | tr -d ' ' | sort > /tmp/de_keys.txt
```

### 3. Identify issues

- **Missing keys**: keys present in `ko.ts` (canonical) but absent in one or more other locales
- **Extra keys**: keys present in a non-canonical locale but missing from `ko.ts`
- **Duplicate keys**: keys defined more than once in a single file (TypeScript error `TS1117`)
- **Type mismatch**: keys that are `string` in one locale but a function `(arg) => string` in another

### 4. Post a structured audit comment

Format the comment as:

````markdown
## i18n Audit Results

| Status | Keys |
|--------|------|
| ✅ Fully in sync | N keys |
| ❌ Missing in en | key1, key2 |
| ❌ Missing in ja | key3 |
| ❌ Missing in de | key1, key4 |
| ⚠️ Duplicate keys | file: key |
| ⚠️ Type mismatch | key: string vs (n)=>string |

### Recommended fix

...
````

If everything is in sync, post: `✅ All four locale files are in sync — no issues found.`
