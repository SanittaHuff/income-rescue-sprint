# Income Rescue Sprint

A governed, user-controlled job-search recovery workspace developed under Quiet Bridge Research and presented as an independent product in the Life Vault HQ family.

## Current product surface

The browser prototype currently supports:

- Memory-first Experience Evidence intake
- Governed evidence states that distinguish user review, source support, and independent verification
- User review and approval of resume components
- Opportunity scoring and priority management
- One Next Best Action recommendation at a time
- A visible Career Companion with truthful capability and permission boundaries
- A local, user-supplied recruiter-email review demonstration with editable reply drafting
- A Connections & Agent Controls center showing available, bounded, planned, and unavailable capabilities
- Guided Mode and contextual Help Tips
- First-use welcome and written Getting Started guidance
- Local JSON export, import, migration, and deletion
- Sensitive-information input safeguards
- Comfort View and Reduce Motion preferences
- Responsive and keyboard-conscious interaction
- Clear privacy, prototype, and readiness limitations

## Run locally

No compilation step is required for the browser prototype.

1. Download or clone the repository.
2. Open `index.html` in a modern browser.
3. Workspace data is stored only in that browser's local storage unless exported.
4. Recruiter-email text is reviewed only while its page is open and is not included in the workspace export.

For a local web server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Validate

Static and truth-boundary validation:

```bash
npm run validate:mvp
```

Governed Chromium browser regression:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Validation covers JavaScript syntax, required product surfaces, prototype disclosures, evidence-state migration, portability, accessibility landmarks, responsive and reduced-motion styling, Companion permissions, recruiter-email review boundaries, connector status, onboarding, display preferences, and safe failure.

## Truth boundary

This is an authentic working prototype, not a production release, connected AI agent, or certified pilot.

The Career Companion can explain, navigate, suggest limited local next actions, and prepare editable internal drafts. The recruiter-email review uses transparent local pattern rules on text the user deliberately pastes. It does not read or verify a mailbox, verify a sender, connect to an external AI model, send messages, schedule interviews, monitor accounts, or apply for jobs.

The prototype has no backend, cloud identity, account recovery, payment system, live external connector, autonomous job application, background monitoring, or server-side backup. No feature may claim that an external action occurred unless a future integration provides verifiable evidence.

Do not enter passwords, financial information, medical information, Social Security numbers, authentication codes, confidential customer information, or confidential employer information.

## Current branch and deployment

The visible prototype on `main` is validated through GitHub Actions and deployed through GitHub Pages. Development changes remain unmerged until their governed quality gates pass.

## Review status

The prior prototype passed the repository-level final QA flight check documented in `docs/FINAL-QA-FLIGHT-CHECK.md`. P0 Companion remediation, browser regression, human comprehension review, assistive-technology review, security architecture, legal and regulatory review, production readiness, pilot authorization, and the Five Required Reviews remain separately governed gates until verified and accepted.
