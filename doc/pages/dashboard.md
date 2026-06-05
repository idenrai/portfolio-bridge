# Dashboard Page

| Item | Value |
| --- | --- |
| Route | `/` |
| Component | `src/pages/Dashboard.tsx` |
| Related components | `src/components/dashboard/` |
| Primary hook | `usePortfolio()` — `src/hooks/usePortfolio.ts` |

## Data Flow

```text
useAssetStore (assets)
  → usePortfolio() hook
  → PortfolioSummary
  → All dashboard components
```

`usePortfolio()` aggregates all portfolio calculation logic (totals, allocations, holdings, P&L, FX exposure).

## Sections

### KPI Bar (`KpiBar.tsx`)

Five summary metrics in a horizontal bar. All monetary values converted to `baseCurrency`.

| Slot | Metric | Detail |
| --- | --- | --- |
| 1 | Total portfolio value | Sum of all assets |
| 2 | Total P&L (unrealised) | Amount + percentage |
| 3 | Number of holdings | Excludes cash positions |
| 4 | Cash ratio | Cash assets as % of total value |
| 5 | FX exposure | Non-baseCurrency assets as % of total value |

### Allocation Pie Charts (`AllocationPieCharts.tsx`)

Two side-by-side pie charts:

- **By market**: KR / JP / US / EU / Other
- **By category**: Dividend / Growth / Value / Index / Bond / REIT / Cash / Crypto / Commodity / Other

### Holdings Table (`TopHoldingsTable.tsx`)

Sortable table of all positions (including cash).

| Column | Description |
| --- | --- |
| Name | Asset name + ticker (if available) |
| Type / Market | Asset type and market |
| Weight % | Portfolio weight with inline bar |
| Value | Current value in baseCurrency |
| P&L | Unrealised gain/loss (amount + %) |
| Return | Return % since avg buy price |

Sort options: value / P&L / return / weight (descending default).

### Category Analysis Card (`CategoryAnalysisCard.tsx`)

Shows target allocation vs actual for each category with visual deviation bars.
Target allocations are configured in Settings → Target Allocation.

### Currency Exposure Card (`CurrencyExposureCard.tsx`)

Table of currency exposure percentages with ±5% FX scenario analysis showing the
monetary impact on total portfolio value.

### Rebalance Card (`RebalanceCard.tsx`)

Buy/sell amount suggestions to bring current allocation back to configured targets.

| Column | Description |
| --- | --- |
| Category | Category to rebalance |
| Direction | `buy` or `sell` |
| Amount | Amount in baseCurrency |

### Insights Panel (`InsightsPanel.tsx`)

Automatically generated alerts. Each alert can be individually dismissed (persisted for the session).

| Alert Type | Trigger Condition |
| --- | --- |
| Overweight | Single asset > 15% of portfolio |
| Large loss | Single asset return < −20% |
| Low cash | Cash < 3% of portfolio |
| High cash | Cash > 20% of portfolio |
| FX overexposure | Foreign currency > 40% of portfolio |
| Category deviation | Any category deviates > 10 %p from target |

### P&L Waterfall Chart (`PnLWaterfallChart.tsx`)

Waterfall chart showing P&L contribution by holding, sorted by impact.

### Portfolio History Chart (`PortfolioHistoryChart.tsx`)

Line chart of portfolio value over time.
Data comes from `useSnapshotStore` — snapshots are saved periodically.

### AI Analysis Banner

Generates a structured portfolio analysis prompt via `buildInsightPrompt()`
(`src/utils/ai/buildInsightPrompt.ts`).
The user copies the prompt and pastes it into ChatGPT / Claude / Gemini / Grok.

See [../features/ai-prompts.md](../features/ai-prompts.md) for the full prompt specification.

### Onboarding

When the asset list is empty, the dashboard displays an onboarding state with a
"Try with sample data" button.
Sample data is loaded from `src/utils/sampleData.ts`.
