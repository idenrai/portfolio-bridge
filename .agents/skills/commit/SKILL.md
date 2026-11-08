---
name: commit
description: 스테이징된 변경사항(git diff --cached)을 분석하여 Conventional Commits 표준 형식의 고품질 커밋 메시지를 생성하는 스킬
---

# Commit Message Generator Skill

**트리거:** `/commit` 또는 `/commit-kr` (스테이징된 변경사항에 대한 커밋 메시지 작성 시)

---

## 1. 커밋 생성 절차
1. `git diff --cached`를 실행하여 스테이징된 변경사항을 확인합니다.
   - 스테이징된 내용이 없으면 "스테이징된 변경사항이 없습니다. 먼저 `git add`를 실행해 주세요."라고 안내합니다.
2. 변경 유형(type) 분류: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `revert`
3. 언어 규칙:
   - 사용자가 한국어를 명시하거나 `/commit-kr` 호출 시: 제목과 본문을 자연스러운 한국어로 작성 (type은 영어 유지)
   - 기본 또는 `/commit` 호출 시: 표준 영어로 작성
4. 제목(Description): 50자 이내, 명령조, 마침표(`.`) 생략
5. 본문(Body): 한 줄 띄운 후 변경 이유와 배경 서술

---

## 2. 금지 사항
- ❌ 이모지 사용 금지
- ❌ 모호한 단어(`update`, `fix`, `수정`, `변경`) 단독 사용 금지
- ❌ 메타 설명이나 도입부 없이 커밋 메시지 본문만 직접 출력

