# Portfolio Bridge

> **[English](#english)** | **[한국어](#한국어)**

---

<a id="english"></a>

## English

> Multi-country financial asset manager (Korea · Japan · US · Germany) — a **privacy-first web app**

🌐 **Live Demo**: [portfolio-bridge-sigma.vercel.app](https://portfolio-bridge-sigma.vercel.app/)

All data is stored **only in browser localStorage** — never sent to external servers. No account required.

📚 **[Full Design Documentation →](doc/)**

---

### Quick Start

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:5173)
npm run dev

# Run unit tests (Vitest)
npx vitest run

# Run E2E tests (Playwright)
npx playwright test

# Lint check
npm run lint

# Production build
npm run build
```

---

### Web Deployment (Vercel)

1. Push your repository to GitHub
2. Sign in at [vercel.com](https://vercel.com) → Add New Project → select `portfolio-bridge` → **Deploy**
3. No environment variables needed. Edge Runtime API proxies and static assets deploy automatically.

---

### Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19 · TypeScript 5.9 · Vite 7 · Lucide React · date-fns · Fontsource (Inter, Fira Code) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, `@theme`, `@utility`) |
| State & Async Data | Zustand 5 (localStorage persist) · TanStack Query v5 |
| Charts | Recharts 3 |
| Routing | React Router v7 (`react-router-dom` v7 with `React.lazy` & `Suspense`) |
| i18n | Custom (ko / en / ja / de) |
| Market & Economic Data | Yahoo Finance API & FRED API via Edge Proxy |
| Deployment | Vercel (Edge Runtime Functions + static CDN) |
| Testing | Vitest 4 · React Testing Library · Playwright E2E · JSDOM |
| Linting | ESLint 9 (flat config) with typescript-eslint + Tailwind CSS plugin |

---

### Project Structure

```text
src/
├── pages/          # Dashboard, Assets, Gurus, FirePlanner, Settings, About
├── components/     # layout/, common/, dashboard/, assets/, gurus/, fire/, settings/
├── providers/      # QueryProvider (TanStack React Query)
├── hooks/          # Custom React hooks (usePortfolio, useAnalyzer, useTickerSearch, etc.)
├── stores/         # Zustand stores (useAssetStore, useFireStore, useSettingsStore, etc.)
├── constants/      # App constants (fx, storage keys, thresholds)
├── i18n/           # Translation files (ko/en/ja/de) & TranslationKeys type
├── types/          # TypeScript type definitions
├── utils/          # calc/, yahoo/, ai/, analyzers/, gdrive/, cn.ts, csv.ts
├── tests/          # Unit tests (Vitest) & E2E tests (Playwright)
└── style.css       # Global styles & Tailwind v4 theme/utility tokens

api/                # Vercel Edge Runtime Functions (Yahoo Finance & FRED proxy)
```

---

### Disclaimer

- For **personal, non-commercial use only**.
- Uses unofficial Yahoo Finance APIs. Commercial use may violate Yahoo's Terms of Service.
- Data provided is for reference only — not investment advice.
- The developer assumes no liability for losses from use of this software.

---

### License

[MIT License](LICENSE)

---

<a id="한국어"></a>

## 한국어

> 한국 · 일본 · 미국 · 독일 다국가 금융자산을 하나의 대시보드에서 통합 관리하는 **privacy-first 웹 앱**

🌐 **라이브 데모**: [portfolio-bridge-sigma.vercel.app](https://portfolio-bridge-sigma.vercel.app/)

모든 데이터는 **브라우저 localStorage**에만 저장되며 외부 서버로 전송되지 않습니다. 계정 생성 없이 바로 사용 가능.

📚 **[전체 설계 문서 →](doc/)**

---

### 빠른 시작

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 시작 (http://localhost:5173)
npm run dev

# 단위 테스트 실행 (Vitest)
npx vitest run

# E2E 테스트 실행 (Playwright)
npx playwright test

# 린트 검사
npm run lint

# 프로덕션 빌드
npm run build
```

---

### 웹 배포 (Vercel)

1. GitHub에 레포지토리를 푸시합니다
2. [vercel.com](https://vercel.com) 로그인 → Add New Project → `portfolio-bridge` 선택 → **Deploy**
3. 환경변수 설정 불필요. Edge Runtime API 프록시 및 정적 에셋이 자동으로 배포됩니다.

---

### 기술 스택

| 영역 | 기술 |
| --- | --- |
| 프런트엔드 | React 19 · TypeScript 5.9 · Vite 7 · Lucide React · date-fns · Fontsource (Inter, Fira Code) |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite`, `@theme`, `@utility`) |
| 상태 & 비동기 데이터 | Zustand 5 (localStorage 영속) · TanStack Query v5 |
| 차트 | Recharts 3 |
| 라우팅 | React Router v7 (`react-router-dom` v7, `React.lazy` 및 `Suspense`) |
| 다국어 | 커스텀 i18n (ko / en / ja / de) |
| 시세 & 경제 데이터 | Yahoo Finance API & FRED API via 엣지 프록시 |
| 웹 배포 | Vercel (Edge Runtime Functions + 정적 CDN) |
| 테스트 | Vitest 4 · React Testing Library · Playwright E2E · JSDOM |
| 린트 | ESLint 9 (플랫 설정) + typescript-eslint + Tailwind CSS 플러그인 |

---

### 프로젝트 구조

```text
src/
├── pages/          # Dashboard, Assets, Gurus, FirePlanner, Settings, About
├── components/     # layout/, common/, dashboard/, assets/, gurus/, fire/, settings/
├── providers/      # QueryProvider (TanStack React Query)
├── hooks/          # 커스텀 React 훅 (usePortfolio, useAnalyzer, useTickerSearch 등)
├── stores/         # Zustand 스토어 (useAssetStore, useFireStore, useSettingsStore 등)
├── constants/      # 앱 상수 (fx, 스토리지 키, 임계값)
├── i18n/           # 번역 파일 (ko/en/ja/de) 및 TranslationKeys 타입
├── types/          # TypeScript 타입 정의
├── utils/          # calc/, yahoo/, ai/, analyzers/, gdrive/, cn.ts, csv.ts
├── tests/          # 단위 테스트 (Vitest) 및 E2E 테스트 (Playwright)
└── style.css       # 글로벌 스타일 및 Tailwind v4 테마/유틸리티 토큰

api/                # Vercel Edge Runtime Functions (Yahoo Finance 및 FRED 프록시)
```

---

### 면책 조항

- **개인 비상업적 용도**로만 사용하십시오.
- Yahoo Finance 비공식 API 사용. 상업적 이용은 Yahoo 이용약관에 따라 제한될 수 있습니다.
- 시세·환율·분석 데이터는 참고용이며, 투자 결정의 근거로 사용해서는 안 됩니다.
- 이 소프트웨어 사용으로 인한 어떠한 손실에 대해서도 개발자는 책임을 지지 않습니다.

---

### 라이선스

[MIT License](LICENSE)
