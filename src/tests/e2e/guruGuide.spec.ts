import { test, expect } from '@playwright/test';
import { setupTestPortfolio } from './helpers/mockStorage';

test('verifies Guru strategy filtering, search, and interactive guide matcher', async ({ page }) => {
  // 모의 자산 주입하여 빈 상태 방지
  await setupTestPortfolio(page);

  // 1. 투자 구루 페이지 진입
  await page.goto('/gurus');
  await expect(page.getByRole('heading', { level: 1, name: '투자 구루' })).toBeVisible();

  // 2. 전략 태그 필터 칩 확인
  const valueFilterChip = page.getByRole('button', { name: '가치투자' });
  const growthFilterChip = page.getByRole('button', { name: '성장·모멘텀' });
  await expect(valueFilterChip).toBeVisible();
  await expect(growthFilterChip).toBeVisible();

  // 그리드 뷰 및 필터바 스크린샷 캡처
  await page.screenshot({
    path: '/Users/idenrai/.gemini/antigravity-ide/brain/cd2743a6-c0ff-4c96-b971-225635dcc631/guru_filter_grid_demo.png',
  });

  // 3. '성장·모멘텀' 필터 클릭
  await growthFilterChip.click();
  // 캐시 우드 표시 확인
  await expect(page.locator('button[aria-label*="캐시 우드"]')).toBeVisible();
  // 벤저민 그레이엄(가치투자)은 필터링되어 숨겨져야 함
  await expect(page.locator('button[aria-label*="벤저민 그레이엄"]')).toHaveCount(0);

  // '전체'로 복구
  await page.getByRole('button', { name: '전체' }).click();
  await expect(page.locator('button[aria-label*="벤저민 그레이엄"]')).toBeVisible();

  // 4. 검색창 테스트
  const searchInput = page.getByPlaceholder('구루 이름 또는 운용사 검색...');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('버핏');
  await expect(page.locator('button[aria-label*="워렌 버핏"]')).toBeVisible();
  await expect(page.locator('button[aria-label*="캐시 우드"]')).toHaveCount(0);

  // 검색어 초기화
  const clearBtn = page.getByLabel('Clear search');
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
  } else {
    await searchInput.fill('');
  }
  await expect(page.locator('button[aria-label*="캐시 우드"]')).toBeVisible();

  // 5. '나에게 맞는 구루 찾기' 가이드 모달 오픈
  const guideBtn = page.getByRole('button', { name: '나에게 맞는 구루 찾기' }).first();
  await expect(guideBtn).toBeVisible();
  await guideBtn.click();

  // 모달 헤더 확인
  await expect(page.locator('text=투자 성향 맞춤 구루 추천 가이드')).toBeVisible();

  // Step 1: 안정형/보수형 선택 후 다음
  await page.locator('text=원금 보존과 안정적 배당 복리').click();
  await page.getByRole('button', { name: '다음' }).click();

  // Step 2: 가치투자 선택 후 다음
  await page.locator('text=기업 내재가치와 충분한 안전마진 중심').click();
  await page.getByRole('button', { name: '다음' }).click();

  // Step 3: 따뜻한 멘토형 선택 후 진단
  await page.locator('text=따뜻하고 상냥하며 격려해 주는 멘토형').click();
  await page.getByRole('dialog').getByRole('button', { name: '나에게 맞는 구루 찾기' }).click();

  // Step 4: 추천 결과 확인 (버핏 1순위 베스트 매칭)
  await expect(page.getByText('최고의 매칭')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading', { name: '워렌 버핏' })).toBeVisible();

  // 스크린샷 캡처 (모달 결과)
  await page.screenshot({
    path: '/Users/idenrai/.gemini/antigravity-ide/brain/cd2743a6-c0ff-4c96-b971-225635dcc631/guru_guide_modal_demo.png',
  });

  // '이 구루와 상담 시작하기' 클릭
  const selectCtaBtn = page.getByRole('button', { name: '이 구루와 상담 시작하기' });
  await expect(selectCtaBtn).toBeVisible();
  await selectCtaBtn.click();

  // 모달이 닫히고 워렌 버핏 상세 상담 페이지로 전환 확인
  await expect(page.getByRole('heading', { name: '워렌 버핏', level: 2 }).or(page.getByRole('heading', { name: 'Warren Buffett', level: 2 }))).toBeVisible();
  await expect(page.getByText('Berkshire Hathaway (Chairman)')).toBeVisible();

  // 전체 화면 스크린샷 캡처
  await page.screenshot({
    path: '/Users/idenrai/.gemini/antigravity-ide/brain/cd2743a6-c0ff-4c96-b971-225635dcc631/guru_guide_selected_demo.png',
  });
});
