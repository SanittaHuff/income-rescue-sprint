import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function openProduct(page) {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('lvhq-welcome-complete', 'true');
  });
  await page.goto('/');
  await expect(page.locator('#workspace')).toBeVisible();
}

async function expectNoSeriousAccessibilityViolations(page, label) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const serious = results.violations.filter(item => ['critical', 'serious'].includes(item.impact));
  expect(serious, `${label}: ${JSON.stringify(serious, null, 2)}`).toEqual([]);
}

test('completed welcome state preserves skip link as the first keyboard target', async ({ page }) => {
  await openProduct(page);

  await expect.poll(() => page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName)).not.toBe('workspace');

  await page.keyboard.press('Tab');
  const skipLink = page.locator('.skip-link');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await expect(skipLink).toHaveText('Skip to workspace');

  await page.keyboard.press('Enter');
  await expect(page.locator('#workspace')).toBeFocused();
});

test('module navigation explicitly names current section and keyboard focus', async ({ page }) => {
  await openProduct(page);
  const status = page.locator('#moduleNavStatus');
  const currentValue = page.locator('#moduleCurrentValue');
  const focusValue = page.locator('#moduleFocusValue');
  const overviewTab = page.locator('.nav-button[data-panel="dashboard"]');
  const evidenceTab = page.locator('.nav-button[data-panel="evidence"]');

  await expect(status).toBeVisible();
  await expect(currentValue).toHaveText('Overview');
  await expect(focusValue).toHaveText('Not on module navigation');
  await expect(overviewTab.locator('.nav-current-badge')).toHaveText('Current');

  // Establish keyboard modality before programmatically moving to the control under test.
  await page.keyboard.press('Tab');
  await evidenceTab.focus();
  await expect(evidenceTab).toBeFocused();
  await expect.poll(() => evidenceTab.evaluate(element => element.matches(':focus-visible'))).toBe(true);
  await expect(focusValue).toHaveText('Experience Evidence');
  await expect(status).toHaveClass(/keyboard-focus-active/);

  const focusStyle = await evidenceTab.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor,
      textDecorationLine: style.textDecorationLine,
      boxShadow: style.boxShadow
    };
  });
  expect(parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(5);
  expect(focusStyle.outlineColor).toBe('rgb(255, 216, 77)');
  expect(focusStyle.textDecorationLine).toContain('underline');
  expect(focusStyle.boxShadow).not.toBe('none');

  await evidenceTab.press('Enter');
  await expect(evidenceTab).toHaveClass(/active/);
  await expect(evidenceTab.locator('.nav-current-badge')).toHaveText('Current');
  await expect(currentValue).toHaveText('Experience Evidence');
  await expect(page.locator('#workspace')).toBeFocused();
  await expect(focusValue).toHaveText('Not on module navigation');
});

test('core, Companion, email review, and capability surfaces pass automated WCAG preflight', async ({ page }) => {
  await openProduct(page);
  const reassurance = page.locator('.reassurance');
  await expect(reassurance).toBeVisible();
  await expect.poll(() => reassurance.evaluate(element => getComputedStyle(element).color)).toBe('rgb(234, 247, 251)');
  await expect.poll(() => reassurance.locator('strong').evaluate(element => getComputedStyle(element).color)).toBe('rgb(255, 255, 255)');
  await expectNoSeriousAccessibilityViolations(page, 'Overview');

  await page.locator('#careerCompanionToggle').click();
  await expect(page.locator('#careerCompanionPanel')).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page, 'Career Companion');
  await page.keyboard.press('Escape');

  await page.locator('.nav-button[data-panel="email-review"]').click();
  await expect(page.getByRole('heading', { name: 'Recruiter Email Review' })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page, 'Recruiter Email Review');

  await page.locator('.nav-button[data-panel="capabilities"]').click();
  await expect(page.getByRole('heading', { name: 'Connections & Agent Controls' })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page, 'Connections and Agent Controls');
});

test('redacted warning phrases are reviewable but actual secret-shaped values are rejected', async ({ page }) => {
  await openProduct(page);
  await page.locator('.nav-button[data-panel="email-review"]').click();
  const textarea = page.locator('#recruiterEmailText');

  await textarea.fill('The sender asked for a bank account and an authentication code. These values have been removed.');
  await expect(textarea).toHaveValue(/bank account/);
  await expect(textarea).toHaveAttribute('aria-invalid', 'false');

  await textarea.fill('Social Security number: 123-45-6789');
  await expect(textarea).toHaveValue('');
  await expect(textarea).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#toast')).toHaveText('Sensitive information was not accepted in this prototype.');

  await textarea.fill('Bank account: 123456789');
  await expect(textarea).toHaveValue('');
  await expect(textarea).toHaveAttribute('aria-invalid', 'true');
});
