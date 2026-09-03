# Investment Gurus Page

| Item | Value |
| --- | --- |
| Route | `/gurus` |
| Component | `src/pages/Gurus.tsx` |
| Sub-components | `src/components/gurus/page/`, `src/components/gurus/prompt/` |
| Modals | `CustomGuruModal`, `GuruGuideModal` |
| Hooks | `useAnalyzer`, `useGuruFilter`, `useGuruPromptScope` |
| Stores | `useGuruSessionStore`, `useCustomGuruStore` |

## Guru List

23 investment gurus defined in `src/utils/gurus.ts` (`GURU_PROFILES`).

`src/utils/gurus.ts`의 `GURU_PROFILES`에 정의된 23명의 투자 구루입니다.

| ID | Name |
| --- | --- |
| `buffett` | Warren Buffett |
| `munger` | Charlie Munger |
| `lynch` | Peter Lynch |
| `graham` | Benjamin Graham |
| `dalio` | Ray Dalio |
| `lilu` | Li Lu |
| `ackman` | Bill Ackman |
| `burry` | Michael Burry |
| `fisher` | Ken Fisher |
| `cohen` | Steven Cohen |
| `marks` | Howard Marks |
| `klarman` | Seth Klarman |
| `templeton` | John Templeton |
| `soros` | George Soros |
| `wood` | Cathie Wood |
| `druckenmiller` | Stanley Druckenmiller |
| `smith` | Terry Smith |
| `greenblatt` | Joel Greenblatt |
| `piotroski` | Joseph Piotroski |
| `oneil` | William O'Neil |
| `bogle` | John Bogle |
| `swensen` | David Swensen |
| `taleb` | Nassim Taleb |

Each guru has:

- `idealAllocation`: array of `{ category, targetPercent }` defining the guru's target portfolio mix.
- `style`: English communication style instructions (AI-facing only, not displayed to user).

각 구루는 다음을 가집니다:

- `idealAllocation`: 구루의 이상적 포트폴리오 배분을 정의하는 `{ category, targetPercent }` 배열.
- `style`: 영문 커뮤니케이션 스타일 지침 (AI 전용, 사용자에게 표시되지 않음).

## Guru Display

For each selected guru:

선택한 구루에 대해 다음이 표시됩니다:

| Element | Source |
| --- | --- |
| Philosophy (Principles) / 철학 원칙 | `t.guru_philosophy_<id>` (localized) |
| Quotes / 명언 | `t.guru_quotes_<id>` (localized) |
| Ideal allocation pie chart / 이상적 배분 파이 차트 | `guru.idealAllocation` |
| Radar comparison / 레이더 비교 | User's allocation vs guru's ideal |
| Rebalancing suggestions / 리밸런싱 제안 | Computed from `idealAllocation` vs current |

## AI Prompt Generation

### Initial Review / 첫 번째 리뷰

Builds a full portfolio review prompt in the guru's persona via `buildGuruPrompt()`.

`buildGuruPrompt()`를 통해 구루 페르소나로 전체 포트폴리오 리뷰 프롬프트를 생성합니다.

- Button: "Ask [Guru Name]" / 버튼: "[구루 이름]에게 묻기"
- Output: structured prompt in a modal/panel, copy-to-clipboard. / 출력: 모달/패널의 구조화 프롬프트, 클립보드 복사.
- Session saved to `useGuruSessionStore` after copying. / 복사 후 `useGuruSessionStore`에 세션 저장.

See [../features/ai-prompts.md](../features/ai-prompts.md#buildguruprompt).

### Follow-up Review / 팔로우업 리뷰

After saving a session, the "Follow-up" button becomes available.
Builds a delta-only prompt via `buildGuruFollowUpPrompt()` showing only changes since the saved session date.
When the "Follow-up" prompt is copied, the session snapshot is updated to the current state, allowing for sequential comparisons.

세션 저장 후 "팔로우업" 버튼이 활성화됩니다.
저장된 세션 날짜 이후 변경 사항만 담은 델타 프롬프트를 `buildGuruFollowUpPrompt()`로 생성합니다.
"팔로우업" 프롬프트를 복사할 때 세션 스냅샷이 현재 상태로 갱신되어, 매번 직전 질문 시점과의 꼬리물기 식 비교가 가능해집니다.

See [../features/ai-prompts.md](../features/ai-prompts.md#buildgurufollowupprompt).

### Consultation Holdings Selector / 상담 종목 선택 (`GuruAIPromptBanner.tsx`)

- **Default Scoping / 기본 스코프**: Initialized via `usePortfolio({ scope: "guru" })`, automatically including assets with `all` and `guru_only` visibilities while excluding `dashboard_only` (e.g., gold, crypto) and `hidden` assets to prevent repetitive divestment advice from gurus.
- **Dynamic Selection Accordion / 동적 선택 아코디언**: An accordion panel accessible via `[ 🎛️ Consultation Assets (X/Y) ]` allows users to dynamically check or uncheck individual positions for AI analysis without altering global visibility settings.
- **Real-time Recalculation / 실시간 재연산**: Toggling holdings immediately recalculates the portfolio summary and allocations via `calculateSummary()`, updating both the generated AI prompt and the session snapshot.
- **Quick Controls / 퀵 컨트롤**: Provides `Select All`, `Deselect All`, and `Reset to Default` actions.
- **Empty Scope Handling / 빈 스코프 안내**: If a portfolio contains assets but all are set to `dashboard_only` or `hidden`, Gurus page displays an informational notice banner (`guru_all_scoped_out_notice`) encouraging manual asset selection rather than blocking navigation with a generic empty screen.

- **기본 스코프**: `usePortfolio({ scope: "guru" })`를 통해 초기화되어 `전체(all)` 및 `구루 전용(guru_only)` 자산만 포함하고, `대시보드 전용`(예: 금, 암호화폐) 및 `숨김` 자산은 기본 배제하여 일률적인 매도 잔소리를 방지합니다.
- **동적 종목 선택 아코디언**: 배너 상단의 `[ 🎛️ 상담 포함 종목 선택 (X/Y) ]` 버튼을 통해 전역 설정을 바꾸지 않고도 AI 상담에 포함할 종목을 실시간으로 체크/해제할 수 있습니다.
- **실시간 재연산**: 종목 체크 상태 변경 시 `calculateSummary()`를 통해 로컬 요약치와 비중을 즉시 재계산하여 생성되는 AI 프롬프트와 세션 스냅샷에 실시간 반영합니다.
- **퀵 컨트롤**: `전체 선택`, `전체 해제`, `기본값으로 복원` 단축 액션을 제공합니다.
- **빈 스코프 안내**: 자산이 등록되어 있으나 모두 `대시보드 전용` 또는 `숨김`인 경우, 일반 빈 화면으로 차단하는 대신 페이지 상단에 안내 배너(`guru_all_scoped_out_notice`)를 띄워 수동 선택을 유도합니다.

### Session Management (`useGuruSessionStore`)

- Stores one `GuruSessionSnapshot` per guru. / 구루당 하나의 `GuruSessionSnapshot`을 저장합니다.
- Snapshot includes: date, total value, holdings list, category/market allocation, cash %. / 스냅샷에는 날짜, 총액, 보유 종목, 카테고리·시장 배분, 현금 비중이 포함됩니다.
- Snapshot is taken at the time the initial prompt is generated. / 스냅샷은 첫 번째 프롬프트 생성 시점에 저장됩니다.

## Quantitative Analyzers

All analyzers live in `src/utils/analyzers/` and render in `src/components/gurus/`.
Fundamental data is fetched via `useAnalyzer` → `yahooFundamentals.ts`.

모든 채점기는 `src/utils/analyzers/`에 있으며 `src/components/gurus/`에서 렌더링됩니다.
기초 데이터는 `useAnalyzer` → `yahooFundamentals.ts`를 통해 가져옵니다.

### Portfolio Stock Deduplication / 보유 주식 중복 제거

When analyzing portfolio holdings across multiple brokerage accounts, duplicate stocks with the same ticker (case/whitespace-normalized) are deduplicated by `useAnalyzer`.
- `portfolioStockCount` displays the number of unique stocks.
- API fetches and scoring run once per unique ticker.
- If multiple entries exist with differing names, the more descriptive company name (e.g., official company name over raw ticker string) is preferentially preserved for display.

여러 증권 계좌에 동일한 종목(티커)이 분산 등록되어 있는 경우, `useAnalyzer`에서 대소문자/공백 정규화된 티커를 기준으로 중복을 제거하여 채점합니다.
- `portfolioStockCount`는 고유 종목 수를 표시합니다.
- 고유 티커당 1회만 API 호출 및 채점을 수행합니다.
- 계좌별로 다른 이름이 등록되어 있는 경우, 단순 티커명보다 더 구체적인 정식 사명을 우선 채택하여 결과 카드에 표시합니다.

### Fallback Strategy / 폴백 전략

```text
financialData
  → incomeStatementHistory
    → balanceSheetHistory
      → earningsHistory
        → implied / calculated values
```

Used to maximize coverage for Korean and Japanese stocks.

한국·일본 종목의 데이터 커버리지를 최대화하기 위해 사용됩니다.

### Lynch 10-Bagger (`LynchTenBaggerCard.tsx`)

피터 린치 성장주 기준. Max score: 100 / 최고 점수: 100점.

| Criterion / 기준 | Points / 점수 | Benchmark / 기준값 |
| --- | --- | --- |
| PEG ratio / PEG 비율 | 20 | PEG < 1.0 ideal |
| EPS growth (YoY) / EPS 성장률 | 20 | Higher is better |
| Revenue growth (YoY) / 매출 성장률 | 15 | Higher is better |
| Debt/Equity / 부채비율 | 15 | Lower is better |
| Operating margin / 영업이익률 | 15 | Higher is better |
| Market cap / 시가총액 | 15 | Small/mid-cap preferred |

### Greenblatt Magic Formula (`MagicFormulaCard.tsx`)

조엘 그린블라트 마법공식. Max score: 100 / 최고 점수: 100점.

| Criterion / 기준 | Points / 점수 | Benchmark / 기준값 |
| --- | --- | --- |
| Earnings yield (EBIT/EV) / 이익수익률 | 30 | Higher is better |
| Return on Capital (ROIC) / 자본수익률 | 30 | Higher is better |
| Operating margin / 영업이익률 | 20 | Higher is better |
| Debt/Equity / 부채비율 | 10 | Lower is better |
| Market cap filter / 시가총액 필터 | 10 | Excludes micro-cap |

### Graham Defensive Investor (`GrahamDefensiveCard.tsx`)

벤저민 그레이엄 방어적 투자 기준. Max score: 100 / 최고 점수: 100점.

| Criterion / 기준 | Points / 점수 | Benchmark / 기준값 |
| --- | --- | --- |
| P/E ratio / PER | 20 | P/E ≤ 15 |
| P/B ratio / PBR | 20 | P/B ≤ 1.5 |
| Graham Number (P/E × P/B) | 20 | Product ≤ 22.5 |
| Current ratio / 유동비율 | 15 | ≥ 2.0 |
| Debt/Equity / 부채비율 | 15 | Low leverage |
| Dividend yield / 배당수익률 | 10 | Pays a dividend |

### Smith Quality Compounder (`SmithQualityCard.tsx`)

테리 스미스 퀄리티 기준. Max score: 100 / 최고 점수: 100점.

| Criterion / 기준 | Points / 점수 | Benchmark / 기준값 |
| --- | --- | --- |
| ROE / 자기자본이익률 | 25 | High return on equity |
| Operating margin / 영업이익률 | 25 | High profitability |
| FCF conversion (FCF / Net Income) | 20 | > 80% |
| Revenue growth / 매출 성장률 | 15 | Consistent growth |
| Debt/Equity / 부채비율 | 15 | Low leverage |

### Piotroski F-Score (`PiotroskiFScoreCard.tsx`)

9개 이진 기준(각 0 또는 1점). 합계 0–9, 100점으로 환산.

**Profitability / 수익성 (4 points / 4점)**

| Signal | Condition |
| --- | --- |
| F1 — ROA | ROA > 0 in current year / 당해연도 ROA 양수 |
| F2 — Operating Cash Flow / 영업현금흐름 | CFO > 0 in current year |
| F3 — ΔROA | ROA improving YoY / ROA 전년 대비 개선 |
| F4 — Accruals quality / 발생주의 품질 | CFO > Net Income |

**Leverage & Liquidity / 레버리지·유동성 (3 points / 3점)**

| Signal | Condition |
| --- | --- |
| F5 — ΔLeverage / Δ부채비율 | Long-term debt ratio decreased YoY |
| F6 — ΔLiquidity / Δ유동비율 | Current ratio improved YoY |
| F7 — No dilution / 주식 희석 없음 | No new common shares issued |

**Operating Efficiency / 운영 효율성 (2 points / 2점)**

| Signal | Condition |
| --- | --- |
| F8 — ΔGross margin / Δ매출총이익률 | Gross margin improved YoY |
| F9 — ΔAsset turnover / Δ자산회전율 | Asset turnover improved YoY |

Score interpretation: **8–9 = Strong / 강함** · **4–7 = Neutral / 중립** · **0–3 = Weak / 약함**

### O'Neil CAN SLIM (`OneilCanSlimCard.tsx`)

윌리엄 오닐 성장주 시스템. Max score: 100 / 최고 점수: 100점.

| Letter | Criterion | Benchmark |
| --- | --- | --- |
| C | Current quarterly EPS growth / 분기 EPS 성장 | ≥ 25% YoY |
| A | Annual EPS growth / 연간 EPS 성장 | ≥ 25% for 3 consecutive years |
| N | New — near 52-week high / 52주 신고가 근접 | Within 5–10% of 52-week high |
| S | Supply / Float / 유통주식 수 | Small to mid float preferred |
| L | Leader (Relative Strength) / 상대강도 | RS ≥ 80 |
| I | Institutional sponsorship / 기관 보유 | Increasing ownership count |
| M | Market direction / 시장 방향 | Confirmed uptrend / 상승 추세 확인 |

## Empty State

When no assets are registered, the page shows a message directing the user to the Asset Management page.

등록된 자산이 없으면 자산 관리 페이지로 안내하는 메시지가 표시됩니다.

## Custom Guru Persona Service

Users can create and configure their own personalized AI Guru via `CustomGuruModal`:
- **Risk Tolerance / 위험 감수 성향**: `conservative` (안정 지향), `balanced` (균형 성장), `aggressive` (공격 투자).
- **Investment Strategy / 투자 전략**: `dividend_cashflow`, `tech_growth`, `deep_value`, `all_weather`, `quant_momentum`.
- **Coaching Tone / 코칭 톤**: `direct_unfiltered` (단도직입적), `supportive_mentor` (격려와 멘토링), `analytical_quant` (데이터 기반 분석).
- **Guiding Principles / 개인 원칙**: Custom free-text investment philosophy note.
- **Target Allocation Sync / 목표 배분 연동**: Automatically benchmarks against user's custom targets set in Settings.
- **Dedicated Avatar & Card**: Represented by a glowing indigo gradient card with a customizable avatar icon (`bot`, `shield`, `rocket`, `scale`, `sparkles`).

사용자는 `CustomGuruModal`을 통해 자신만의 맞춤형 AI 구루를 생성하고 설정할 수 있습니다:
- **위험 감수 성향**: `conservative` (안정 지향), `balanced` (균형 성장), `aggressive` (공격 투자).
- **투자 전략**: 배당 및 현금흐름, 기술 성장, 딥 밸류, 올웨더, 퀀트 및 모멘텀.
- **코칭 톤**: 단도직입적 팩트 폭격, 지지적인 멘토, 계량적 퀀트 분석가.
- **개인 원칙/메모**: 자유 텍스트 투자 메모 입력.
- **목표 배분 연동**: 설정(Settings) 페이지에 등록된 유저의 목표 배분과 실시간 연동되어 갭을 평가.
- **전용 아바타 및 카드**: 인디고 그라데이션 카드와 선택 가능한 아바타 아이콘(`bot`, `shield`, `rocket`, `scale`, `sparkles`)으로 시각화.

## Strategy Filtering & Multi-Faceted Search

Managed by the `useGuruFilter` custom hook and rendered via `GuruFilterToolbar`:
- **Category Chips**: Quick toggle between `All`, `Value`, `Growth`, `Passive`, `Quant`, `Macro`, `Hedge`. Implemented as accessible toggle buttons with `role="group"` and `aria-pressed`.
- **Multi-Faceted Search**: Real-time matching across localized name, raw English name, firm, primary/secondary category tag labels, investment style summary, and custom guru strategy keywords.

`useGuruFilter` 커스텀 훅과 `GuruFilterToolbar` 컴포넌트를 통해 제공됩니다:
- **카테고리 칩**: 전체, 가치투자, 성장·모멘텀, 자산배분·패시브, 퀀트, 매크로, 헤지 필터. `role="group"` 및 `aria-pressed` 속성을 갖춘 웹 접근성 토글 버튼 규격 준수.
- **다차원 실시간 검색**: 현지화 이름, 영문 원본 이름, 운용사, 1차/2차 카테고리 태그 번역 라벨, 투자 스타일 요약문, 커스텀 전략 키워드를 아우르는 포괄적 검색.

## Interactive Guru Guide Matcher (`GuruGuideModal`)

A 3-step interactive assessment modal that recommends the most suitable guru based on user tendencies:
1. **Risk & Volatility Stance / 위험 성향**: Conservative (drawdown defense) vs Balanced (diversified compounding) vs Aggressive (high-volatility growth).
2. **Analysis Methodology / 분석 방식**: Bottom-up Fundamentals vs Macro & Trends vs Systematic Rules & Factor Models.
3. **Coaching Style / 코칭 스타일**: Strict Margin of Safety vs Growth Potential vs Structural Asset Allocation.

3단계 대화형 진단을 통해 유저 성향에 최적화된 구루(또는 커스텀 구루)를 매칭하고 원클릭 선택을 지원합니다:
1. **위험 성향**: 손실 방어(보수) vs 분산 복리(중립) vs 고수익 성장(공격).
2. **분석 방식**: 기업 재무제표 펀더멘털 vs 거시경제 매크로 vs 수학적 퀀트/팩터.
3. **피드백 스타일**: 엄격한 안전마진 vs 미래 성장 잠재력 vs 기계적 자산배분.

## Layout Structure

### Initial State (Hero Grid)

When no guru is selected, the page displays a responsive grid (Hero Grid) of all available gurus to encourage user selection. The cards are designed with a premium "AMEX credit card" aesthetic, featuring a strict 1.586:1 aspect ratio, subtle gradients, and structured layout (centered large avatar, name and firm bottom-left, member since bottom-right) to simulate physical premium cards.

구루가 선택되지 않은 초기 상태에서는 사용자 선택을 유도하기 위해 반응형 그리드(Hero Grid) 형태로 모든 구루의 목록을 표시합니다. 각 카드는 프리미엄 "AMEX 신용카드" 미학으로 디자인되어 엄격한 1.586:1 비율, 은은한 그라데이션, 구조화된 레이아웃(정중앙 대형 아바타, 좌측 하단 이름 및 소속, 우측 하단 Since 연도)을 통해 실제 프리미엄 카드의 느낌을 구현합니다.

### Firm Name Formatting

Guru firm names often include parentheses (e.g., `Berkshire Hathaway (Chairman)`). The `GuruFirm` component handles this by completely removing the parenthesis and its contents to maintain a clean and uncluttered layout within the strict card aspect ratio.

구루의 소속 이름에는 종종 괄호가 포함됩니다. `GuruFirm` 컴포넌트는 엄격한 카드 비율 내에서 깔끔하고 심플한 레이아웃을 유지하기 위해 괄호 및 그 안의 내용(직함, 이전 회사 등)을 완전히 제거하고 렌더링합니다.

### Detail View

Once a guru is selected, the list transforms into a horizontal scrollable selector at the top (featuring explicit left/right scroll arrows and a custom scrollbar for better UX), revealing the detail view below.
The guru detail view uses a 12-column grid layout with a sticky left panel and a scrollable right panel. The AI prompt banner is placed at the top of the right panel.

구루가 선택되면 전체 목록은 화면 상단의 가로 스크롤 선택기(더 나은 UX를 위한 명시적인 좌우 스크롤 화살표 및 커스텀 스크롤바 포함)로 축소되며, 그 아래에 상세 뷰가 나타납니다.
구루 상세 뷰는 12열 그리드 레이아웃을 사용하며, 좌측 패널은 고정(sticky), 우측 패널은 스크롤됩니다. AI 프롬프트 배너는 가장 중요한 기능이므로 우측 패널 최상단에 배치됩니다.

```
12-col grid
├── Left (col-span-4, sticky): Profile avatar + philosophy
└── Right (col-span-8): GuruAIPromptBanner (Top) + Charts + rebalancing + screeners
```

### Avatar Sizing

| Context | Size | Rationale |
|---------|------|-----------|
| Hero Grid (Gurus) | `aspect-[1.586/1]`, avatar `w-[28%]` | AMEX Black Card's Centurion emblem aesthetic; uses absolute positioning and percentage width to scale perfectly across all viewport sizes |
| GuruSelector grid (Mini Cards) | `w-48 sm:w-56` (aspect 1.586:1), avatar `w-[20%]` | Maintains credit card proportions while fitting horizontal carousel; touch-friendly avatars |
| Profile panel | `w-full max-w-[320px] aspect-square` (up to 320px) | Editorial, magazine-cover style prominent display; aligned top-center or top-left |

구루 선택 캐러셀의 미니 카드는 가로 스크롤에 맞추면서도 신용카드 비율을 유지하며, 프로필 패널의 아바타는 최대 320px 뷰로 에디토리얼 디자인 요소를 강조해 초상화 디테일이 크게 보이도록 구성합니다.

## Design & Accessibility

The UI enforces an "anti-slop" aesthetic, avoiding unconditional center-alignment (center bias) in favor of editorial, left-aligned data presentations. Interactive elements support keyboard navigation (`focus-visible` rings).

UI는 무조건적인 중앙 정렬(Center Bias)을 지양하고 편집물 스타일의 좌측 정렬 데이터 표출을 선호하는 "anti-slop" 미학을 적용합니다. 인터랙티브 요소는 키보드 탐색을 지원합니다(`focus-visible` 링).
