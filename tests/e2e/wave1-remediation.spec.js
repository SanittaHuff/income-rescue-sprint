import { expect, test } from '@playwright/test';

const STORAGE_KEY = 'income-rescue-sprint-v1';

function reviewedWorkspace() {
  return {
    version: 2,
    profile: { name: 'Synthetic Reviewer', targetRole: 'Platform Administrator', workPreference: 'Remote first' },
    evidence: [
      {
        id: 'ev-wave1',
        role: 'Platform Administrator',
        timeframe: '2024–2025',
        evidence: 'Reconciled ownership mappings and updated the governed work board for engineering managers',
        tools: 'Azure DevOps and CSV',
        result: 'Reduced unresolved ownership exceptions before the reporting deadline',
        confidence: 'High confidence',
        source: 'Synthetic source note',
        status: 'reviewed-by-user',
        reviewedAt: '2026-08-06T00:00:00.000Z',
        createdAt: '2026-08-06T00:00:00.000Z'
      }
    ],
    components: [],
    jobs: [],
    completedActions: [],
    lastUpdated: '2026-08-06T00:00:00.000Z'
  };
}

async function openProduct(page, { state = null, companionOpen = false } = {}) {
  await page.addInitScript(({ initialState, restoreCompanion }) => {
    localStorage.clear();
    localStorage.setItem('lvhq-welcome-complete', 'true');
    if (initialState) localStorage.setItem('income-rescue-sprint-v1', JSON.stringify(initialState));
    if (restoreCompanion) localStorage.setItem('lvhq-career-companion-open', 'true');
  }, { initialState: state, restoreCompanion: companionOpen });
  await page.goto('/');
  await expect(page.locator('#workspace')).toBeVisible();
}

test('reviewed evidence can create a transparent local resume draft without adding new facts', async ({ page }) => {
  await openProduct(page, { state: reviewedWorkspace() });
  await page.locator('.nav-button[data-panel="resume"]').click();

  await expect(page.getByRole('button', { name: 'Draft from reviewed evidence' })).toBeVisible();
  await page.locator('#evidenceId').selectOption('ev-wave1');
  await page.locator('#componentType').selectOption('Achievement bullet');
  await page.getByRole('button', { name: 'Draft from reviewed evidence' }).click();

  const draft = await page.locator('#componentText').inputValue();
  expect(draft).toContain('Reconciled ownership mappings and updated the governed work board for engineering managers');
  expect(draft).toContain('Azure DevOps and CSV');
  expect(draft).toContain('Reduced unresolved ownership exceptions before the reporting deadline');
  expect(draft).not.toMatch(/guaranteed|independently verified|increased revenue|saved \$/i);
  await expect(page.locator('#label')).not.toHaveValue('');
  await expect(page.locator('#componentForm .callout')).toContainText('does not use a connected AI model or add new facts');
});

test('experience intake prompts for context scope constraints and results without requiring proof', async ({ page }) => {
  await openProduct(page);
  await page.locator('.nav-button[data-panel="evidence"]').click();

  await expect(page.locator('label[for="evidence"]')).toHaveText('What was happening, and what did you do?');
  await expect(page.locator('#evidence').locator('xpath=following-sibling::*[contains(@class,"field-hint")]')).toContainText('scope or volume');
  await expect(page.locator('#evidence').locator('xpath=following-sibling::*[contains(@class,"field-hint")]')).toContainText('constraints');
  await expect(page.locator('#evidence').locator('xpath=following-sibling::*[contains(@class,"field-hint")]')).toContainText('recovered memories');
});

test('resume gate uses neutral progress language', async ({ page }) => {
  await openProduct(page);
  await page.locator('.nav-button[data-panel="resume"]').click();

  await expect(page.locator('.callout.warning strong')).toHaveText('One review step remains.');
  await expect(page.locator('.callout.warning')).toContainText('Review one experience before creating resume wording');
  await expect(page.locator('.callout.warning')).not.toContainText('Truth Gate closed');
});

test('navigation help tips do not create nested keyboard focus stops', async ({ page }) => {
  await openProduct(page);
  const tips = page.locator('.nav-button .info-tip');
  await expect(tips.first()).toBeVisible();
  const count = await tips.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i += 1) {
    await expect(tips.nth(i)).toHaveAttribute('tabindex', '-1');
    await expect(tips.nth(i)).toHaveAttribute('aria-hidden', 'true');
  }
  await expect(page.locator('.nav-button').first()).toHaveAttribute('aria-describedby', /nav-help-/);
});

test('restored Career Companion stays visible without unsolicited focus transfer', async ({ page }) => {
  await openProduct(page, { companionOpen: true });
  await expect(page.locator('#careerCompanionPanel')).toBeVisible();
  await expect(page.locator('#careerCompanionToggle')).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(() => page.evaluate(() => Boolean(document.activeElement?.closest?.('#careerCompanion')))).toBe(false);
});

test('high-risk recruiter message defaults to independent verification before engagement', async ({ page }) => {
  await openProduct(page);
  await page.locator('.nav-button[data-panel="email-review"]').click();
  await page.locator('#recruiterEmailText').fill('Role: Support Analyst\nCompany: Example Co\nPlease send your SSN and bank account details through WhatsApp before we schedule the interview.');
  await page.locator('#emailSafetyAcknowledge').check();
  await page.getByRole('button', { name: 'Review Message' }).click();

  await expect(page.locator('#emailReviewResult .risk-block')).toContainText('Social Security');
  await expect(page.locator('#emailReviewResult .risk-block')).toContainText('banking');
  await expect(page.locator('#emailReplyDraft')).toHaveValue(/Do not reply yet/);
  await expect(page.locator('#emailReplyDraft')).toHaveValue(/Independently verify the employer/i);
  await expect(page.locator('#emailReplyDraft')).not.toHaveValue(/I am interested in learning more/i);
});

test('shortened-link caution also receives the safety-first non-engagement draft', async ({ page }) => {
  await openProduct(page);
  await page.locator('.nav-button[data-panel="email-review"]').click();
  await page.locator('#recruiterEmailText').fill('Role: Support Analyst\nCompany: Example Co\nPlease use https://bit.ly/example-onboarding to complete the next step for this opportunity.');
  await page.locator('#emailSafetyAcknowledge').check();
  await page.getByRole('button', { name: 'Review Message' }).click();

  await expect(page.locator('#emailReviewResult .risk-block')).toContainText('shortened link');
  await expect(page.locator('#emailReplyDraft')).toHaveValue(/Do not reply yet/);
  await expect(page.locator('#emailReplyDraft')).not.toHaveValue(/I am interested in learning more/i);
});

test('guaranteed-hire caution also receives the safety-first non-engagement draft', async ({ page }) => {
  await openProduct(page);
  await page.locator('.nav-button[data-panel="email-review"]').click();
  await page.locator('#recruiterEmailText').fill('Role: Support Analyst\nCompany: Example Co\nThis is a guaranteed job and an instant hire. Reply now to start today.');
  await page.locator('#emailSafetyAcknowledge').check();
  await page.getByRole('button', { name: 'Review Message' }).click();

  await expect(page.locator('#emailReviewResult .risk-block')).toContainText('guaranteed hiring');
  await expect(page.locator('#emailReplyDraft')).toHaveValue(/Do not reply yet/);
  await expect(page.locator('#emailReplyDraft')).not.toHaveValue(/I am interested in learning more/i);
});

test('interview request receives interview-aware rather than generic outreach drafting', async ({ page }) => {
  await openProduct(page);
  await page.locator('.nav-button[data-panel="email-review"]').click();
  await page.locator('#recruiterEmailText').fill('Role: Platform Administrator\nCompany: Example Co\nWe would like to schedule an interview next week. Please share your availability for a 30 minute phone screen.');
  await page.locator('#emailSafetyAcknowledge').check();
  await page.getByRole('button', { name: 'Review Message' }).click();

  await expect(page.locator('#emailReplyDraft')).toHaveValue(/Thank you for the interview invitation/);
  await expect(page.locator('#emailReplyDraft')).toHaveValue(/confirm an available time/);
  await expect(page.locator('#emailReplyDraft')).not.toHaveValue(/interested in learning more/i);
});
