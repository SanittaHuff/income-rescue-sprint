# Income Rescue Sprint

A governed, user-controlled job-search recovery workspace developed under Quiet Bridge Research.

## Current product surface

The browser MVP currently supports:

- Experience Evidence intake and explicit verification
- Truth-gated Resume Component drafting and approval
- Opportunity scoring and priority management
- One Next Best Action recommendation at a time
- Local JSON export, import, and deletion
- Responsive and keyboard-accessible interface
- Clear privacy and prototype limitations

## Run locally

No build process is required for the browser MVP.

1. Download or clone the repository.
2. Open `index.html` in a modern browser.
3. Data will be stored only in that browser's local storage.

For a local web server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Validate

```bash
npm run validate:mvp
```

The validation checks JavaScript syntax, required product surfaces, accessibility landmarks, responsive styling, safety helpers, and data-portability controls.

## Truth boundary

This is an authentic working MVP, not a production release. It currently has no backend, cloud identity, payment system, external connector, autonomous job application, or server-side backup. No feature may claim an external action occurred unless a future integration provides verifiable evidence.

## Current branch and review

The visible build is maintained in `build/visible-mvp` and reviewed through Draft Pull Request #4 before merging to `main`.
