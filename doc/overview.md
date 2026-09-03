# Portfolio Bridge — Application Overview

## Purpose

Portfolio Bridge is a privacy-first, multi-currency portfolio management web application.
Users can track and analyze financial assets across Korea, Japan, the US, and Germany from a single dashboard.
All user data is stored in browser `localStorage` only — no server-side storage, no account required.

Portfolio Bridge는 프라이버시 우선 원칙으로 설계된 다통화 포트폴리오 관리 웹 애플리케이션입니다.
한국·일본·미국·독일의 금융 자산을 하나의 대시보드에서 추적하고 분석할 수 있습니다.
모든 사용자 데이터는 브라우저 `localStorage`에만 저장되며 서버 저장소나 계정이 필요하지 않습니다.

## Key Features

| Feature | Description |
| --- | --- |
| Unified Dashboard | KPI bar, allocation charts, holdings table, rebalance suggestions, auto insights |
| Asset Management | Yahoo Finance ticker search, manual entry, AI classification, CSV import/export, display scope |
| Investment Gurus | 23 guru personas, ideal allocation comparison, 6 quantitative analyzers, AI prompt generation with dynamic asset scoping |
| AI Portfolio Analysis | Structured prompts for ChatGPT / Claude / Gemini / Grok |
| Auto Insights | Alerts for overweight, large losses, low cash, currency overexposure |
| Multi-language | Korean / English / 日本語 / Deutsch with instant switch |
| FIRE Planner | Project portfolio growth to FIRE based on safe withdrawal rates |
| Google Drive Backup | Optional sync of localStorage data to the user's own Google Drive |

| 기능 | 설명 |
| --- | --- |
| 통합 대시보드 | KPI 바, 배분 차트, 보유 종목 테이블, 리밸런싱 제안, 자동 인사이트 |
| 자산 관리 | Yahoo Finance 종목 검색, 수동 등록, AI 카테고리 분류, CSV 가져오기·내보내기, 표시 범위 설정 |
| 투자 구루 | 23명의 구루 페르소나, 이상적 배분 비교, 6종 정량 채점기, 상담 종목 동적 선택 AI 프롬프트 생성 |
| AI 포트폴리오 분석 | ChatGPT / Claude / Gemini / Grok에 바로 붙여넣을 구조화 프롬프트 |
| 자동 인사이트 | 과대비중·큰 손실·현금 부족·환 노출 초과 자동 감지 경고 |
| 다국어 | 한국어 / English / 日本語 / Deutsch 즉시 전환 |
| FIRE 플래너 | 안전 인출률을 기반으로 FIRE 달성까지의 포트폴리오 성장 시뮬레이션 |
| Google Drive 백업 | localStorage 데이터를 사용자 개인 Google Drive에 선택적 동기화 |

## Architecture

The app runs as a React SPA with client-side caching (TanStack Query + Zustand 5) and resilient Edge Runtime API proxies.

앱은 클라이언트 측 비동기 캐싱(TanStack Query + Zustand 5 Granular Selector) 및 복원력 높은 엣지 런타임 API 프록시를 갖춘 React SPA로 동작합니다.

```text
Local dev (Vite)                       Vercel deployment
┌──────────────────────────────┐    ┌──────────────────────────────────┐
│ React 19 SPA                 │    │ React 19 SPA (Static CDN)        │
│ TanStack Query + Zustand 5   │    │ TanStack Query + Zustand 5       │
│ Vite dev API proxy plugin    │    │ Vercel Edge Runtime Functions    │
│ (/api/yahoo, /fred, /health) │    │ (/api/proxy, /fred, /health)     │
└──────────────┬───────────────┘    └────────────────┬─────────────────┘
               └───────────────────┬─────────────────┘
                                   ↓
                   Yahoo Finance & FRED St. Louis API
```

`yahooFetch()` in `src/utils/yahoo/yahooCore.ts` and FRED utilities auto-detect the runtime and route requests accordingly.

`yahooFetch()` 및 FRED 관련 유틸리티는 런타임을 자동 감지하여 적절한 프록시 엔드포인트로 요청을 전달합니다.

## Routing

앱의 라우트 구성입니다.

| Route | Page | Component |
| --- | --- | --- |
| `/` | Dashboard | `src/pages/Dashboard.tsx` |
| `/assets` | Asset Management | `src/pages/Assets.tsx` |
| `/gurus` | Investment Gurus | `src/pages/Gurus.tsx` |
| `/fire` | FIRE Planner | `src/pages/FirePlanner.tsx` |
| `/settings` | Settings | `src/pages/Settings.tsx` |
| `/about` | About | `src/pages/About.tsx` |

## State Management

All global state uses Zustand 5 with `persist` middleware (localStorage) and granular selector subscriptions alongside TanStack Query for server state. Store files live in `src/stores/`.

모든 전역 상태는 `persist` 미들웨어(localStorage)를 사용하는 Zustand 5 스토어(Granular Selector 최적화 적용) 및 서버 상태를 위한 TanStack Query로 관리됩니다. 스토어 파일은 `src/stores/`에 위치합니다.

| Store | File | Purpose |
| --- | --- | --- |
| `useAssetStore` | `useAssetStore.ts` | Asset list / 자산 목록 |
| `useBrokerStore` | `useBrokerStore.ts` | Broker accounts / 브로커 계좌 |
| `useFireStore` | `useFireStore.ts` | FIRE simulation inputs & preferences / FIRE 시뮬레이터 설정 |
| `useSettingsStore` | `useSettingsStore.ts` | Currency, exchange rates, target allocations / 통화·환율·목표 배분 |
| `useProfileStore` | `useProfileStore.ts` | User profile / 사용자 프로필 |
| `useLanguageStore` | `useLanguageStore.ts` | Active locale / 현재 언어 |
| `useSnapshotStore` | `useSnapshotStore.ts` | Portfolio value history / 포트폴리오 가치 이력 |
| `useGuruSessionStore` | `useGuruSessionStore.ts` | Guru AI chat sessions / 구루 AI 채팅 세션 |
| `useGoogleDriveStore` | `useGoogleDriveStore.ts` | Google Drive auth state / Google Drive 인증 상태 |

Storage keys are defined in `src/constants/storage.ts`.

스토리지 키는 `src/constants/storage.ts`에 정의되어 있습니다.

## App Layout

앱의 레이아웃 구성 컴포넌트입니다.

| Component | Location | Role |
| --- | --- | --- |
| `Layout` | `components/layout/Layout.tsx` | Root shell (header + content area + bottom nav) / 루트 셸 |
| `Header` | `components/layout/Header.tsx` | Top bar (logo, global navigation, language dropdown) / 상단 GNB 바 |
| `BottomNav` | `components/layout/BottomNav.tsx` | Mobile bottom navigation bar / 모바일 하단 내비게이션 |
| `ScrollToTop` | `components/layout/ScrollToTop.tsx` | Scroll restoration on route change / 라우트 이동 시 스크롤 상단 복원 |

## Privacy Model

- No backend, no database, no user accounts.
- All data lives in browser `localStorage`.
- Yahoo Finance and FRED requests are proxied — the proxy does **not** receive or store portfolio data.
- Google Drive integration is optional; data is stored in the user's own Drive folder.
- AI prompts are generated client-side and placed in clipboard — never transmitted by the app.

- 백엔드, 데이터베이스, 사용자 계정 없음.
- 모든 데이터는 브라우저 `localStorage`에 저장.
- Yahoo Finance 및 FRED 요청은 프록시를 통하지만, 프록시는 포트폴리오 데이터를 받거나 저장하지 않음.
- Google Drive 연동은 선택사항이며, 데이터는 사용자 본인의 Drive 폴더에 저장.
- AI 프롬프트는 클라이언트에서 생성되어 클립보드에 저장되며 앱이 전송하지 않음.

## Document Index

설계 문서 목록입니다.

| Document | Path | Contents |
| --- | --- | --- |
| Overview / 전체 개요 | `doc/overview.md` | App concept, routing, state, privacy |
| Dashboard / 대시보드 | `doc/pages/dashboard.md` | Dashboard page spec |
| Asset Management / 자산 관리 | `doc/pages/assets.md` | Asset management page spec |
| Gurus / 투자 구루 | `doc/pages/gurus.md` | Gurus page + analyzers |
| FIRE Planner / FIRE 플래너 | `doc/pages/fire.md` | FIRE projection & compounding simulation |
| Settings / 설정 | `doc/pages/settings.md` | Settings page + user profile |
| AI Prompts / AI 프롬프트 | `doc/features/ai-prompts.md` | AI prompt system |
| i18n / 다국어 | `doc/features/i18n.md` | i18n system + translation guide |
| Yahoo Finance | `doc/system/yahoo-finance.md` | Yahoo Finance & FRED proxy integration |
