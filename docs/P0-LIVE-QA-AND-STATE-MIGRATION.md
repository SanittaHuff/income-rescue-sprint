# P0 Live QA and Evidence-State Migration Gate

Status: Active gate for PR #6
Date: 2026-08-06
Branch: `p0-companion-remediation`
Authority: Decision 034 and the Cross-Product Expert Product Review Standard

## Purpose

Define the exact evidence required before PR #6 may leave draft status, merge, or deploy. This gate covers the visible Career Companion, truthful capability boundaries, accessibility preflight, responsive behavior, and the migration away from the legacy internal evidence status `verified`.

A static workflow pass is necessary but is not sufficient evidence for live interaction acceptance.

## Gate A — Career Companion interaction

Test with keyboard only and record Pass, Fail, or Blocked for each item.

1. The Career Companion toggle is reachable in logical tab order.
2. Enter or Space opens the panel.
3. `aria-expanded` changes accurately.
4. Focus moves into the opened panel without becoming lost.
5. Tab and Shift+Tab reach every visible control in a logical order.
6. Escape closes the panel and returns focus to the toggle.
7. The Close button closes the panel and returns focus to the toggle.
8. Each navigation action opens the correct product module.
9. No action claims to contact an external system.
10. The permission statement remains visible and understandable.

Required evidence: browser, operating system, viewport, result, defect ID when failed, remediation, and retest result.

## Gate B — Capability comprehension

A tester must be able to answer all of the following correctly after using the Companion:

- Is this a live autonomous AI agent? **No.**
- Can it access email, calendar, job boards, or external AI services? **No.**
- Can it send messages or applications? **No.**
- What can it do now? **Explain and navigate inside the local prototype.**
- Who approves consequential actions? **The user; external consequential actions are unavailable.**

Any incorrect answer is a comprehension failure requiring wording or layout remediation.

## Gate C — Responsive and visual checks

Test at minimum:

- 320 x 568
- 375 x 667
- 390 x 844
- 768 x 1024
- 1280 x 720
- 1440 x 900

For each viewport verify:

- no horizontal page scrolling caused by the Companion;
- toggle remains reachable;
- panel remains fully usable;
- text does not overlap or clip;
- controls meet practical touch-target expectations;
- zoom to 200% does not remove required information or controls;
- Comfort View and Reduce Motion remain functional.

## Gate D — Assistive-technology preflight

At minimum perform one desktop screen-reader preflight and record the exact tool and version.

Verify:

- toggle name, role, and expanded state are announced;
- panel landmark and heading are understandable;
- capability and permission boundaries are read in a meaningful order;
- hidden content is not announced while closed;
- status changes do not create confusing duplicate announcements;
- navigation actions have distinct accessible names.

This preflight is not independent accessibility certification.

## Gate E — Evidence-state migration design

### Target vocabulary

Internal and persisted evidence states must no longer use `verified` for user self-review.

Required target states:

- `saved-from-memory`
- `needs-review`
- `reviewed-by-user`
- `supported-by-source`
- `independently-verified` — reserved for genuine external verification only

### Legacy migration rule

When loading version 1 local or imported data:

- `verified` becomes `reviewed-by-user`;
- `pending` becomes `needs-review`;
- `needs-review` remains `needs-review`;
- `rejected` remains `rejected`;
- unknown values become `needs-review` and must not silently qualify for resume-component creation.

The migrated state must be saved with an incremented schema version only after successful parsing and normalization.

### Behavioral requirements

- Progress calculations count `reviewed-by-user`, not `verified`.
- Resume-component creation requires `reviewed-by-user` or a stronger truthful evidence state.
- Editing reviewed evidence resets it to `needs-review`.
- The review action stores `reviewed-by-user` and a `reviewedAt` timestamp.
- No user-facing text uses `verify`, `verified`, or `verification` for self-review.
- Imported legacy exports migrate without losing profile, evidence, components, jobs, completed actions, timestamps, or source notes.
- Exported data uses the new schema and new status values.

## Gate F — Regression scenarios

Execute with synthetic, non-sensitive data only.

1. New user adds evidence, reviews it, creates a component, approves it, exports, clears data, imports, and confirms equivalence.
2. Legacy version 1 export containing `verified` imports and becomes `reviewed-by-user`.
3. Editing a reviewed entry resets review status and prevents premature component creation.
4. Deleting evidence removes linked resume components after explicit confirmation.
5. Invalid JSON import fails safely without altering current data.
6. Unknown evidence state imports as `needs-review` and does not increase readiness.
7. Existing jobs, opportunity scores, and Next Best Action behavior remain intact.
8. Clearing local data requires confirmation and restores the empty first-use state.

## Acceptance rule

PR #6 may leave draft status only when:

- static quality checks pass on the final commit;
- Gates A through F have recorded evidence;
- every Critical or High defect is corrected and retested;
- the evidence-state migration is implemented rather than visually masked;
- the pull request accurately lists remaining limitations;
- no production, pilot, security, legal, SME, or accessibility certification is implied.

Merge and deployment remain separate governed actions after this gate passes.
