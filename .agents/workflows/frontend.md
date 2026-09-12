---
description: 프론트엔드 UI/UX 컴포넌트 신규 생성, 수정 및 리팩토링
---

# Frontend Engineering Workflow

**Activation:** `/frontend` (또는 UI/UX 컴포넌트, 페이지, 훅, 스토어 등의 신규 생성 및 수정을 진행할 때)

이 워크플로우는 프론트엔드와 관련된 생성, 수정, 리팩토링, 디자인 개선의 모든 라이프사이클에 적용되는 마스터 가이드라인입니다.

## 1. Visual Design & Bloomberg Terminal System (필수 준수)

### 1.1 프론트엔드 작업 착수 전 Design Read & 다이얼 선언 (의무)
프론트엔드 컴포넌트나 페이지를 생성/수정할 때는 `.agents/skills/design-taste-frontend/SKILL.md`에 따라 첫머리에 다음 고정 프리셋을 선언하고 이를 기준으로 스타일을 결정합니다:
```text
Reading this as: Financial Terminal for multi-asset investors, with Bloomberg Terminal language (Sharp edges, Fira Code, Amber/Green telemetry, zero generic gradients).
Dials: DESIGN_VARIANCE: 3 | MOTION_INTENSITY: 2 | VISUAL_DENSITY: 9
```

### 1.2 안티-AI-슬롭 엄격 금지 규칙 (Negative Constraints)
`.agents/skills/frontend-design/SKILL.md`의 원칙에 따라 다음 AI 템플릿 기본값들을 **절대 생성하거나 유입시켜서는 안 됩니다**:
- ❌ **보라색/인디고 오염 금지:** `violet-*`, `purple-*`, `indigo-*` 계열의 악센트 및 그라디언트(`bg-linear-to-r from-violet...`) 사용 엄격 금지.
- ❌ **글래스모피즘 오라 금지:** 배경에 떠 있는 블러 글로우(`blur-[80px]`, floating glow balls) 및 `backdrop-blur-md` 남용 금지.
- ❌ **둥근 모서리 남발 금지:** `rounded-lg`, `rounded-xl`, `rounded-2xl` 사용 엄격 금지. 기본은 날카로운 직각(`rounded-none`)이며, 초소형 배지나 인풋에서만 제한적으로 `rounded-sm` 허용.
- ❌ **장식용 AI 아이콘 남용 금지:** `Sparkles`와 같은 맥락 없는 장식성 아이콘 사용 금지. 터미널 프롬프트(`>`), 브래킷(`[ ]`), 상태 인디케이터(`●`) 등 기능적 사이니지를 사용.
- ❌ **과도한 그림자 금지:** `shadow-lg`, `shadow-xl` 등 떠 있는 카드 그림자 배제 (단단한 1px 헤어라인 `border-zinc-800` 사용).

### 1.3 블룸버그 단말기 시그니처 토큰 & 사이니지 (`ui-ux-pro-max` terminal-style)
- **배경 및 테두리:** `bg-black`, `bg-zinc-950`, `border-zinc-800` (1px hairline border).
- **시그니처 앰버(Bloomberg Amber):** `text-amber-400`, `border-amber-500/30`, `bg-amber-500/10` (시스템 하이라이트, 중요 프롬프트, 알림).
- **시그니처 텔레메트리 그린(Terminal Green):** `text-emerald-400`, `border-emerald-500/30`, `bg-emerald-500/10` (수익, 긍정 지표).
- **시그니처 터미널 레드(Terminal Red):** `text-rose-400`, `border-rose-500/30`, `bg-rose-500/10` (손실, 위험 지표).
- **타이포그래피:** 모든 수치와 티커 심볼은 `font-mono tabular-nums` (`Fira Code`). 라벨은 마이크로 대문자 표기(`text-2xs font-bold uppercase tracking-wider text-zinc-500`).
- **브래킷 사이니지:** 버튼 및 배지는 `[ BUTTON ]`, `[ 01 ]`, `[ LIVE ]` 형태의 터미널 브래킷 감싸기 유지.
- **반응형 검증:** 모바일 우선(Mobile-first) 레이아웃을 준수하되 모바일에서도 고밀도(DENSITY 9) 정보 전달력을 유지.
- **Tailwind CSS v4 최신 스케일:** 임의 픽셀 값(`rounded-[4px]`, `h-[30px]`) 대신 v4 공식 토큰(`rounded-sm`, `h-7.5`, `min-h-11`) 사용.
- **AI 프롬프트 생성기 및 구루 컴포넌트 작업 시:** 반드시 `.agents/workflows/prompt.md` 워크플로우를 참조하여 프롬프트 품질과 프라이버시 원칙을 보장.

## 2. State Management & Data Fetching
- **Zustand 5 클라이언트 상태 관리:**
  - 글로벌 클라이언트 상태(자산 목록, 설정, 브로커, 프로필 등)는 Zustand 5 스토어로 관리합니다.
  - 스토어 생성 및 상태 구독 시 `.agents/skills/zustand-5/SKILL.md`의 패턴(Granular Selectors, `persist` 미들웨어, 불변성 보장)을 철저히 준수합니다.
- **TanStack Query (React Query v5) 비동기 서버 상태:**
  - API 통신, 시세 및 외부 데이터 캐싱 시 `.agents/skills/tanstack-query-best-practices/SKILL.md`를 기반으로 Query Key Factory, Stale Time, 낙관적 업데이트(Optimistic Updates)를 설계합니다.
- **로컬 퍼스트(Local-First) 지속성 및 오프라인 설계:**
  - 클라이언트 상태 저장소 설계 시 `.agents/skills/local-first/SKILL.md`의 원칙(영구 스토리지 `navigator.storage.persist()`, 다중 탭 동기화 `useMultiTabSync`, 스토리지 쿼터 모니터링, 안전한 JSON 백업)을 철저히 준수합니다.
  - TanStack Query 사용 시 `networkMode: 'offlineFirst'` 및 적절한 `gcTime`을 설정하여 오프라인 환경에서도 캐시된 시세를 즉시 렌더링할 수 있도록 보장합니다.

## 3. Component Structure & Modification
- 모든 컴포넌트는 Functional Component 구조의 훅(Hooks) 패턴으로만 작성합니다.
- Props 및 상태 타입 정의 시 `.agents/skills/typescript-advanced-types/SKILL.md` 및 `.agents/skills/typescript-best-practices/SKILL.md`를 준수하여 `any`를 엄격히 금지하고 Discriminated Union 및 엄격한 타입을 적용합니다.
- Tailwind CSS v4 유틸리티 클래스만 사용하여 스타일링하며, 인라인 스타일(`style={{}}`)은 특별히 동적인 렌더링을 제외하고는 사용하지 않습니다.
- 컴포넌트의 클래스 조합 및 props 오버라이드는 반드시 `@/utils/cn`(`twMerge` + `clsx`) 유틸리티를 사용하여 안전하게 병합합니다. (단순 템플릿 리터럴 결합 지양)
- 내부 임포트 경로는 상대 경로 대신 항상 `@/` 별칭(Alias)을 사용합니다.
- 변경 후에는 반드시 `npm run lint -- --fix`를 실행하여 Tailwind 클래스 순서를 정렬하고 중복을 자동 제거합니다.

## 4. Component Scaffolding (신규 생성 시)
새로운 파일을 생성할 때는 다음 구조 규칙을 따릅니다:
- **File placement & naming**
  - Reusable primitive: `src/components/common/PascalCase.tsx`
  - Feature component: `src/components/<feature>/PascalCase.tsx`
  - Page (route): `src/pages/PascalCase.tsx`
  - Custom hook: `src/hooks/useCamelCase.ts`
  - Zustand store: `src/stores/use<Domain>Store.ts`
  - Utility function: `src/utils/camelCase.ts`
- **Barrel Exports:** 새로운 파일을 생성한 후, 동일 디렉토리 내의 `index.ts`를 반드시 업데이트합니다 (예: `export { MyComponent } from "./MyComponent";`).

## 5. i18n 동기화 (다국어 지원)
컴포넌트 생성 또는 수정 과정에서 사용자에게 노출되는 문자열(User-visible strings)이 포함되거나 변경될 경우:
1. 관련된 모든 다국어 문자열 키를 식별합니다.
2. `src/i18n/types.ts` 파일에 키를 추가하거나 업데이트합니다.
3. 4개의 로캘 파일(`ko.ts`, `en.ts`, `ja.ts`, `de.ts`)의 정확히 동일한 상대적 위치에 번역을 추가합니다.

## 6. Verification & Quality Audit (검증 및 QA 파이프라인)
프론트엔드 컴포넌트 생성 또는 수정 후에는 다음 단계적 검증을 필수로 수행합니다:
1. **단위 및 컴포넌트 테스트 검증:** 핵심 계산 유틸리티나 복잡한 훅/컴포넌트 변경 시 `.agents/skills/vitest/SKILL.md`를 참조하여 단위 테스트를 작성 및 실행(`npx vitest run`)합니다.
2. **코드 정렬 및 린트 검사:** `npm run lint -- --fix`를 실행하여 Tailwind 클래스 순서 정렬 및 코드 표준을 검증합니다.
3. **디자인 및 접근성 감사:** `.agents/skills/web-design-guidelines/SKILL.md`를 기반으로 웹 인터페이스 가이드라인, 터치 타겟(최소 44px), 명도 대비, 키보드 네비게이션, 시각적 계층을 감사합니다.
4. **시각적 비교(Visual Diff) 검증:** `/before-and-after` 스킬 또는 `.agents/skills/agent-browser/SKILL.md` / `.agents/skills/webapp-testing/SKILL.md`를 활용하여 브라우저 렌더링 상태 및 변경 전후의 시각적 차이를 직접 검증합니다.
