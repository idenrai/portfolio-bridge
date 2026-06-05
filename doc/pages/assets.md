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

`KR` (Korea) · `JP` (Japan) · `US` (United States) · `EU` (Europe) · `OTHER`

## Asset Table (`AssetTable.tsx`)

Displays all registered assets.

Columns: Name, Market, Category, Qty, Avg Cost, Current Price, Value, P&L, Return.

Actions per row: Edit, Delete.

## Add Asset Flow

### Step 1 — Mode Selection (`ModeSelector.tsx`)

| Mode | Description |
| --- | --- |
| Search | Ticker search via Yahoo Finance → auto-fills metadata |
| Manual | Direct data entry without search |

### Step 2a — Ticker Search (`SearchStep.tsx`)

- Queries `yahooFetch()` → Yahoo Finance search endpoint.
- Results show name, ticker, exchange, type.
- Selecting a result auto-fills current price and metadata into the form.

### Step 2b — Asset Form Variants

| Component | Use Case | Required Fields |
| --- | --- | --- |
| `AssetForm.tsx` | Stock / ETF / Bond (detailed) | Name, type, market, currency, quantity, avg buy price, current price |
| `ManualEntryForm.tsx` | Simple manual entry | Name, value, currency |
| `CashForm.tsx` | Cash / bank deposit | Currency, amount |
| `CryptoForm.tsx` | Cryptocurrency | Symbol, quantity, current price |

### Step 3 — Confirm (`ConfirmStep.tsx`)

Preview of asset details. Validates required fields before saving to `useAssetStore`.

## Edit Asset (`EditForm.tsx`)

In-place editing of all asset fields. Existing values are pre-populated.

## Account / Broker Assignment

Assets can be assigned to broker accounts managed in `useBrokerStore`.
Broker manager UI is in `BrokerManager.tsx`. Account selector is in `AccountSelect.tsx`.

## AI Auto-Classification

Generates an English structured prompt listing all assets without a category,
requesting JSON category assignments.

1. User copies the generated prompt.
2. Pastes into ChatGPT / Claude and copies the JSON response back.
3. Categories are applied in bulk to all matched assets.
4. Reasoning text is displayed in the active UI language.

## CSV Import

1. User selects a `.csv` file.
2. A 5-row preview is displayed before confirmation.
3. On confirm, rows are parsed and added to `useAssetStore`.

Expected CSV columns: `name`, `ticker`, `type`, `market`, `currency`, `quantity`,
`avgBuyPrice`, `currentPrice`, `category`.

Implemented in `src/utils/csv.ts`.

## CSV Export

Exports the current asset list to a `.csv` file with all fields included.
Implemented in `src/utils/csv.ts`.

## Data Store

| Store | localStorage Key | Content |
| --- | --- | --- |
| `useAssetStore` | `STORAGE_KEYS.ASSETS` | Full asset list |
| `useBrokerStore` | `STORAGE_KEYS.BROKERS` | Broker account definitions |
