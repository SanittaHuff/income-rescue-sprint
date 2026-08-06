import { readFileSync } from 'node:fs';

const files = {
  html: readFileSync('index.html', 'utf8'),
  css: readFileSync('styles.css', 'utf8'),
  app: readFileSync('app.js', 'utf8'),
  evidenceGovernance: readFileSync('evidence-state-governance.js', 'utf8'),
  familyCss: readFileSync('lvhq-family.css', 'utf8'),
  familyJs: readFileSync('lvhq-family.js', 'utf8'),
  qa: readFileSync('prototype-qa.js', 'utf8'),
  buildCss: readFileSync('build-mode.css', 'utf8'),
  buildJs: readFileSync('build-mode.js', 'utf8'),
  p0Css: readFileSync('p0-tools.css', 'utf8'),
  p0Js: readFileSync('p0-tools.js', 'utf8'),
  readme: readFileSync('README.md', 'utf8')
};

const requiredHtml = [
  'Income Rescue Sprint',
  'Experience Evidence',
  'Resume Readiness',
  'Opportunity Priority',
  'Next Best Action',
  'Recruiter Email Review',
  'Connections & Agent Controls',
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
  throw new Error('P0 Companion assets exist but are not wired into the live product.');
}

if (!files.html.includes('href="p0-tools.css"') || !files.html.includes('src="p0-tools.js"')) {
  throw new Error('P0 recruiter-review and capability assets are not wired into the live product.');
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

if (files.buildJs.includes('createTreeWalker')) {
  throw new Error('Broad visible-text rewriting could alter user-authored or governed evidence language.');
}

if (!files.html.includes('Written walkthroughs available now') || !files.html.includes('Video production remains planned')) {
  throw new Error('Getting Started does not distinguish working guidance from planned video production.');
}

if (!files.html.includes('<strong>Not connected</strong>')) {
  throw new Error('Product readiness does not clearly disclose unavailable connectors and services.');
}

if (!files.html.includes('src="evidence-state-governance.js"')) {
  throw new Error('Governed evidence-state migration is not wired into the live product.');
}

const governedStateRequirements = [
  "const REVIEWED = 'reviewed-by-user'",
  "const NEEDS_REVIEW = 'needs-review'",
  "if (value === 'verified') return REVIEWED",
  "if (value === 'pending') return NEEDS_REVIEW",
  "return ALLOWED.has(value) ? value : NEEDS_REVIEW",
  'Legacy evidence states will be migrated safely',
  'delete item.verifiedAt',
  'Self-review is explicit and is not third-party verification',
  'Workspace export created with governed evidence states'
];
const missingGovernedStates = governedStateRequirements.filter(value => !files.evidenceGovernance.includes(value));
if (missingGovernedStates.length) {
  throw new Error(`Evidence-state migration boundaries are incomplete: ${missingGovernedStates.join(', ')}`);
}

if (!files.evidenceGovernance.includes("existing.status) ? NEEDS_REVIEW") && !files.evidenceGovernance.includes('status: isReviewed(existing) ? NEEDS_REVIEW')) {
  throw new Error('Editing reviewed evidence does not reset it to needs-review.');
}

if (!files.evidenceGovernance.includes("const INDEPENDENT = 'independently-verified'")) {
  throw new Error('Independent verification is not reserved as a distinct governed state.');
}

const emailReviewRequirements = [
  'Recruiter Email Review',
  'User-supplied text only',
  'No mailbox is connected',
  'not added to the workspace export',
  'transparent prototype rules—not by a connected AI model',
  'Nothing is sent',
  'This is not sender verification'
];
const missingEmailReview = emailReviewRequirements.filter(value => !files.p0Js.includes(value));
if (missingEmailReview.length) {
  throw new Error(`Recruiter email review boundaries are incomplete: ${missingEmailReview.join(', ')}`);
}

const capabilityRequirements = [
  'Connections & Agent Controls',
  '1. Explain and navigate — Available',
  '2. Suggest — Available locally',
  '3. Draft internally — Available',
  '4. Prepare for your approval — User controlled',
  '5. External action — Unavailable',
  'No connector can be enabled from this screen'
];
const missingCapabilities = capabilityRequirements.filter(value => !files.p0Js.includes(value));
if (missingCapabilities.length) {
  throw new Error(`Agent permission or connector boundaries are incomplete: ${missingCapabilities.join(', ')}`);
}

if (!files.p0Css.includes('.email-review-summary') || !files.p0Css.includes('.capability-grid') || !files.p0Css.includes('@media')) {
  throw new Error('Recruiter review or capability-center responsive styling is missing.');
}

if (!files.html.includes('Recruiter-email text is reviewed only while that page is open')) {
  throw new Error('Privacy disclosure does not explain recruiter-email handling.');
}

if (!files.readme.includes('local, user-supplied recruiter-email review') || !files.readme.includes('It does not read or verify a mailbox')) {
  throw new Error('README capability disclosures are not reconciled with the product.');
}

console.log('Visible MVP static validation passed across product, LVHQ, safety, accessibility, Career Companion, agent permissions, recruiter-email review, connector truth boundaries, governed evidence-state migration, portability, and display-preference assets.');
