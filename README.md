# Income Rescue Sprint

A governed, user-controlled job-search recovery workspace developed under Quiet Bridge Research and presented as an independent product in the Life Vault HQ family.

## Current product surface

The live browser prototype currently supports:

- Memory-first Experience Evidence intake
- User review and approval of resume components
- Opportunity scoring and priority management
- One Next Best Action recommendation at a time
- Guided Mode and contextual Help Tips
- First-use welcome and written Getting Started guidance
- Local JSON export, import, and deletion
- Sensitive-information input safeguards
- Comfort View and Reduce Motion preferences
- Responsive and keyboard-conscious interaction
- Clear privacy, prototype, and readiness limitations

## Run locally

No compilation step is required for the browser prototype.

1. Download or clone the repository.
2. Open `index.html` in a modern browser.
3. Data is stored only in that browser's local storage unless exported.

For a local web server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Validate

```bash
npm run validate:mvp
```

Validation checks JavaScript syntax, required product surfaces, prototype disclosures, accessibility landmarks, responsive and reduced-motion styling, safety helpers, onboarding, display preferences, and data-portability controls.

## Truth boundary

This is an authentic working prototype, not a production release or certified pilot. It has no backend, cloud identity, account recovery, payment system, external connector, autonomous job application, or server-side backup. No feature may claim that an external action occurred unless a future integration provides verifiable evidence.

Do not enter passwords, financial information, medical information, Social Security numbers, authentication codes, confidential customer information, or confidential employer information.

## Current branch and deployment

The visible prototype is maintained on `main`, validated through GitHub Actions, and deployed through GitHub Pages.

## Review status

The prototype has passed the repository-level final QA flight check documented in `docs/FINAL-QA-FLIGHT-CHECK.md`. Security architecture, legal and regulatory review, production readiness, pilot authorization, and the Five Required Reviews remain open governance gates.