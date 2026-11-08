# Edge Caching & Proxy Security Specifications

Vercel Edge Runtime 프록시(`api/proxy.ts`, `api/fred.ts`, `api/health.ts`)의 캐싱 헤더 및 Zero-Trust 파라미터 검증 사양서입니다.

---

## 1. Smart Edge Caching Profiles

| 엔드포인트/데이터 유형 | Cache-Control 헤더 | 목적 |
| :--- | :--- | :--- |
| **차트 데이터 (`/chart`)** | `s-maxage=300, stale-while-revalidate=600` | 5분 엣지 캐싱으로 야후 파이낸스 레이트 리밋 방어 |
| **기본 펀더멘털 (`/quoteSummary`)** | `s-maxage=60, stale-while-revalidate=120` | 1분 엣지 캐싱 |
| **티커 검색 (`/search`)** | `s-maxage=60, stale-while-revalidate=120` | 1분 엣지 캐싱 (반복 검색 최적화) |
| **실시간 호가 시세 (`realtime`)** | `s-maxage=15, stale-while-revalidate=30` | 15초 짧은 캐시로 신선도 유지 |
| **FRED 거시경제 지표 (`api/fred`)** | `s-maxage=86400, stale-while-revalidate=43200` | 1일 엣지 캐싱 (경제 지표는 갱신 빈도 낮음) |
| **시스템 헬스체크 (`api/health`)** | `no-cache, no-store, must-revalidate` | 무캐시 실시간 인프라 가동 상태 모니터링 |

---

## 2. Zero-Trust Security Guards

```typescript
// Path Traversal 방어 정규식
const SAFE_PATH_REGEX = /^[a-zA-Z0-9_\-\/.]+$/;
if (!SAFE_PATH_REGEX.test(pathname) || pathname.includes("..")) {
  return new Response(JSON.stringify({ error: "Invalid path format" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

// Timeout 가드 (10초 강제)
const signal = AbortSignal.timeout(10_000);
```

