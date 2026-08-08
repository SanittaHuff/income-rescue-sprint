import { expect, test } from '@playwright/test';

test('all major product areas are visibly discoverable in narrow-screen navigation', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('lvhq-welcome-complete', 'true');
  });
  await page.goto('/');

  const nav = page.locator('.module-nav');
  await expect(nav).toBeVisible();
  const navDisplay = await nav.evaluate(element => getComputedStyle(element).display);
  await expect.poll(() => nav.evaluate(element => getComputedStyle(element).display)).toBe('grid');

  const panels = ['dashboard', 'evidence', 'resume', 'jobs', 'next', 'email-review', 'capabilities', 'settings'];
  const bounds = [];
  for (const panel of panels) {
    const button = page.locator(`.nav-button[data-panel="${panel}"]`);
    await expect(button).toBeVisible();
    bounds.push({ panel, box: await button.boundingBox() });
  }

  console.log(`::notice title=Mobile navigation bounds::${JSON.stringify({ viewport: { width: 390, height: 844 }, navDisplay, nav: await nav.boundingBox(), buttons: bounds })}`);

  for (const { panel, box } of bounds) {
    expect(box, `${panel} button must have a measurable box`).not.toBeNull();
    expect(box.x, `${panel} left edge must remain in the viewport`).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, `${panel} right edge must remain in the viewport`).toBeLessThanOrEqual(391);
  }

  await page.locator('.nav-button[data-panel="email-review"]').click();
  await expect(page.getByRole('heading', { name: 'Recruiter Email Review' })).toBeVisible();
  await page.locator('.nav-button[data-panel="capabilities"]').click();
  await expect(page.getByRole('heading', { name: 'Connections & Agent Controls' })).toBeVisible();

  await testInfo.attach('mobile-navigation-discovery', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png'
  });
});
