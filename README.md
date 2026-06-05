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
npm install
npm run dev    # localhost:5173
npm run build  # production build
```

---

### Web Deployment (Vercel)

1. Push your repository to GitHub
2. Sign in at [vercel.com](https://vercel.com) → Add New Project → select `portfolio-bridge` → **Deploy**
3. No environment variables needed. Auto-redeploys on every `git push`.

---

### Desktop App (Tauri)

See [doc/system/tauri.md](doc/system/tauri.md) for prerequisites and full build instructions.

```bash
npm run tauri:dev    # Dev mode (Vite HMR + native window)
npm run tauri:build  # Production installer for current OS
```

---

### Tech Stack

| Area | Technology |
|------|------------|
| Frontend | React 19 · TypeScript · Vite 7 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 (localStorage persist) |
| Charts | Recharts |
| Routing | React Router v7 |
| i18n | Custom (ko / en / ja / de) |
| Market Data | Yahoo Finance API |
| Desktop | Tauri v2 (Rust) + tauri-plugin-http |
| Deployment | Vercel (Serverless Functions + static CDN) |

---

### Project Structure

```text
src/
├── pages/          # Dashboard, Assets, Gurus, Settings, About
├── components/     # layout/, common/, dashboard/, assets/, gurus/
├── hooks/          # Custom React hooks
├── stores/         # Zustand stores (all persisted to localStorage)
├── i18n/           # Translation files (ko/en/ja/de)
├── types/          # TypeScript type definitions
└── utils/          # calc/, yahoo/, ai/, analyzers/, gdrive/

api/                # Vercel Serverless Functions (Yahoo Finance proxy)
src-tauri/          # Tauri (Rust) desktop app
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
npm install
npm run dev    # localhost:5173
npm run build  # 프로덕션 빌드
```

---

### 웹 배포 (Vercel)

1. GitHub에 레포지토리를 푸시합니다
2. [vercel.com](https://vercel.com) 로그인 → Add New Project → `portfolio-bridge` 선택 → **Deploy**
3. 환경변수 설정 불필요. `git push`마다 자동 재배포.

---

### 데스크톱 앱 (Tauri)

사전 요구 사항 및 빌드 상세는 [doc/system/tauri.md](doc/system/tauri.md) 참조.

```bash
npm run tauri:dev    # 개발 모드 (Vite HMR + 네이티브 윈도우)
npm run tauri:build  # 프로덕션 인스톨러 생성
```

---

### 기술 스택

| 영역 | 기술 |
|------|------|
| 프런트엔드 | React 19 · TypeScript · Vite 7 |
| 스타일링 | Tailwind CSS v4 |
| 상태 관리 | Zustand 5 (localStorage persist) |
| 차트 | Recharts |
| 라우팅 | React Router v7 |
| 다국어 | 커스텀 i18n (ko / en / ja / de) |
| 시세 조회 | Yahoo Finance API |
| 데스크톱 | Tauri v2 (Rust) + tauri-plugin-http |
| 웹 배포 | Vercel (Serverless Functions + 정적 CDN) |

---

### 프로젝트 구조

```text
src/
├── pages/          # Dashboard, Assets, Gurus, Settings, About
├── components/     # layout/, common/, dashboard/, assets/, gurus/
├── hooks/          # 커스텀 React 훅
├── stores/         # Zustand 스토어 (localStorage 영속)
├── i18n/           # 번역 파일 (ko/en/ja/de)
├── types/          # TypeScript 타입 정의
└── utils/          # calc/, yahoo/, ai/, analyzers/, gdrive/

api/                # Vercel Serverless Functions (Yahoo Finance 프록시)
src-tauri/          # Tauri (Rust) 데스크톱 앱
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
