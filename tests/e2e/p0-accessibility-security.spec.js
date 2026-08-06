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

test('core, Companion, email review, and capability surfaces pass automated WCAG preflight', async ({ page }) => {
  await openProduct(page);
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
