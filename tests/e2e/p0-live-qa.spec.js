import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const STORAGE_KEY = 'income-rescue-sprint-v1';

function workspaceState(overrides = {}) {
  return {
    version: 1,
    profile: { name: 'Test User', targetRole: 'Azure DevOps Administrator', workPreference: 'Remote first' },
    evidence: [],
    components: [],
    jobs: [],
    completedActions: [],
    lastUpdated: '2026-08-06T00:00:00.000Z',
    ...overrides
  };
}

async function openProduct(page, { state = null, welcomeComplete = true } = {}) {
  await page.addInitScript(({ initialState, welcomeIsComplete }) => {
    localStorage.clear();
    if (welcomeIsComplete) localStorage.setItem('lvhq-welcome-complete', 'true');
    if (initialState) localStorage.setItem('income-rescue-sprint-v1', JSON.stringify(initialState));
  }, { initialState: state, welcomeIsComplete: welcomeComplete });
  await page.goto('/');
  await expect(page.locator('#workspace')).toBeVisible();
}

async function storedWorkspace(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
}

test('first-use welcome traps focus and Escape exits safely', async ({ page }) => {
  await openProduct(page, { welcomeComplete: false });
  const overlay = page.locator('#welcomeOverlay');
  await expect(overlay).toBeVisible();
  await expect(page.locator('#welcomeGuided')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('#welcomeExplore')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#welcomeGuided')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(overlay).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('lvhq-welcome-complete'))).toBe('true');
});

test('Career Companion is keyboard-operable and states its capability boundary', async ({ page }, testInfo) => {
  await openProduct(page);
  const toggle = page.locator('#careerCompanionToggle');
  const panel = page.locator('#careerCompanionPanel');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('not a live autonomous agent');
  await expect(panel).toContainText('No mailbox, calendar, job board, external AI service, or automatic application access');
  await expect(panel).toContainText('Explain and navigate only');
  await testInfo.attach('career-companion-open', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png'
  });

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();

  await toggle.click();
  await panel.locator('[data-companion-go="evidence"]').click();
  await expect(panel).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Experience Evidence' })).toBeVisible();
  await expect(page.locator('.nav-button[data-panel="evidence"]')).toHaveClass(/active/);
});

test('mobile and 200-percent-equivalent layouts preserve visible controls without horizontal overflow', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openProduct(page);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  await page.locator('#careerCompanionToggle').click();
  const companionBox = await page.locator('#careerCompanion').boundingBox();
  expect(companionBox).not.toBeNull();
  expect(companionBox.x).toBeGreaterThanOrEqual(0);
  expect(companionBox.x + companionBox.width).toBeLessThanOrEqual(391);
  await testInfo.attach('mobile-companion', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png'
  });

  // A 640 CSS-pixel viewport represents a 1280-pixel desktop viewed at 200% browser zoom.
  await page.setViewportSize({ width: 640, height: 900 });
  await expect(page.getByRole('heading', { name: /Turn scattered experience/ })).toBeVisible();
  await expect(page.locator('#careerCompanionToggle')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await testInfo.attach('reflow-200-percent-equivalent', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png'
  });
});

test('legacy and unknown evidence states migrate safely and drive governed workflow logic', async ({ page }) => {
  const state = workspaceState({
    evidence: [
      { id: 'ev-reviewed', role: 'Legacy reviewed role', evidence: 'Reviewed evidence', confidence: 'High confidence', status: 'verified', verifiedAt: '2026-01-01T00:00:00.000Z', createdAt: '2026-01-01T00:00:00.000Z' },
      { id: 'ev-pending', role: 'Pending role', evidence: 'Pending evidence', confidence: 'Recovered memory', status: 'pending', createdAt: '2026-01-02T00:00:00.000Z' },
      { id: 'ev-unknown', role: 'Unknown role', evidence: 'Unknown evidence', confidence: 'Needs verification', status: 'mystery-state', createdAt: '2026-01-03T00:00:00.000Z' },
      { id: 'ev-independent', role: 'Independent role', evidence: 'Independent evidence', confidence: 'High confidence', status: 'independently-verified', createdAt: '2026-01-04T00:00:00.000Z' }
    ]
  });
  await openProduct(page, { state });

  await expect.poll(async () => {
    const stored = await storedWorkspace(page);
    return { version: stored.version, statuses: stored.evidence.map(item => item.status) };
  }).toEqual({
    version: 2,
    statuses: ['reviewed-by-user', 'needs-review', 'needs-review', 'independently-verified']
  });

  await page.locator('.nav-button[data-panel="evidence"]').click();
  await expect(page.locator('article[data-id="ev-reviewed"]')).toContainText('Reviewed by you');
  await expect(page.locator('article[data-id="ev-pending"]')).toContainText('Needs your review');
  await expect(page.locator('article[data-id="ev-independent"]')).toContainText('Independently verified');
  await expect(page.locator('article[data-id="ev-unknown"]')).toContainText('Needs verification');

  await page.locator('.nav-button[data-panel="resume"]').click();
  await expect(page.locator('#evidenceId option')).toContainText(['Select evidence', /Legacy reviewed role/, /Independent role/]);

  await page.locator('.nav-button[data-panel="next"]').click();
  await expect(page.getByRole('heading', { name: 'Review evidence from Pending role' })).toBeVisible();

  await page.locator('.nav-button[data-panel="evidence"]').click();
  await page.locator('article[data-id="ev-reviewed"] [data-action="edit-evidence"]').click();
  await page.locator('#evidence').fill('Reviewed evidence changed during edit');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect.poll(async () => (await storedWorkspace(page)).evidence.find(item => item.id === 'ev-reviewed').status).toBe('needs-review');
  await expect(page.locator('article[data-id="ev-reviewed"]')).toContainText('Needs your review');
});

test('recruiter email review detects useful signals without connecting, sending, or persisting pasted text', async ({ page }, testInfo) => {
  await openProduct(page);
  await page.locator('.nav-button[data-panel="email-review"]').click();
  await expect(page.getByRole('heading', { name: 'Recruiter Email Review' })).toBeVisible();
  await expect(page.locator('#workspace')).toContainText('No mailbox is connected');

  const sample = `Role: Azure DevOps Administrator\nCompany: Example Staffing\nThis is a remote W-2 contract at $70/hr. Please send your resume and availability. Contact us on WhatsApp and provide your bank account for equipment reimbursement.`;
  await page.locator('#recruiterEmailText').fill(sample);
  await page.locator('#emailSafetyAcknowledge').check();
  await page.getByRole('button', { name: 'Review Message' }).click();

  await expect(page.locator('#emailReviewResult')).toContainText('Remote');
  await expect(page.locator('#emailReviewResult')).toContainText('W-2 contract');
  await expect(page.locator('#emailReviewResult')).toContainText('$70/hr');
  await expect(page.locator('#emailReviewResult')).toContainText('Send or update a resume');
  await expect(page.locator('#emailReviewResult')).toContainText('Provide availability');
  await expect(page.locator('#emailReviewResult')).toContainText('Requests banking, card, payment, gift-card, or cryptocurrency information');
  await expect(page.locator('#emailReviewResult')).toContainText('Moves the conversation to Telegram or WhatsApp');
  await expect(page.locator('#emailReplyDraft')).not.toHaveValue('');
  await expect(page.locator('#emailReviewResult')).toContainText('Nothing is sent');
  await expect.poll(() => page.evaluate(value => Object.values(localStorage).every(item => !item.includes(value)), 'equipment reimbursement')).toBe(true);

  await testInfo.attach('recruiter-email-review', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png'
  });
});

test('agent permissions and connector status remain visible and external actions stay unavailable', async ({ page }) => {
  await openProduct(page);
  await page.locator('#careerCompanionToggle').click();
  await page.getByRole('button', { name: 'Show connection status' }).click();

  await expect(page.getByRole('heading', { name: 'Connections & Agent Controls' })).toBeVisible();
  await expect(page.locator('#workspace')).toContainText('1. Explain and navigate — Available');
  await expect(page.locator('#workspace')).toContainText('2. Suggest — Available locally');
  await expect(page.locator('#workspace')).toContainText('3. Draft internally — Available');
  await expect(page.locator('#workspace')).toContainText('4. Prepare for your approval — User controlled');
  await expect(page.locator('#workspace')).toContainText('5. External action — Unavailable');
  await expect(page.locator('#workspace')).toContainText('Gmail and Outlook');
  await expect(page.locator('#workspace')).toContainText('No connector can be enabled from this screen');
  await expect(page.locator('#workspace')).toContainText('No sending, scheduling, applying, purchasing, sharing, deleting external data, or background monitoring');
});

test('export and import preserve governed states and invalid imports fail safely', async ({ page }) => {
  const state = workspaceState({
    evidence: [
      { id: 'ev-export', role: 'Export role', evidence: 'Export evidence', confidence: 'High confidence', status: 'verified', verifiedAt: '2026-01-01T00:00:00.000Z', createdAt: '2026-01-01T00:00:00.000Z' }
    ]
  });
  await openProduct(page, { state });

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const download = await downloadPromise;
  const exported = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(exported.version).toBe(2);
  expect(exported.evidence[0].status).toBe('reviewed-by-user');
  expect(exported.evidence[0].reviewedAt).toBe('2026-01-01T00:00:00.000Z');

  const imported = workspaceState({
    evidence: [
      { id: 'ev-import', role: 'Imported role', evidence: 'Imported evidence', confidence: 'Recovered memory', status: 'unsupported-state', createdAt: '2026-02-01T00:00:00.000Z' }
    ]
  });
  await page.locator('#importInput').setInputFiles({
    name: 'income-rescue-import.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(imported))
  });
  await expect(page.locator('#confirmDialog')).toBeVisible();
  await page.locator('#acceptConfirm').click();
  await expect.poll(async () => (await storedWorkspace(page)).evidence[0].status).toBe('needs-review');
  await expect(page.locator('#verifiedCount')).toHaveText('0 reviewed');

  await page.locator('#importInput').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{not valid json')
  });
  await expect(page.locator('#toast')).toHaveText('Import failed. Select a valid Income Rescue Sprint JSON export.');
});
