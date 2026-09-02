# Dashboard Page

| Item | Value |
| --- | --- |
| Route | `/` |
| Component | `src/pages/Dashboard.tsx` |
| Related components | `src/components/dashboard/` |
| Primary hook | `usePortfolio()` — `src/hooks/usePortfolio.ts` |
| Related hooks | `usePortfolioSnapshot()` — `src/hooks/usePortfolioSnapshot.ts` |

## Data Flow

`usePortfolio()` aggregates all portfolio calculation logic (totals, allocations, holdings, P&L, FX exposure). `usePortfolioSnapshot()` automatically saves daily portfolio snapshots while guarding against filtered states or initial loading.

`usePortfolio()`는 총액, 배분, 보유 종목, 손익, 환 노출 등 모든 포트폴리오 계산 로직을 집계합니다. `usePortfolioSnapshot()`은 필터가 적용된 상태나 초기 로딩 중 스냅샷이 오염되지 않도록 보호하며 일일 포트폴리오 스냅샷을 자동 저장합니다.

```text
useAssetStore (assets)
  → usePortfolio() hook
  → PortfolioSummary
  → All dashboard components
  → usePortfolioSnapshot() (daily snapshot persistence)
```

## Sections

### Filter Bar (`FilterBar.tsx`)

A bar that allows filtering the dashboard data by market, asset type, category, and broker/account. Displays live filtered count with accessibility announcements.

대시보드 데이터를 시장, 자산 유형, 카테고리, 계좌별로 다중 필터링할 수 있는 바 컴포넌트입니다. 스크린리더 접근성을 지원하는 실시간 필터링 개수 표시를 제공합니다.


### KPI Bar (`KpiBar.tsx`)

Five summary metrics in a horizontal bar. All monetary values converted to `baseCurrency`. During the initial price fetch, a loading overlay is displayed to prevent stale local cache prices from being shown.

5개의 핵심 지표를 가로 바로 표시합니다. 모든 금액은 `baseCurrency`로 변환됩니다. 최초 시세 데이터 조회 중에는 로컬 캐시의 낡은 가격이 노출되지 않도록 로딩 오버레이가 표시됩니다.

| Slot | Metric | Description |
| --- | --- | --- |
| 1 | Total portfolio value / 총 평가액 | Sum of all assets |
| 2 | Total P&L / 총 손익 | Amount + percentage |
| 3 | Number of holdings / 보유 종목 수 | Excludes cash positions |
| 4 | Cash ratio / 현금 비중 | Cash assets as % of total value |
| 5 | FX exposure / 외화 노출 | Non-baseCurrency assets as % of total value |

### Allocation Pie Charts (`AllocationPieCharts.tsx`)

A unified tabbed card allowing users to switch between market allocation and category allocation via a header segmented button.

헤더 세그먼트 버튼을 통해 시장별 배분과 분류별 배분을 손쉽게 전환할 수 있는 통합 탭형 카드입니다.

- **By market / 시장별**: KR / JP / US / EU / Other
- **By category / 카테고리별**: Dividend / Growth / Value / Index / Bond / REIT / Cash / Crypto / Commodity / Other

Features a standalone SVG donut chart paired with a clean 2-column HTML grid legend (`grid grid-cols-2`) to guarantee 0% text overlapping, perfect vertical compact sizing, and full non-clipping geometry in sidebar layouts.

사이드바 레이아웃에서 텍스트 겹침을 100% 방지하고 세로 공간을 효율적으로 활용하기 위해 Recharts SVG 내부 범례 대신 깔끔한 HTML 2열 그리드 범례(`grid grid-cols-2`)와 온전한 도넛 차트를 결합하여 렌더링합니다.

### Holdings Table (`TopHoldingsTable.tsx`)

Sortable table of all positions (including cash). Defaults to displaying the top 20 positions to maintain visual balance with the sidebar, with an inline toggle to view all holdings.

모든 포지션(현금 포함)을 정렬 가능한 테이블로 표시합니다. 우측 사이드바와의 시각적 균형을 위해 기본 상위 20개 종목을 노출하며, 전체 보기/상위 20개 토글을 제공합니다.

| Column | Description |
| --- | --- |
| Name / 종목명 | Asset name + ticker (if available) |
| Type / Market | Asset type and market |
| Weight % / 비중 | Portfolio weight with inline bar |
| Value / 평가액 | Current value in baseCurrency |
| P&L / 손익 | Unrealised gain/loss (amount + %) |
| Return / 수익률 | Return % since avg buy price |

Sort options: value / P&L / return / weight (descending default).

정렬 옵션: 평가액 / 손익 / 수익률 / 비중 (기본값: 내림차순).

### Category Analysis Card (`CategoryAnalysisCard.tsx`)

Shows target allocation vs actual for each category with visual deviation bars.
Target allocations are configured in Settings → Target Allocation.

각 카테고리의 목표 배분 대비 실제 배분을 편차 바로 시각화합니다.
목표 배분은 설정 → 목표 배분에서 설정합니다.

### Currency Exposure Card (`CurrencyExposureCard.tsx`)

Table of currency exposure percentages with ±5% FX scenario analysis showing the
monetary impact on total portfolio value.

통화별 노출 비중 테이블과 ±5% 환율 변동 시나리오 분석(총 포트폴리오 가치 영향액)을 제공합니다.

### Rebalance Card (`RebalanceCard.tsx`)

Buy/sell amount suggestions to bring current allocation back to configured targets.

현재 배분을 목표 배분으로 되돌리기 위한 매수·매도 금액 제안을 제공합니다.

| Column | Description |
| --- | --- |
| Category / 카테고리 | Category to rebalance |
| Direction / 방향 | `buy` or `sell` |
| Amount / 금액 | Amount in baseCurrency |

### Insights Panel (`InsightsPanel.tsx`)

Automatically generated alerts. Each alert can be individually dismissed (persisted for the session).

자동 생성 경고 알림입니다. 각 알림은 개별적으로 닫을 수 있으며, 세션 동안 유지됩니다.

| Alert Type / 경고 유형 | Trigger Condition / 발동 조건 |
| --- | --- |
| Overweight / 과대비중 | Single asset > 15% of portfolio |
| Large loss / 큰 손실 | Single asset return < −20% |
| Low cash / 현금 부족 | Cash < 3% of portfolio |
| High cash / 현금 과다 | Cash > 20% of portfolio |
| FX overexposure / 환 노출 초과 | Foreign currency > 40% of portfolio |
| Category deviation / 카테고리 편차 | Any category deviates > 10 %p from target |

### P&L Ranked Bar-List Widget (`PnLWaterfallChart.tsx`)

Modern fintech-styled bidirectional ranked bar-list widget visualizing profit and loss by aggregated holding (using `summary.holdings`). Features 0% text truncation with a 2-tier asset metadata display (Name + Market / Ticker / Asset Type), a zero-line centered bidirectional gauge (Loss in blue on left, Gain in red on right), tabular right-aligned P&L amount and return percentages, interactive sort controls (`By Impact`, `By Gain`, `By Return`), and a `Top 20 / Show All` item toggle. Synchronizes seamlessly with the top Filter Bar. Lazy loaded with `ChartSkeleton` fallback.

보유 종목별 손익을 시각화하는 모던 핀테크 스타일의 양방향 게이지 바 리스트 위젯입니다 (`summary.holdings` 기반). 2열 종목 메타데이터(이름 + 시장/티커/자산유형)를 통해 텍스트 잘림을 완전히 해소하고, 중앙 제로 기준선 중심의 양방향 게이지(좌측 파란색 손실, 우측 빨간색 수익)와 우측 표 형식의 손익/수익률 컬럼을 제공합니다. 인터랙티브 정렬 세그먼트(`절댓값순`, `수익순`, `수익률순`) 및 `상위 20개 / 전체 보기` 토글을 지원하며, 상단 필터 바와 완벽하게 연동됩니다. `ChartSkeleton` 스켈레톤 UI를 통해 지연 로딩됩니다.

### Portfolio History Chart (`PortfolioHistoryChart.tsx`)

Area chart of portfolio value and cost basis over time with interactive time range filtering (`1M`, `3M`, `6M`, `1Y`, `ALL`). Displays real-time period performance (value change and return percentage) in the header. Features a rich dark-themed custom tooltip providing detailed breakdown (Value, Cost Basis, Profit/Loss, and Return %) and an "All Portfolio Basis" badge. Lazy loaded with `ChartSkeleton` fallback.
Data comes from `useSnapshotStore` — daily snapshots saved automatically via `usePortfolioSnapshot`.

시간에 따른 포트폴리오 평가액 및 매입원가 추이를 인터랙티브 기간 필터(`1M`, `3M`, `6M`, `1Y`, `ALL`)와 함께 제공하는 영역 차트입니다. 카드 헤더에 선택된 기간 동안의 자산 변동액 및 수익률 변동(%) 미니 KPI를 실시간 표시합니다. 다크 테마 커스텀 툴팁(평가액, 원가, 평가손익, 수익률 4종 지표) 및 "전체 포트폴리오 기준" 뱃지를 제공하며, `ChartSkeleton` 스켈레톤 UI를 통해 지연 로딩됩니다.
데이터는 `useSnapshotStore`에서 `usePortfolioSnapshot` 훅을 통해 일일 단위로 자동 기록된 스냅샷을 사용합니다.


### AI Analysis Banner

Generates a structured portfolio analysis prompt via `buildInsightPrompt()`
(`src/utils/ai/buildInsightPrompt.ts`).
The user copies the prompt and pastes it into ChatGPT / Claude / Gemini / Grok.

`buildInsightPrompt()`를 통해 구조화된 포트폴리오 분석 프롬프트를 생성합니다.
사용자는 이 프롬프트를 복사해 ChatGPT / Claude / Gemini / Grok에 붙여넣습니다.

See [../features/ai-prompts.md](../features/ai-prompts.md) for the full prompt specification.

전체 프롬프트 스펙은 [../features/ai-prompts.md](../features/ai-prompts.md)를 참조하세요.

### Onboarding

When the asset list is empty, the dashboard displays an onboarding state with a
"Try with sample data" button.
Sample data is loaded from `src/utils/sampleData.ts`.

자산 목록이 비어 있을 때, 대시보드는 "샘플 데이터로 둘러보기" 버튼이 있는 온보딩 화면을 표시합니다.
샘플 데이터는 `src/utils/sampleData.ts`에서 로드됩니다.
