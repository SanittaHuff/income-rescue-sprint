import { readFileSync } from 'node:fs';

const files = {
  html: readFileSync('index.html', 'utf8'),
  css: readFileSync('styles.css', 'utf8'),
  app: readFileSync('app.js', 'utf8'),
  familyCss: readFileSync('lvhq-family.css', 'utf8'),
  familyJs: readFileSync('lvhq-family.js', 'utf8'),
  qa: readFileSync('prototype-qa.js', 'utf8'),
  buildCss: readFileSync('build-mode.css', 'utf8'),
  buildJs: readFileSync('build-mode.js', 'utf8')
};

const requiredHtml = [
  'Income Rescue Sprint',
  'Experience Evidence',
  'Resume Readiness',
  'Opportunity Priority',
  'Next Best Action',
  'Privacy & Trust',
  'Data & Settings',
  'Prototype Preview',
  'Product Readiness',
  'Getting Started'
];

const missing = requiredHtml.filter(label => !files.html.includes(label));
if (missing.length) throw new Error(`Missing required product surfaces: ${missing.join(', ')}`);

if (!files.html.includes('aria-live') || !files.html.includes('skip-link')) {
  throw new Error('Accessibility landmarks are missing.');
}

if (!files.css.includes('@media') || !files.css.includes('prefers-reduced-motion')) {
  throw new Error('Responsive or reduced-motion base styling is missing.');
}

if (!files.app.includes('escapeHtml') || !files.app.includes('askConfirmation')) {
  throw new Error('Required safety helpers are missing.');
}

if (!files.app.includes('exportData') || !files.app.includes('importInput')) {
  throw new Error('Data portability controls are missing.');
}

if (!files.familyJs.includes('Guided Mode') || !files.familyJs.includes('showFirstUseWelcome')) {
  throw new Error('Guided Mode or first-use onboarding is missing.');
}

if (!files.familyCss.includes('.coach-strip') || !files.familyCss.includes('.written-guide')) {
  throw new Error('Guided Mode or Learning Center styling is missing.');
}

if (!files.qa.includes('loadExperienceEnhancements') || !files.qa.includes('prototypeSafetyBound')) {
  throw new Error('Prototype safety or enhancement loading is missing.');
}

if (!files.buildJs.includes('initializeBuildMode') || !files.buildJs.includes('improveWelcomeKeyboardSafety')) {
  throw new Error('Display preferences or welcome keyboard safeguards are missing.');
}

if (!files.buildCss.includes('.comfort-view') || !files.buildCss.includes('.reduce-motion')) {
  throw new Error('Comfort View or Reduce Motion styling is missing.');
}

if (files.buildCss.includes('*,@media')) {
  throw new Error('Malformed reduced-motion CSS detected.');
}

if (!files.html.includes('href="build-mode.css"') || !files.html.includes('src="build-mode.js"')) {
  throw new Error('P0 enhancement assets exist but are not wired into the live product.');
}

const companionRequirements = [
  'Career Companion',
  'not a live autonomous agent',
  'No mailbox, calendar, job board, external AI service, or automatic application access',
  'Permission level:',
  'Explain and navigate only'
];
const missingCompanion = companionRequirements.filter(value => !files.buildJs.includes(value));
if (missingCompanion.length) {
  throw new Error(`Career Companion truth boundaries are incomplete: ${missingCompanion.join(', ')}`);
}

if (!files.buildCss.includes('.career-companion') || !files.buildCss.includes('.companion-panel')) {
  throw new Error('Career Companion responsive styling is missing.');
}

if (!files.buildJs.includes("button.setAttribute('aria-label', 'Mark this evidence as reviewed by you')")) {
  throw new Error('Evidence self-review control is not labeled truthfully.');
}

if (!files.html.includes('Written walkthroughs available now') || !files.html.includes('Video production remains planned')) {
  throw new Error('Getting Started does not distinguish working guidance from planned video production.');
}

if (!files.html.includes('<strong>Not connected</strong>')) {
  throw new Error('Product readiness does not clearly disclose unavailable connectors and services.');
}

console.log('Visible MVP static validation passed across product, LVHQ, safety, accessibility, P0 Companion, capability-boundary, and display-preference assets.');
