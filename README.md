# Portfolio Bridge

> 한국 · 일본 · 미국 다국가 금융자산을 하나의 대시보드에서 통합 관리하는 로컬 우선(privacy-first) 포트폴리오 앱

🌐 **라이브 데모**: [portfolio-bridge-sigma.vercel.app](https://portfolio-bridge-sigma.vercel.app/)

모든 데이터는 **브라우저 localStorage**에만 저장되며 외부 서버로 전송되지 않습니다.  
Yahoo Finance 시세/환율 조회는 프록시를 통해 클라이언트에서 직접 수행합니다.

---

## 스크린샷 구성

| 영역 | 설명 |
|---|---|
| **KPI 바** | 총 평가액 · 평가 손익 · 보유 종목 · 현금 비중 · 외화 노출 |
| **배분 차트** | 국가(시장)별 · 태그별 파이 차트 |
| **보유 종목** | 평가액/손익/수익률/비중 정렬 테이블 |
| **태그 분석** | 목표 vs 실제 편차 바 |
| **환율 노출** | 통화별 비중 + ±5% FX 시나리오 |
| **리밸런스** | 매수/매도 제안 |
| **인사이트** | 과대비중 · 큰 손실 · 현금부족 · 환노출 자동 경고 |

---

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 (localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 웹 배포 (Vercel)

Vercel에 배포하면 별도의 서버 없이 정적 SPA + API 프록시가 함께 동작합니다.

### 배포 방법

1. GitHub에 레포지토리를 푸시합니다.
2. [vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인합니다.
3. "Add New Project" → `portfolio-bridge` 레포 선택 → **Deploy** 클릭
4. 환경변수 설정 없이 바로 배포됩니다.

이후 `git push`할 때마다 자동으로 재배포됩니다.

### 프록시 구조

| 경로 | 대상 | 파일 |
|---|---|---|
| `/api/yahoo/*` | `query1.finance.yahoo.com` | `api/yahoo/[...path].ts` |
| `/api/yahoo-jp/*` | `finance.yahoo.co.jp` | `api/yahoo-jp/[...path].ts` |

`vercel.json`에서 SPA 라우팅 fallback과 API 리라이트를 설정합니다.

---

## 데스크톱 앱 (Tauri)

Tauri v2를 사용하여 macOS (.app / .dmg) 및 Windows (.exe / .msi) 데스크톱 앱으로 빌드할 수 있습니다.

### 사전 요구 사항

| OS | 필수 설치 |
|---|---|
| **공통** | [Node.js](https://nodejs.org/) 18+, [Rust](https://rustup.rs/) 1.77.2+ |
| **macOS** | Xcode Command Line Tools (`xcode-select --install`) |
| **Windows** | [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (C++ 데스크톱 개발 워크로드), [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (Win 10+에 기본 포함) |

### 개발 모드

```bash
npm run tauri:dev
```

Vite HMR + 네이티브 데스크톱 윈도우가 동시에 실행됩니다. 코드 수정 시 즉시 반영됩니다.

### 프로덕션 빌드

```bash
npm run tauri:build
```

현재 OS에 맞는 인스톨러가 생성됩니다:

| OS | 출력 경로 | 형식 |
|---|---|---|
| macOS | `src-tauri/target/release/bundle/dmg/` | `.app`, `.dmg` |
| Windows | `src-tauri/target/release/bundle/nsis/` | `.exe` (NSIS 설치 프로그램) |
| Windows | `src-tauri/target/release/bundle/msi/` | `.msi` |

> **참고**: Tauri는 크로스 컴파일을 지원하지 않습니다. Windows `.exe`는 Windows에서, macOS `.dmg`는 macOS에서 빌드해야 합니다.

### 아키텍처

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

## 주요 기능

### 대시보드

- 5칸 KPI 바 (총 평가액, 손익, 보유 종목 수, 현금 비중, 외화 노출)
- 국가별 · 태그별 파이 차트
- 보유 종목 테이블 (평가액/손익/수익률/비중 정렬, 비중 바)
- 태그 목표 vs 실제 편차 시각화
- 환율 노출 테이블 + ±5% 시나리오 분석
- 리밸런스 매수/매도 제안
- 자동 인사이트 경고 (과대비중 >15%, 손실 >20%, 현금 <3%/>20%, 환노출 >40%, 태그 편차 >10%p)
- **온보딩 샘플 데이터**: 빈 대시보드에서 "샘플 데이터로 둘러보기" 버튼으로 즉시 데모 체험

### 자산 관리

- 종목 검색 (Yahoo Finance US + Yahoo Japan HTML 스크래핑)
- 수동 등록 · 수정 · 삭제
- AI 분류 프롬프트 생성 → JSON 응답으로 태그 일괄 적용
- **CSV 가져오기 미리보기**: 파일 선택 후 5행 미리보기 → 확인 후 임포트 확정
- CSV 내보내기

### 투자 구루

- 15명의 투자 구루 지원: 버핏, 멍거, 린치, 그레이엄, 달리오, 리루, 빌 애크먼, 마이클 버리, 켄 피셔, 스티븐 코헨, 하워드 막스, 세스 클라먼, 존 템플턴, 조지 소로스, 캐시 우드
- 구루별 투자 철학 (5개 항목 상세 설명)
- 구루별 대표 보유 종목 Top 5 (티커, 종목명, 비중)
- 구루 이상적 배분 파이 차트 vs 내 포트폴리오 레이더 비교
- 구루 기준 리밸런싱 제안

### 다국어 (i18n)

- 한국어 🇰🇷 · English 🇺🇸 · 日本語 🇯🇵 3개국어 지원
- 헤더의 국기 버튼으로 즉시 전환
- 투자 구루 이름/철학 포함 전체 UI 다국어 대응
- Zustand persist로 언어 설정 유지

### 설정

- 표시 화폐 전환 (KRW / JPY / USD)
- **환율 캐시 전략**: 앱 시작 시 자동 조회, 1시간 이내 캐시는 재사용, 조회 실패 시 24시간 이내 캐시로 폴백 (amber 경고 표시)
- 태그별 목표 비중 설정
- 전체 데이터 초기화

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프런트엔드 | React 19 · TypeScript · Vite 7 |
| 스타일링 | Tailwind CSS v4 |
| 상태 관리 | Zustand 5 (localStorage persist) |
| 차트 | Recharts |
| 라우팅 | React Router v7 |
| 다국어 | 커스텀 i18n (ko / en / ja) |
| 시세 조회 | Yahoo Finance API (US) + Yahoo Japan HTML 스크래핑 (JP) |
| 데스크톱 | Tauri v2 (Rust) + tauri-plugin-http |
| 웹 배포 | Vercel (Serverless Functions + 정적 CDN) |

---

## 프로젝트 구조

```
src/
├── pages/              # Dashboard, Assets, Gurus, Settings
├── components/
│   ├── layout/         # Layout, Sidebar, Header
│   ├── common/         # Card, Button, Modal
│   ├── dashboard/      # KpiBar, AllocationPieCharts, TopHoldingsTable,
│   │                   # TagAnalysisCard, CurrencyExposureCard,
│   │                   # RebalanceCard, InsightsPanel
│   └── assets/         # AssetForm, AssetTable
├── hooks/              # usePortfolio, useExchangeRates, useTickerSearch
├── stores/             # useAssetStore, useSettingsStore, useLanguageStore
├── i18n/               # types.ts, ko.ts, en.ts, ja.ts, index.ts
├── types/              # Asset, Currency, Portfolio, Guru 타입
├── utils/              # 계산, 환율, CSV, 구루, Yahoo Finance, AI 분류
├── App.tsx
└── main.tsx

api/
├── yahoo/              # Vercel Serverless — Yahoo Finance US 프록시
│   └── [...path].ts
└── yahoo-jp/           # Vercel Serverless — Yahoo Finance Japan 프록시
    └── [...path].ts

src-tauri/
├── Cargo.toml          # Rust 의존성 (tauri, tauri-plugin-http)
├── tauri.conf.json     # Tauri 앱 설정 (창 크기, 번들, 권한)
├── capabilities/       # HTTP 요청 허용 도메인 설정
├── icons/              # 앱 아이콘 (macOS .icns, Windows .ico)
└── src/
    ├── main.rs         # Rust 진입점
    └── lib.rs          # 플러그인 등록 (http, log)

vercel.json             # Vercel 배포 설정 (SPA rewrite, API 라우팅)
```

---

## Yahoo Finance 데이터 조회

이 앱은 두 가지 경로로 시세/환율을 조회합니다:

| 경로 | 엔드포인트 | 용도 |
|---|---|---|
| US API | `query1.finance.yahoo.com` (Vite proxy / Vercel Serverless) | 미국·한국 종목 검색/시세, 환율 |
| JP 스크래핑 | `finance.yahoo.co.jp` (커스텀 플러그인 / Vercel Serverless) | 일본 펀드·주식 검색/시세 (HTML `__PRELOADED_STATE__` 파싱) |

> **참고**: Yahoo Finance의 비공식 엔드포인트를 사용하므로 API 구조가 변경되면 조회가 실패할 수 있습니다.

---

## 면책 조항 (Disclaimer)

- 이 프로젝트는 **개인 학습 및 포트폴리오 관리 목적**으로 제작되었습니다.
- Yahoo Finance의 데이터를 비공식 API 및 웹 스크래핑으로 조회합니다. 이는 Yahoo의 이용약관에 따라 상업적 이용이 제한될 수 있습니다. **개인 비상업적 용도**로만 사용하십시오.
- 제공되는 시세·환율·분석 데이터는 참고용이며, 투자 결정의 근거로 사용해서는 안 됩니다.
- 이 소프트웨어의 사용으로 인한 어떠한 손실에 대해서도 개발자는 책임을 지지 않습니다.

---

## 라이선스

[MIT License](LICENSE)
