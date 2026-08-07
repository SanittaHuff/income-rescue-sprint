# Income Rescue Sprint — Human Evidence Session — Captain Representative User / AT Device Participant

**Date:** August 7, 2026  
**Authority:** Evidence capture only — not first-time reviewer evidence, formal Captain UAT, external SME validation, accessibility certification, pilot approval, merge authority, deployment authority, or release authority.  
**Branch under review:** `p0-companion-remediation`  
**Run-98 human-review build:** artifact `8985644385`  
**Run-98 package head at session start:** `50b91d1bad3f6db416f3d2ce0e7293e77bba090d`  
**Reviewer label:** Captain representative user / device participant  
**Operating system:** Windows desktop environment observed; exact version not yet recorded  
**Browser:** Microsoft Edge InPrivate; exact version not yet recorded  
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

After restarting the first-use state in an InPrivate Edge window, the reviewer reported that repeated **Tab** navigation moved across all three welcome controls: **Explore on my own → See Getting Started → Start with Guided Mode**, confirming forward keyboard access across the complete control set in the modal.

With focus returned to **Explore on my own**, the reviewer pressed **Shift+Tab once** and focus moved to **Start with Guided Mode**, confirming reverse wrap from the first control to the last control.

For the first Escape attempt, the reviewer initially reported that nothing visibly changed, then clarified that Microsoft Edge's in-page Find box disappeared on that first Escape. Therefore the first Escape was **confirmed consumed by browser chrome** and did not test the product's page-level Escape handler.

After the Find box was confirmed closed, the reviewer performed a second Escape attempt and initially reported **“Nothing.”** Because window ownership was not independently established for that keypress, the result was held as inconclusive pending a controlled reproduction.

The controlled reproduction then used the InPrivate Income Rescue Sprint review-build window with visible keyboard focus on a welcome control. The reviewer pressed **Escape once** and reported **“WELCOME CLOSED.”** Screenshot evidence shows the welcome overlay dismissed and the underlying Income Rescue Sprint workspace visible in Microsoft Edge InPrivate.

For the skip-link scenario, the reviewer reloaded the current InPrivate review-build page after the welcome-complete state had been stored, waited for load, and pressed **Tab once**. The reviewer reported that **Add Experience** became highlighted. The reviewer noticed a **quick blink**, but did not see a persistent visible **Skip to workspace** link and did not observe an intentional skip action occurring.

With **Add Experience** visibly focused, the reviewer pressed **Shift+Tab once**. Focus moved to **Display Options**, not to **Skip to workspace**.

### Chief source/code reconciliation

- `index.html` contains a real skip link before the main page content: `Skip to workspace` → `#workspace`.
- `styles.css` positions `.skip-link` off-screen by default and moves it onscreen only while focused via `.skip-link:focus{left:10px}`.
- `app.js` defines `setActivePanel(panel)` and calls `workspace.focus({ preventScroll: true })` every time that function runs.
- `app.js` calls `setActivePanel('dashboard')` during initial page setup. Therefore page load programmatically moves focus to `#workspace` before the user begins normal tab navigation.
- From that programmatically focused workspace, the next Tab enters the workspace’s interactive content; reverse Tab moves backward into controls that precede the workspace, which is consistent with the live-device **Add Experience → Display Options** observation.
- The first-use welcome is rendered as `role="dialog"` with `aria-modal="true"`.
- Build-mode keyboard safety intentionally traps Tab/Shift+Tab focus among controls inside the welcome overlay.
- The welcome implementation initially focuses **Start with Guided Mode**. Because it is the last control, pressing Tab is designed to wrap focus to the first control, **Explore on my own**.
- The keyboard safety handler explicitly wraps **Shift+Tab** from the first control back to the last control.
- The same handler intercepts page-level Escape and activates **Explore on my own**, which dismisses the welcome overlay.

### Current evidence interpretation

- **Welcome modal forward focus containment:** **Pass evidence.** The reviewer confirmed keyboard movement across all three welcome controls with Tab and did not report focus escaping to background controls.
- **Welcome modal reverse focus containment:** **Pass evidence.** Shift+Tab from the first welcome control wrapped to the last welcome control as designed.
- **Welcome Escape behavior:** **Pass evidence.** A controlled review-build-window reproduction dismissed the welcome overlay with one Escape press after browser Find UI was closed.
- **AT-001 — Initial-load focus override bypasses skip-link start position — Medium — CONFIRMED.** On page load, `setActivePanel('dashboard')` programmatically focuses the workspace. This prevents a keyboard user from beginning at the document’s intended first focusable control and makes the visible-on-focus **Skip to workspace** link unavailable as the first Tab target. The finding is supported by both source behavior and live-device evidence. The user is not trapped and can still navigate, so this is not currently classified as Critical/High; however, it must be remediated and retested before accessibility gate closure.
- **Background interaction isolation:** Reviewer could not access underlying page controls while the modal remained open; consistent with intended modal isolation.
- **Candidate finding — background scroll leakage:** The reviewer reports that the page scrollbar can move while the fixed modal remains visually stationary. This may indicate the background document remains scrollable under the modal. **Status: Candidate / reproduction required before permanent finding ID or severity assignment.** Potential impact is loss of page position or disorientation after the modal closes.

## Remediation requirement for AT-001

Do not programmatically move focus into the workspace during initial page load. Preserve workspace focus movement for explicit user-triggered panel navigation where it is useful. Add automated regression coverage proving that, after welcome completion and reload, the first Tab exposes **Skip to workspace** and activating that link moves focus/navigation to the workspace.

## Next evidence action

Chief-owned remediation and automated regression must complete first. Captain should not continue reverse-tabbing through the header to compensate for AT-001. After a new governed human-review build is generated, retest the skip-link route on the Captain device before continuing the remaining keyboard-only and real-screen-reader scenarios.

## Truth boundary

AT-001 is confirmed from human evidence plus implementation reconciliation. It is not yet remediated or retested. No accessibility gate, RATS item, merge, deployment, pilot, certification, or release gate is closed by this evidence.