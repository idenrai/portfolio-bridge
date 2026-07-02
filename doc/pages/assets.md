# Asset Management Page

| Item | Value |
| --- | --- |
| Route | `/assets` |
| Component | `src/pages/Assets.tsx` |
| Related components | `src/components/assets/` |
| Primary store | `useAssetStore` |

## Asset Data Model

### Asset Types (`AssetType`)

`stock` · `etf` · `bond` · `fund` · `cash` · `crypto` · `real_estate` · `other`

### Asset Categories (`AssetCategory`)

`dividend` · `growth` · `value` · `index` · `bond` · `reit` · `cash` · `crypto` · `commodity` · `other`

### Markets (`Market`)

`KR` (Korea / 한국) · `JP` (Japan / 일본) · `US` (United States / 미국) · `EU` (Europe / 유럽) · `OTHER`

## Asset Table (`AssetTable.tsx`)

Displays all registered assets with columns: Name, Market, Category, Qty, Avg Cost, Current Price, Value, P&L, Return.
Actions per row: Edit, Delete.

등록된 모든 자산을 표시합니다. 컬럼: 종목명, 시장, 카테고리, 수량, 매입단가, 현재가, 평가액, 손익, 수익률.
각 행의 액션: 수정, 삭제.

## Add Asset Flow

### Step 1 — Mode Selection (`ModeSelector.tsx`)

| Mode | Description |
| --- | --- |
| Search / 검색 | Ticker search via Yahoo Finance → auto-fills metadata |
| Manual / 수동 | Direct data entry without search |

### Step 2a — Ticker Search (`SearchStep.tsx`)

- Queries `yahooFetch()` → Yahoo Finance search endpoint.
- Results show name, ticker, exchange, type.
- Selecting a result auto-fills current price and metadata into the form.

- `yahooFetch()`를 통해 Yahoo Finance 검색 엔드포인트에 쿼리합니다.
- 결과에는 종목명, 티커, 거래소, 유형이 표시됩니다.
- 결과 선택 시 현재가와 메타데이터가 폼에 자동 입력됩니다.

### Step 2b — Asset Form Variants

| Component | Use Case | Required Fields |
| --- | --- | --- |
| `AssetForm.tsx` | Stock / ETF / Bond (detailed) | Name, type, market, currency, quantity, avg buy price, current price |
| `ManualEntryForm.tsx` | Simple manual entry / 간이 입력 | Name, value, currency |
| `CashForm.tsx` | Cash / bank deposit / 현금·예금 | Currency, amount |
| `CryptoForm.tsx` | Cryptocurrency / 암호화폐 | Symbol, quantity, current price |

### Step 3 — Confirm (`ConfirmStep.tsx`)

Preview of asset details. Validates required fields before saving to `useAssetStore`.

자산 세부 정보 미리보기입니다. 필수 항목을 검증한 후 `useAssetStore`에 저장합니다.

## Edit Asset (`EditForm.tsx`)

In-place editing of all asset fields. Existing values are pre-populated.

모든 자산 항목을 인라인으로 수정합니다. 기존 값이 미리 채워집니다.

## Account / Broker Assignment

Assets can be assigned to broker accounts managed in `useBrokerStore`.
Broker manager UI is in `BrokerManager.tsx`. Account selector is in `AccountSelect.tsx`.

자산을 `useBrokerStore`에서 관리하는 브로커 계좌에 할당할 수 있습니다.
브로커 관리 UI는 `BrokerManager.tsx`, 계좌 선택기는 `AccountSelect.tsx`에 있습니다.

## AI Auto-Classification

Generates an English structured prompt listing all assets without a category,
requesting JSON category assignments.

카테고리가 없는 자산 목록을 영문 구조화 프롬프트로 생성하여 JSON 카테고리 일괄 할당을 요청합니다.

1. User copies the generated prompt. / 생성된 프롬프트를 복사합니다.
2. Pastes into ChatGPT / Claude and copies the JSON response back. / ChatGPT / Claude에 붙여넣고 JSON 응답을 복사합니다.
3. Categories are applied in bulk to all matched assets. / 매칭된 자산에 카테고리가 일괄 적용됩니다.
4. Reasoning text is displayed in the active UI language. / 분류 이유가 현재 UI 언어로 표시됩니다.

## CSV Import

1. User selects a `.csv` file. / `.csv` 파일을 선택합니다.
2. A 5-row preview is displayed before confirmation. / 확인 전 5행 미리보기가 표시됩니다.
3. On confirm, rows are parsed and added to `useAssetStore`. / 확인 시 행이 파싱되어 `useAssetStore`에 추가됩니다.

Expected CSV columns: `name`, `ticker`, `type`, `market`, `currency`, `quantity`,
`avgBuyPrice`, `currentPrice`, `category`.
Implemented in `src/utils/csv.ts`.

CSV 예상 컬럼: 위와 동일. `src/utils/csv.ts`에 구현되어 있습니다.

## CSV Export

Exports the current asset list to a `.csv` file with all fields included.
Implemented in `src/utils/csv.ts`.

현재 자산 목록을 모든 항목이 포함된 `.csv` 파일로 내보냅니다.
`src/utils/csv.ts`에 구현되어 있습니다.

## Data Store

| Store | localStorage Key | Content |
| --- | --- | --- |
| `useAssetStore` | `STORAGE_KEYS.ASSETS` | Full asset list / 전체 자산 목록 |
| `useBrokerStore` | `STORAGE_KEYS.BROKERS` | Broker account definitions / 브로커 계좌 정의 |

## Design & Accessibility

Asset tables utilize `tabular-nums` for consistent numeric alignments and `focus-visible` for keyboard navigation. Action headers and sortable columns use `<button>` elements to maintain keyboard accessibility, adhering to Vercel Web Interface Guidelines.

자산 테이블은 일관된 숫자 정렬을 위해 `tabular-nums`를, 키보드 탐색을 위해 `focus-visible`을 활용합니다. 액션 헤더와 정렬 가능한 컬럼은 `<button>` 요소를 사용하여 Vercel 접근성 가이드라인을 준수합니다.
