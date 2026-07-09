# FIRE Planner Page (`/fire`)

## Overview
The FIRE Planner page provides users with a projection of their portfolio's future value to determine when they might achieve FIRE. It uses a compounding simulation based on current assets, expected monthly contributions, expected annual returns, and safe withdrawal rates.

FIRE 플래너 페이지는 현재 자산, 예상 월별 투자액, 연평균 기대 수익률, 그리고 안전 인출률을 기반으로 포트폴리오의 미래 가치를 시뮬레이션하여 언제 FIRE를 달성할 수 있는지 보여줍니다.

## Key Features
- **Portfolio Projection**: Visualizes the growth curve of the user's current portfolio over time.
  **포트폴리오 프로젝션**: 시간이 지남에 따른 현재 포트폴리오의 성장 곡선을 시각화합니다.
- **Goal Setting**: Allows users to set a target monthly passive income.
  **목표 설정**: 사용자가 목표로 하는 월별 패시브 인컴(수동적 소득)을 설정할 수 있습니다.
- **Safe Withdrawal Rate (SWR)**: Calculates the target portfolio size required to sustain the desired income (e.g., using the 4% rule).
  **안전 인출률 (SWR)**: 원하는 소득을 유지하는 데 필요한 목표 포트폴리오 규모를 계산합니다 (예: 4% 룰 사용).
- **Interactive Adjustments**: Users can tweak expected returns, inflation, and monthly savings to instantly see the impact on their FIRE date.
  **인터랙티브 조정**: 기대 수익률, 인플레이션, 월 저축액을 조정하여 FIRE 달성 시기에 미치는 영향을 즉시 확인할 수 있습니다.

## State Management & Architecture

### `useFireStore` (Zustand)
The core state for the FIRE planner is managed in `src/stores/useFireStore.ts`. This store persists user preferences to `localStorage`, ensuring the projection inputs are saved across sessions.

FIRE 플래너의 핵심 상태는 `src/stores/useFireStore.ts`에서 관리됩니다. 이 스토어는 사용자의 입력값을 `localStorage`에 유지하여 세션 간에도 프로젝션 설정이 보존되도록 합니다.

- **Inputs**: `currentAge`, `expectedReturnRate`, `inflationRate`, `monthlySavings`, `monthlyExpense`, `targetAmount`.
  **입력값**: `currentAge`, `expectedReturnRate`, `inflationRate`, `monthlySavings`, `monthlyExpense`, `targetAmount`.
- **Modes**: The store toggles between `target` mode (setting a fixed FIRE amount) or `expense` mode (calculating the FIRE amount dynamically based on `monthlyExpense` and `safeWithdrawalRate`).
  **모드**: 고정된 FIRE 목표 금액을 설정하는 `target` 모드와, `monthlyExpense` 및 `safeWithdrawalRate`를 기반으로 목표 금액을 동적으로 계산하는 `expense` 모드 사이를 전환합니다.
- **Portfolio Linking**: The `usePortfolioAssets` boolean determines whether to pull real-time KRW totals from `useAssetStore` (via `usePortfolio().summary.totalValueKRW`) or use a manually inputted starting value.
  **포트폴리오 연동**: `usePortfolioAssets` 불리언 값에 따라 `useAssetStore`의 실시간 원화 총자산을 가져올지, 수동으로 입력한 시작 금액을 사용할지 결정합니다.

### Data Flow & Calculation
1. **Currency Normalization**: Inputs in `FirePlanner.tsx` (like `monthlySavings` and `totalValueKRW`) are normalized into the user's selected `baseCurrency` (e.g., USD, EUR, JPY) using `fromKRW` and the latest exchange rates (`useExchangeRates()`).
   **통화 정규화**: `FirePlanner.tsx`의 입력값들은 `fromKRW`와 최신 환율 데이터를 사용하여 사용자가 선택한 기준 통화(`baseCurrency`)로 정규화됩니다.
2. **Deterministic Compounding**: The normalized values are passed to `calculateFire({ currentAssets, monthlySavings, expectedReturnRate, targetAmount, currentAge })` in `src/utils/calc/fire.ts`.
   **결정론적 복리 계산**: 정규화된 값들은 `src/utils/calc/fire.ts`의 `calculateFire` 함수로 전달되어 복리 계산을 수행합니다.
3. **Simulation Output**: `calculateFire` returns a year-by-year projection array (`FireDataPoint[]`) until the `targetAmount` is reached or the projection caps out at 100 years of age.
   **시뮬레이션 출력**: `calculateFire`는 목표 금액에 도달하거나 100세에 이를 때까지의 연도별 프로젝션 배열(`FireDataPoint[]`)을 반환합니다.

## Extensibility
- Future enhancements may include dynamic Monte Carlo simulations considering Sequence of Returns Risk (SORR).
  향후 개선 사항으로 수익률 순서 리스크(SORR)를 고려한 동적 몬테카를로 시뮬레이션이 포함될 수 있습니다.
- The `FireResultCard` and `FireChart` components are decoupled from the state, making them reusable if we ever introduce multiple scenario comparisons.
  `FireResultCard`와 `FireChart` 컴포넌트는 상태와 분리되어 있어, 향후 다중 시나리오 비교 기능이 도입될 경우 쉽게 재사용할 수 있습니다.
