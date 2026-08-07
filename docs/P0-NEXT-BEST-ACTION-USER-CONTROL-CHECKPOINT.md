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

These requirements were reconciled against the P0 branch implementation before remediation.

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
- **Automated evidence:** Visible MVP Quality run 90; 24/24 governed Chromium tests passed, including `held opportunity cannot drive high-priority counts readiness or Next Best Action`.

## UX-003 — Manual “Mark complete” could record progress without underlying state change

- **Perspective:** UX; Quality / workflow integrity; Workforce / Job-Seeker
- **Scenario:** A user opens Next Best Action and presses `Mark complete` without completing the recommended work in its owning module.
- **Observation before remediation:** The control appended the recommendation key to `completedActions`, which contributed readiness points, but did not change the underlying evidence, resume, or opportunity state. The same recommendation could remain logically incomplete while the interface recorded completion progress.
- **Returning-workspace extension:** Existing browser workspaces could already contain these legacy `completedActions` acknowledgments. Removing the button alone would not be sufficient if those historical records continued contributing readiness points after the user returned.
- **Source conflict:** The governed interaction contract defines completed state as verified progress and requires Coach Mode to never imply a click succeeded without verification. It also explicitly supports Pause and return later.
- **Severity:** High.
- **Impact:** Readiness could be overstated and users could receive a misleading completion signal unrelated to actual workflow progress, including after returning to an older workspace.
- **Recommendation:** Derive completion from the underlying workspace facts. Remove manual completion acknowledgment from the current Next Best Action surface, provide an explicit pause path that preserves state without awarding progress, and neutralize legacy acknowledgment points without destructively deleting stored compatibility data.
- **Required before PR readiness?** Yes.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High.
- **Disposition:** Accept — implemented and regression tested.
- **Owner:** Chief.
- **Remediation:** Next Best Action now offers `Pause for now` instead of `Mark complete`. Pausing returns to the Overview, keeps the workspace unchanged, and does not add a completed-action record. The recommendation boundary states that completion is based on workspace facts actually updated. Legacy `completedActions` remain stored for non-destructive compatibility but no longer add readiness points.
- **Automated evidence:** Visible MVP Quality run 90; 24/24 governed Chromium tests passed, including `Next Best Action pause preserves state without recording false completion` and `legacy completed-action acknowledgements remain stored but no longer inflate readiness`.

## WF-004 — Opportunity recommendation did not surface the user-recorded next step or enough rationale

- **Perspective:** Workforce / Job-Seeker; UX; Recruiter workflow
- **Scenario:** An active opportunity already contains a user-entered `nextStep`.
- **Observation before remediation:** Next Best Action named the selected opportunity and score but only told the user to review the next step and deadline. It did not surface the next step the user had already recorded and did not explain the score dimensions on the recommendation surface.
- **Source gap:** The governed interaction contract requires the recommendation to show why it is recommended and preserve human override; AT-11 requires rationale, evidence, confidence, uncertainty, risks, and override. The current prototype does not yet fulfill every AT-11 human-judgment element, but it can truthfully surface the stored user next step and the explicit scoring dimensions without inventing facts.
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
- **Automated evidence:** Visible MVP Quality run 90; 24/24 governed Chromium tests passed, including `Next Best Action prefers an active role and surfaces the user-recorded next step`.

## Run 90 product-behavior checkpoint

- **Validated branch head:** `35c1abdf95a7f63d41e75273b241ef95db07afc2`
- **Visible MVP Quality:** run 90 — success
- **Static validation:** success
- **Governed Chromium QA:** 24/24 tests passed
- **Browser QA artifact:** `8981326146`
- **Browser QA digest:** `sha256:cbbee9834031306c47c426fb715b64edffe411a2813e8ddb1b1df08297e55cab`
- **Human-review build artifact generated by run 90:** `8981326343`
- **Run 90 review-build digest:** `sha256:433c90ea23267acd53d19eaa941f6b611978cad6ef83639dbcd47ddd865ded29`

Run 90 verifies the product behavior above, including returning-workspace readiness compatibility. Later successful workflow runs that only reconcile governance documentation or package contents may become the current governance-package checkpoint without replacing this underlying product-behavior evidence. Current package identifiers are synchronized externally in PR #6, issue #5, and CBOM rather than recursively embedded into every packaged checkpoint file.

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