---
name: frontend
description: Develops Bloomberg Terminal style high-density financial UI, enforces anti-AI-slop rules, Tailwind v4, Zustand 5 granular selectors, and WAI-ARIA accessibility.
---

# Frontend Engineering (블룸버그 터미널 UI/UX 구현)

**트리거:** `/frontend` (UI 컴포넌트, 페이지, 스타일, 상태 관리 개발 및 리디자인 요청 시)

이 스킬은 블룸버그 단말기 스타일의 고밀도 금융 인터페이스를 구현하기 위한 개발 런북입니다.

---

## 1. 사전 선언 및 안티-AI-슬롭 가드레일

작업 착수 시 다음 블룸버그 터미널 프리셋을 기준으로 설계합니다:
```text
Reading this as: Financial Terminal for multi-asset investors, with Bloomberg Terminal language (Sharp edges, Fira Code, Amber/Green telemetry, zero generic gradients).
Dials: DESIGN_VARIANCE: 3 | MOTION_INTENSITY: 2 | VISUAL_DENSITY: 9
```

- **절대 금지 (Negative Constraints)**:
  - ❌ 보라/인디고 오염 금지 (`violet-*`, `purple-*`, `indigo-*` 및 그라디언트)
  - ❌ 글래스모피즘 오라 금지 (배경 글로우 블러, 플로팅 볼)
  - ❌ 둥근 모서리 남발 금지 (`rounded-none` 직각 테두리 고수)
  - ❌ 장식성 AI 아이콘 배제 (`Sparkles` 등 배제, 터미널 프롬프트 `>` 브래킷 `[ ]` 사용)
  - ❌ 카드 그림자 배제 (`shadow-*` 대신 1px 헤어라인 `border-zinc-800`)

상세 컬러 및 사이니지 토큰은 [블룸버그 디자인 토큰 참조서](./references/terminal-tokens.md)를 확인합니다.

---

## 2. 상태 관리 및 비동기 통신
1. **Zustand 5 세분화된 셀렉터 (Granular Selectors)**:
   - 전체 스토어 구조분해 금지. 개별 원자 상태를 셀렉터 함수로 구독:
     ```tsx
     const baseCurrency = useSettingsStore((s) => s.baseCurrency);
     ```
2. **TanStack Query v5 오프라인 회복력**:
   - `networkMode: 'offlineFirst'` 및 캐시 수명(`gcTime`, `staleTime`)을 보장하여 로컬 우선성 유지.

---

## 3. UI 구현 4단계 실행 절차
1. **마크업 & 직각 레이아웃 구성**: `rounded-none`, 1px 헤어라인, 고밀도 그리드/플렉스 배치.
2. **타이포그래피 & 수치 정렬**: `font-mono tabular-nums` (`Fira Code`) 적용.
3. **WAI-ARIA 접근성 탑재**: 키보드 트래버설(`Tab`, `Enter`, `Escape`), 포커스 링, `aria-*` 속성 적용.
4. **다국어(i18n) 동기화**: 신규 문자열 발생 시 `src/i18n/{ko,en,ja,de}.ts` 4개 국어 즉시 반영.
