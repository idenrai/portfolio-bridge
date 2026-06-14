---
description: 백엔드(Node.js/API) 아키텍처 설계, API 개발 및 리팩토링
---

# Backend Engineering Workflow

**Activation:** `/backend` (또는 Node.js 서버, REST API, Vercel Serverless Function 등 백엔드 영역의 생성, 수정, 아키텍처 결정을 진행할 때)

이 워크플로우는 백엔드와 관련된 아키텍처 설계, API 개발, 리팩토링 및 성능 최적화의 모든 라이프사이클에 적용되는 마스터 가이드라인입니다. 단순한 코딩을 넘어 **의사결정(Decision-making)과 검증(Validation)**에 초점을 맞춥니다.

## 1. 선행 지식 로드 (필수)
백엔드 관련 작업을 시작하기 전, 다음 두 가지 스킬(지침서)을 **반드시 먼저 읽고** 원칙을 숙지하십시오:
- `.agents/skills/nodejs-best-practices/SKILL.md` (아키텍처 사고 방식, 프레임워크 선택, 보안 원칙)
- `.agents/skills/nodejs-backend-patterns/SKILL.md` (실제 코드 구현 패턴)

## 2. Framework & Architecture Selection
- 맹목적으로 기존의 코드를 복사하거나 기본값(Express 등)을 선택하지 마십시오.
- **컨텍스트 확인:** 현재 배포 환경(Vercel Edge, Node.js 서버 등), 성능 요구사항, 팀의 숙련도에 따라 Hono, Fastify, Express, Next.js API 등을 상황에 맞게 제안합니다.
- 복잡해지는 로직은 항상 Controller(Route), Service, Repository 계층으로 분리하여 단일 책임 원칙을 준수합니다.

## 3. Security & Validation (Zero-Trust)
- **모든 경계에서 검증:** 클라이언트로부터 들어오는 입력(Query params, Body, Headers)을 절대 신뢰하지 않습니다.
- Zod, Valibot 등의 라이브러리를 활용하여 API 진입점에서 반드시 데이터 스키마 유효성 검사(Validation)를 수행합니다.
- 비밀키, 데이터베이스 URL 등 민감한 정보는 절대 하드코딩하지 않으며 환경 변수(Environment Variables)를 통해서만 접근합니다.

## 4. Error Handling
- **중앙화된 에러 처리:** 모든 계층(Layer)에서 발생한 에러는 상위 미들웨어나 핸들러에서 일괄적으로 잡을 수 있도록 커스텀 에러 클래스를 활용합니다.
- 클라이언트에게는 상황에 맞는 명확한 HTTP Status Code(400, 401, 403, 404, 500 등)와 친절한 메시지를 반환합니다.
- 서버의 내부 정보(Stack Trace 등)는 오직 서버 로그에만 남기며 절대 클라이언트에게 노출해서는 안 됩니다.

## 5. Async Patterns & Event Loop
- I/O 바운드 작업(DB 쿼리, 외부 API 호출 등)은 철저히 비동기(`async/await`, `Promise.all` 등) 패턴으로 구현합니다.
- 프로덕션 코드에서 이벤트 루프를 블로킹할 수 있는 동기(Sync) 메서드의 사용을 엄격히 금지합니다.
