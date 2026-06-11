# Project Guidelines (SSoT)

이 파일은 AI 에이전트가 상황에 맞게 적절한 규칙과 워크플로우를 참조할 수 있도록 라우팅하는 마스터 파일입니다.

## 📌 Core Rules (항상 준수)
코딩 전반에 적용되는 필수 규칙입니다. 코드 작성 전 반드시 다음 파일들을 확인하세요.
- 프로젝트 전체 아키텍처 및 스택: `.agent/rules/project-context.md` 읽기
- React/TypeScript/스타일링/Zustand 코딩 표준: `.agent/rules/react-typescript.md` 읽기
- GitHub 커밋 규칙: `.agent/rules/git-commit-rules.md` 읽기

## 🔄 Workflows (상황별 참조 트리거)
특정 작업이나 상황이 발생했을 때, 해당하는 워크플로우나 에이전트 지침을 로드하세요.

- **컴포넌트/페이지/훅/스토어 신규 생성 시:** `.agent/workflows/component-creator.md` 읽기
- **번역 키 추가 및 다국어(i18n) 작업 시:** `.agent/workflows/i18n-sync.md` 및 `.agent/workflows/i18n-audit.md` 읽기
- **빌드 검토 및 오류 해결 시:** `.agent/workflows/build-guard.md` 및 `.agent/workflows/build-check.md` 읽기
- **단위 테스트 작성 및 검증 시:** `.agent/workflows/test-writer.md` 읽기
- **Yahoo Finance API 연동 및 수정 시:** `.agent/skills/yahoo-finance/SKILL.md` 읽기
- **코드 리뷰 요청 시:** `.agent/workflows/review.md` 읽기
- **한국어 커밋 메시지 작성 시:** `.agent/workflows/commit-kr.md` 읽기
- **영어 커밋 메시지 작성 시:** `.agent/workflows/commit.md` 읽기
- **기능 구현 전 계획 수립 시:** `.agent/workflows/plan.md` 읽기
- **기존 코드 파악 및 종속성 분석 시:** `.agent/workflows/grasp.md` 읽기
- **코드 및 개념 설명 요청 시:** `.agent/workflows/explain.md` 읽기
- **코드 수정 없이 순수 상담 및 질문 요청 시 (/ask):** `.agent/workflows/ask.md` 읽기
- **현재 세션을 요약하고 파기할 시 (/discard):** `.agent/workflows/discard.md` 읽기
- **ESLint 오류를 자동 수정할 시 (/lint-fix):** `.agent/workflows/lint-fix.md` 읽기

## 🛠 Skills (도구 및 스킬)
AI가 특정 도구나 기능이 필요할 때 로드하세요.
- 프로젝트 인덱싱 및 컨텍스트 파악 필요 시: `.agent/skills/indexing-awareness/SKILL.md` 읽기
- 현재 날짜 및 시간 파악 필요 시 (지식 컷오프 회피): `.agent/skills/knowledge-cutoff-awareness/SKILL.md` 읽기
- Vercel/Next.js 성능 최적화 가이드 필요 시: `.agent/skills/vercel-react-best-practices/SKILL.md` 읽기