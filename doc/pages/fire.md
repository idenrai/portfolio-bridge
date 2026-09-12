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
4. **Chart Formatting**: The Y-axis and tooltips in `FireChart.tsx` use `formatCurrency` with compact units (e.g. 억/만 for Korean, 億/万 for Japanese, M/K for English/German) tailored to the active UI language.
   **차트 포맷팅**: `FireChart.tsx`의 Y축과 툴팁은 현재 UI 언어 설정에 맞춰 축약 단위(한국어: 억/만, 일본어: 億/万, 영/독어: M/K)를 자동으로 적용하는 `formatCurrency`를 사용합니다.

### UI & Visual Components
- **`FirePlanner.tsx`**: Utilizes a 100% full-width responsive workspace (`space-y-4 md:space-y-6`), split on desktop (`lg:grid-cols-12 lg:gap-6`) between the left input form (`lg:col-span-5 xl:col-span-4`) and right analytics/chart stack (`lg:col-span-7 xl:col-span-8`). Automatically links user age from `useProfileStore` when `currentAge` is not explicitly set (`effectiveAge = currentAge ?? profileAge`).
  **`FirePlanner.tsx`**: 100% 전폭 반응형 워크스페이스(`space-y-4 md:space-y-6`)로 동작하며, 데스크톱(`lg:grid-cols-12 lg:gap-6`)에서 좌측 입력 폼(`lg:col-span-5 xl:col-span-4`)과 우측 결과/차트 스택(`lg:col-span-7 xl:col-span-8`)으로 분할됩니다. `currentAge`가 명시되지 않은 경우 `useProfileStore`의 나이를 자동으로 연동(`effectiveAge = currentAge ?? profileAge`)합니다.
- **`FireResultCard.tsx`**: Features a top milestone badge (`N years to FIRE / Reach at age N`) with compound leverage ratio (`+XX% compound gain`), followed by a 4-card financial KPI grid displaying Target Net Worth, Total Contributions, Compound Growth Amount, and Milestone year. Also includes an interactive Retirement Longevity Horizon section showing a two-color lifecycle gauge (accumulation vs safe withdrawal up to age 100) and Trinity Study risk warning for retirement horizons exceeding 30 years (`isExtendedRetirement`).
  **`FireResultCard.tsx`**: 상단 FIRE 마일스톤 달성 배지(`N년 후 FIRE 달성 / N세 도달`) 및 복리 레버리지 효과(`+XX% 복리 창출`), 4대 핵심 재무 KPI 그리드를 제공합니다. 또한 100세 기대 수명 기준의 은퇴 라이프사이클 타임라인(자산 축적기 vs 안전 인출기 2색 게이지 바)과 30년 초과 조기 은퇴 시 안전 인출률 3.5% 이하 권장 안내(`isExtendedRetirement`)를 제공합니다.
- **`FireInputForm.tsx`**: Interactive form equipped with currency/unit badges, expected return slider with quick presets (`4% Conservative`, `7% Moderate`, `10% Aggressive`), safe withdrawal rate presets (`3.5%`, `4.0% Trinity Rule`, `5.0%`), enlarged mobile touch targets (`min-h-7.5 px-2 py-1.5 sm:text-2xs`), real-time portfolio linking, and a one-click reset button to restore profile age when manually overridden.
  **`FireInputForm.tsx`**: 통화/단위 뱃지가 부착된 인풋, 기대수익률 조절 슬라이더 및 원클릭 프리셋(`보수적 4%`, `중립적 7%`, `공격적 10%`), 안전 인출률 프리셋(`3.5%`, `4.0% 트리니티 룰`, `5.0%`), 확장된 모바일 터치 타겟(`min-h-7.5 px-2 py-1.5 sm:text-2xs`), 실시간 포트폴리오 연동 토글, 수동 나이 입력 후 프로필 나이로 되돌리는 원클릭 복귀 버튼을 갖춘 인터랙티브 입력 폼입니다.
- **`FireChart.tsx`**: Recharts area & line visualization equipped with responsive container height (`h-72 min-h-72 w-full sm:h-80 sm:min-h-80 lg:h-96 lg:min-h-96`), a dark terminal custom tooltip (`rounded-none border-zinc-800 bg-zinc-950 font-mono`), compact currency formatting, and a highlighted vertical `ReferenceLine` with terminal bracket signage (`[FIRE REACHED: ${successYear}Y]`) marking the exact milestone year where projected assets cross the terminal amber target line (`#f59e0b`).
  **`FireChart.tsx`**: 반응형 컨테이너 높이(`h-72 min-h-72 w-full sm:h-80 sm:min-h-80 lg:h-96 lg:min-h-96`), 다크 터미널 커스텀 툴팁(`rounded-none border-zinc-800 bg-zinc-950 font-mono`), 축약 통화 포맷팅, 자산 곡선이 터미널 앰버 목표선(`#f59e0b`)과 교차하는 FIRE 달성 연도를 표시하는 각괄호 사이니지(`[FIRE REACHED: ...]`) 수직 참조선(`ReferenceLine`)을 탑재한 시뮬레이션 차트입니다.

## Extensibility
- Future enhancements may include dynamic Monte Carlo simulations considering Sequence of Returns Risk (SORR).
  향후 개선 사항으로 수익률 순서 리스크(SORR)를 고려한 동적 몬테카를로 시뮬레이션이 포함될 수 있습니다.
- The `FireResultCard` and `FireChart` components are decoupled from the state, making them reusable if we ever introduce multiple scenario comparisons.
  `FireResultCard`와 `FireChart` 컴포넌트는 상태와 분리되어 있어, 향후 다중 시나리오 비교 기능이 도입될 경우 쉽게 재사용할 수 있습니다.
- `calculateFire` accepts a parameterized `targetLongevity` (defaulting to 100), enabling user-customizable target life expectancies in future iterations.
  `calculateFire`는 매개변수화된 `targetLongevity`(기본값 100)를 지원하여 향후 유저 커스텀 기대 수명 설정을 손쉽게 확장할 수 있습니다.
