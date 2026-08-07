# Income Rescue Sprint — P0 Next Best Action User-Control Checkpoint

**Date:** August 6, 2026  
**Branch:** `p0-companion-remediation`  
**Pull request:** #6 — Draft / unmerged  
**Authority basis:** Decisions 034, 036, and 037; `docs/P0-HUMAN-REVIEW-GATE.md`; Income Rescue Sprint — Evidence-to-Component Frontend Workflow and Interaction Contract v1  
**Review type:** Internal source-and-code reconciliation with synthetic browser regression evidence

## Truth boundary

This checkpoint supplements `docs/P0-WAVE1-INTERNAL-PANEL-FINDINGS.md`. It records newly discovered workflow-integrity findings and the tested internal remediation. It is not external SME review, independent validation, accessibility certification, security approval, Five Required Reviews pass, Captain UAT, pilot authorization, production approval, merge authority, deployment authority, commercialization approval, or release authority.

Human comprehension, post-remediation recruiter scan, real assistive-technology preflight, post-revision human reliability review, Captain walkthrough/UAT, and later pilot/security/legal gates remain open.

## Source-backed interaction requirements used for this review

The governed frontend interaction contract states that:

- the Dashboard / Next Best Win recommends one highest-value action;
- a consequential recommendation should show why it is recommended and preserve human override;
- a user may pause and return later;
- a blocked state explains the blocker and routes to resolution;
- a completed state represents verified progress and recommends the next stage;
- an unresolved Hold / Verify state cannot advance for downstream use;
- Coach Mode must preserve progress and must never imply an action succeeded without verification; and
- acceptance test AT-11 requires recommendations to display rationale, evidence, confidence, uncertainty, risks, and override.

These requirements were reconciled against the current P0 branch implementation before remediation.

# Findings and tested dispositions

## WF-003 — Held opportunities could still influence active priority, readiness, and Next Best Action

- **Perspective:** Workforce / Job-Seeker; UX; workflow integrity
- **Scenario:** A user explicitly places a high-scoring opportunity on `Hold`.
- **Observation before remediation:** Opportunity scoring did not account for status. Governed readiness counted every opportunity except `Skipped`, and Next Best Action excluded `Skipped` and `Applied` but did not exclude `Hold`. A held opportunity could therefore remain high priority, contribute readiness points, or become the recommended action.
- **Source conflict:** The governed interaction contract treats unresolved Hold / Verify states as blocking downstream use and requires visible human override.
- **Severity:** High.
- **Impact:** The product could countermand an explicit user decision to pause an opportunity and could make readiness appear higher because of work the user intentionally removed from the active queue.
- **Recommendation:** Keep held/skipped opportunities stored and editable, but exclude them from active priority scoring, readiness contribution, and Next Best Action until the user deliberately reactivates one.
- **Required before PR readiness?** Yes.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High.
- **Disposition:** Accept — implemented and regression tested.
- **Owner:** Chief.
- **Remediation:** `wave1-remediation.js` now treats `Hold` and `Skipped` as inactive for active priority/readiness/recommendation purposes. If all opportunities are inactive, Next Best Action routes the user to reactivate or add an opportunity rather than silently advancing a held item.
- **Automated evidence:** Visible MVP Quality run 82; 23/23 governed Chromium tests passed, including `held opportunity cannot drive high-priority counts readiness or Next Best Action`.

## UX-003 — Manual “Mark complete” could record progress without underlying state change

- **Perspective:** UX; Quality / workflow integrity; Workforce / Job-Seeker
- **Scenario:** A user opens Next Best Action and presses `Mark complete` without completing the recommended work in its owning module.
- **Observation before remediation:** The control appended the recommendation key to `completedActions`, which contributed readiness points, but did not change the underlying evidence, resume, or opportunity state. The same recommendation could remain logically incomplete while the interface recorded completion progress.
- **Source conflict:** The governed interaction contract defines completed state as verified progress and requires Coach Mode to never imply a click succeeded without verification. It also explicitly supports Pause and return later.
- **Severity:** High.
- **Impact:** Readiness could be overstated and users could receive a misleading completion signal unrelated to actual workflow progress.
- **Recommendation:** Derive completion from the underlying workspace facts. Remove manual completion acknowledgment from the current Next Best Action surface and provide an explicit pause path that preserves state without awarding progress.
- **Required before PR readiness?** Yes.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High.
- **Disposition:** Accept — implemented and regression tested.
- **Owner:** Chief.
- **Remediation:** Next Best Action now offers `Pause for now` instead of `Mark complete`. Pausing returns to the Overview, keeps the workspace unchanged, and does not add a completed-action record. The recommendation boundary states that completion is based on workspace facts actually updated.
- **Automated evidence:** Visible MVP Quality run 82; 23/23 governed Chromium tests passed, including `Next Best Action pause preserves state without recording false completion`.

## WF-004 — Opportunity recommendation did not surface the user-recorded next step or enough rationale

- **Perspective:** Workforce / Job-Seeker; UX; Recruiter workflow
- **Scenario:** An active opportunity already contains a user-entered `nextStep`.
- **Observation before remediation:** Next Best Action named the selected opportunity and score but only told the user to review the next step and deadline. It did not surface the next step the user had already recorded and did not explain the score dimensions on the recommendation surface.
- **Source gap:** The governed interaction contract requires the recommendation to show why it is recommended and preserve human override; AT-11 requires rationale, evidence, confidence, uncertainty, risks, and override. The current prototype does not yet fulfill every AT-11 element, but it can truthfully surface the stored user next step and the explicit scoring dimensions without inventing facts.
- **Severity:** Medium.
- **Impact:** The recommendation could feel generic and could separate the user from their own planned action.
- **Recommendation:** Surface the stored next step when present and identify the explicit priority-score dimensions. Do not invent a step when none is stored; prompt the user to add or confirm one instead.
- **Required before PR readiness?** Yes for the current bounded recommendation surface.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High.
- **Disposition:** Accept — implemented and regression tested for the bounded prototype.
- **Owner:** Chief.
- **Remediation:** Active opportunity recommendations now display `Next step you set:` when a next step exists, the current priority score, the scoring dimensions (fit, work arrangement, urgency, evidence strength, and pay alignment), and a deadline when one is stored. When no next step exists, the product asks the user to add or confirm one before acting.
- **Automated evidence:** Visible MVP Quality run 82; 23/23 governed Chromium tests passed, including `Next Best Action prefers an active role and surfaces the user-recorded next step`.

## Run 82 tested checkpoint

- **Validated branch head:** `8077b904151caf8a7e4e8dae8864b4a973f3960b`
- **Visible MVP Quality:** run 82 — success
- **Static validation:** success
- **Governed Chromium QA:** 23/23 tests passed
- **Browser QA artifact:** `8981184755`
- **Browser QA digest:** `sha256:bc2d4aaf8f430dcf57d28b68c10cef4838b2f9714e111968c20eafc9aa5bce05`
- **Human-review build artifact:** `8981184925`
- **Review-build digest:** `sha256:800b4b3140374fca7ccb2ec4564581adc38ffa53216be0f79f2c376a70ef6e64`

Run 82 verifies the implementation above. A later workflow run that adds this documentation to the packaged human-review artifact may become the current branch/package checkpoint without changing the underlying product behavior described here.

## Remaining boundaries

This checkpoint does not close:

- first-time human comprehension of product purpose/capability boundaries;
- human recruiter/resume scan of generated components;
- the remaining AT-11 human judgment elements not proven by the bounded automated scenarios;
- real screen-reader or other assistive-technology preflight;
- post-revision human QA/UAT reliability testing;
- BM-001 final wording disposition;
- Captain walkthrough/UAT;
- Five Required Reviews;
- real-data/pilot security and retention architecture;
- legal/regulatory review; or
- merge, deployment, production, commercialization, or release gates.

PR #6 remains Draft, open, unmerged, and undeployed.