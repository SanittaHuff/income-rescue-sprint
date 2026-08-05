import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const js = readFileSync('app.js', 'utf8');

const requiredHtml = [
  'Income Rescue Sprint',
  'Experience Evidence',
  'Resume Readiness',
  'Opportunity Priority',
  'Next Best Action',
  'Privacy & Trust',
  'Data & Settings'
];

const missing = requiredHtml.filter(label => !html.includes(label));
if (missing.length) {
  throw new Error(`Missing required product surfaces: ${missing.join(', ')}`);
}

if (!html.includes('aria-live') || !html.includes('skip-link')) {
  throw new Error('Accessibility landmarks are missing.');
}

if (!css.includes('@media') || !css.includes('prefers-reduced-motion')) {
  throw new Error('Responsive or reduced-motion styling is missing.');
}

if (!js.includes('escapeHtml') || !js.includes('askConfirmation')) {
  throw new Error('Required safety helpers are missing.');
}

if (!js.includes('exportData') || !js.includes('importInput')) {
  throw new Error('Data portability controls are missing.');
}

console.log('Visible MVP static validation passed.');
