import { test, expect } from '@playwright/test';
import { setupTestPortfolio } from './helpers/mockStorage';

test('verifies Custom Guru navigation from Dashboard and persona customization in Gurus tab', async ({ page }) => {
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
        name: 'Schwab US Dividend Equity ETF',
        ticker: 'SCHD',
        type: 'stock',
        market: 'US',
        currency: 'USD',
        quantity: 100,
        avgBuyPrice: 70,
        currentPrice: 80,
        categories: ['dividend'],
        visibility: 'all',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
    targetAllocations: [
      { category: 'growth', targetPercent: 50 },
      { category: 'dividend', targetPercent: 50 },
    ],
  });

  // 1. 대시보드 진입
  await page.goto('/');
  await page.waitForTimeout(500);

  // 2. 대시보드 내 커스텀 구루 진단 배너 확인 및 클릭
  const dashBannerTitle = page.locator('text=나만의 맞춤형 AI 구루 진단');
  await expect(dashBannerTitle).toBeVisible();

  const consultBtn = page.getByRole('link', { name: '진단받기' });
  await expect(consultBtn).toBeVisible();
  await consultBtn.click();

  // 3. /gurus?guru=custom 이동 및 커스텀 구루 자동 선택 확인
  await page.waitForURL('**/gurus?guru=custom');
  await expect(page.getByRole('heading', { level: 1, name: '투자 구루' })).toBeVisible({ timeout: 10000 });

  // 커스텀 구루 배너 및 기본 이름 확인
  const customGuruBadge = page.locator('text=나만의 구루').first();
  await expect(customGuruBadge).toBeVisible();

  const defaultGuruName = page.locator('text=나만의 맞춤 구루').first();
  await expect(defaultGuruName).toBeVisible();

  // 4. 구루 성향 설정 모달 열기
  const settingsBtn = page.getByRole('button', { name: '구루 성향 설정' }).first();
  await expect(settingsBtn).toBeVisible();
  await settingsBtn.click();

  // 모달 확인
  await expect(page.locator('text=나만의 AI 구루 설정')).toBeVisible();

  // 이름 변경
  const nameInput = page.locator('#custom-guru-name');
  await nameInput.fill('글로벌 퀀트 멘토');

  // 전략 변경 (퀀트 & 모멘텀 선택)
  const quantOption = page.getByRole('button', { name: /퀀트 & 모멘텀/ });
  await quantOption.click();

  // 어투 변경 (냉철한 팩트폭격형 선택)
  const directToneOption = page.getByRole('button', { name: /냉철한 팩트폭격형/ });
  await directToneOption.click();

  // 저장
  const saveBtn = page.getByRole('button', { name: '저장하고 구루 적용' });
  await saveBtn.click();

  // 5. 변경된 이름 및 전략 반영 확인
  await expect(page.locator('text=글로벌 퀀트 멘토').first()).toBeVisible();

  // 6. 프롬프트 열기 및 내용 검증
  const showPromptBtn = page.getByRole('button', { name: /새 대화 시작/ });
  await showPromptBtn.click();

  const textarea = page.locator('textarea').first();
  await expect(textarea).toBeVisible();
  const promptValue = await textarea.inputValue();

  expect(promptValue).toContain('글로벌 퀀트 멘토');
  expect(promptValue).toContain('Quantitative & Momentum');
  expect(promptValue).toContain('Direct, blunt, and uncompromising');
  expect(promptValue).toContain('ALLOCATION BY CATEGORY (vs your custom target)');

  // 7. 시각적 검증용 스크린샷 캡처
  await page.screenshot({
    path: '/Users/idenrai/.gemini/antigravity-ide/brain/cd2743a6-c0ff-4c96-b971-225635dcc631/custom_guru_demo.png',
    fullPage: true,
  });
});
