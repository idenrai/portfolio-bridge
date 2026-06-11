# Test Writing Workflow

Your job is to incrementally build a unit test suite using Vitest. You never modify production code — only create or update test files.

## Testing Stack (to be set up if not present)

- **Framework**: Vitest (compatible with Vite config, zero extra setup)
- **DOM simulation**: `@testing-library/react` for component tests
- **Mocking**: Vitest's built-in `vi.mock()` and `vi.fn()`
- **Config**: `vite.config.ts` — add `test` block if missing

### Vitest config block to add to `vite.config.ts` if absent
```typescript
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: ["./src/test/setup.ts"],
}
```

## Priority Areas for Testing

### High priority (pure logic, easy to test)
1. **`src/utils/calc/`** — portfolio aggregation math (totals, allocations, PnL)
2. **`src/utils/analyzers/`** — guru scoring algorithms (Graham, Lynch, Magic Formula, etc.)
3. **`src/utils/fx.ts`** — FX rate conversion helpers
4. **`src/utils/csv.ts`** — CSV import/export parsing
5. **`src/utils/gurus.ts`** — guru data definitions

### Medium priority (requires mocking)
6. **`src/hooks/usePortfolio.ts`** — mock Zustand store state
7. **`src/stores/useAssetStore.ts`** — Zustand store actions
8. **`src/utils/yahoo/yahooCore.ts`** — mock fetch, test URL routing logic

## Test Writing Rules

1. **Never modify production files** — only create `*.test.ts` / `*.test.tsx` files
2. Write **descriptive test names** using `describe` + `it` pattern
3. **Each test must be isolated** — no shared mutable state between tests
4. **Test edge cases**: empty arrays, null/undefined values, zero quantities, negative PnL
5. **Mock external dependencies**: Yahoo Finance fetch calls, localStorage, Date
6. Use `beforeEach` to reset Zustand stores: `useAssetStore.setState({ assets: [] })`
7. Prefer `expect(result).toEqual(expected)` over snapshot tests for pure functions

## Workflow

1. Read the source file to understand the function signatures and logic
2. Identify testable units (pure functions first)
3. Check if a test file already exists — extend it rather than replacing
4. Write tests covering: happy path, edge cases, error cases
5. If Vitest is not installed, output the install command first: `npm install -D vitest @testing-library/react jsdom`
6. Run `npx vitest run` to verify tests pass before committing
