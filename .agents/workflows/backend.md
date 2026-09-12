---
description: 백엔드(Node.js/API/Edge Runtime) 아키텍처 설계, API 개발 및 비즈니스 로직 구현
---

# Backend Engineering Workflow

**Activation:** `/backend` (또는 Node.js 서버, REST API, Vercel Edge Runtime Proxy 등 백엔드 영역의 생성, 수정, 아키텍처 결정을 진행할 때)

이 워크플로우는 백엔드 및 엣지 프록시와 관련된 아키텍처 설계, API 개발, 비즈니스 로직 구현 및 성능 최적화의 모든 라이프사이클에 적용되는 마스터 가이드라인입니다. 단순한 코딩을 넘어 **의사결정(Decision-making)과 검증(Validation)**에 초점을 맞춥니다.

## 1. 선행 지식 로드 (필수)
백엔드 및 API 관련 작업을 시작하기 전, 다음 스킬(지침서)을 **반드시 먼저 읽고** 원칙을 숙지하십시오:
- `.agents/skills/nodejs-best-practices/SKILL.md` (아키텍처 사고 방식, 프레임워크 선택, 보안 원칙)
- `.agents/skills/nodejs-backend-patterns/SKILL.md` (실제 코드 구현 패턴)
- **로컬 퍼스트(Local-First) 연동 및 오프라인 회복력 설계 시:** `.agents/skills/local-first/SKILL.md` 읽기 (네트워크 프로브 엔드포인트 설계, 스마트 엣지 캐싱, 오프라인 지원 API 패턴, 무상태 엣지 가드레일)
- **Vercel Edge Runtime & 프록시 연동 시:** `.agents/skills/yahoo-finance/SKILL.md` 및 `.agents/skills/vercel-react-best-practices/SKILL.md` (Edge Functions, 엣지 캐싱, 쿠키/크럼 인증)
- **AI 프롬프트 및 분석 유틸리티 연동 시:** 구루 프롬프트 조립, 계좌/세무 데이터 블록 주입, 구조화된 분석 포맷을 설계하거나 수정할 때는 반드시 `.agents/workflows/prompt.md` 워크플로우를 참조합니다.

## 2. Runtime & Architecture Selection
- **Vercel Edge Runtime 활용 (`api/` 디렉터리):**
  - 모든 Vercel 서버리스 엔드포인트는 `export const config = { runtime: "edge" };` 기반의 **Edge Runtime**으로 작성합니다.
  - Node.js 내장 모듈(fs, path 등) 대신 **Web Standard API (`Request`, `Response`, `fetch`, `Headers`)**를 사용합니다.
  - 엣지 레이트리밋 방어 및 응답속도 향상을 위해 성공적인 GET 응답에 적절한 `Cache-Control` 헤더(`s-maxage`, `stale-while-revalidate`)를 부여합니다.
- **Local-First 지원 원칙 (Privacy-First & Stateless Edge):**
  - 백엔드(Edge Functions)는 사용자의 개인 금융 상태를 서버에 영속화하지 않습니다. 모든 영속 상태는 클라이언트 브라우저가 소유합니다.
  - 클라이언트의 실시간 오프라인 감지 및 재연결 프로브를 위해 무캐시(No-cache) 헬스체크 엔드포인트(`/api/health`)를 항시 지원합니다.
  - 외부 시세/환율 데이터는 엣지 캐싱(`s-maxage`, `stale-while-revalidate`)을 적극 적용하여 클라이언트 오프라인 복귀 시 버스트 부하를 방어합니다.
  - **스토리지 엔진 마이그레이션 기준:** 등록 자산 수가 500건을 초과하거나 로컬 스토리지 사용량이 3MB(5MB 한도의 60%)를 초과할 경우, `.agents/skills/local-first/SKILL.md`의 IndexedDB 또는 OPFS/SQLite WASM 마이그레이션 패턴 도입을 우선 검토합니다.
- 복잡해지는 로직은 항상 Controller(Route), Service 계층으로 분리하여 단일 책임 원칙을 준수합니다.

> [!TIP]
> **순수 리팩토링 위임 (Handoff to `/refactor`):**
> API 인터페이스 및 엣지 프록시 동작을 100% 보존한 채 파일 경로 이동, 계층 구조 개편, 중복 제거, 코드 스멜 개선 등 순수 리팩토링을 진행할 때는 본 워크플로우 대신 반드시 `.agents/workflows/refactor.md` 워크플로우를 호출하십시오.

## 3. Security & Validation (Zero-Trust)
- **모든 경계에서 검증:** 클라이언트로부터 들어오는 입력(Query params, Body, Headers)을 절대 신뢰하지 않습니다.
- **경로 및 네임스페이스 보안 검증:** API 프록시 경로(`__path`, `id` 등)는 반드시 정규식 검증(Path Traversal `..` 차단, 허용된 접두사 및 화이트리스트 검사)을 통과해야 합니다.
- 비밀키, API 토큰 등 민감한 정보는 절대 하드코딩하지 않으며 환경 변수(Environment Variables)를 통해서만 접근합니다.

## 4. Error Handling
- **중앙화된 에러 처리:** 모든 계층(Layer)에서 발생한 에러는 상위 핸들러에서 일괄적으로 잡을 수 있도록 try-catch 및 커스텀 에러 응답 형식을 일관되게 유지합니다.
- 클라이언트에게는 상황에 맞는 명확한 HTTP Status Code(400, 401, 403, 404, 429, 500, 502 등)와 친절한 JSON 메시지를 반환합니다.
- 서버의 내부 상세 정보(Stack Trace 등)는 서버 콘솔(`console.error`)에만 남기며 클라이언트 응답에 노출하지 않습니다.

## 5. Async Patterns & Event Loop
- I/O 바운드 작업(외부 API 호출, 스트리밍 등)은 철저히 비동기(`async/await`, `Promise.all` 등) 패턴으로 구현합니다.
- 외부 API rate limit(429)이나 토큰 만료(401/403) 발생 시 지수 백오프(Exponential Backoff) 및 자동 재시도 패턴을 적용합니다.
