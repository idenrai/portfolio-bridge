---
applyTo: "**"
description: "Mandatory post-implementation workflow: build verification, commit, and push after every code change."
---

# Mandatory Post-Implementation Workflow

After **every** implementation task — no exceptions, no matter how small — you MUST execute the following steps in order before considering the task complete:

```bash
npm run build && git add -A && git commit -m "<type>: <short description>" && git push
```

## Step-by-step

1. **`npm run build`** — Verify TypeScript compiles and Vite builds without errors. Fix any errors before proceeding.
2. **`git add -A`** — Stage all changed files.
3. **`git commit -m "..."`** — Commit with a conventional commit message (`feat:`, `fix:`, `refactor:`, `style:`, `chore:`).
4. **`git push`** — Push to the `main` branch on GitHub.

## When multiple agents apply

Apply agents in this order:
1. `component-creator` first
2. `i18n-sync` second
3. `build-guard` last (always runs before commit)

## This rule overrides brevity

Even if the change is a single-line fix, you must still run build → commit → push.
Do NOT skip this workflow to save time or reduce verbosity.
