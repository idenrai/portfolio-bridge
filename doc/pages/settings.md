# Settings Page

| Item | Value |
| --- | --- |
| Route | `/settings` |
| Component | `src/pages/Settings.tsx` |
| Section components | `src/components/settings/` (`DisplaySection`, `ProfileSection`, `DataRefreshSection`, `DataManagementSection`) |
| Stores | `useSettingsStore`, `useProfileStore`, `useGoogleDriveStore` |

## Page Structure

`Settings.tsx` acts as a clean layout container hosting four dedicated section components from `src/components/settings/`:

1. **DisplaySection**: Base display currency configuration.
2. **ProfileSection**: Investor profile and long-term financial plans for AI prompt injection.
3. **DataRefreshSection**: Market quote and exchange rate auto-refresh controls & status.
4. **DataManagementSection**: Target asset allocation, Google Drive backup/restore, and full data reset.

---

## User Profile

**Store**: `useProfileStore` (`src/stores/useProfileStore.ts`)
**Component**: `ProfileSection` (`src/components/settings/ProfileSection.tsx`)

Purpose: personal context injected into AI guru prompts. Stored in localStorage only — never transmitted.

목적: AI 구루 프롬프트에 주입되는 개인 맥락 정보입니다. localStorage에만 저장되며 외부로 전송되지 않습니다.

### Fields

| Field | Type | UI Control | Description |
| --- | --- | --- | --- |
| `nickname` | `string` | `<input type="text">` | Name for gurus to address the investor / 구루가 투자자를 부를 이름 |
| `age` | `number \| null` | `<input type="number">` | Investor age / 투자자 나이 |
| `annualIncome` | `number \| null` | `<input type="number">` | Annual income in baseCurrency / 연소득 |
| `monthlyBudget` | `number \| null` | `<input type="number">` | Monthly investment budget / 월 투자 예산 |
| `plan3y` | `string` | `AutoResizeTextarea` | 3-year investment plan / 3년 투자 계획 |
| `plan5y` | `string` | `AutoResizeTextarea` | 5-year investment plan / 5년 투자 계획 |
| `plan10y` | `string` | `AutoResizeTextarea` | 10-year investment plan / 10년 투자 계획 |
| `notes` | `string` | `AutoResizeTextarea` | Notes / caveats / 특이사항·유의점 |

### AutoResizeTextarea

`plan3y`, `plan5y`, `plan10y`, `notes` fields use the shared `AutoResizeTextarea` component defined in `src/components/common/AutoResizeTextarea.tsx`.
It automatically grows in height as content is typed, using `useRef` + `useEffect` to set `height = scrollHeight`.

`plan3y`, `plan5y`, `plan10y`, `notes` 필드는 `src/components/common/AutoResizeTextarea.tsx`에 정의된 공통 `AutoResizeTextarea` 컴포넌트를 사용합니다.
입력 내용이 늘어나면 `useRef` + `useEffect`를 통해 `height = scrollHeight`로 자동 높이 조정됩니다.

### Prompt Injection Protection

Free-text fields are wrapped in `[INVESTOR DATA START]` / `[INVESTOR DATA END]` markers
when injected into AI prompts to prevent prompt injection.

자유 입력 필드는 AI 프롬프트에 주입될 때 `[INVESTOR DATA START]` / `[INVESTOR DATA END]` 마커로 감싸서
프롬프트 인젝션을 방지합니다.

## Display Currency

**Store**: `useSettingsStore.baseCurrency`
**Component**: `DisplaySection` (`src/components/settings/DisplaySection.tsx`)

Options: `KRW` · `JPY` · `USD` · `EUR`

All monetary values across the app are converted to and displayed in the selected baseCurrency.
This setting is independent of the UI language.

앱 전체의 모든 금액이 선택한 baseCurrency로 변환되어 표시됩니다.
이 설정은 UI 언어(한국어, 영어 등)와 독립적으로 동작합니다.

## Exchange Rates & Price Refresh

**Store**: `useSettingsStore.exchangeRates`
**Component**: `DataRefreshSection` (`src/components/settings/DataRefreshSection.tsx`)
**Hook**: `useExchangeRates` / `usePriceRefresh` / `useDataRefresh`

### Cache Strategy

| Condition / 조건 | Behavior / 동작 |
| --- | --- |
| Last fetch < 1 hour ago / 마지막 조회 1시간 이내 | Use cached rates (no network call) / 캐시 사용 |
| Fetch fails, cache < 24 hours / 조회 실패, 캐시 24시간 이내 | Use cache with amber warning / 캐시 사용 + 경고 표시 |
| Fetch fails, cache > 24 hours / 조회 실패, 캐시 24시간 초과 | Show error / 오류 표시 |
| Manual refresh / 수동 새로고침 | Always fetches fresh rates / 항상 최신 환율 조회 |

The refresh button shows: last-updated time, updated count, total asset count, and failed tickers.

새로고침 버튼에는 마지막 업데이트 시간, 업데이트 수, 전체 자산 수, 실패한 티커가 표시됩니다.

## Target Allocation & Data Management

**Store**: `useSettingsStore.targetAllocations`, `useGoogleDriveStore`
**Component**: `DataManagementSection` (`src/components/settings/DataManagementSection.tsx`)

### Target Allocation

**Type**: `TargetAllocation[]` — `{ category: AssetCategory; targetPercent: number }[]`

Used by:
- Dashboard → Category Analysis Card (deviation visualization) / 카테고리 편차 시각화
- Dashboard → Rebalance Card (buy/sell suggestions) / 리밸런싱 매수·매도 제안

### Google Drive Backup

**Store**: `useGoogleDriveStore`
**Hook**: `useGoogleDrive`

Optional integration to sync/backup localStorage data to a file in the user's personal Google Drive.

localStorage 데이터를 사용자 개인 Google Drive의 파일로 동기화·백업하는 선택적 연동입니다.

- Auth via Google OAuth (client-side, no server involved). / Google OAuth 인증 (클라이언트 전용, 서버 없음).
- Backup file stored in the user's own Drive folder. / 백업 파일은 사용자 본인의 Drive 폴더에 저장됩니다.
- To delete the backup: revoke app access at `myaccount.google.com/permissions`. / 백업 삭제: 해당 페이지에서 앱 접근 권한을 해제하면 Drive 백업 파일도 삭제됩니다.

### Data Reset

Clears all assets and settings from localStorage after a confirmation dialog.
Triggers `window.location.reload()` to reset the app to its initial state.
Keys cleared: `STORAGE_KEYS.ASSETS`, `STORAGE_KEYS.SETTINGS`, `STORAGE_KEYS.BROKERS`, etc.

확인 다이얼로그 후 localStorage에서 모든 자산과 설정을 삭제합니다.
`window.location.reload()`를 호출하여 앱을 초기 상태로 재설정합니다.
