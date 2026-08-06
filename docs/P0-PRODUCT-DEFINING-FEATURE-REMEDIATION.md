# Income Rescue Sprint — P0 Product-Defining Feature Remediation

Status: Captain approved for governed implementation planning
Date: 2026-08-06
Authority: CBOM Product Excellence Decision Log — Decision 034
Branch: `p0-companion-remediation`

## Purpose

Preserve the current Senior Recruiter / Resume and ATS examination findings as baseline evidence, pause the remaining SME and Captain UAT sequence, and add the minimum product-defining capabilities required for the working prototype to represent its intended promise.

This plan governs the current public browser prototype. It does not import or claim capabilities from older recovery-build records unless those capabilities are independently present, reconciled, implemented, and verified in this repository.

## Current verified boundary

The current `main` prototype provides local Experience Evidence intake, user-reviewed resume components, opportunity prioritization, Next Best Action, Guided Mode, written Getting Started guidance, local export/import/delete, sensitive-input safeguards, and accessibility preferences.

It currently has no backend, cloud identity, live mailbox or calendar connector, live ATS parser, autonomous external action, or production security architecture.

## Baseline findings to freeze

1. The product does not visibly present the AI Companion as the organizing center of the experience.
2. Guided Mode and Next Best Action are deterministic browser features, not a true AI agent.
3. Email and calendar connectors are not live in the current repository.
4. The Learning Center contains video placeholders rather than working tutorial content.
5. Evidence self-review uses language such as `verified`, which may imply independent verification.
6. Capability status is not organized clearly enough across Available now, Demonstration, Planned, and Unavailable.

## P0 implementation sequence

### P0-1 — Truthful evidence-status vocabulary

Replace ambiguous self-review language with explicit states:

- Saved from memory
- Needs your review
- Reviewed by you
- Supported by a source
- Independently verified — reserved for genuine external verification only

Acceptance boundary: progress calculations and downstream resume eligibility must continue to work without claiming third-party validation.

### P0-2 — Visible Career Companion

Add a persistent Companion entry point and a dedicated Companion workspace that:

- explains what it can and cannot do;
- surfaces the current Next Best Action;
- offers guided choices for Experience, Resume, Opportunities, Email Review, and Learning;
- labels deterministic prototype guidance honestly;
- never claims a model, connector, or external action that is not present.

Initial implementation may be a bounded local orchestration layer. It must not be represented as generative AI until a real model integration exists.

### P0-3 — Agent permission and approval model

Show action levels in plain language:

1. Explain only
2. Suggest
3. Draft internally
4. Prepare for your approval
5. External action — unavailable in this prototype

Every consequential path must show what would happen, what data would be used, and that the user remains the final approver.

### P0-4 — Email Review demonstration workflow

Add a safe user-supplied-message workflow that can:

- accept pasted fictional or non-sensitive recruiter/job email text;
- identify likely purpose, dates, deadlines, requested actions, and missing information;
- prepare an editable reply draft;
- save the review locally only after explicit user action;
- state clearly that no mailbox was accessed and no message was sent.

A live Gmail or Outlook connection remains out of scope until separate provider, OAuth, privacy, token-revocation, deletion, security, and end-to-end testing gates pass.

### P0-5 — Connector and capability center

Add a truthful status surface for Email, Calendar, Cloud Storage, and Job Boards using these states:

- Available now
- Demonstration only
- Planned
- Not available

Each card must state access scope, external actions, storage behavior, disconnect status, and current limitations. No Connect button may imply authorization when provider integration is absent.

### P0-6 — Working Learning Center content

Replace placeholder-only presentation with usable first-release learning content:

- First five minutes
- Add one Experience Evidence entry
- Review resume wording
- Prioritize one opportunity
- Use the Career Companion safely
- Review a recruiter email safely

Each lesson must include an accessible written walkthrough. Video slots may remain labeled Planned until real captioned videos and transcripts exist. Placeholder thumbnails must not be presented as playable videos.

### P0-7 — Capability disclosure cleanup

Create one consistent capability legend across the product:

- Working in this prototype
- Demonstration workflow
- Planned after review
- Requires external approval or integration

The README, Privacy and Trust dialog, Product Readiness panel, Learning Center, and Companion must use consistent language.

## Review and QA lifecycle

1. Preserve the current Recruiter/ATS findings as the pre-remediation baseline.
2. Implement P0-1 through P0-7 in bounded commits.
3. Run syntax, static quality, keyboard, reduced-motion, responsive, sensitive-input, storage, export/import, and safe-failure checks.
4. Verify the deployed working product before claiming completion.
5. Run a targeted Recruiter/ATS retest.
6. Continue Workforce/Job-Seeker, UX/Accessibility, QA/UAT, and Security/Privacy/Data Governance reviews.
7. Conduct Captain UAT only after required remediation and retesting.

## Prohibited claims and actions

This plan does not authorize:

- mailbox or calendar access;
- message sending;
- automatic application submission;
- silent monitoring;
- background scraping;
- external profile changes;
- production credentials;
- sensitive or real participant data;
- independent SME approval;
- security, legal, pilot, production, or commercial certification.

## Initial implementation checkpoint

The first build slice is P0-1 plus the truthful visible Career Companion shell. It should improve trust and product coherence without requiring external services, credentials, spending, or sensitive data.
