import { test, expect } from '@playwright/test';

test('has title and renders dashboard', async ({ page }) => {
  await page.goto('/');

  // Assuming there is some recognizable text or header
  await expect(page).toHaveTitle(/Portfolio Bridge/);
  
  // Checking for some main elements, assuming 'Portfolio Bridge' or similar appears in DOM
  const header = page.locator('header');
  await expect(header).toBeVisible();
});
