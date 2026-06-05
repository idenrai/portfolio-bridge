# Settings Page

**Route**: `/settings`  
**Component**: `src/pages/Settings.tsx`  
**Stores**: `useSettingsStore`, `useProfileStore`, `useGoogleDriveStore`

---

## Section: User Profile

**Store**: `useProfileStore` (`src/stores/useProfileStore.ts`)  
**Purpose**: Personal context injected into AI guru prompts.

### Fields

| Field | Type | UI Control | Description |
|-------|------|------------|-------------|
| `nickname` | `string` | `<input type="text">` | Name for gurus to address the investor |
| `age` | `number \| null` | `<input type="number">` | Investor age |
| `annualIncome` | `number \| null` | `<input type="number">` | Annual income in baseCurrency |
| `monthlyBudget` | `number \| null` | `<input type="number">` | Monthly investment budget in baseCurrency |
| `plan3y` | `string` | `<AutoResizeTextarea>` | 3-year investment plan (free text) |
| `plan5y` | `string` | `<AutoResizeTextarea>` | 5-year investment plan (free text) |
| `plan10y` | `string` | `<AutoResizeTextarea>` | 10-year investment plan (free text) |
| `notes` | `string` | `<AutoResizeTextarea>` | Notes / caveats (free text) |

### AutoResizeTextarea

The `plan3y`, `plan5y`, `plan10y`, and `notes` fields use a local `AutoResizeTextarea` component defined in `Settings.tsx`.  
It automatically grows in height as content is typed, using `useRef` + `useEffect` to set `height = scrollHeight`.

### Prompt Injection Protection

Free-text fields (`plan3y`, `plan5y`, `plan10y`, `notes`) are wrapped in `[INVESTOR DATA START]` / `[INVESTOR DATA END]` markers when injected into AI prompts to prevent prompt injection.

---

## Section: Display Currency

**Store**: `useSettingsStore.baseCurrency`  
**Options**: `KRW` · `JPY` · `USD` · `EUR`

All monetary values across the app are converted to and displayed in the selected baseCurrency using stored exchange rates.

---

## Section: Exchange Rates

**Store**: `useSettingsStore.exchangeRates`  
**Hook**: `useExchangeRates` / `useDataRefresh`

### Cache Strategy

| Condition | Behavior |
|-----------|----------|
| Last fetch < 1 hour ago | Use cached rates (no network call) |
| Fetch fails, cache < 24 hours old | Use cache with amber warning indicator |
| Fetch fails, cache > 24 hours old | Show error, rates may be stale |
| Manual refresh | Always fetches fresh rates via `yahooFx.ts` |

The refresh button shows last-updated time, updated count, total asset count, and any failed tickers.

---

## Section: Target Allocation

**Store**: `useSettingsStore.targetAllocations`  
**Type**: `TargetAllocation[]` — `{ category: AssetCategory; targetPercent: number }[]`

Used by:
- Dashboard → Category Analysis Card (deviation visualization)
- Dashboard → Rebalance Card (buy/sell suggestions)

---

## Section: Data Reset

Clears all assets and settings from localStorage after a confirmation dialog.  
Triggers `window.location.reload()` to reset the app to its initial state.

Keys cleared: `STORAGE_KEYS.ASSETS`, `STORAGE_KEYS.SETTINGS`

---

## Section: Google Drive Backup

**Store**: `useGoogleDriveStore`  
**Hook**: `useGoogleDrive`

Optional integration to sync/backup localStorage data to a file in the user's personal Google Drive.

- Auth via Google OAuth (client-side, no server involved)
- Backup file stored in the user's own Drive folder
- To delete the backup: revoke app access at `myaccount.google.com/permissions`

> Note: If a user revokes access on the Google permissions page, the backup file stored in Drive is also deleted.
