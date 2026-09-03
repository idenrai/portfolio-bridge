import { test, expect } from '@playwright/test';
import { setupTestPortfolio } from './helpers/mockStorage';

test('verifies multi-account holding breakdown and tax wrappers in Guru prompt', async ({ page }) => {
  await setupTestPortfolio(page, {
    accounts: [
      {
        id: 'broker-nisa',
        name: 'SBI証券 NISA',
        nickname: 'SBI NISA',
        broker: 'SBI証券',
        accountType: 'NISA (성장)',
        country: 'JP',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'broker-taxable',
        name: 'SBI証券 特定',
        nickname: 'SBI 특정',
        broker: 'SBI証券',
        accountType: '特定',
        country: 'JP',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
    assets: [
      {
        id: 'sanrio-nisa',
        name: 'Sanrio Company, Ltd.',
        ticker: '8136.T',
        type: 'stock',
        market: 'JP',
        currency: 'JPY',
        quantity: 500,
        avgBuyPrice: 2400,
        currentPrice: 3000,
        categories: ['growth'],
        brokerId: 'broker-nisa',
        visibility: 'all',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'sanrio-taxable',
        name: 'Sanrio Company, Ltd.',
        ticker: '8136.T',
        type: 'stock',
        market: 'JP',
        currency: 'JPY',
        quantity: 100,
        avgBuyPrice: 2800,
        currentPrice: 3000,
        categories: ['growth'],
        brokerId: 'broker-taxable',
        visibility: 'all',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
  });

  // Navigate to Gurus page
  await page.goto('/gurus');
  await page.waitForTimeout(500);

  // Click a guru button (e.g. Buffett)
  const guruBtn = page.getByRole('button', { name: /버핏|Buffett/i }).first();
  await expect(guruBtn).toBeVisible();
  await guruBtn.click();
  await page.waitForTimeout(500);

  // Click '새 대화 시작' to reveal prompt textarea
  const newSessionBtn = page.getByRole('button', { name: /새 대화 시작/i });
  await expect(newSessionBtn).toBeVisible();
  await newSessionBtn.click();
  await page.waitForTimeout(500);

  // Check prompt textarea
  const textarea = page.locator('textarea');
  await expect(textarea).toBeVisible();
  const promptValue = await textarea.inputValue();

  // Multi-account hierarchy verification
  expect(promptValue).toContain('Multi-Account Breakdown (2 separate account positions):');
  expect(promptValue).toContain('Account: "SBI NISA" (JP: NISA Growth [Tax-Free])');
  expect(promptValue).toContain('Holding: 500 shares (83.3% of position)');
  expect(promptValue).toContain('Avg Buy Price: JPY 2,400 | Current Price: JPY 3,000');
  expect(promptValue).toContain('Return: +25.0%');
  expect(promptValue).toContain('Tax Status: Tax-Free wrapper');

  expect(promptValue).toContain('Account: "SBI 특정" (JP: Specific/Withholding Tax [Taxable])');
  expect(promptValue).toContain('Holding: 100 shares (16.7% of position)');
  expect(promptValue).toContain('Avg Buy Price: JPY 2,800 | Current Price: JPY 3,000');
  expect(promptValue).toContain('Return: +7.1%');
  expect(promptValue).toContain('Tax Status: Taxable Account');

  // Verify explicit task directives
  expect(promptValue).toContain('IMPORTANT - MULTI-ACCOUNT & TAX-AWARE ADVICE');

  // Save screenshot of the Guru prompt
  const artifactDir = '/Users/idenrai/.gemini/antigravity-ide/brain/cd2743a6-c0ff-4c96-b971-225635dcc631';
  await page.screenshot({
    path: `${artifactDir}/gurus_multi_account_prompt.png`,
    fullPage: false,
  });
});
