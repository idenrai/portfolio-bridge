---
description: AI 프롬프트 작성, 템플릿 설계, 구조화된 출력(JSON) 및 프롬프트 최적화
---

# Prompt Engineering Workflow

**Activation:** `/prompt` (또는 `/prompt-engineering`, AI 프롬프트의 신규 작성, 템플릿 설계, 구조화된 출력 정의, 성능 최적화 및 디버깅을 진행할 때)

이 워크플로우는 AI 프롬프트의 설계, 템플릿화, 퓨샷(Few-Shot) 구성, 구조화된 출력 스키마 정의, 품질 최적화 및 프로젝트 통합의 전 라이프사이클에 적용되는 마스터 가이드라인입니다. 모호한 자연어 지시를 넘어 **재현 가능하고 신뢰성 높은 프롬프트 아키텍처**를 구축하는 것을 목표로 합니다.

---

## 1. 필수 스킬 참조 및 핵심 원칙 (Core Skills & Principles)

프롬프트 작성 또는 개선 작업 착수 전, 반드시 아래의 공식 프롬프트 엔지니어링 스킬을 확인하고 적용합니다:
- **기본 기법 및 패턴 학습:** `.agents/skills/prompt-engineering/SKILL.md` (CoT, Few-Shot, System Prompt, Error Recovery, Progressive Disclosure)
- **고급 프로덕션 패턴 학습:** `.agents/skills/prompt-engineering-patterns/SKILL.md` (JSON Mode, Pydantic/Zod Schema 강제, A/B Testing, Token 최적화, KPI 지표)

### 5대 설계 원칙
1. **구체성 (Be Specific):** 모호한 지시는 모호한 결과를 낳습니다. 기대하는 출력의 어조, 포맷, 길이를 명시합니다.
2. **시연 중심 (Show, Don't Tell):** 긴 서술형 설명보다 실제 입출력 예시(Few-Shot)가 훨씬 강력합니다.
3. **지침 계층화 (Instruction Hierarchy):** 역할, 작업, 제약, 예시, 입력 데이터의 순서로 문맥을 체계화합니다.
4. **구조화된 출력 강제 (Structured Output):** 파싱이 필요한 결과물은 반드시 JSON/Schema를 강제하고 예외 처리를 둡니다.
5. **토큰 효율성 (Token Efficiency):** 컨텍스트 윈도우를 낭비하지 않도록 간결하면서도 본질적인 지시를 유지합니다.

---

## 2. 역할 및 시스템 프롬프트 아키텍처 (Role & System Context)

- **명확한 페르소나 부여:**
  - AI 모델의 전문성과 행동 기준을 시스템 컨텍스트에 정의합니다.
  - *예시:* "당신은 워런 버핏의 가치투자 철학과 복리 원칙에 입각하여 포트폴리오를 냉철하게 진단하는 전문 자산배분 멘토입니다."
- **부정적 제약 조건(Negative Constraints) 명시:**
  - 하지 말아야 할 행동을 명확한 금지 규칙으로 선언합니다.
  - *예시:* "인사말이나 면책 조항(Disclaimer)을 반복하지 마십시오.", "주어진 자산 데이터 외의 종목을 임의로 지어내지 마십시오."
- **시스템 프롬프트와 사용자 데이터의 엄격한 분리:**
  - 변하지 않는 역할 및 지침은 시스템 프롬프트에 배치하고, 가변적인 사용자 입력 데이터는 명확히 격리합니다.

---

## 3. 지침 계층 구조 및 추론 설계 (Instruction Hierarchy & Reasoning)

프롬프트는 다음의 표준 계층 구조를 따릅니다:

```
[System Context / Role]
  ↓
[Task Instruction (주 작업 지침: 세무 최적화, 리밸런싱, 리스크 진단)]
  ↓
[Negative Constraints / Rules (제약 조건 및 금지 사항)]
  ↓
[Few-Shot Examples (입출력 모범 사례 / 기대 톤앤매너)]
  ↓
[Portfolio & Investor Data (보유 자산, 계좌 배분, 사용자 프로필)]
  ↓
[Output Format / Schema (최종 응답 형식: Markdown 테이블 / 구조화된 진단표)]
```

### Chain-of-Thought (CoT) 적용 기준
- 단순 사실 검색이나 포맷 변환이 아닌, **자산 배분 분석, 세무 최적화(Tax-Efficient Asset Location), 리스크/낙폭 평가** 등 다단계 판단이 필요한 작업에는 반드시 단계별 사고를 유도합니다.
- 복잡한 포트폴리오 진단 시 "먼저 거시적 자산 배분을 분석한 후, 계좌별 절세 효율성과 개별 종목 리스크를 순차적으로 평가하십시오"와 같은 단계별 추론 지침을 프롬프트에 내장합니다.

---

## 4. Few-Shot 예시 구성 (Demonstrations)

- **2~5개 입력-출력 쌍 구성:**
  - 모델에게 원하는 형태와 품질 수준을 직접 보여주기 위해 정제된 예시를 포함합니다.
- **다양성과 엣지 케이스 포괄:**
  - 현금 100% 포트폴리오, 특정 단일 종목 집중도 80% 초과, 손실 구간 종목 등 경계 조건(Edge case)에 대한 처리 예시를 포함합니다.
- **예시 오염(Example Pollution) 방지:**
  - 타겟 도메인과 무관하거나 편향을 유발할 수 있는 부적절한 예시를 배제하고 토큰을 최적화합니다.

---

## 5. 구조화된 출력 및 스키마 강제 (Structured Output & Error Recovery)

- **출력 포맷 명시:**
  - 애플리케이션에서 파싱하거나 UI에 정렬된 형태로 렌더링할 경우 Markdown 표나 JSON Schema를 명확히 선언합니다.
- **파싱 에러 및 결측값 회복 지침:**
  - 특정 자산의 가격 데이터나 계좌 정보가 불완전할 때의 기본값(Fallback) 및 처리 지침을 사전에 정의합니다.

---

## 6. 재사용 가능한 템플릿 시스템 (Reusable Template Systems)

- **동적 변수 보간(Interpolation):**
  - 프롬프트 빌더 함수는 가변 데이터를 안전한 매개변수로 전달받아 템플릿 리터럴로 조합합니다. (`buildGuruPrompt`, `buildCustomGuruPrompt`, `buildGuruFollowUpPrompt`)
- **모듈형 컴포넌트:**
  - 보유 종목 표 포맷터(`promptHoldings.ts`), 계좌 및 세무 배분 블록(`promptAccountBreakdown.ts`), 통화/단위 포맷터(`promptFormatters.ts`) 등 모듈화된 조각을 결합하여 재사용성을 극대화합니다.

---

## 7. 프로젝트 통합 및 포트폴리오 구루 시스템 연계 가이드라인 (`portfolio-bridge` 전용)

- **클라이언트 사이드 조립 및 프라이버시 최우선 원칙 (Privacy-First):**
  - 사용자의 민감한 금융/자산 데이터는 외부 서버 DB에 영속화되지 않으며, 브라우저 로컬에서 동적으로 조립되어 사용자의 클립보드 복사 또는 투명한 인터랙션으로 제공됩니다.
- **프롬프트 인젝션 방어 (Prompt Injection Protection):**
  - 사용자 프로필(자유 텍스트 메모, 3개년 계획 등)은 반드시 `[INVESTOR DATA START]` / `[INVESTOR DATA END]` 마커로 감싸 데이터 블록으로 격리하여 프롬프트 명령어 탈취를 방지합니다.
- **다국어 일관성 및 페르소나 보존:**
  - 구루의 핵심 투자 철학(`philosophyEn`)은 언어 간 뉘앙스 왜곡을 방지하기 위해 항상 영어 원문을 유지하고, 응답 언어 제약 조건(`respond entirely in [Language]`)을 통해 사용자의 활성 언어(`LANG_NAMES[lang]`)로 출력하도록 유도합니다.
- **복수 계좌 및 세무 래퍼(Tax Wrappers) 구조화:**
  - 자산/계좌 배분 정보 주입 시 `--- ALLOCATION BY ACCOUNT & TAX STATUS ---` 섹션과 영문 표준 태그(`[Tax-Free]`, `[Tax-Deferred Pension]`, `[Taxable]`)를 준수하며, `Tax-Efficient Asset Location` 분석 지침을 포함합니다.
- **설계 문서 및 유닛 테스트 동기화:**
  - 프롬프트 구조나 문구가 변경될 경우 `src/tests/unit/promptHelpers.test.ts`, `src/tests/unit/customGuru.test.ts` 및 설계 문서 `doc/features/ai-prompts.md`를 함께 업데이트하여 회귀 테스트를 100% 통과해야 합니다.

---

## 8. 품질 검증 및 자가 점검 체크리스트 (Self-Check & QA)

프롬프트 작성 또는 수정 완료 후 아래 체크리스트를 전수 검증합니다:

- [ ] **페르소나/철학 명확성:** 모델의 분석 렌즈(구루 투자 철학)와 의사소통 스타일이 명확히 정의되어 있는가?
- [ ] **지침 계층화 및 CoT:** 계좌 배분 분석, 세무 효율성 진단, 개별 종목 평가 지침이 계층적으로 설계되어 있는가?
- [ ] **프롬프트 인젝션 방어:** 사용자 자유 입력 데이터가 `[INVESTOR DATA START/END]` 마커로 엄격히 격리되어 있는가?
- [ ] **세무 및 계좌 태그 준수:** 비과세/과세이연/일반과세 태그가 표준 형식에 부합하는가?
- [ ] **다국어 응답 일관성:** 철학 원문(영문)과 UI 활성 언어(ko/en/ja/de) 응답 지시가 충돌 없이 조화를 이루는가?
- [ ] **토큰 효율성:** 불필요한 면책 조항 유도나 중복 설명이 제거되었는가?
- [ ] **유닛 테스트 통과:** `npm run test:unit` (또는 `npx vitest run src/tests/unit/promptHelpers.test.ts`)을 실행하여 모든 프롬프트 생성 테스트가 통과하는가?
- [ ] **설계 문서 동기화:** `doc/features/ai-prompts.md`와 구현 코드가 일치하는가?
