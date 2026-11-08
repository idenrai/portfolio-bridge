---
name: backend
description: Develops Vercel Edge Runtime Serverless Functions, Zero-Trust input validation, smart edge caching, and proxy clients for Yahoo Finance and FRED.
---

# Backend Engineering (Vercel Edge API 프록시 엔지니어링)

**트리거:** `/backend` (Vercel Edge Functions, API 프록시, 야후 파이낸스/FRED 연동, 헬스체크 개발 시)

이 스킬은 무상태(Stateless) 고성능 엣지 프록시 계층을 구현하기 위한 런북입니다.

---

## 1. Vercel Edge Runtime 원칙 (`api/`)
- 모든 서버리스 함수는 `export const config = { runtime: "edge" };` 선언 필수.
- Node.js 내장 모듈 대신 Web Standard API (`Request`, `Response`, `fetch`, `Headers`) 사용.
- **타임아웃 방어**: 업스트림 외부 요청에 `AbortSignal.timeout(10_000)` 강제 적용.

---

## 2. Zero-Trust 입력 검증 & 무상태 아키텍처
1. **화이트리스트 검증**: URL 경로(`__path`) 및 쿼리 파라미터는 화이트리스트 정규식으로 엄격히 필터링하며 `..`를 차단합니다.
2. **HTTP 메서드 검증**: 허용되지 않은 메서드는 `405 Method Not Allowed` (`Allow` 헤더 동반)로 즉시 거부합니다.
3. **사용자 데이터 비전송**: 사용자의 금융 자산/포트폴리오는 서버로 전송받지 않으며 오직 브라우저 로컬스토리지에만 존재합니다.

---

## 3. 스마트 엣지 캐싱 적용
엔드포인트 성격에 맞추어 `Cache-Control` (`s-maxage`, `stale-while-revalidate`)을 구성합니다.
상세 캐시 정책 및 예제 코드는 [엣지 캐싱 및 보안 참조서](./references/edge-caching.md)를 확인합니다.
