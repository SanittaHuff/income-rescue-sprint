# Income Rescue Sprint — Human Evidence Session — Captain Representative User / AT Device Participant

**Date:** August 7, 2026  
**Authority:** Evidence capture only — not first-time reviewer evidence, formal Captain UAT, external SME validation, accessibility certification, pilot approval, merge authority, deployment authority, or release authority.  
**Branch under review:** `p0-companion-remediation`  
**Run-98 human-review build:** artifact `8985644385`  
**Run-98 package head at session start:** `50b91d1bad3f6db416f3d2ce0e7293e77bba090d`  
**Reviewer label:** Captain representative user / device participant  
**Operating system:** Windows desktop environment observed; exact version not yet recorded  
**Browser:** Microsoft Edge; exact version not yet recorded  
**Input method for current observations:** Keyboard-only step in progress  
**Assistive technology:** Not yet enabled  
**Synthetic-data boundary:** No task data entered yet

## Evidence integrity note

Captain has prior product exposure, so this session must not be labeled first-time human-comprehension evidence. It is representative-user and real-device accessibility evidence. A genuinely first-time comprehension reviewer remains a separate open evidence dependency.

## D1 — First-use dialog / keyboard route — evidence captured so far

### Observation supplied by reviewer

After opening the extracted run-98 `index.html` review build and pressing **Tab once** while the first-use welcome dialog was open:

1. Visible focus moved to **“Explore on my own.”**
2. Reviewer did not see **“Skip to workspace.”**
3. Reviewer reported that only the first welcome surface was accessible while the dialog was open.
4. Reviewer reported that the vertical browser/page scrollbar moved, but the visible welcome UI did not move.

After restarting the first-use state in an InPrivate Edge window, the reviewer then reported that repeated **Tab** navigation moved across all three welcome controls: **Explore on my own → See Getting Started → Start with Guided Mode**, confirming forward keyboard access across the complete control set in the modal.

With focus returned to **Explore on my own**, the reviewer pressed **Shift+Tab once** and focus moved to **Start with Guided Mode**, confirming reverse wrap from the first control to the last control.

For the first Escape attempt, the reviewer reported that nothing visibly changed. Earlier screenshot evidence showed Microsoft Edge's in-page Find box (`workspace 1/4`) open in the browser chrome. Because Edge can consume Escape to close that browser-level Find UI before the page receives the key, this first Escape result is classified as **inconclusive** rather than a product failure. A clean Escape retest is required after confirming the Find box is closed.

### Chief source/code reconciliation

- `index.html` contains a real skip link before the main page content: `Skip to workspace` → `#workspace`.
- The first-use welcome is rendered as `role="dialog"` with `aria-modal="true"`.
- Build-mode keyboard safety intentionally traps Tab/Shift+Tab focus among controls inside the welcome overlay.
- The welcome implementation initially focuses **Start with Guided Mode**. Because it is the last control, pressing Tab is designed to wrap focus to the first control, **Explore on my own**.
- The keyboard safety handler explicitly wraps **Shift+Tab** from the first control back to the last control.
- The same handler is designed to intercept page-level Escape and activate **Explore on my own**, which should dismiss the welcome overlay. Browser chrome must not be active for the test to validly exercise that page-level handler.

### Current evidence interpretation

- **Skip-to-workspace:** **Not yet tested.** The prior test order was premature because the modal was intentionally active. The skip-link scenario will be tested after the welcome dialog is dismissed.
- **Welcome modal forward focus containment:** **Pass evidence.** The reviewer confirmed keyboard movement across all three welcome controls with Tab and did not report focus escaping to background controls.
- **Welcome modal reverse focus containment:** **Pass evidence.** Shift+Tab from the first welcome control wrapped to the last welcome control as designed.
- **Welcome Escape behavior:** **Inconclusive / clean retest required.** The first Escape attempt may have been consumed by Edge's Find box and cannot be used as pass or fail evidence.
- **Background interaction isolation:** Reviewer could not access underlying page controls while the modal remained open; consistent with intended modal isolation.
- **Candidate finding — background scroll leakage:** The reviewer reports that the page scrollbar can move while the fixed modal remains visually stationary. This may indicate the background document remains scrollable under the modal. **Status: Candidate / reproduction required before permanent finding ID or severity assignment.** Potential impact is loss of page position or disorientation after the modal closes.

## Next evidence action

Confirm the browser Find box is closed, then retest Escape once while focus is on a welcome button. After dismissal, test the actual `Skip to workspace` link as a separate scenario.

## Truth boundary

No RATS item, accessibility gate, or Critical/High blocker is closed by this partial evidence. No merge or deployment action is authorized.