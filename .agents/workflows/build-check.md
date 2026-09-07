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

사용자에게 보고할 때는 아래 한국어 형식을 준수하세요:

**빌드 통과 시:**

````markdown
## ✅ 빌드 및 품질 검증 통과

| 검증 항목 | 결과 |
|---|:---:|
| 린트 검사 (`npm run lint`) | ✅ 0 errors |
| 타입 검증 (`npx tsc --noEmit`) | ✅ 타입 오류 없음 |
| 프로덕션 빌드 (`npm run build`) | ✅ 정상 빌드 완료 |

번들 크기: `dist/assets/index-*.js  X kB (gzip: Y kB)`
````

**빌드 실패 시:**

````markdown
## ❌ 빌드 검증 실패

| 검증 항목 | 결과 |
|---|:---:|
| 린트 검사 (`npm run lint`) | ❌ N errors |
| 타입 검증 (`npx tsc --noEmit`) | ❌ N type errors |
| 프로덕션 빌드 (`npm run build`) | ⏭️ 건너뜀 (선행 실패) |

### 세부 에러 내역

<details>
<summary>전체 에러 로그 확인</summary>

```
<에러 로그 내용>
```

</details>

### 해결 방안 제안

(각 에러에 대한 간결한 해결 제안)
````

Do not make any code changes. Your only output is the comment.
