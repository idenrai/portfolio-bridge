# Project Guidelines (SSoT)

이 파일은 AI 에이전트가 상황에 맞게 최신 규칙(Rules), 서브에이전트(Subagents), 스킬(Skills), 라이프사이클 훅(Hooks), MCP 도구를 탐색하고 오케스트레이션할 수 있도록 안내하는 Antigravity 2.0 단일 진실 공급원(SSoT) 마스터 라우팅 파일입니다.

---

## 📌 1. Core Rules (항상 준수)
- **프로젝트 아키텍처 & 스택:** `.agents/rules/project-context.md`
- **보안 & 데이터 프라이버시 (Zero-Trust / Local-First):** `.agents/rules/security.md`
- **React 19 / TypeScript 5.9 / Tailwind v4 / Zustand 5 코딩 표준:** `.agents/rules/react-typescript.md`
- **Conventional Commits 규약:** `.agents/rules/git-commit-rules.md`
- **언어 제어 전략 (채팅, 산출물, PR 본문 100% 한국어):** `.agents/rules/language-strategies.md`
- **구루 아바타 화이트 라인 아트 스타일 규격:** `.agents/rules/guru-avatar-style.md`
- **시니어 엔지니어 행동 규범 & 인덱싱 의식:** `.agents/rules/senior-engineer-conduct.md`, `.agents/rules/indexing-codebase.md`

---

## 🤖 2. Declarative Subagents (선언형 서브에이전트)
메인 컨텍스트를 오염시키지 않고 독립된 관점과 전용 도구 세트로 백그라운드 작업을 수행하는 전문 서브에이전트입니다.

- **전문 코드 리뷰어 (`code-reviewer`):** `.agents/agents/code-reviewer.md` (블룸버그 UI/UX, 접근성, 보안, 성능 다각도 편향 없는 감사)
- **품질 게이트 검증자 (`quality-guard`):** `.agents/agents/quality-guard.md` (격리된 환경에서 빌드, 타입 검사, 린트, Vitest 테스트 일괄 검증 및 장애 분석)

---

## 🛠️ 3. Specialized Modern Skills (모던 스킬 및 슬래시 커맨드)
Antigravity 2.0 사양에 따라 모든 절차는 점진적 공개(Progressive Disclosure)를 준수하는 모듈형 스킬(`.agents/skills/<name>/SKILL.md`)로 구성됩니다.

- **심층 기술 조사 및 아키텍처 원인 규명 (`/deep-dive`):** `.agents/skills/deep-dive/SKILL.md` (Context7 공식 문서 교차검증 + Sequential Thinking 다단계 논리 분석)
- **프론트엔드 UI/UX & 블룸버그 단말기 디자인 시스템 (`/frontend`):** `.agents/skills/frontend/SKILL.md` (Sharp edges, Fira Code, Amber/Green 텔레메트리, 안티-AI-슬롭, WAI-ARIA 접근성)
- **백엔드 & Vercel Edge Runtime 프록시 (`/backend`):** `.agents/skills/backend/SKILL.md` (Zero-Trust 파라미터 검증, 스마트 엣지 캐싱, 무상태 아키텍처)
- **구루 AI 프롬프트 엔지니어링 (`/prompt`, `/guru-prompt`):** `.agents/skills/guru-prompt/SKILL.md` (페르소나 렌즈, 프롬프트 인젝션 방어, 세무 최적화, 아바타 스텐실 변환 스크립트)
- **점진적 무중단 리팩토링 (`/refactor`):** `.agents/skills/refactor/SKILL.md` (Green Baseline, 6단계 파이프라인, 마틴 파울러 코드 스멜 카탈로그)
- **품질 게이트 & Fail-Fast 파이프라인 (`/quality-gate`):** `.agents/skills/quality-gate/SKILL.md` (1초 타입 체크 `tsc --noEmit`, ESLint `--fix`, Vitest, 번들 빌드)
- **4개 국어(ko/en/ja/de) 번역 동기화 & 감사 (`/i18n`):** `.agents/skills/i18n/SKILL.md` (키 누락/중복/불일치 1초 감사 스크립트 내장)
- **커밋 메시지 자동 생성 (`/commit`, `/commit-kr`):** `.agents/skills/commit/SKILL.md` (Conventional Commits 한영 규격)
- **문서 동기화 및 PR 자동 생성 (`/pr`):** `.agents/skills/pr/SKILL.md` (`doc/` 영한 병기 동기화, 단계적 커밋 분할, `github-mcp-server` 연동)
- **다각도 전문 코드 리뷰 (`/review`, `/code-review`):** `.agents/skills/code-review/SKILL.md` (`code-reviewer` 서브에이전트 위임 및 체크리스트 감사)
- **원격 정리된 로컬 브랜치 일괄 정리 (`/prune`):** `.agents/skills/prune/SKILL.md` (`[gone]` 상태 고립 브랜치 감지, 보호 브랜치 보존 및 일괄 안전 삭제)
- **로컬 퍼스트(Local-First) 영속성 & 동기화:** `.agents/skills/local-first/SKILL.md`
- **단위 테스트 작성 및 모범 사례:** `.agents/skills/vitest/SKILL.md`
- **UI 변경 시각적 차이(Visual Diff) 검증:** `.agents/skills/before-and-after/SKILL.md` 및 `agent-browser`

---

## 🛡️ 4. Lifecycle Hooks (생명주기 안전 가드)
- **PreToolUse 안전 가드 (`.agents/hooks.json`):**
  - 파괴적 셸 명령(`git push --force`, `git reset --hard`, `rm -rf`, `main` 브랜치 삭제, `--no-verify`)을 사전 차단하는 Node.js 고속 가드 (`.agents/hooks/scripts/block-dangerous-commands.cjs`).

---

## 🔌 5. Model Context Protocol (MCP 서버 연동)
- **GitHub MCP (`github-mcp-server`):** PR 생성, 이슈 조회, 커밋 히스토리 추적.
- **Context7 (`context7`):** React 19, Tailwind v4, Zustand 5 등 최신 공식 문서 실시간 교차검증.
- **Sequential Thinking (`sequential-thinking`):** 복잡한 기술적 문제의 다단계 논리 분석 및 가설 반증.
