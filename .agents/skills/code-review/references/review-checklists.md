# Code Review Checklists (전문 리뷰 체크리스트)

이 문서는 Portfolio Bridge 프로젝트의 코드 리뷰 시 검토하는 상세 항목 기준서입니다.

---

## 1. Bloomberg Terminal UI/UX & Anti-AI-Slop 체크리스트
- [ ] **Sharp Edges**: 모달, 버튼, 카드, 인풋, 배지 등 모든 UI 요소에 둥근 모서리(`rounded-*`)가 배제되고 직각(`rounded-none`)을 유지하는가?
- [ ] **1px Hairline Border**: 테두리가 과도하게 두껍지 않고 `border border-border`로 정밀하게 분할되어 있는가?
- [ ] **Anti-AI-Slop Color**: 제네릭한 보라/인디고 그라데이션이 배제되고 터미널 엠버/에메랄드/시안 텔레메트리 색상을 사용하는가?
- [ ] **Typography Density**: Fira Code(`font-mono`)가 수치 텔레메트리에 적용되고, `tabular-nums`로 자릿수 정렬이 유지되는가?
- [ ] **Compact Spacing**: 불필요한 대형 패딩 대신 고밀도 패딩(`p-2`~`p-3`)을 사용하는가?

---

## 2. Accessibility (WAI-ARIA) 체크리스트
- [ ] **Keyboard Navigation**: 커스텀 셀렉트 및 드롭다운이 `ArrowUp/Down`, `Enter`, `Escape`로 원활히 제어되는가?
- [ ] **Focus Rings**: 마우스 클릭이 아닌 키보드 탭 이동 시 `focus-visible:ring-1`이 명확히 표시되는가?
- [ ] **Screen Reader Labels**: 아이콘 전용 버튼에 `aria-label`이 누락되지 않았는가?
- [ ] **Dropdown State**: 확장 가능한 요소에 `aria-expanded`와 `role="listbox|menu"`가 정의되어 있는가?

---

## 3. Local-First & Zero-Trust Security 체크리스트
- [ ] **Data Confinement**: 금융 자산 및 포트폴리오 데이터가 절대 외부 서버로 전송되지 않고 브라우저 `localStorage`에만 머무르는가?
- [ ] **Proxy Validation**: Edge Runtime API 프록시 호출 시 strict 화이트리스트 정규식을 거치는가?
- [ ] **Safe Code Evaluation**: `dangerouslySetInnerHTML`, `eval`, Function 생성자 등 악성 코드 주입 통로가 차단되었는가?

---

## 4. Performance & State Management 체크리스트
- [ ] **Granular Selectors**: Zustand 스토어 구독 시 `useStore(s => s.field)` 형태의 세분화 셀렉터를 사용하는가? (전체 스토어 구조분해 금지)
- [ ] **Chart Re-renders**: Recharts 컴포넌트가 부모 상태 변경 시 불필요하게 전체 재계산되지 않는가?
- [ ] **Effect Minimization**: 불필요한 `useEffect`를 통한 상태 동기화 대신 파생 상태(`useMemo`)를 활용하는가?

