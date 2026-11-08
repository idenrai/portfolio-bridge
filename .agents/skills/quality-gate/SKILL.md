---
name: quality-gate
description: TypeScript 타입 검사, ESLint 린트 자동 수정(--fix), Vitest 단위 테스트, Vite 프로덕션 빌드 검증 및 트러블슈팅을 전담하는 통합 품질 게이트 스킬
---

# Quality Gate Skill

**트리거:** `/quality-gate` (또는 빌드 확인, 린트 오류 수정, 타입 에러 진단, 배포 전 품질 검증 시)

기존 `build-check`, `build-guard`, `lint-fix`의 역할을 통합하여, **Fail-Fast & Fail-Cheap** 원칙에 입각한 검증 파이프라인을 운영합니다.

---

## 1. 검증 파이프라인 원클릭 실행
```bash
./.agents/skills/quality-gate/scripts/verify-all.sh
```

### 단계별 검증 규약 (Fail-Fast 순서):
1. **타입 검증 (`npx tsc --noEmit`):** 가장 빠르고 저렴하게 컴파일 타임 에러와 Props 불일치를 검출합니다.
2. **린트 검증 및 자동 수정 (`npm run lint -- --fix`):** ESLint 9 플랫 컨피그 및 `eslint-plugin-tailwindcss` 클래스 정렬/중복을 자동 해결합니다.
3. **단위 테스트 (`npx vitest run`):** 비즈니스 계산 로직, 프롬프트 생성 헬퍼, 커스텀 훅을 검증합니다.
4. **프로덕션 빌드 (`npm run build`):** Vite 7 번들링 무결성을 최종 확인합니다.

---

## 2. 자주 발생하는 에러 패턴 및 해결책
| 에러 코드 | 주요 원인 | 조치 방안 |
|---|---|---|
| `TS2345` / `TS2322` | 다국어 키 추가 후 `src/i18n/types.ts` 누락 | `types.ts` 인터페이스 및 4개 언어 파일 동기화 |
| `TS1117` | 로캘 파일 내 동일 키 중복 정의 | 중복 키 제거 |
| `TS2339` | Zustand 스토어 타입에 신규 필드 누락 | `UserProfile` 또는 해당 Store 인터페이스 업데이트 |
| ESLint Tailwind 정렬 경고 | 클래스 순서 불일치 | `npm run lint -- --fix` 실행 |

