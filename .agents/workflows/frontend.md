---
description: 프론트엔드 UI/UX 컴포넌트 신규 생성, 수정 및 리팩토링
---

# Frontend Engineering Workflow

**Activation:** `/frontend` (또는 UI/UX 컴포넌트, 페이지, 훅, 스토어 등의 신규 생성 및 수정을 진행할 때)

이 워크플로우는 프론트엔드와 관련된 생성, 수정, 리팩토링, 디자인 개선의 모든 라이프사이클에 적용되는 마스터 가이드라인입니다.

## 1. Visual Design & UI/UX (필수 준수)
- **컴포넌트 수정 및 생성 시:** 기존 프로젝트의 톤앤매너(Zinc/Black 기반 다크 미니멀리즘, 터미널 감성의 모노스페이스 배지 등) 일관성을 엄격히 유지합니다.
- **반응형 검증:** 항상 모바일 우선(Mobile-first) 레이아웃을 고려하며, 필요 시 Tailwind의 반응형 유틸리티(`md:`, `lg:`)를 적극 활용하여 여백과 크기를 세밀하게 조정합니다.
- UI/UX 변경 시 항상 `.agents/skills/ui-ux-pro-max/SKILL.md`, `.agents/skills/frontend-design/SKILL.md`, `.agents/skills/design-taste-frontend/SKILL.md`를 우선 참조하여 안티-슬롭(Anti-slop) 원칙 및 퀄리티 컨트롤을 적용합니다.
- **Tailwind CSS v4 모범 사례 준수:** 스타일링 시 `.agents/skills/tailwind-4-docs/SKILL.md`, `.agents/skills/tailwind-design-system/SKILL.md`, `.agents/skills/tailwind-css-patterns/SKILL.md`를 적극 활용하여 최신 v4 토큰(`@theme`, `@utility`) 및 구조를 준수합니다.
- **Canonical Class 우선 원칙:** 임의 픽셀 값(`rounded-[4px]`, `h-[30px]`, `min-w-[120px]`, `max-w-[200px]`, `min-h-[44px]`, `z-[100]`) 대신 Tailwind v4 공식 스케일(`rounded-sm`, `h-7.5`, `min-w-30`, `max-w-50`, `min-h-11`, `z-100` 등)을 우선적으로 사용합니다.
- 피해야 할 패턴: 일반적인 AI 템플릿(어두운 회색에 형광색 액센트, 세리프 폰트 남용 등)을 피하고 의도적이고 독창적인 디자인 결정을 내립니다.
- UI 텍스트 작성 시 '디자인 속 글쓰기' 가이드(능동태, 명확한 동사, 일관성 있는 사이니지)를 준수합니다.

## 2. State Management & Data Fetching
- **Zustand 5 클라이언트 상태 관리:**
  - 글로벌 클라이언트 상태(자산 목록, 설정, 브로커, 프로필 등)는 Zustand 5 스토어로 관리합니다.
  - 스토어 생성 및 상태 구독 시 `.agents/skills/zustand-5/SKILL.md`의 패턴(Granular Selectors, `persist` 미들웨어, 불변성 보장)을 철저히 준수합니다.
- **TanStack Query (React Query v5) 비동기 서버 상태:**
  - API 통신, 시세 및 외부 데이터 캐싱 시 `.agents/skills/tanstack-query-best-practices/SKILL.md`를 기반으로 Query Key Factory, Stale Time, 낙관적 업데이트(Optimistic Updates)를 설계합니다.

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
