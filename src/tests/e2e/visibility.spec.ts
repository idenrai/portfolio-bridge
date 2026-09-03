import { test, expect } from '@playwright/test';
import { setupTestPortfolio } from './helpers/mockStorage';

test('verifies asset visibility and guru consultation scope', async ({ page }) => {
  await setupTestPortfolio(page, {
    assets: [
      {
        id: 'sample-1',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        type: 'stock',
        market: 'US',
        currency: 'USD',
        quantity: 10,
        avgBuyPrice: 150,
        currentPrice: 180,
        categories: ['growth'],
        visibility: 'all',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'sample-2',
        name: 'Gold ETF',
        ticker: 'GLD',
        type: 'etf',
        market: 'US',
        currency: 'USD',
        quantity: 5,
        avgBuyPrice: 180,
        currentPrice: 200,
        categories: ['commodity'],
        visibility: 'dashboard_only',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'sample-3',
        name: 'Berkshire Hathaway',
        ticker: 'BRK-B',
        type: 'stock',
        market: 'US',
        currency: 'USD',
        quantity: 2,
        avgBuyPrice: 300,
        currentPrice: 350,
        categories: ['value'],
        visibility: 'guru_only',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'sample-4',
        name: 'Secret Coin',
        ticker: 'BTC',
        type: 'crypto',
        market: 'OTHER',
        currency: 'USD',
        quantity: 1,
        avgBuyPrice: 50000,
        currentPrice: 60000,
        categories: ['crypto'],
        visibility: 'hidden',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
  });

  // 1. Visit dashboard
  await page.goto('/');
  await expect(page).toHaveTitle(/Portfolio Bridge/);

  // 2. Go to Assets page
  await page.goto('/assets');
  await page.waitForTimeout(500);

  // Verify '표시 범위' header exists in the table
  const visibilityTh = page.locator('th', { hasText: /표시 범위|Scope/ });
  await expect(visibilityTh).toBeVisible();

  // Verify visibility combobox or badge in the rows
  const badge = page.locator('span, button', { hasText: /전체|대시보드 전용|구루 전용|숨김|All|Dashboard Only|Guru Only|Hidden/ }).first();
  await expect(badge).toBeVisible();

  // Save screenshot of Assets table
  const artifactDir = '/Users/idenrai/.gemini/antigravity-ide/brain/cd2743a6-c0ff-4c96-b971-225635dcc631';
  await page.screenshot({
    path: `${artifactDir}/assets_visibility.png`,
    fullPage: false,
  });

  // 3. Go to Gurus page
  await page.goto('/gurus');
  await page.waitForTimeout(500);

  // Click a guru button
  const guruBtn = page.getByRole('button', { name: /클라먼|버핏|Klarman|Buffett|소로스|템플턴/ }).first();
  await expect(guruBtn).toBeVisible();
  await guruBtn.click();
  await page.waitForTimeout(500);

  // Verify '상담 포함 종목 선택' button in GuruAIPromptBanner
  const scopeBtn = page.getByRole('button', { name: /상담 포함 종목|Consultation/i });
  await expect(scopeBtn).toBeVisible();

  // Click to open the scope selector panel
  await scopeBtn.click();
  await page.waitForTimeout(300);

  // Verify scope selector elements
  await expect(page.getByText('전체 선택')).toBeVisible();
  await expect(page.getByText('전체 해제')).toBeVisible();
  await expect(page.getByText('기본값으로 복원')).toBeVisible();

  // Test toggling an asset checkbox in the selector
  const goldCheckbox = page.locator('label', { hasText: /Gold ETF/ }).locator('input[type="checkbox"]');
  await expect(goldCheckbox).not.toBeChecked();
  await goldCheckbox.check();
  await expect(goldCheckbox).toBeChecked();
  await expect(page.getByRole('button', { name: /상담 포함 종목|Consultation/i })).toContainText('3/4');

  // Test reset to default
  await page.getByText('기본값으로 복원').click();
  await expect(goldCheckbox).not.toBeChecked();
  await expect(page.getByRole('button', { name: /상담 포함 종목|Consultation/i })).toContainText('2/4');

  // Click '새 대화 시작' to open prompt textarea
  const newSessionBtn = page.getByRole('button', { name: /새 대화 시작/i });
  if (await newSessionBtn.isVisible()) {
    await newSessionBtn.click();
    await page.waitForTimeout(300);
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    const promptValue = await textarea.inputValue();
    expect(promptValue).toContain('Apple Inc.');
    expect(promptValue).toContain('Berkshire Hathaway');
    expect(promptValue).not.toContain('Gold ETF');
    expect(promptValue).not.toContain('Secret Coin');
  }

  // Save screenshot of Gurus page with open scope selector
  await page.screenshot({
    path: `${artifactDir}/gurus_scope_selector.png`,
    fullPage: false,
  });
});

