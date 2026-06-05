# Investment Gurus Page

**Route**: `/gurus`  
**Component**: `src/pages/Gurus.tsx`  
**Related components**: `src/components/gurus/`  
**Hook**: `useAnalyzer` (`src/hooks/useAnalyzer.ts`)  
**Session store**: `useGuruSessionStore`

---

## Guru List

20 investment gurus defined in `src/utils/gurus.ts` (`GURU_PROFILES`):

| ID | Name |
|----|------|
| `buffett` | Warren Buffett |
| `munger` | Charlie Munger |
| `lynch` | Peter Lynch |
| `graham` | Benjamin Graham |
| `dalio` | Ray Dalio |
| `lilu` | Li Lu |
| `ackman` | Bill Ackman |
| `burry` | Michael Burry |
| `fisher` | Ken Fisher |
| `cohen` | Steven Cohen |
| `marks` | Howard Marks |
| `klarman` | Seth Klarman |
| `templeton` | John Templeton |
| `soros` | George Soros |
| `wood` | Cathie Wood |
| `druckenmiller` | Stanley Druckenmiller |
| `smith` | Terry Smith |
| `greenblatt` | Joel Greenblatt |
| `piotroski` | Joseph Piotroski |
| `oneil` | William O'Neil |

Each guru has:
- `idealAllocation`: array of `{ category, targetPercent }` defining the guru's target portfolio mix
- `style`: English communication style instructions (AI-facing only, not displayed to user)

---

## Guru Display

For each selected guru:

| Element | Source |
|---------|--------|
| Philosophy (5 principles + 1 quote) | `t.guru_philosophy_<id>` (localized, see [i18n.md](i18n.md)) |
| Ideal allocation pie chart | `guru.idealAllocation` |
| Radar comparison | User's current category allocation vs guru's ideal |
| Rebalancing suggestions | Computed from `idealAllocation` vs current portfolio |

---

## AI Prompt Generation

### Initial Review

Builds a full portfolio review prompt in the guru's persona via `buildGuruPrompt()`.

- Button: "Ask [Guru Name]"
- Output: structured prompt in a modal/panel, copy-to-clipboard
- Session saved to `useGuruSessionStore` after copying

See [ai-prompts.md](ai-prompts.md#buildguruprompt) for full prompt specification.

### Follow-up Review

After saving a session, the "Follow-up" button becomes available.  
Builds a delta-only prompt via `buildGuruFollowUpPrompt()` showing only changes since the saved session date.

See [ai-prompts.md](ai-prompts.md#buildgurufollowupprompt) for full prompt specification.

### Session Management (`useGuruSessionStore`)

- Stores one `GuruSessionSnapshot` per guru
- Snapshot includes: date, total value, holdings list, category/market allocation, cash %
- Snapshot is taken at the time the initial prompt is generated

---

## Quantitative Analyzers

All analyzers live in `src/utils/analyzers/` and render in `src/components/gurus/`.  
Fundamental data is fetched via `useAnalyzer` → `yahooFundamentals.ts`.

### Fallback Strategy

```text
financialData → incomeStatementHistory → balanceSheetHistory → earningsHistory → implied values
```

Used to maximize coverage for Korean and Japanese stocks that may not have `financialData`.

---

### Lynch 10-Bagger (`LynchTenBaggerCard.tsx`)

Peter Lynch growth stock criteria. **Max score: 100**

| Criterion | Points | Benchmark |
|-----------|--------|-----------|
| PEG ratio | 20 | PEG < 1.0 ideal |
| EPS growth (YoY) | 20 | Higher is better |
| Revenue growth (YoY) | 15 | Higher is better |
| Debt/Equity | 15 | Lower is better |
| Operating margin | 15 | Higher is better |
| Market cap | 15 | Small/mid-cap preferred |

---

### Greenblatt Magic Formula (`MagicFormulaCard.tsx`)

Joel Greenblatt dual-factor ranking. **Max score: 100**

| Criterion | Points | Benchmark |
|-----------|--------|-----------|
| Earnings yield (EBIT/EV) | 30 | Higher is better |
| Return on Capital (ROIC) | 30 | Higher is better |
| Operating margin | 20 | Higher is better |
| Debt/Equity | 10 | Lower is better |
| Market cap filter | 10 | Excludes micro-cap |

---

### Graham Defensive Investor (`GrahamDefensiveCard.tsx`)

Benjamin Graham's defensive checklist. **Max score: 100**

| Criterion | Points | Benchmark |
|-----------|--------|-----------|
| P/E ratio | 20 | P/E ≤ 15 |
| P/B ratio | 20 | P/B ≤ 1.5 |
| Graham Number (P/E × P/B) | 20 | Product ≤ 22.5 |
| Current ratio | 15 | ≥ 2.0 |
| Debt/Equity | 15 | Low leverage |
| Dividend yield | 10 | Pays a dividend |

---

### Smith Quality Compounder (`SmithQualityCard.tsx`)

Terry Smith quality criteria. **Max score: 100**

| Criterion | Points | Benchmark |
|-----------|--------|-----------|
| ROE | 25 | High return on equity |
| Operating margin | 25 | High profitability |
| FCF conversion (FCF / Net Income) | 20 | > 80% |
| Revenue growth | 15 | Consistent top-line growth |
| Debt/Equity | 15 | Low leverage |

---

### Piotroski F-Score (`PiotroskiFScoreCard.tsx`)

9 binary criteria (0 or 1 each). Total 0–9, scaled to 100.

**Profitability (4 points)**

| Signal | Condition |
|--------|-----------|
| F1 — ROA | ROA > 0 in current year |
| F2 — Operating Cash Flow | CFO > 0 in current year |
| F3 — ΔROA | ROA improving YoY |
| F4 — Accruals quality | CFO > Net Income |

**Leverage & Liquidity (3 points)**

| Signal | Condition |
|--------|-----------|
| F5 — ΔLeverage | Long-term debt ratio decreased YoY |
| F6 — ΔLiquidity | Current ratio improved YoY |
| F7 — No dilution | No new common shares issued |

**Operating Efficiency (2 points)**

| Signal | Condition |
|--------|-----------|
| F8 — ΔGross margin | Gross margin improved YoY |
| F9 — ΔAsset turnover | Asset turnover improved YoY |

Score interpretation: **8–9 = Strong** · **4–7 = Neutral** · **0–3 = Weak**

---

### O'Neil CAN SLIM (`OneilCanSlimCard.tsx`)

William O'Neil's growth stock system. **Max score: 100**

| Letter | Criterion | Benchmark |
|--------|-----------|-----------|
| C | Current quarterly EPS growth | ≥ 25% YoY |
| A | Annual EPS growth | ≥ 25% for 3 consecutive years |
| N | New — near 52-week high | Within 5–10% of 52-week high |
| S | Supply / Float | Small to mid float preferred |
| L | Leader (Relative Strength) | RS ≥ 80 |
| I | Institutional sponsorship | Increasing ownership count |
| M | Market direction | Confirmed uptrend |

---

## Empty State

When no assets are registered, the page shows a message directing the user to the Asset Management page.
