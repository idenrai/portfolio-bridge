---
name: guru-prompt
description: Portfolio Bridge 투자 거장 AI 프롬프트 아키텍처, 페르소나 설계, 프롬프트 인젝션 방어, 세무 최적화(Tax-Efficient Asset Location) 및 델타 팔로우업 프롬프트 엔지니어링 마스터 스킬
---

# Guru Prompt Engineering Skill

**트리거:** `/prompt` 또는 `/guru-prompt` (AI 프롬프트의 신규 작성, 템플릿 설계, 구루 페르소나 추가, 세무 지침 개선 시)

이 스킬은 Portfolio Bridge의 클라이언트 사이드 AI 프롬프트 조립 시스템(`src/utils/ai/`)의 설계, 보안, 다국어 처리 및 테스트 동기화 가이드라인입니다.

---

## 1. 프롬프트 계층 구조 (Instruction Hierarchy)
```
[System Context / Role Persona (buildPersonaHeader)]
  ↓
[Investment Philosophy & Communication Style (philosophyEn & guru.style)]
  ↓
[Context & Real-Time Anchor (Today's date: YYYY-MM-DD)]
  ↓
[Investor Profile ([INVESTOR DATA START] ... [INVESTOR DATA END])]
  ↓
[Task Instructions (Step-by-Step Reasoning, Tax-Efficient Asset Location)]
  ↓
[Portfolio Data Block (Allocations, Accounts, Holdings Table)]
  ↓
[Output Format / Schema]
  ↓
[Response Constraints (Language, No Disclaimers, Web Search Enforcement, Edge Cases)]
```

---

## 2. 5대 핵심 가드레일 (Negative Constraints)
1. **프롬프트 인젝션 방어 (Prompt Injection Defense):**
   - 사용자 자유 입력(닉네임, 메모, 3개년 계획, 커스텀 철학)은 반드시 `[INVESTOR DATA START]` / `[INVESTOR DATA END]` 마커로 격리하여 명령어 탈취를 차단합니다.
2. **영문 철학 SSoT & 다국어 응답 일관성:**
   - 구루의 철학 원문(`philosophyEn`)과 렌즈는 뉘앙스 왜곡 방지를 위해 항상 **영문**을 유지하되, 응답 언어 지시(`respond entirely in [Language]`)를 통해 UI 활성 언어로 출력하도록 유도합니다.
3. **세무 래퍼(Tax Wrappers) 최적 배치 지침:**
   - 복수 계좌 분산 종목에는 `[Tax-Free]`, `[Tax-Deferred Pension]`, `[Taxable]` 태그를 명시하고, 비과세 계좌 복리 효과 극대화 조언(`Tax-Efficient Asset Location`)을 반드시 포함합니다.
4. **실시간 최신 웹 검색 강제:**
   - 모델의 내부 학습 지식 컷오프를 극복하기 위해 `You MUST use your web search tool to find the latest news, earnings...` 지침을 필수 부여합니다.
5. **면책 조항 반복 배제:**
   - AI 특유의 뻔한 면책 조항("이것은 금융 조언이 아니며...")을 금지하고 단호하고 진정성 있는 조언 톤을 유지합니다.

---

## 3. 테스트 및 설계 문서 동기화
- 프롬프트 구조나 문구가 변경될 경우 반드시 다음 파일들을 동기화하고 유닛 테스트를 100% 통과해야 합니다:
  - `src/tests/unit/promptHelpers.test.ts`
  - `src/tests/unit/customGuru.test.ts`
  - `doc/features/ai-prompts.md`

