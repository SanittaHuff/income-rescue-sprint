import { expect, test } from '@playwright/test';

async function openProduct(page) {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('lvhq-welcome-complete', 'true');
  });
  await page.goto('/');
  await expect(page.locator('#workspace')).toBeVisible();
}

test('UX-004 panel remediation exposes semantic current state and explicit workspace focus', async ({ page }) => {
  await openProduct(page);

  const currentValue = page.locator('#moduleCurrentValue');
  const focusValue = page.locator('#moduleFocusValue');
  const workspace = page.locator('#workspace');
  const overviewTab = page.locator('.nav-button[data-panel="dashboard"]');
  const evidenceTab = page.locator('.nav-button[data-panel="evidence"]');
  const settingsTab = page.locator('.nav-button[data-panel="settings"]');

  await expect(currentValue).toHaveText('Overview');
  await expect(focusValue).toHaveText('Not on module navigation');
  await expect(overviewTab).toHaveAttribute('aria-current', 'page');
  await expect(evidenceTab).not.toHaveAttribute('aria-current', 'page');

  await overviewTab.click();
  await expect(workspace).toBeFocused();
  await expect(focusValue).toHaveText('Workspace content');
  await expect(currentValue).toHaveText('Overview');

  await page.keyboard.press('Shift+Tab');
  await expect(settingsTab).toBeFocused();
  await expect(focusValue).toHaveText('Data & Settings');
  await expect(currentValue).toHaveText('Overview');

  await evidenceTab.focus();
  await evidenceTab.press('Enter');
  await expect(evidenceTab).toHaveAttribute('aria-current', 'page');
  await expect(overviewTab).not.toHaveAttribute('aria-current', 'page');
  await expect(currentValue).toHaveText('Experience Evidence');
  await expect(workspace).toBeFocused();
  await expect(focusValue).toHaveText('Workspace content');
});
