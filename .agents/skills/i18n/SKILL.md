---
name: i18n
description: 한국어(ko), 영어(en), 일본어(ja), 독일어(de) 4개 국어 번역 키의 추가, 동기화, 감사(Audit) 및 TypeScript 인터페이스 정합성을 관리하는 다국어 마스터 스킬
---

# i18n Synchronization & Audit Skill

**트리거:** `/i18n` (또는 다국어 번역 키 추가, 언어 파일 간 누락 키 검증, 번역 감사 시)

---

## 1. 다국어 감사 스크립트 실행
```bash
./.agents/skills/i18n/scripts/audit-i18n.sh
```

---

## 2. 번역 키 추가 워크플로우
1. `src/i18n/types.ts`: `Translations` 인터페이스에 키 추가
2. `src/i18n/ko.ts`: 한국어 값 추가
3. `src/i18n/en.ts`: 영어 값 추가
4. `src/i18n/ja.ts`: 일본어 값 추가
5. `src/i18n/de.ts`: 독일어 값 추가
6. **동일 상대 위치 유지:** 4개 파일의 동일한 섹션 위치에 키를 삽입하여 파일 간 diff 정합성을 유지합니다.

---

## 3. 철칙
- `types.ts`와 4개 로캘 파일 간의 키는 100% 1:1 대응해야 합니다.
- 함수형 번역(`(count) => ...`)은 모든 로캘에서 동일한 인자와 반환 타입을 유지합니다.
- AI 프롬프트 생성용 텍스트는 UI 언어와 무관하게 항상 영어로 생성되도록 지침을 유지합니다.

