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
| Asset Management | Yahoo Finance ticker search, manual entry, AI classification, CSV import/export |
| Investment Gurus | 20 guru personas, ideal allocation comparison, 6 quantitative analyzers, AI prompt generation |
| AI Portfolio Analysis | Structured prompts for ChatGPT / Claude / Gemini / Grok |
| Auto Insights | Alerts for overweight, large losses, low cash, currency overexposure |
| Multi-language | Korean / English / 日本語 / Deutsch with instant switch |
| FIRE Planner | Project portfolio growth to financial independence based on safe withdrawal rates |
| Google Drive Backup | Optional sync of localStorage data to the user's own Google Drive |

| 기능 | 설명 |
| --- | --- |
| 통합 대시보드 | KPI 바, 배분 차트, 보유 종목 테이블, 리밸런싱 제안, 자동 인사이트 |
| 자산 관리 | Yahoo Finance 종목 검색, 수동 등록, AI 카테고리 분류, CSV 가져오기·내보내기 |
| 투자 구루 | 20명의 구루 페르소나, 이상적 배분 비교, 6종 정량 채점기, AI 프롬프트 생성 |
| AI 포트폴리오 분석 | ChatGPT / Claude / Gemini / Grok에 바로 붙여넣을 구조화 프롬프트 |
| 자동 인사이트 | 과대비중·큰 손실·현금 부족·환 노출 초과 자동 감지 경고 |
| 다국어 | 한국어 / English / 日本語 / Deutsch 즉시 전환 |
| FIRE 플래너 | 안전 인출률을 기반으로 재정적 자유(FIRE) 달성까지의 포트폴리오 성장 시뮬레이션 |
| Google Drive 백업 | localStorage 데이터를 사용자 개인 Google Drive에 선택적 동기화 |

## Architecture

The app runs in three distinct environments.

앱은 세 가지 실행 환경을 지원합니다.

```text
Local dev (Vite)          Vercel deployment           Tauri desktop
┌────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ React SPA      │    │ React SPA (CDN)    │    │ React SPA (WebView)│
│ Vite proxy     │    │ Serverless Fn      │    │ tauri-plugin-http  │
└──────┬─────────┘    └────────┬───────────┘    └─────────┬──────────┘
       └──────────────────────┴─────────────────────────┘
                               ↓
                        Yahoo Finance API
```

`yahooFetch()` in `src/utils/yahoo/yahooCore.ts` auto-detects the runtime and routes requests accordingly.

`yahooFetch()`는 런타임을 자동 감지하여 적절한 경로로 요청을 전달합니다.

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

All global state uses Zustand with `persist` middleware (localStorage). Store files live in `src/stores/`.

모든 전역 상태는 `persist` 미들웨어(localStorage)를 사용하는 Zustand 스토어로 관리됩니다. 스토어 파일은 `src/stores/`에 위치합니다.

| Store | File | Purpose |
| --- | --- | --- |
| `useAssetStore` | `useAssetStore.ts` | Asset list / 자산 목록 |
| `useBrokerStore` | `useBrokerStore.ts` | Broker accounts / 브로커 계좌 |
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
| `Layout` | `components/layout/Layout.tsx` | Root shell (header + content area + footer) / 루트 셸 |
| `Header` | `components/layout/Header.tsx` | Top bar (logo, global navigation, language, currency) / 상단 GNB 바 |
| `BottomNav` | `components/layout/BottomNav.tsx` | Mobile bottom navigation / 모바일 하단 내비게이션 |

## Privacy Model

- No backend, no database, no user accounts.
- All data lives in browser `localStorage`.
- Yahoo Finance requests are proxied — the proxy does **not** receive or store portfolio data.
- Google Drive integration is optional; data is stored in the user's own Drive folder.
- AI prompts are generated client-side and placed in clipboard — never transmitted by the app.

- 백엔드, 데이터베이스, 사용자 계정 없음.
- 모든 데이터는 브라우저 `localStorage`에 저장.
- Yahoo Finance 요청은 프록시를 통하지만, 프록시는 포트폴리오 데이터를 받거나 저장하지 않음.
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
| Settings / 설정 | `doc/pages/settings.md` | Settings page + user profile |
| AI Prompts / AI 프롬프트 | `doc/features/ai-prompts.md` | AI prompt system |
| i18n / 다국어 | `doc/features/i18n.md` | i18n system + translation guide |
| Yahoo Finance | `doc/system/yahoo-finance.md` | Yahoo Finance integration |
| Tauri | `doc/system/tauri.md` | Tauri desktop app |
