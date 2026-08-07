# Income Rescue Sprint — Human Evidence Session — Captain Representative User / AT Device Participant

**Date:** August 7, 2026  
**Authority:** Evidence capture only — not first-time reviewer evidence, formal Captain UAT, external SME validation, accessibility certification, pilot approval, merge authority, deployment authority, or release authority.  
**Branch under review:** `p0-companion-remediation`  
**Reviewer label:** Captain representative user / device participant  
**Operating system:** Windows desktop environment observed; exact version not yet recorded  
**Browser:** Microsoft Edge InPrivate; exact version not yet recorded  
**Input method:** Keyboard-only evidence in progress  
**Assistive technology:** Real screen reader not yet enabled  
**Synthetic-data boundary:** No real participant or sensitive data entered

## Evidence integrity note

Captain has prior product exposure, so this session must not be labeled first-time human-comprehension evidence. It is representative-user and real-device accessibility evidence. A genuinely first-time comprehension reviewer remains a separate open evidence dependency.

## D1 — First-use dialog / keyboard route

### Human observations captured

1. With the first-use welcome open, repeated **Tab** navigation moved across all three welcome controls: **Explore on my own → See Getting Started → Start with Guided Mode**.
2. With focus on **Explore on my own**, **Shift+Tab** moved to **Start with Guided Mode**, confirming reverse wrap.
3. An initial Escape attempt was consumed by Microsoft Edge's in-page Find box and was correctly excluded from product evidence.
4. In a controlled retest with the review-build window active and a welcome button visibly focused, **Escape** dismissed the welcome screen. Screenshot evidence showed the underlying Income Rescue Sprint workspace after dismissal.
5. While the welcome screen was open, the reviewer reported that the browser/page scrollbar could move while the fixed welcome UI remained visually stationary.
6. After welcome completion and reload, the reviewer pressed **Tab once**. **Add Experience** became highlighted rather than a usable **Skip to workspace** link. The reviewer perceived a brief blink but could not identify or use the skip link. **Shift+Tab** from Add Experience moved to **Display Options**.

## Source / implementation reconciliation

- `index.html` contains `Skip to workspace` targeting `#workspace`.
- `styles.css` moves the skip link onscreen only while focused.
- The first-use welcome is `role="dialog"` with `aria-modal="true"` and has intentional forward/reverse focus containment plus Escape handling.
- The original app startup path called `setActivePanel('dashboard')`, which attempted to focus `#workspace` during initial page boot. Human evidence showed that this bypassed the intended skip-link start position.
- The welcome implementation did not initially prevent background document scrolling.

## Confirmed findings

### AT-001 — Medium — Initial-load focus override bypasses skip-link start position

**Human evidence:** After welcome completion and reload, first Tab landed on **Add Experience**, not **Skip to workspace**; reverse navigation moved to **Display Options**.  
**Root cause:** Initial application boot attempted to move focus to `#workspace` before normal document-level keyboard traversal.  
**Remediation:** The workspace is not programmatically focusable during the synchronous boot render. `build-mode.js` restores `tabindex="-1"` after boot so deliberate navigation and skip-link activation can still focus the workspace.  
**Automated status:** Remediation verified.  
**Human status:** **Real-device retest pending. AT-001 is not closed until that retest passes.**

### AT-002 — Medium — Background page can scroll while welcome modal is open

**Human evidence:** Reviewer observed the browser/page scrollbar moving while the fixed welcome screen remained stationary.  
**Remediation:** `build-mode.css` now applies `body:has(#welcomeOverlay){overflow:hidden}` while the welcome overlay exists.  
**Automated status:** Remediation verified by a dedicated wheel-scroll regression.  
**Human status:** **Real-device retest pending. AT-002 is not closed until that retest passes.**

## Remediation and QA chronology

### Run 109 — failed safely
- Head: `f141263f678bf1377106d737b1db2ba7d53157ba`
- Static validation passed.
- Browser QA failed because the first AT-001 patch introduced a duplicate global `WELCOME_KEY` constant in `build-mode.js`, conflicting with `lvhq-family.js` under classic-script loading.
- Human-review artifact was not published.
- This failed attempt is retained as remediation history and is not valid release/review evidence.

### Run 110 — narrowed failure
- Static validation passed.
- 24/25 governed Chromium tests passed.
- Namespace-collision regressions were resolved.
- AT-001 regression still failed; human-review build was not published.

### Run 112 — AT-001 automated remediation verified
- Head: `10022c787532629a4918cca6f49b866334ca681c`
- Static validation passed.
- 25/25 governed Chromium tests passed, including **completed welcome state preserves skip link as the first keyboard target**.
- Browser QA artifact: `8989735121`
- Browser QA digest: `sha256:083e3404d13103074cf9da46ed54f9ae0e44463c38452c3483d82c34487f6d13`
- Human-review artifact: `8989735660`
- Human-review digest: `sha256:f7a6b8289dae3b00ae5f8f4ecca6f5991de806784fb5c4016e94a18dfdd31b49`
- Captain handoff intentionally held so AT-002 could be remediated in the same download candidate.

### Run 114 — current combined accessibility-remediation candidate
- Head: `602c4af8da65f96d1623e397e57234ca49a4e03b`
- Visible MVP Quality run **114 — success**.
- Static validation passed.
- **26/26 governed Chromium tests passed**.
- AT-001 regression passed.
- AT-002 background-scroll regression passed.
- Existing automated WCAG serious-impact, first-use dialog, Companion, responsive/200%-equivalent, migration, recruiter-safety, portability, and user-control coverage remained green.
- Browser QA artifact: `8989800360`
- Browser QA digest: `sha256:eb327320e8928afb02b6ff29127e9f5afd8eb6a1c4f8b2ce630bfb66959d4a1d`
- Human-review build artifact: `8989800807`
- Human-review build digest: `sha256:e02f19f27176ff96dbc884fa36f7d125bcf4e1af17a145a7c232b2618048e3f9`
- Workflow logs verify **20 governed review files** packaged.

## Current interpretation

- Welcome forward focus containment: **Human pass evidence**.
- Welcome reverse focus containment: **Human pass evidence**.
- Welcome Escape behavior: **Human pass evidence**.
- AT-001 skip-link order: **Confirmed finding; automated remediation verified; Captain real-device retest pending**.
- AT-002 welcome background scroll: **Confirmed finding; automated remediation verified; Captain real-device retest pending**.
- Real screen-reader announcements: **Not yet tested**.
- First-time human capability comprehension: **Not produced by this session**.
- Formal Captain UAT: **Not active**.

## Next evidence action

Use the exact run-114 human-review artifact on the Captain device. Retest AT-001 first, then AT-002, one Coach Mode action at a time. If both pass, continue the remaining keyboard-only core route and then enable a real screen reader for D2 evidence.

## Truth boundary

Automated remediation evidence does not replace the required real-device retest or real screen-reader evidence. No independent validation, accessibility certification, Five Required Reviews pass, Captain UAT pass, pilot authorization, security/privacy/legal approval, commercialization, production approval, merge, deployment, or release is granted by this evidence session.