# Portfolio Bridge

> **[English](#english)** | **[한국어](#한국어)**

---

<a id="english"></a>

## English

> Manage multi-country financial assets (Korea · Japan · US · Germany) in one dashboard,  
> and gain portfolio insights from AI and legendary investors — a **privacy-first web app**

🌐 **Live Demo**: [portfolio-bridge-sigma.vercel.app](https://portfolio-bridge-sigma.vercel.app/)

All data is stored **only in browser localStorage** — never sent to external servers.  
No account required. Market data and exchange rates are fetched client-side via proxy from Yahoo Finance.

---

### Key Features

| Feature | Description |
|---|---|
| 📊 **Unified Dashboard** | KPI bar, tag/market allocation charts, holdings table, rebalance suggestions |
| 💼 **Asset Management** | Ticker search (Yahoo Finance), manual entry, AI auto-tagging, CSV import/export |
| 💡 **Investment Gurus** | Compare your portfolio with 18 gurus (Buffett, Dalio, Lynch, Druckenmiller, Smith, Greenblatt, etc.) |
| 🤖 **AI Portfolio Analysis** | Structured prompts ready to paste into ChatGPT · Claude · Gemini · Grok |
| 🔔 **Auto Insights** | Alerts for overweight, large losses, low cash, currency exposure |
| 🌐 **Multi-language & Currency** | Korean · English · 日本語 · Deutsch / KRW · USD · JPY · EUR |

---

### Quick Start

```bash
# Install dependencies
npm install

# Development server (localhost:5173)
npm run dev

# Production build
npm run build
```

---

### Web Deployment (Vercel)

Deploy to Vercel for a static SPA + API proxy with zero server management.

1. Push your repository to GitHub.
2. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
3. "Add New Project" → select `portfolio-bridge` → **Deploy**
4. No environment variables needed.

Auto-redeploys on every `git push`.

#### Proxy Structure

| Path | Target | File |
|---|---|---|
| `/api/yahoo/*` | `query1.finance.yahoo.com` | `api/yahoo/[...path].ts` |
| `/api/yahoo-jp/*` | `finance.yahoo.co.jp` | `api/yahoo-jp/[...path].ts` |

SPA routing fallback and API rewrites are configured in `vercel.json`.

---

### Desktop App (Tauri)

Build native macOS (.app / .dmg) and Windows (.exe / .msi) desktops using Tauri v2.

#### Prerequisites

| OS | Requirements |
|---|---|
| **All** | [Node.js](https://nodejs.org/) 18+, [Rust](https://rustup.rs/) 1.77.2+ |
| **macOS** | Xcode Command Line Tools (`xcode-select --install`) |
| **Windows** | [VS Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (C++ desktop workload), [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) |

```bash
# Dev mode (Vite HMR + native window)
npm run tauri:dev

# Production build (installer for current OS)
npm run tauri:build
```

| OS | Output Path | Format |
|---|---|---|
| macOS | `src-tauri/target/release/bundle/dmg/` | `.app`, `.dmg` |
| Windows | `src-tauri/target/release/bundle/nsis/` | `.exe` (NSIS installer) |
| Windows | `src-tauri/target/release/bundle/msi/` | `.msi` |

> **Note**: Tauri does not support cross-compilation. Build on the target OS.

#### Architecture

```
Browser (local dev)                 Vercel deployment                  Tauri desktop
┌──────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│  React SPA       │          │  React SPA (CDN)     │          │  React SPA (WebView) │
│  fetch("/api/…") │          │  fetch("/api/…")     │          │  yahooFetch()        │
│       ↓          │          │       ↓              │          │       ↓              │
│  Vite Proxy      │          │  Serverless Function │          │  tauri-plugin-http   │
│       ↓          │          │       ↓              │          │       ↓              │
│  Yahoo Finance   │          │  Yahoo Finance       │          │  Yahoo Finance       │
└──────────────────┘          └──────────────────────┘          └──────────────────────┘
```

`yahooFetch()` auto-detects the runtime Environment:

- **Local dev**: Vite proxy (`/api/yahoo/…`)
- **Vercel**: Serverless Functions proxy
- **Tauri desktop**: Direct request via `tauri-plugin-http` (bypasses CORS)

---

### Feature Details

#### Dashboard

- 5-slot KPI bar (total value, P&L, holdings count, cash ratio, FX exposure)
- Pie charts by market & tag
- Holdings table (sortable by value / P&L / return / weight, weight bar)
- Tag target vs actual deviation visualization
- Currency exposure table + ±5 % scenario analysis
- Rebalance buy/sell suggestions
- **Auto insights** (overweight >15 %, loss >20 %, cash <3 % / >20 %, FX exposure >40 %, tag deviation >10 %p) — per-item dismiss
- **AI analysis banner**: structured prompt containing all holdings → paste into ChatGPT · Claude · Gemini · Grok
- **Onboarding sample data**: "Try with sample data" button on empty dashboard

#### Asset Management

- Ticker search (Yahoo Finance US + Yahoo Japan HTML scraping)
- Manual add / edit / delete
- **AI auto-tagging**: English structured prompt → apply tags in bulk via JSON response (reasons in app language)
- **CSV import preview**: 5-row preview → confirm to import
- CSV export

#### Investment Gurus

- 18 gurus: Buffett, Munger, Lynch, Graham, Dalio, Li Lu, Ackman, Burry, Ken Fisher, Steven Cohen, Howard Marks, Seth Klarman, John Templeton, George Soros, Cathie Wood, Stanley Druckenmiller, Terry Smith, Joel Greenblatt
- Philosophy (5 principles + 1 representative quote per guru)
- Ideal allocation pie chart vs portfolio radar comparison
- Guru-based rebalancing suggestions
- AI prompt generation always injects **English** guru philosophy (independent of UI language)

#### Multi-language (i18n)

- Korean 🇰🇷 · English 🇺🇸 · 日本語 🇯🇵 · Deutsch 🇩🇪
- Instant switch via flag buttons in the header
- Full UI localization including guru names & philosophies
- Language setting persisted via Zustand
- Guru philosophy rendering uses locale text first, then falls back to English if a locale key is missing

#### Translation Style Guide (Guru Philosophy)

- Each `guru_philosophy_*` must keep a strict 6-line structure:
    1)–5) principle bullets, 6) quote bullet (`Quote:` / `명언:` / `名言：` / `Zitat:`)
- Keep one bullet per line using `• ` and `\n` concatenation style used in i18n files
- Keep investment terminology consistent by locale (e.g., ROIC, Margin of Safety, Risk Parity)
- Avoid machine-literal translation; prefer natural, domain-accurate phrasing for investors
- If localized copy is missing, UI should gracefully fall back to English (already implemented in `GurusPage`)
- Prompt generation must remain English-philosophy based for cross-language consistency

#### Settings

- Display currency toggle (KRW / JPY / USD / EUR)
- **Exchange rate caching**: auto-fetch on startup, reuse within 1 h, fallback to 24 h cache on failure (amber warning)
- Target allocation per tag
- Full data reset

---

### Tech Stack

| Area | Technology |
|---|---|
| Frontend | React 19 · TypeScript · Vite 7 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 (localStorage persist) |
| Charts | Recharts |
| Routing | React Router v7 |
| i18n | Custom (ko / en / ja / de) |
| Market Data | Yahoo Finance API (US) + Yahoo Japan HTML scraping (JP) |
| Desktop | Tauri v2 (Rust) + tauri-plugin-http |
| Deployment | Vercel (Serverless Functions + static CDN) |

---

### Project Structure

```
src/
├── pages/              # Dashboard, Assets, Gurus, Settings, About
├── components/
│   ├── layout/         # Layout, Sidebar, Header
│   ├── common/         # Card, Button, Modal
│   ├── dashboard/      # KpiBar, AllocationPieCharts, TopHoldingsTable,
│   │                   # TagAnalysisCard, CurrencyExposureCard,
│   │                   # RebalanceCard, InsightsPanel
│   └── assets/         # AssetForm, AssetTable
├── hooks/              # usePortfolio, useExchangeRates, useTickerSearch
├── stores/             # useAssetStore, useSettingsStore, useLanguageStore
├── i18n/               # types.ts, ko.ts, en.ts, ja.ts, de.ts, index.ts
├── types/              # Asset, Currency, Portfolio, Guru types
├── utils/              # Calculations, FX, CSV, Guru, Yahoo Finance, AI
├── App.tsx
└── main.tsx

api/
├── yahoo/[...path].ts          # Vercel Serverless — Yahoo Finance US proxy
└── yahoo-jp/[...path].ts       # Vercel Serverless — Yahoo Finance Japan proxy

src-tauri/
├── Cargo.toml                  # Rust deps (tauri, tauri-plugin-http)
├── tauri.conf.json             # Tauri app config (window, bundle, permissions)
├── capabilities/               # Allowed HTTP request domains
├── icons/                      # App icons (.icns, .ico)
└── src/
    ├── main.rs                 # Rust entry point
    └── lib.rs                  # Plugin registration (http, log)

vercel.json                     # Vercel config (SPA rewrite, API routing)
```

---

### Yahoo Finance Data

| Path | Endpoint | Usage |
|---|---|---|
| US API | `query1.finance.yahoo.com` (Vite proxy / Vercel Serverless) | US/KR ticker search & quotes, exchange rates |
| JP Scraping | `finance.yahoo.co.jp` (custom plugin / Vercel Serverless) | JP fund/stock search & quotes (HTML `__PRELOADED_STATE__` parsing) |

> **Note**: Uses unofficial Yahoo Finance endpoints; API changes may break data fetching.

---

### Disclaimer

- This project is for **personal learning and portfolio management** only.
- Market data is fetched via unofficial APIs and web scraping from Yahoo Finance. Commercial use may violate Yahoo's Terms of Service. **Use for personal, non-commercial purposes only.**
- Quotes, exchange rates, and analysis are for reference only — not investment advice.
- The developer assumes no liability for any losses resulting from use of this software.

---

### License

[MIT License](LICENSE)

---

---

<a id="한국어"></a>

## 한국어

> 한국 · 일본 · 미국 · 독일 다국가 금융자산을 하나의 대시보드에서 통합 관리하고,  
> AI 및 전설적인 투자가들의 관점에서 포트폴리오 인사이트를 얻는 **privacy-first 웹 앱**

🌐 **라이브 데모**: [portfolio-bridge-sigma.vercel.app](https://portfolio-bridge-sigma.vercel.app/)

모든 데이터는 **브라우저 localStorage**에만 저장되며 외부 서버로 전송되지 않습니다.  
계정 생성 없이 바로 사용할 수 있습니다.  
Yahoo Finance 시세/환율 조회는 프록시를 통해 클라이언트에서 직접 수행합니다.

---

### 핵심 기능 요약

| 기능 | 설명 |
|---|---|
| 📊 **통합 대시보드** | KPI 바, 태그·시장별 배분 차트, 보유 종목 테이블, 리밸런싱 제안 |
| 💼 **자산 관리** | 종목 검색(Yahoo Finance), 수동 등록, AI 자동 태그 분류, CSV 가져오기·내보내기 |
| 💡 **투자 구루** | 버핏·달리오·린치·드러큰밀러·스미스·그린블라트 등 18명의 철학과 내 포트폴리오 비교 |
| 🤖 **AI 포트폴리오 분석** | ChatGPT · Claude · Gemini · Grok에 바로 붙여넣을 구조화 프롬프트 생성 |
| 🔔 **자동 인사이트** | 과대비중, 큰 손실, 현금 부족, 환 노출 초과를 자동 감지·경고 |
| 🌐 **다국어 · 다통화** | 한국어 · English · 日本語 · Deutsch / KRW · USD · JPY · EUR |

---

### 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 (localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

---

### 웹 배포 (Vercel)

Vercel에 배포하면 별도의 서버 없이 정적 SPA + API 프록시가 함께 동작합니다.

1. GitHub에 레포지토리를 푸시합니다.
2. [vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인합니다.
3. "Add New Project" → `portfolio-bridge` 레포 선택 → **Deploy** 클릭
4. 환경변수 설정 없이 바로 배포됩니다.

이후 `git push`할 때마다 자동으로 재배포됩니다.

#### 프록시 구조

| 경로 | 대상 | 파일 |
|---|---|---|
| `/api/yahoo/*` | `query1.finance.yahoo.com` | `api/yahoo/[...path].ts` |
| `/api/yahoo-jp/*` | `finance.yahoo.co.jp` | `api/yahoo-jp/[...path].ts` |

`vercel.json`에서 SPA 라우팅 fallback과 API 리라이트를 설정합니다.

---

### 데스크톱 앱 (Tauri)

Tauri v2를 사용하여 macOS (.app / .dmg) 및 Windows (.exe / .msi) 데스크톱 앱으로 빌드할 수 있습니다.

#### 사전 요구 사항

| OS | 필수 설치 |
|---|---|
| **공통** | [Node.js](https://nodejs.org/) 18+, [Rust](https://rustup.rs/) 1.77.2+ |
| **macOS** | Xcode Command Line Tools (`xcode-select --install`) |
| **Windows** | [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (C++ 데스크톱 개발 워크로드), [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (Win 10+에 기본 포함) |

```bash
# 개발 모드 (Vite HMR + 네이티브 데스크톱 윈도우)
npm run tauri:dev

# 프로덕션 빌드 (현재 OS에 맞는 인스톨러 생성)
npm run tauri:build
```

| OS | 출력 경로 | 형식 |
|---|---|---|
| macOS | `src-tauri/target/release/bundle/dmg/` | `.app`, `.dmg` |
| Windows | `src-tauri/target/release/bundle/nsis/` | `.exe` (NSIS 설치 프로그램) |
| Windows | `src-tauri/target/release/bundle/msi/` | `.msi` |

> **참고**: Tauri는 크로스 컴파일을 지원하지 않습니다. Windows `.exe`는 Windows에서, macOS `.dmg`는 macOS에서 빌드해야 합니다.

#### 아키텍처

```
브라우저 (로컬 개발)                   Vercel 웹 배포                     Tauri 데스크톱 앱
┌──────────────────┐            ┌──────────────────────┐          ┌──────────────────────┐
│  React SPA       │            │  React SPA (CDN)     │          │  React SPA (WebView) │
│  fetch("/api/…") │            │  fetch("/api/…")     │          │  yahooFetch()        │
│       ↓          │            │       ↓              │          │       ↓              │
│  Vite Proxy      │            │  Serverless Function │          │  tauri-plugin-http   │
│       ↓          │            │       ↓              │          │       ↓              │
│  Yahoo Finance   │            │  Yahoo Finance       │          │  Yahoo Finance       │
└──────────────────┘            └──────────────────────┘          └──────────────────────┘
```

`yahooFetch()` 래퍼가 실행 환경을 자동 감지하여:

- **브라우저 (로컬 개발)**: Vite 프록시 (`/api/yahoo/…`) 경유
- **Vercel 웹 배포**: Vercel Serverless Functions 프록시 경유
- **Tauri 데스크톱**: `tauri-plugin-http`로 Yahoo Finance에 직접 요청 (CORS 우회)

---

### 주요 기능

#### 대시보드

- 5칸 KPI 바 (총 평가액, 손익, 보유 종목 수, 현금 비중, 외화 노출)
- 국가별 · 태그별 파이 차트
- 보유 종목 테이블 (평가액/손익/수익률/비중 정렬, 비중 바)
- 태그 목표 vs 실제 편차 시각화
- 환율 노출 테이블 + ±5% 시나리오 분석
- 리밸런스 매수/매도 제안
- **자동 인사이트** 경고 (과대비중 >15%, 손실 >20%, 현금 <3%/>20%, 환노출 >40%, 태그 편차 >10%p) — 항목별 개별 닫기 지원
- **AI 포트폴리오 분석 배너**: 보유 종목 전체 데이터를 포함한 구조화 프롬프트 생성 → ChatGPT · Claude · Gemini · Grok에 바로 붙여넣기
- **온보딩 샘플 데이터**: 빈 대시보드에서 "샘플 데이터로 둘러보기" 버튼으로 즉시 데모 체험

#### 자산 관리

- 종목 검색 (Yahoo Finance US + Yahoo Japan HTML 스크래핑)
- 수동 등록 · 수정 · 삭제
- **AI 자동 태그 분류**: 영문 구조화 프롬프트 생성 → JSON 응답으로 태그 일괄 적용 (앱 표시 언어로 reason 응답)
- **CSV 가져오기 미리보기**: 파일 선택 후 5행 미리보기 → 확인 후 임포트 확정
- CSV 내보내기

#### 투자 구루

- 18명의 투자 구루: 버핏, 멍거, 린치, 그레이엄, 달리오, 리루, 빌 애크먼, 마이클 버리, 켄 피셔, 스티븐 코헨, 하워드 막스, 세스 클라먼, 존 템플턴, 조지 소로스, 캐시 우드, 스탠리 드러큰밀러, 테리 스미스, 조엘 그린블라트
- 구루별 투자 철학 (핵심 원칙 5개 + 대표 명언 1개)
- 구루 이상적 배분 파이 차트 vs 내 포트폴리오 레이더 비교
- 구루 기준 리밸런싱 제안
- AI 구루 프롬프트는 UI 언어와 무관하게 영어 철학 텍스트를 기준으로 생성

#### 다국어 (i18n)

- 한국어 🇰🇷 · English 🇺🇸 · 日本語 🇯🇵 · Deutsch 🇩🇪 4개국어 지원
- 헤더의 국기 버튼으로 즉시 전환
- 투자 구루 이름/철학 포함 전체 UI 다국어 대응
- Zustand persist로 언어 설정 유지
- 구루 철학 텍스트는 해당 언어 우선, 누락 시 영어로 자동 폴백

#### 번역 스타일 가이드 (구루 철학)

- 각 `guru_philosophy_*`는 6줄 구조를 유지합니다.
    - 1~5줄: 투자 원칙 bullet
    - 6줄: 명언 bullet (`Quote:` / `명언:` / `名言：` / `Zitat:`)
- 각 줄은 `• `로 시작하고, i18n 파일의 `\n` 연결 스타일을 유지합니다.
- 투자 도메인 용어(예: ROIC, 안전마진, 리스크 패리티)는 언어별로 일관되게 번역합니다.
- 직역보다 투자 문맥에서 자연스럽고 정확한 의역을 우선합니다.
- 특정 언어 키가 누락되더라도 UI는 영어 철학으로 안전하게 폴백합니다 (`GurusPage` 반영).
- AI 프롬프트는 언어 일관성을 위해 영어 철학 텍스트를 기준으로 유지합니다.

#### 설정

- 표시 화폐 전환 (KRW / JPY / USD / EUR)
- **환율 캐시 전략**: 앱 시작 시 자동 조회, 1시간 이내 캐시는 재사용, 조회 실패 시 24시간 이내 캐시로 폴백 (amber 경고 표시)
- 태그별 목표 비중 설정
- 전체 데이터 초기화

---

### 기술 스택

| 영역 | 기술 |
|---|---|
| 프런트엔드 | React 19 · TypeScript · Vite 7 |
| 스타일링 | Tailwind CSS v4 |
| 상태 관리 | Zustand 5 (localStorage persist) |
| 차트 | Recharts |
| 라우팅 | React Router v7 |
| 다국어 | 커스텀 i18n (ko / en / ja / de) |
| 시세 조회 | Yahoo Finance API (US) + Yahoo Japan HTML 스크래핑 (JP) |
| 데스크톱 | Tauri v2 (Rust) + tauri-plugin-http |
| 웹 배포 | Vercel (Serverless Functions + 정적 CDN) |

---

### Yahoo Finance 데이터 조회

| 경로 | 엔드포인트 | 용도 |
|---|---|---|
| US API | `query1.finance.yahoo.com` (Vite proxy / Vercel Serverless) | 미국·한국 종목 검색/시세, 환율 |
| JP 스크래핑 | `finance.yahoo.co.jp` (커스텀 플러그인 / Vercel Serverless) | 일본 펀드·주식 검색/시세 (HTML `__PRELOADED_STATE__` 파싱) |

> **참고**: Yahoo Finance의 비공식 엔드포인트를 사용하므로 API 구조가 변경되면 조회가 실패할 수 있습니다.

---

### 면책 조항

- 이 프로젝트는 **개인 학습 및 포트폴리오 관리 목적**으로 제작되었습니다.
- Yahoo Finance의 데이터를 비공식 API 및 웹 스크래핑으로 조회합니다. 이는 Yahoo의 이용약관에 따라 상업적 이용이 제한될 수 있습니다. **개인 비상업적 용도**로만 사용하십시오.
- 제공되는 시세·환율·분석 데이터는 참고용이며, 투자 결정의 근거로 사용해서는 안 됩니다.
- 이 소프트웨어의 사용으로 인한 어떠한 손실에 대해서도 개발자는 책임을 지지 않습니다.

---

### 라이선스

[MIT License](LICENSE)
