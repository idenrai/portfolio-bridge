---
description: 작업 완료 후 PR 자동 생성
---

# Pull Request Automation Workflow

**Activation:** User typed `/pr` or requested to create a PR after finishing a task.

## Objective
자동으로 현재 작업 내역을 브랜치에 커밋하고 GitHub에 푸시한 뒤, Pull Request를 생성합니다.

## Workflow Steps

### 1. Check Git Status
- `git status`를 실행하여 커밋되지 않은 변경사항이 있는지 확인합니다.

### 2. Branch Check & Creation
- 현재 브랜치를 확인합니다 (`git branch --show-current`).
- 만약 현재 브랜치가 `main` 또는 기존 기능과 무관한 브랜치라면, 사용자에게 새 브랜치를 생성할지 물어보거나(예: `feature/xxx`) 작업 맥락에 맞는 새 브랜치를 생성합니다.

### 3. Commit Changes (If any)
- `git add .` (또는 필요한 파일만) 명령을 실행하여 변경사항을 스테이징합니다.
- `git-commit-rules.md`를 참고하여 Conventional Commit 메시지를 작성하고 `git commit`을 실행합니다.

### 4. Push to Remote
- `git push -u origin <current-branch>`를 사용하여 원격 저장소에 푸시합니다.

### 5. Check Existing Pull Request & Create/Update
- `github-mcp-server`의 `list_pull_requests` 도구를 호출하여 현재 브랜치(`head`)로 이미 열려있는(Open 상태) PR이 있는지 확인합니다.
- **이미 열려있는 PR이 있는 경우:**
  - 새로운 커밋은 `git push` 단계에서 기존 PR에 자동으로 반영되므로, PR을 새로 생성하지 않습니다.
  - 사용자에게 기존 PR에 추가 변경사항이 성공적으로 반영되었음을 알립니다.
- **열려있는 PR이 없는 경우:**
  - `github-mcp-server`의 `create_pull_request` 도구를 호출하여 새 PR을 생성합니다.
  - **Parameters:**
    - `owner`: (저장소 소유자)
    - `repo`: (저장소 이름)
    - `title`: PR 제목 (커밋 제목과 유사하게 작성)
    - `body`: 변경사항 요약, 구현한 기능, 남은 작업(TODO) 등을 마크다운으로 상세히 작성.
    - `head`: 작업한 브랜치 이름
    - `base`: 병합할 타겟 브랜치 (기본값: `main`)

### 6. Report Success
- 성공적으로 PR이 생성되면, 생성된 PR 링크와 함께 사용자에게 완료를 보고합니다.
