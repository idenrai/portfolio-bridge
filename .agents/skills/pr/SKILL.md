---
name: pr
description: Automates pull request creation with doc synchronization (.github/doc-map.yml), staged logical commits, and GitHub MCP server integration (create_pull_request, issue closing).
---

# Pull Request Automation (PR 자동화 및 이슈 연동)

**트리거:** `/pr` (작업 완료 후 PR 생성, GitHub 이슈 해결 및 문서 동기화 요청 시)

이 스킬은 작업 완료 후 문서 동기화, 단계적 커밋 분할, 그리고 **GitHub MCP 서버(`github-mcp-server`)** 또는 `gh` CLI를 통한 고품질 PR 생성 프로토콜입니다.

---

## 1. 사전 검증 및 동기화 (Pre-PR Checklist)
1. **설계 문서 동기화 (`.github/doc-map.yml`)**:
   - 변경된 파일에 매핑된 `doc/` 문서를 확인하고, **영어 먼저, 한국어 바로 뒤**의 인라인 이중 언어(Bilingual) 표준을 유지하며 최신화합니다.
2. **품질 게이트 검증**:
   - `./.agents/skills/quality-gate/scripts/verify-all.sh` (TypeScript, ESLint, Vitest, 번들 빌드) 100% 통과를 확인합니다.
3. **논리적 커밋 분할 (Conventional Commits)**:
   - 모든 변경을 통째로 커밋하지 않고, 논리적 단위(`feat`, `refactor`, `fix`, `docs`, `chore`)로 분할하여 스테이징 및 커밋합니다.

---

## 2. GitHub MCP 도구 기반 PR 생성
GitHub 관련 작업 시 연결된 `github-mcp-server` MCP 도구를 우선 활용합니다.

1. **관련 이슈 조회 및 연결**:
   - 이슈가 관련된 경우 `call_mcp_tool(ServerName: "github-mcp-server", ToolName: "get_issue", Arguments: { owner, repo, issue_number })`를 호출하여 요구사항 충족을 대조합니다.
2. **원격 푸시**:
   - 현재 작업 브랜치를 원격에 푸시합니다 (`git push -u origin <branch-name>`).
3. **Pull Request 생성**:
   - MCP 도구 `create_pull_request`를 호출하거나 `gh pr create` 명령을 사용합니다:
     - **제목**: `type(scope): 한국어 설명` (예: `feat(gurus): 켄 그리핀 구루 탑재 및 아바타 스텐실 규격화`)
     - **본문**: 100% 한국어로 개요, 세부 변경사항, 문서 동기화 내역, 테스트 검증 결과를 테이블과 체크리스트로 상세 작성.
     - **이슈 종결**: 본문 하단에 `Closes #<이슈번호>` 명시.

---

## 3. 원격/로컬 브랜치 정리
- 이미 머지되었거나 트래킹이 끊긴 `[gone]` 브랜치를 정리합니다:
  ```bash
  git fetch -p && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs -r git branch -D
  ```
