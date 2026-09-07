import { test, expect } from '@playwright/test';
import { setupTestPortfolio } from './helpers/mockStorage';

test('has title and renders dashboard with aligned grid gaps', async ({ page }) => {
  await setupTestPortfolio(page, {
    assets: [
      {
        id: 'ast-1',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        type: 'stock',
        market: 'US',
        currency: 'USD',
        quantity: 50,
        avgBuyPrice: 150,
        currentPrice: 200,
        categories: ['growth'],
        visibility: 'all',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'ast-2',
        name: 'Toyota Motor',
        ticker: '7203.T',
        type: 'stock',
        market: 'JP',
        currency: 'JPY',
        quantity: 100,
        avgBuyPrice: 2000,
        currentPrice: 2500,
        categories: ['value'],
        visibility: 'all',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
  });

  await page.route('**/api/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ USD: 1350, JPY: 9, EUR: 1450, KRW: 1 }),
    });
  });

  await page.goto('/');
  await expect(page).toHaveTitle(/Portfolio Bridge/);
  await expect(page.getByRole('heading', { level: 1, name: '대시보드' })).toBeVisible({ timeout: 15000 });

  // 로딩 상태 종료 대기
  const loadingOverlay = page.getByRole('status').getByText('조회 중…');
  if (await loadingOverlay.isVisible()) {
    await loadingOverlay.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  // 상단 지표 및 보유 종목 테이블 확인
  await expect(page.locator('text=총 평가액')).toBeVisible();
  await expect(page.locator('text=현금 비중')).toBeVisible();
  await expect(page.locator('text=외화 노출')).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: '보유 종목' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: '인사이트' })).toBeVisible();

  // 대시보드 그리드 정렬 검증 스크린샷 캡처
  await page.screenshot({
    path: '/Users/idenrai/.gemini/antigravity-ide/brain/cd2743a6-c0ff-4c96-b971-225635dcc631/dashboard_grid_gap_aligned.png',
  });
});
