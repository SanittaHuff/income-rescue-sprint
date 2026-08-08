import { expect, test } from '@playwright/test';

test('all major product areas are visibly discoverable in narrow-screen navigation', async ({ page }, testInfo) => {
  page.on('pageerror', error => {
    console.log(`::notice title=Mobile page error::${String(error.message || error)}`);
  });
  page.on('console', message => {
    if (message.type() === 'error') console.log(`::notice title=Mobile browser console error::${message.text()}`);
  });

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
  console.log('::notice title=Mobile discovery phase::Navigation geometry assertions passed');

  await page.locator('.nav-button[data-panel="email-review"]').click();
  const emailHeading = page.getByRole('heading', { name: 'Recruiter Email Review' });
  console.log(`::notice title=Mobile email-review phase::${JSON.stringify({ count: await emailHeading.count(), visible: await emailHeading.isVisible().catch(() => false), focus: await page.locator('#moduleFocusValue').textContent() })}`);
  await expect(emailHeading, 'Recruiter Email Review heading must render after mobile navigation activation').toBeVisible();

  await page.locator('.nav-button[data-panel="capabilities"]').click();
  const capabilitiesHeading = page.getByRole('heading', { name: 'Connections & Agent Controls' });
  const capabilityState = await page.evaluate(() => ({
    activePanel: typeof activePanel === 'undefined' ? 'undefined' : activePanel,
    activeButton: document.querySelector('.nav-button.active')?.dataset.panel || '',
    workspaceText: document.getElementById('workspace')?.innerText.slice(0, 240) || '',
    renderCapabilityCenterType: typeof renderCapabilityCenter,
    setActivePanelType: typeof setActivePanel
  }));
  console.log(`::notice title=Mobile capabilities phase::${JSON.stringify({ count: await capabilitiesHeading.count(), visible: await capabilitiesHeading.isVisible().catch(() => false), focus: await page.locator('#moduleFocusValue').textContent(), ...capabilityState })}`);
  await expect(capabilitiesHeading, 'Connections & Agent Controls heading must render after mobile navigation activation').toBeVisible();

  console.log('::notice title=Mobile screenshot phase::Starting full-page evidence screenshot');
  const screenshot = await page.screenshot({ fullPage: true });
  console.log(`::notice title=Mobile screenshot phase::Screenshot captured (${screenshot.length} bytes)`);
  await testInfo.attach('mobile-navigation-discovery', {
    body: screenshot,
    contentType: 'image/png'
  });
  console.log('::notice title=Mobile discovery phase::Test completed');
});
