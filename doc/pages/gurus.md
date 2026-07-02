# Investment Gurus Page

| Item | Value |
| --- | --- |
| Route | `/gurus` |
| Component | `src/pages/Gurus.tsx` |
| Related components | `src/components/gurus/` |
| Hook | `useAnalyzer` (`src/hooks/useAnalyzer.ts`) |
| Session store | `useGuruSessionStore` |

## Guru List

20 investment gurus defined in `src/utils/gurus.ts` (`GURU_PROFILES`).

`src/utils/gurus.ts`의 `GURU_PROFILES`에 정의된 20명의 투자 구루입니다.

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
| Philosophy (5 principles + 1 quote) / 철학 | `t.guru_philosophy_<id>` (localized) |
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

### Session Management (`useGuruSessionStore`)

- Stores one `GuruSessionSnapshot` per guru. / 구루당 하나의 `GuruSessionSnapshot`을 저장합니다.
- Snapshot includes: date, total value, holdings list, category/market allocation, cash %. / 스냅샷에는 날짜, 총액, 보유 종목, 카테고리·시장 배분, 현금 비중이 포함됩니다.
- Snapshot is taken at the time the initial prompt is generated. / 스냅샷은 첫 번째 프롬프트 생성 시점에 저장됩니다.

## Quantitative Analyzers

All analyzers live in `src/utils/analyzers/` and render in `src/components/gurus/`.
Fundamental data is fetched via `useAnalyzer` → `yahooFundamentals.ts`.

모든 채점기는 `src/utils/analyzers/`에 있으며 `src/components/gurus/`에서 렌더링됩니다.
기초 데이터는 `useAnalyzer` → `yahooFundamentals.ts`를 통해 가져옵니다.

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

## Layout Structure

The guru detail view uses a 12-column grid layout with a sticky left panel and a scrollable right panel. The AI prompt banner is placed outside and below the grid at full width.

구루 상세 뷰는 12열 그리드 레이아웃을 사용하며, 좌측 패널은 고정(sticky), 우측 패널은 스크롤됩니다. AI 프롬프트 배너는 그리드 바깥 하단에 전체 폭으로 배치됩니다.

```
12-col grid
├── Left (col-span-4, sticky): Profile avatar + philosophy
└── Right (col-span-8): Charts + rebalancing + screeners

Full width (below grid): GuruAIPromptBanner
```

### Avatar Sizing

| Context | Size | Rationale |
|---------|------|-----------|
| GuruSelector grid | `w-11 h-11 sm:w-12 sm:h-12` (44–48px) | Meets Apple HIG touch-target-size minimum (44px); portrait detail recognizable |
| Profile panel | `w-20 h-20 sm:w-24 sm:h-24` (80–96px) | Prominent display for generated portraits; aligned top with `items-start` |

구루 선택 그리드의 아바타는 44–48px로 터치 타겟 최소 기준을 충족하며, 프로필 패널의 아바타는 80–96px로 초상화 디테일이 충분히 보이도록 합니다.

## Design & Accessibility

The UI enforces an "anti-slop" aesthetic, avoiding unconditional center-alignment (center bias) in favor of editorial, left-aligned data presentations. Interactive elements support keyboard navigation (`focus-visible` rings).

UI는 무조건적인 중앙 정렬(Center Bias)을 지양하고 편집물 스타일의 좌측 정렬 데이터 표출을 선호하는 "anti-slop" 미학을 적용합니다. 인터랙티브 요소는 키보드 탐색을 지원합니다(`focus-visible` 링).
