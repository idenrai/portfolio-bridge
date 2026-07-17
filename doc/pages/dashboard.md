# Dashboard Page

| Item | Value |
| --- | --- |
| Route | `/` |
| Component | `src/pages/Dashboard.tsx` |
| Related components | `src/components/dashboard/` |
| Primary hook | `usePortfolio()` — `src/hooks/usePortfolio.ts` |

## Data Flow

`usePortfolio()` aggregates all portfolio calculation logic (totals, allocations, holdings, P&L, FX exposure).

`usePortfolio()`는 총액, 배분, 보유 종목, 손익, 환 노출 등 모든 포트폴리오 계산 로직을 집계합니다.

```text
useAssetStore (assets)
  → usePortfolio() hook
  → PortfolioSummary
  → All dashboard components
```

## Sections

### Filter Bar (`FilterBar.tsx`)

A bar that allows filtering the dashboard data by market, asset type, category, and broker/account.

대시보드 데이터를 시장, 자산 유형, 카테고리, 계좌별로 다중 필터링할 수 있는 바 컴포넌트입니다.

### KPI Bar (`KpiBar.tsx`)

Five summary metrics in a horizontal bar. All monetary values converted to `baseCurrency`.

5개의 핵심 지표를 가로 바로 표시합니다. 모든 금액은 `baseCurrency`로 변환됩니다.

| Slot | Metric | Description |
| --- | --- | --- |
| 1 | Total portfolio value / 총 평가액 | Sum of all assets |
| 2 | Total P&L / 총 손익 | Amount + percentage |
| 3 | Number of holdings / 보유 종목 수 | Excludes cash positions |
| 4 | Cash ratio / 현금 비중 | Cash assets as % of total value |
| 5 | FX exposure / 외화 노출 | Non-baseCurrency assets as % of total value |

### Allocation Pie Charts (`AllocationPieCharts.tsx`)

Two side-by-side pie charts.

두 개의 파이 차트를 나란히 표시합니다.

- **By market / 시장별**: KR / JP / US / EU / Other
- **By category / 카테고리별**: Dividend / Growth / Value / Index / Bond / REIT / Cash / Crypto / Commodity / Other

### Holdings Table (`TopHoldingsTable.tsx`)

Sortable table of all positions (including cash).

모든 포지션(현금 포함)을 정렬 가능한 테이블로 표시합니다.

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

### P&L Waterfall Chart (`PnLWaterfallChart.tsx`)

Waterfall chart showing P&L contribution by holding, sorted by impact.

보유 종목별 손익 기여도를 영향도 순으로 정렬한 폭포수 차트입니다.

### Portfolio History Chart (`PortfolioHistoryChart.tsx`)

Line chart of portfolio value over time.
Data comes from `useSnapshotStore` — snapshots are saved periodically.

시간에 따른 포트폴리오 가치 변화 라인 차트입니다.
데이터는 `useSnapshotStore`에서 주기적으로 저장된 스냅샷을 사용합니다.

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
