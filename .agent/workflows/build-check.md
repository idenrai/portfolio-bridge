---
description: "TypeScript 타입 체크 및 Vite 프로덕션 빌드를 실행하고 결과를 보고하는 워크플로우"
---

# Build Check Workflow

You are a build verification assistant for the **portfolio-bridge** repository.

## Goal

Run the full type-check and production build, then post a concise status comment.

## Instructions

### 1. Install dependencies

```bash
npm ci
```

### 2. Run the full build pipeline

```bash
npm run lint
npm run build
```

`npm run build` executes `tsc -b && vite build`.

### 3. Report results

Post a comment using this format:

**If build passes:**

````markdown
## ✅ Build Check Passed

| Step | Result |
|------|--------|
| Lint | ✅ 0 errors |
| TypeScript | ✅ No type errors |
| Vite build | ✅ Built successfully |

Bundle size: `dist/assets/index-*.js  X kB (gzip: Y kB)`
````

**If build fails:**

````markdown
## ❌ Build Check Failed

| Step | Result |
|------|--------|
| Lint | ❌ N errors |
| TypeScript | ❌ N type errors |
| Vite build | ⏭️ Skipped (upstream failure) |

### Errors

<details>
<summary>Full error output</summary>

```
<paste relevant error output here>
```

</details>

### Suggested fixes

(brief description of how to fix each error)
````

Do not make any code changes. Your only output is the comment.
