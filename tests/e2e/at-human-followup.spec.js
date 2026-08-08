import { expect, test } from '@playwright/test';

test('welcome modal prevents background page scrolling', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/');
  const welcome = page.locator('#welcomeOverlay');
  await expect(welcome).toBeVisible();

  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.move(4, 4);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(100);
  const after = await page.evaluate(() => window.scrollY);

  expect(after).toBe(before);
});
