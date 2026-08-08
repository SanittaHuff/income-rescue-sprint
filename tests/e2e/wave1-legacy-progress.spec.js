import { expect, test } from '@playwright/test';

const STORAGE_KEY = 'income-rescue-sprint-v1';

test('legacy completed-action acknowledgements remain stored but no longer inflate readiness', async ({ page }) => {
  const legacyState = {
    version: 2,
    profile: { name: 'Returning Reviewer', targetRole: 'Platform Administrator', workPreference: 'Remote first' },
    evidence: [
      {
        id: 'ev-reviewed',
        role: 'Platform Administrator',
        timeframe: '2024–2025',
        evidence: 'Maintained a governed engineering work board',
        tools: 'Azure DevOps',
        result: 'Kept ownership records current',
        confidence: 'High confidence',
        source: 'Synthetic source note',
        status: 'reviewed-by-user',
        reviewedAt: '2026-08-06T00:00:00.000Z',
        createdAt: '2026-08-06T00:00:00.000Z'
      }
    ],
    components: [
      {
        id: 'component-approved',
        evidenceId: 'ev-reviewed',
        type: 'Achievement bullet',
        label: 'Approved synthetic component',
        text: 'Maintained a governed engineering work board.',
        status: 'approved',
        createdAt: '2026-08-06T00:00:00.000Z'
      }
    ],
    jobs: [],
    completedActions: ['legacy-1', 'legacy-2', 'legacy-3', 'legacy-4', 'legacy-5'],
    lastUpdated: '2026-08-06T00:00:00.000Z'
  };

  await page.addInitScript(state => {
    localStorage.clear();
    localStorage.setItem('lvhq-welcome-complete', 'true');
    localStorage.setItem('income-rescue-sprint-v1', JSON.stringify(state));
  }, legacyState);
  await page.goto('/');

  await expect(page.locator('#progressText')).toHaveText('Sprint readiness: 30%');
  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}'), STORAGE_KEY);
  expect(stored.completedActions).toEqual(['legacy-1', 'legacy-2', 'legacy-3', 'legacy-4', 'legacy-5']);
});