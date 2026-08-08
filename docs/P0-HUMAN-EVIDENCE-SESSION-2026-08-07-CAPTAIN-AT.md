# Income Rescue Sprint — Human Evidence Session — Captain Representative User / AT Device Participant

**Date:** August 7–8, 2026  
**Authority:** Evidence capture only — not first-time reviewer evidence, formal Captain UAT, external SME validation, accessibility certification, pilot approval, merge authority, deployment authority, or release authority.  
**Branch under review:** `p0-companion-remediation`  
**Reviewer label:** Captain representative user / device participant  
**Operating system:** Windows desktop environment observed; exact version not yet recorded  
**Browser:** Microsoft Edge; exact version not yet recorded  
**Input method:** Keyboard/screen evidence in progress  
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
5. Before remediation, while the welcome screen was open, the reviewer reported that the browser/page scrollbar could move while the fixed welcome UI remained visually stationary.
6. Before remediation, after welcome completion and reload, the reviewer pressed **Tab once**. **Add Experience** became highlighted rather than a usable **Skip to workspace** link. The reviewer perceived a brief blink but could not identify or use the skip link. **Shift+Tab** from Add Experience moved to **Display Options**.
7. On the verified run-116 review build, after loading the dashboard/workspace state and pressing **Tab once**, **Skip to workspace** became visibly focused.
8. With **Skip to workspace** focused, pressing **Enter once** changed the URL to `#workspace`, moved the viewport to the workspace, and showed a visible focus outline around the workspace section.
9. In a fresh Edge InPrivate session on the verified run-116 build, the first-use welcome screen appeared. With the welcome screen left open, repeated downward mouse-wheel input did **not** move the page or background scrollbar.
10. On the verified run-132 human-review build, Captain opened a freshly extracted copy and performed the controlled UX-004 check. After clicking **Overview** once, the visible status surface showed **Current section: Overview** and **Keyboard focus: Workspace content**. Captain explicitly reported **PASSED** and supplied screenshot evidence showing both states together.

## Source / implementation reconciliation

- `index.html` contains `Skip to workspace` targeting `#workspace`.
- `styles.css` moves the skip link onscreen only while focused.
- The first-use welcome is `role="dialog"` with `aria-modal="true"` and has intentional forward/reverse focus containment plus Escape handling.
- The original app startup path called `setActivePanel('dashboard')`, which attempted to focus `#workspace` during initial page boot. Human evidence showed that this bypassed the intended skip-link start position.
- The original welcome implementation did not prevent background document scrolling.
- The remediated startup path preserves normal document-level first-tab focus so `Skip to workspace` remains the first keyboard target after welcome completion.
- The remediated welcome state prevents background page scrolling while the welcome overlay is present.
- Run 132 reports **Workspace content** after successful module activation and exposes the active module with `aria-current="page"`; module-name keyboard-focus status is limited to keyboard-visible focus so pointer activation is not disrupted on narrow screens.

## Confirmed findings and retest status

### AT-001 — Medium — Initial-load focus override bypasses skip-link start position

**Original human evidence:** After welcome completion and reload, first Tab landed on **Add Experience**, not **Skip to workspace**; reverse navigation moved to **Display Options**.  
**Root cause:** Initial application boot attempted to move focus to `#workspace` before normal document-level keyboard traversal.  
**Remediation:** The workspace is not programmatically focusable during the synchronous boot render. `build-mode.js` restores `tabindex="-1"` after boot so deliberate navigation and skip-link activation can still focus the workspace.  
**Automated status:** Remediation verified.  
**Human retest:** **PASS on run 116.** First Tab visibly focused **Skip to workspace**; Enter moved to `#workspace` and produced visible workspace focus.  
**Closure state:** **Closed at the current prototype accessibility-preflight level.** This is not accessibility certification.

### AT-002 — Medium — Background page can scroll while welcome modal is open

**Original human evidence:** Reviewer observed the browser/page scrollbar moving while the fixed welcome screen remained stationary.  
**Remediation:** `build-mode.css` applies `body:has(#welcomeOverlay){overflow:hidden}` while the welcome overlay exists.  
**Automated status:** Remediation verified by a dedicated wheel-scroll regression.  
**Human retest:** **PASS on run 116.** In a fresh Edge InPrivate session, repeated downward mouse-wheel input while the welcome screen remained open did not move the page or background scrollbar.  
**Closure state:** **Closed at the current prototype accessibility-preflight level.** This is not accessibility certification.

### UX-004 — Navigation current-state and keyboard-focus visibility

**Original human evidence:** Run-119 retest was inconclusive because Captain could not reliably tell where keyboard focus had landed. Run 123 improved the visible current/focus status but Captain observed that clicking Overview appeared to leave the status unchanged, which contributed to expanded-panel finding UXUI-005.  
**Expanded-panel remediation:** UXUI-005 added explicit **Workspace content** reporting after activation; AT-003 added semantic `aria-current="page"`; UXUI-006 prevented pointer focus from changing the keyboard-focus status before activation on narrow screens.  
**Automated status:** **PASS on run 132 — 28/28 governed Chromium tests.**  
**Human retest:** **PASS on run 132.** After one Overview activation, the visible status surface showed **Current section: Overview** and **Keyboard focus: Workspace content**. Captain explicitly reported **PASSED** and supplied screenshot evidence.  
**Closure state:** **Closed for this tested UX-004 representative-user / prototype-preflight action.** This is not accessibility certification; the remaining keyboard-only route and real screen-reader evidence remain open.

## Remediation and QA chronology

### Run 109 — failed safely
- Head: `f141263f678bf1377106d737b1db2ba7d53157ba`
- Static validation passed.
- Browser QA failed because the first AT-001 patch introduced a duplicate global `WELCOME_KEY` constant in `build-mode.js`, conflicting with `lvhq-family.js` under classic-script loading.
- Human-review artifact was not published.

### Run 110 — narrowed failure
- Static validation passed.
- 24/25 governed Chromium tests passed.
- Namespace-collision regressions were resolved.
- AT-001 regression still failed; human-review build was not published.

### Run 112 — AT-001 automated remediation verified
- Head: `10022c787532629a4918cca6f49b866334ca681c`
- Static validation passed.
- 25/25 governed Chromium tests passed.
- Browser QA artifact: `8989735121`
- Human-review artifact: `8989735660`

### Run 114 — combined code-remediation checkpoint
- Code head: `602c4af8da65f96d1623e397e57234ca49a4e03b`
- Visible MVP Quality run 114 — success.
- 26/26 governed Chromium tests passed.

### Run 115 — documentation checkpoint
- Head: `cf93ae39e7fee6ab3affb94b05fed6ec1e713c6b`
- 26/26 governed Chromium tests passed.

### Run 116 — verified Captain retest build
- Head: `b4d8b75a2f133546f838a037dd471601b1394ad6`
- Visible MVP Quality run 116 — success.
- 26/26 governed Chromium tests passed.
- Human-review artifact: `8989970187`
- This is the exact artifact used for the AT-001 and AT-002 Captain real-device retests.

### Runs 119 / 123 — UX-004 discovery and stronger candidate
- Run 119 automated QA passed, but Captain human retest was inconclusive.
- Run 123 automated QA passed 27/27 with explicit Current section / Keyboard focus status; Captain observation still exposed a human-orientation gap after activation.

### Runs 125–131 — expanded-panel remediation / diagnostics
- Failing or diagnostic runs were contained and did not publish a human-review build.
- Diagnostics isolated stale assertions and the narrow-screen pointer-activation defect UXUI-006.

### Run 132 — verified expanded-panel candidate and Captain UX-004 retest build
- Head: `0b90bfc8a2fd42051a5843efebc50d54ed464851`
- Visible MVP Quality run 132 — **SUCCESS**.
- Workflow run: `31271595064`
- Static/truth-boundary validation: **PASS**.
- Governed Chromium QA: **28/28 PASS**.
- Browser QA artifact: `9025776466`
- Browser digest: `sha256:a92b47597795922021abaabc61363f66e3cc4e70cf3806c06ab872bc55bcd398`
- Human-review artifact: `9025776735`
- Human-review digest: `sha256:7ee90234b630bf6b6a676fe2adb183837f801220d716bf0bc31785cd307cbca1`
- Captain real-device UX-004 retest on the freshly extracted build: **PASS**.

## Current interpretation

- Welcome forward focus containment: **Human pass evidence**.
- Welcome reverse focus containment: **Human pass evidence**.
- Welcome Escape behavior: **Human pass evidence**.
- AT-001 skip-link order and activation: **Human retest PASS; closed at current prototype preflight level**.
- AT-002 welcome background-scroll isolation: **Human retest PASS; closed at current prototype preflight level**.
- UX-004 current-section / workspace-focus visibility after Overview activation: **Human retest PASS on run 132; closed for this tested prototype-preflight action**.
- Remaining keyboard-only core route: **Open**.
- Real screen-reader announcements: **Not yet tested**.
- First-time human capability comprehension: **Not produced by this session**.
- Formal Captain UAT: **Not active**.

## Next evidence action

Continue the remaining keyboard-only core route on the exact verified run-132 human-review build currently open on the Captain device. After the keyboard route is sufficiently covered, enable a real screen reader for D2 evidence. Documentation recording must not be interpreted as changing the tested run-132 product artifact.

## Truth boundary

Human retest passes for AT-001, AT-002, and the tested UX-004 action close those findings only at the current representative-user / prototype accessibility-preflight level. They do not constitute accessibility certification or replace the remaining keyboard route, real screen-reader evidence, first-time human comprehension, recruiter/resume human evidence, internal reliability, Captain formal UAT, pilot, security, privacy, legal, Five Required Reviews, merge, deployment, or release gates.
