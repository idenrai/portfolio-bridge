---
applyTo: "**"
description: "Mandatory post-implementation workflow: doc update, build verification, commit, and push after every code change."
---

# Mandatory Post-Implementation Workflow

After **every** implementation task — no exceptions, no matter how small — execute these steps in order before considering the task complete.

## Step 1: Update Design Documentation

1. Open `.github/doc-map.yml`
2. For **each file you modified**, find all matching entries in `mappings`
3. Open the corresponding `doc` file(s) and update to reflect your changes:
   - New field / component / behavior → add to the relevant section
   - Changed behavior → update the existing description
   - Removed feature → remove or mark deprecated
4. If no pattern in `doc-map.yml` matches the modified file, update `doc/overview.md`

> Pure bug fixes with no user-visible behavioral change: update the doc only if the fix reveals that a spec was incorrect.

## Markdown Style Rules

All documentation files under `doc/` and `README.md` must comply with markdownlint
(root config: `.markdownlint.json`, doc-specific: `doc/.markdownlint.json`).
Apply these rules when writing or updating any doc file:

### Bilingual Requirement / 이중 언어 필수

Every doc file must be written in **both English and Korean**.
Use the following inline bilingual convention throughout:

```markdown
Section body in English.

한국어 설명을 바로 이어서 작성합니다.
```

- Section headings: English only (for anchor consistency with code references).
- Each descriptive paragraph: English first, Korean immediately after (same section, no extra heading).
- Tables: header row in English; add a brief Korean caption line above the table if the purpose is not obvious.
- Code blocks and file/symbol names: always English only.

모든 doc 파일은 **영어와 한국어** 두 언어로 작성해야 합니다.
위 규칙에 따라 영어 단락 바로 다음에 한국어 번역을 이어서 씁니다.
섹션 제목은 영어만 사용하고, 코드·파일명은 항상 영어만 사용합니다.

- Surround every heading with a blank line above and below (MD022).
- Surround every fenced code block with a blank line above and below (MD031).
- Surround every list with a blank line above and below (MD032).
- Surround every table with a blank line above and below (MD058).
- Use a single H1 (`#`) per file — do not skip heading levels (MD001, MD025).
- No trailing spaces — use a blank line to separate paragraphs instead of `  ` (MD009).
- No multiple consecutive blank lines (MD012).
- No bare URLs — always wrap in angle brackets or use link syntax (MD034).

## Step 2: Verify Build

```bash
npm run build
```

Fix all TypeScript or Vite errors before proceeding. Re-run to confirm zero errors.

## Step 3: Commit and Push

```bash
git add -A && git commit -m "<type>: <short description>" && git push
```

Conventional commit types: `feat:` · `fix:` · `refactor:` · `style:` · `chore:` · `docs:`

## Summary (single command after doc update)

```bash
npm run build && git add -A && git commit -m "<type>: <short description>" && git push
```

## When multiple agents apply

Apply agents in this order:
1. `component-creator` first
2. `i18n-sync` second
3. `build-guard` last (always runs before commit)

## This rule overrides brevity

Even a single-line fix requires: **doc check → build → commit → push**.
Do NOT skip any step to save time or reduce verbosity.
