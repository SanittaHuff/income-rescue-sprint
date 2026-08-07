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

### Chief source/code reconciliation

- `index.html` contains a real skip link before the main page content: `Skip to workspace` → `#workspace`.
- The first-use welcome is rendered as `role="dialog"` with `aria-modal="true"`.
- Build-mode keyboard safety intentionally traps Tab/Shift+Tab focus among controls inside the welcome overlay.
- The welcome implementation initially focuses **Start with Guided Mode**. Because it is the last control, pressing Tab is designed to wrap focus to the first control, **Explore on my own**.

### Current evidence interpretation

- **Skip-to-workspace:** **Not yet tested.** The prior test order was premature because the modal was intentionally active. The skip-link scenario will be tested after the welcome dialog is dismissed.
- **Welcome modal focus containment:** **Preliminary pass evidence.** The observed one-Tab transition is consistent with the intended focus loop. Reverse-loop and Escape behavior remain to be tested.
- **Background interaction isolation:** Reviewer could not access underlying page controls while the modal remained open; consistent with intended modal isolation.
- **Candidate finding — background scroll leakage:** The reviewer reports that the page scrollbar can move while the fixed modal remains visually stationary. This may indicate the background document remains scrollable under the modal. **Status: Candidate / reproduction required before permanent finding ID or severity assignment.** Potential impact is loss of page position or disorientation after the modal closes.

## Next evidence action

Verify reverse focus wrapping while the welcome dialog remains open, then test Escape behavior. After dismissal, test the actual `Skip to workspace` link as a separate scenario.

## Truth boundary

No RATS item, accessibility gate, or Critical/High blocker is closed by this partial evidence. No merge or deployment action is authorized.