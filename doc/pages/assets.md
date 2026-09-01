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

## Broker Account Management (`BrokerManager.tsx`)

Users can register multiple brokerage accounts across different markets (KR, JP, US, EU, OTHER).
When adding or editing accounts, country-specific account type presets (`ACCOUNT_TYPES_BY_COUNTRY`) are provided via `CustomSelect`:
- **JP**: `NISA` (Tax-free), `特定` (Taxable withholding), `一般` (Taxable), `iDeCo` (Pension), `法人口座`
- **KR**: `일반위탁` (Taxable), `ISA` (Tax-free), `연금저축` (Pension), `IRP` (Pension), `CMA`, `해외주식비과세`
- **US**: `Taxable`, `Roth IRA` (Tax-free), `Traditional IRA` (Pension), `401(k)` (Pension), `HSA` (Tax-free)
- **EU**: `Standard Depot`, `Sparplan`, `Riester / Rürup` (Pension), `PEA / ISA` (Tax-free)
- **OTHER / Custom**: `Custom Input...` text mode allows entering any arbitrary account type while preserving full backward compatibility.

Account type badges in the account list use visual color-coding (`getAccountTypeBadgeStyle`):
- Emerald for tax-free/tax-advantaged (NISA, ISA, Roth IRA, HSA, etc.)
- Violet for pensions/retirement (연금저축, IRP, iDeCo, 401(k), etc.)
- Amber for crypto, CMA, corporate accounts
- Zinc for standard taxable/general accounts

Enhanced UI/UX Features:
- **Dialog Top-Layer & Fixed Positioning**: `CustomSelect` dynamically mounts to the parent `<dialog>` when inside a modal and utilizes `fixed` viewport coordinates to prevent clipping.
- **Inline Safe Deletion**: Replaces browser-native popups with an in-table confirmation banner (`[ Confirm | Cancel ]`).
- **Smart Nickname Suggestion**: Dynamically updates the placeholder (e.g., `e.g. SBI Securities NISA`) based on the selected institution and account type.
- **Keyboard Submission**: Supports pressing `Enter` to immediately save new or edited accounts.

사용자는 여러 국가(한국, 일본, 미국, 유럽, 기타)의 증권 계좌를 등록하고 관리할 수 있습니다.
계좌 추가/수정 시 국가별 계좌 종류 프리셋(`ACCOUNT_TYPES_BY_COUNTRY`)이 `CustomSelect`로 제공됩니다:
- **일본**: `NISA`(비과세), `特定`(원천징수 과세), `一般`(일반과세), `iDeCo`(연금), `法人口座`
- **한국**: `일반위탁`(과세), `ISA`(비과세), `연금저축`(연금), `IRP`(연금), `CMA`, `해외주식비과세`
- **미국**: `Taxable`, `Roth IRA`(비과세), `Traditional IRA`(연금), `401(k)`(연금), `HSA`(비과세)
- **유럽**: `Standard Depot`, `Sparplan`, `Riester / Rürup`(연금), `PEA / ISA`(비과세)
- **기타/직접입력**: `직접 입력...` 모드를 통해 임의의 계좌 종류를 자유롭게 작성할 수 있으며 완벽한 하위 호환성을 보장합니다.

계좌 목록의 계좌 종류 배지에는 컬러 코딩(`getAccountTypeBadgeStyle`)이 적용됩니다:
- 절세/비과세: 에메랄드 틴트 (NISA, ISA, Roth IRA, HSA 등)
- 연금/퇴직: 바이올렛 틴트 (연금저축, IRP, iDeCo, 401(k) 등)
- 가상자산/CMA/법인: 앰버 틴트
- 일반/과세: 징크 틴트

개선된 UI/UX 기능:
- **모달 Top Layer 포탈 및 Fixed 포지셔닝**: `CustomSelect`가 모달 내부일 때 상위 `<dialog>`에 포탈로 마운트되고 `fixed` 뷰포트 좌표를 사용하여 가림 현상을 방지합니다.
- **인라인 안전 삭제**: 브라우저 기본 알림창 대신 테이블 내 인라인 확인 배지(`[ 확인 | 취소 ]`)를 제공합니다.
- **스마트 애칭 플레이스홀더 제안**: 선택한 금융기관과 계좌 종류에 따라 플레이스홀더(`예: SBI証券 NISA`)를 실시간으로 제안합니다.
- **키보드 빠른 저장**: 입력 필드에서 `Enter` 키를 눌러 즉시 계좌를 저장할 수 있습니다.

## Data Store

| Store | localStorage Key | Content |
| --- | --- | --- |
| `useAssetStore` | `STORAGE_KEYS.ASSETS` | Full asset list / 전체 자산 목록 |
| `useBrokerStore` | `STORAGE_KEYS.BROKERS` | Broker account definitions / 브로커 계좌 정의 |

## Design & Accessibility

Asset tables utilize `tabular-nums` for consistent numeric alignments and `focus-visible` for keyboard navigation. Action headers and sortable columns use `<button>` elements to maintain keyboard accessibility, adhering to Vercel Web Interface Guidelines. For positive/negative values (e.g. PnL), the standard color convention is Red for positive and Blue for negative, matching the Korean stock market standard and ensuring consistency across pages. Decorative icons correctly implement `aria-hidden="true"`, and asynchronous feedback messages utilize `aria-live="polite"` to enhance screen reader experience.

자산 테이블은 일관된 숫자 정렬을 위해 `tabular-nums`를, 키보드 탐색을 위해 `focus-visible`을 활용합니다. 액션 헤더와 정렬 가능한 컬럼은 `<button>` 요소를 사용하여 Vercel 접근성 가이드라인을 준수합니다. 손익 등 양수/음수 표기 시에는 한국 주식 시장 기준 및 앱 내 페이지 일관성을 위해 양수는 빨간색, 음수는 파란색을 사용합니다. 장식용 아이콘은 `aria-hidden="true"` 속성을 갖추고 있으며, 비동기 피드백 메시지에는 `aria-live="polite"`가 적용되어 스크린 리더 환경의 완성도를 높였습니다.
