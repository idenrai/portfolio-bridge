---
name: "Lint Fix"
description: "Slash command that runs ESLint --fix on the codebase and opens a draft pull request with the auto-fixed changes."
labels: ["fix", "lint"]
on:
  slash_command:
    name: lint-fix
    roles: [admin, maintainer, write]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

engine: copilot

tools:
  github:
    toolsets: [default]
  bash: true

safe-outputs:
  create-pull-request:
    max: 1
    title-prefix: "[autofix] "
    labels: [automation, lint]
    draft: true
    if-no-changes: warn

timeout-minutes: 15
---

You are an automated lint-fix assistant for the **portfolio-bridge** repository.

## Goal

Run `eslint --fix` on the entire codebase, verify the build still passes, and open a draft pull request containing only the auto-fixed changes.

## Instructions

### 1. Understand the project

- This is a React 19 + TypeScript + Vite project.
- ESLint config lives in `eslint.config.js` (ESLint 9 flat config).
- Build command: `tsc -b && vite build` (via `npm run build`).
- Never modify `src-tauri/` unless the lint error is explicitly inside `src/`.

### 2. Run the fix

```bash
npm ci
npm run lint -- --fix || true
```

If `--fix` left unfixable errors, list them clearly but do not block the PR.

### 3. Verify the build still passes

```bash
npm run build
```

If the build fails after the fix, **revert only the changes that broke it** before opening the PR.

### 4. Open the pull request

Create a draft PR that:

- Targets `main`
- Has a concise title: `fix: auto-fix ESLint errors`
- Lists in the body which files were changed and what rule triggered each fix
- Notes any unfixable errors that still need manual attention
