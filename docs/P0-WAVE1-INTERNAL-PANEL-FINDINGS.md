# Income Rescue Sprint — P0 Wave 1 Internal Panel Findings

**Date:** August 6, 2026  
**Branch:** `p0-companion-remediation`  
**Pull request:** #6 — Draft / unmerged  
**Authority:** Decisions 034, 036, and 037; `docs/P0-HUMAN-REVIEW-GATE.md`  
**Review type:** Internal simulated professional-perspective desk review against the tested P0 review build, branch source, frozen Recruiter/ATS baseline, and automated QA evidence.

## Truth boundary

This record is preliminary internal product evidence. It is not an external SME review, independent validation, ATS certification, accessibility certification, security approval, legal review, Five Required Reviews pass, Captain UAT, pilot authorization, production approval, commercialization approval, or release authority.

Real human comprehension evidence and real assistive-technology evidence remain open. Findings below distinguish desk-review evidence from those later human gates.

## Wave 1 summary

| Perspective | Desk-review state | Current completion | Remaining dependency |
|---|---|---:|---|
| Brand Management | Substantial pass complete | 80% | Final headline/value-proposition disposition after consolidated findings |
| Recruiter / ATS | Source and synthetic-scenario retest substantial | 70% | Human comprehension and post-remediation component review |
| Workforce / Job-Seeker | Substantial pass complete | 75% | Post-remediation scenario retest |
| UX / Accessibility | Desk review substantial | 75% | Real AT preflight and post-remediation usability retest |
| Security / Privacy / Data Governance | Desk review substantial | 75% | Production/pilot architecture review and post-remediation safety retest |
| Pending-capability scope analysis | Preliminary classification complete | 90% | Genuine Captain scope decision only where noted |

These percentages describe the internal review work only, not product release readiness.

# Consolidated findings

## BM-001 — First-use headline does not surface the resume-building value proposition

- **Perspective:** Brand Management
- **Scenario:** First-use welcome before the user sees the main workspace
- **Observation:** The first-use headline is `Start small. Keep control. Build momentum.` It communicates tone and control but not the product-defining value of turning experience into reusable resume components and job-search action.
- **Evidence:** `lvhq-family.js` first-use welcome; existing governed BM-001 record.
- **Severity:** Medium
- **Impact:** A first-time user may understand the emotional posture but not why this product is materially different from a generic job-search checklist.
- **Recommendation:** Preserve the current headline during functional remediation as already governed, then disposition a supporting value proposition that explicitly connects experience capture, reusable resume content, opportunity prioritization, and next action.
- **Required before PR readiness?** No, if current truthful product description remains immediately visible.
- **Required before Captain UAT?** Yes for final wording/brand acceptance.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Defer exact wording; Accept the need for final disposition.
- **Owner:** Chief; Captain at final wording gate.

## BM-002 — Product promise is fragmented across several strong messages

- **Perspective:** Brand Management
- **Scenario:** Welcome → hero → Resume Readiness → Career Companion
- **Observation:** The product separately promises care/control, next-best action, resume readiness, and Companion guidance. Each is defensible, but the hierarchy does not yet express one concise product promise tying them together.
- **Evidence:** `index.html`, `lvhq-family.js`, `build-mode.js`.
- **Severity:** Medium
- **Impact:** Value can feel like a collection of useful tools rather than one coherent Income Rescue workflow.
- **Recommendation:** In Wave 2, align supporting copy around one sequence: recover experience → create reusable resume content → prioritize opportunities → take one deliberate next action.
- **Required before PR readiness?** No.
- **Required before Captain UAT?** Yes for final wording acceptance.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Accept.
- **Owner:** Chief.

## RATS-013 — Resume-component drafting capability is overstated by the capability map

- **Perspective:** Recruiter / ATS
- **Scenario:** User reaches Resume Readiness after reviewing evidence
- **Observation:** `Connections & Agent Controls` states that the prototype can `prepare editable resume components`, but the current Resume Readiness implementation provides a blank required `Recruiter-facing wording` textarea. The user must author the component; no bounded local drafting behavior is present in the inspected implementation.
- **Evidence:** `p0-tools.js` permission level 3; `app.js` `renderResume()` and component-save path.
- **Severity:** High
- **Impact:** Material capability-truth mismatch in a core product value area; the user may reasonably expect drafting assistance that the current build does not perform.
- **Recommendation:** Because resume-component drafting is already part of the governed product capability, implement a transparent bounded local draft helper derived only from reviewed evidence, label it as a draft, preserve user edit/approval, and never add unsupported facts. If that cannot be done safely at this gate, narrow every capability statement instead.
- **Required before PR readiness?** Yes.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Accept — implement the bounded helper rather than silently lowering the governed product promise.
- **Owner:** Chief.

## RATS-014 — Recruiter reply drafting does not adapt enough to message type

- **Perspective:** Recruiter / ATS
- **Scenario:** Synthetic ordinary outreach, interview request, incomplete lead, suspicious request
- **Observation:** Signal detection distinguishes interview requests, outreach, work arrangement, employment type, pay, and requested actions, but `buildReplyDraft()` uses one general response structure. An interview request can receive `I am interested in learning more` plus requests for the job description/interview process instead of a scheduling-aware response.
- **Evidence:** `p0-tools.js` `analyzeRecruiterEmail()` and `buildReplyDraft()`.
- **Severity:** Medium
- **Impact:** Drafts can sound generic or context-insensitive, reducing recruiter usefulness.
- **Recommendation:** Add bounded message-type branches for interview/screening, ordinary outreach, and incomplete leads; use detected requested actions without inventing facts.
- **Required before PR readiness?** Yes as part of targeted Recruiter/ATS closure.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Accept.
- **Owner:** Chief.

## SEC-001 — High-risk recruiter messages still receive an engagement-oriented default draft

- **Perspective:** Security / Privacy / Data Governance; Recruiter / ATS
- **Scenario:** Synthetic message requesting identity, banking, authentication, payment, or similar high-risk information
- **Observation:** The local review correctly raises caution flags, but the generated draft still begins by expressing interest and invites further communication. The added security paragraph is helpful but does not make the safest default action explicit.
- **Evidence:** `p0-tools.js` caution detection and `buildReplyDraft()`.
- **Severity:** High
- **Impact:** A vulnerable or hurried job seeker could interpret the generated response as product endorsement to continue engaging with a suspicious sender.
- **Recommendation:** When any high-risk caution flag is present, default to a non-engagement safety draft: do not provide sensitive information; independently verify the employer through an official channel; do not use supplied payment/authentication requests; respond only after verification if appropriate. Keep the user in control and avoid claiming the sender is fraudulent.
- **Required before PR readiness?** Yes.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Accept.
- **Owner:** Chief.

## WF-001 — Experience intake under-prompts for recruiter-grade accomplishment evidence

- **Perspective:** Workforce / Job-Seeker; Recruiter / ATS
- **Scenario:** User reconstructs a long-ago, contract, or partially remembered experience
- **Observation:** The main intake asks role/project, timeframe, `What did you actually do?`, tools, result, confidence, and source note. It does not visibly prompt for scope, challenge/context, stakeholders/users, volume/frequency, constraints, ownership level, or measurable change.
- **Evidence:** `app.js` `renderEvidence()`.
- **Severity:** High
- **Impact:** Users may enter duty statements instead of the richer evidence needed to create credible, differentiated resume bullets and interview stories.
- **Recommendation:** Enrich the existing prompts and hints without making proof mandatory. Ask for context, action, scope, tools, and result; explicitly allow estimates/unknowns and recovered memories.
- **Required before PR readiness?** Yes because it directly affects RATS-R07 and RATS-R08.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Accept.
- **Owner:** Chief.

## WF-002 — `Truth Gate closed` is harsher than the governed dignity standard

- **Perspective:** Workforce / Job-Seeker; Brand Management
- **Scenario:** User opens Resume Readiness before reviewing an evidence item
- **Observation:** The visible warning uses `Truth Gate closed.` even though the broader product intentionally uses memory-first, nonjudgmental language.
- **Evidence:** `app.js` `renderResume()`.
- **Severity:** Medium
- **Impact:** Can feel policing or accusatory to users who are uncertain, discouraged, or reconstructing older experience.
- **Recommendation:** Replace with neutral progress language such as `Review one experience before creating resume wording.` Preserve the underlying safeguard.
- **Required before PR readiness?** Yes as a safe wording correction.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Accept.
- **Owner:** Chief.

## UX-001 — Help-tip implementation creates a nested keyboard focus target inside navigation buttons

- **Perspective:** UX / Accessibility
- **Scenario:** Keyboard navigation through product-area buttons with Help Tips enabled
- **Observation:** `addInfoTip()` inserts a `span` with `tabIndex=0` inside each `.nav-button`. A separately focusable descendant inside a native button can create confusing or invalid keyboard/assistive-technology interaction.
- **Evidence:** `lvhq-family.js` `addInfoTip()` and `applyContextHelp()`.
- **Severity:** High
- **Impact:** Core module navigation may expose an unexpected extra focus stop and ambiguous announcement behavior for keyboard/screen-reader users.
- **Recommendation:** Remove descendant `tabIndex=0`; keep the explanation on the parent button through an accessible description/title or render a separate sibling help control outside the button.
- **Required before PR readiness?** Yes.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Accept.
- **Owner:** Chief.

## UX-002 — Restoring an open Career Companion can move focus without a new user action

- **Perspective:** UX / Accessibility
- **Scenario:** Returning session after the Companion was left open
- **Observation:** The open state is persisted. During initialization, restoring `true` calls `setOpen(true)`, which focuses a button inside the panel even though the user did not just activate the Companion in the current session.
- **Evidence:** `build-mode.js` `COMPANION_KEY`, `setOpen()`, and initialization.
- **Severity:** Medium
- **Impact:** Unexpected focus movement can disrupt returning keyboard/screen-reader users and makes page-start position less predictable.
- **Recommendation:** Preserve visual open/closed preference if desired, but only move focus into the Companion when the current-session user explicitly opens it.
- **Required before PR readiness?** Yes.
- **Required before Captain UAT?** Yes.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Accept.
- **Owner:** Chief.

## SPDG-001 — Browser-local storage is suitable only for the current prototype boundary

- **Perspective:** Security / Privacy / Data Governance
- **Scenario:** User stores real career history and exports workspace JSON
- **Observation:** Workspace content is stored in browser local storage and may be exported as JSON. The product discloses this and warns against sensitive information; no account recovery, server controls, encryption-at-rest architecture, retention service, or centralized access controls exist.
- **Evidence:** `app.js`, `index.html` Privacy & Trust disclosure, existing P0 QA checkpoint.
- **Severity:** High at pilot/production gate; informational within synthetic prototype boundary.
- **Impact:** The current architecture is not sufficient evidence for real or sensitive participant data.
- **Recommendation:** Preserve the current synthetic-data restriction. Require explicit security/privacy/data-retention architecture and classification before any real participant-data pilot authorization.
- **Required before PR readiness?** No, if synthetic-only boundary remains explicit.
- **Required before Captain UAT?** No, if synthetic-only testing is used.
- **Required before pilot?** Yes.
- **Confidence:** High
- **Disposition:** Defer implementation to the governed pilot/security architecture gate; keep as a hard pilot blocker.
- **Owner:** Chief recommendation; Captain/security gate for authorization.

# Pending-capability scope classification

| ID | Capability | Chief recommendation | Before Captain UAT? | Before external pilot? | Rationale |
|---|---|---|---|---|---|
| CAP-001 | Real ATS parser | Defer | No | Not necessarily | The prototype can truthfully test evidence-to-resume workflow without claiming an ATS scan. Parser accuracy/cost/vendor dependence should be evaluated separately. |
| CAP-002 | Job-description keyword comparison | Require at pilot-value gate | No | **Recommended Yes** | High practical ROI for job-specific tailoring; can be implemented transparently without pretending to be an ATS score. Captain scope decision required before implementation if it materially expands approved scope. |
| CAP-003 | Resume-file generation/export | Modify scope | No | **Recommended: human-readable export before pilot; full DOCX/PDF may follow** | Users need a usable bridge from approved components to applications; full document-generation complexity need not block Captain UAT. |
| CAP-004 | Captioned tutorial videos | Defer if written guidance passes | No | No | Equivalent written guidance is already present; videos must not replace accessible written instructions. |
| CAP-005 | Live conversational AI | Defer | No | No | Current bounded Companion is sufficient for prototype workflow testing; live AI adds architecture, privacy, cost, safety, and model-governance dependencies. |
| CAP-006 | Mailbox/calendar/job-board/cloud connectors | Defer | No | No for first workflow-validation pilot unless separately justified | Current user-supplied/redacted workflow tests the value proposition without granting external authority. Connector security and consent require a later architecture gate. |

No capability in this table is silently authorized for implementation by this desk review.

# Wave 2 accepted remediation queue

The following corrections are within the already approved P0/workflow/truth/accessibility scope and are accepted for Chief implementation on the governed branch:

1. **RATS-013** — add bounded evidence-only resume-component draft assistance with user approval, or fail safely to narrower truthful wording if implementation cannot meet the truth gate.
2. **RATS-014** — make recruiter reply drafts message-type aware.
3. **SEC-001** — use a non-engagement/independent-verification default when high-risk recruiter-message signals are present.
4. **WF-001** — enrich experience-evidence prompts for context, scope, action, tools, and result while preserving memory-first entry.
5. **WF-002** — replace `Truth Gate closed` with nonjudgmental progress language.
6. **UX-001** — remove nested focusability from Help Tips inside module buttons.
7. **UX-002** — stop unsolicited focus movement when restoring Companion open state.
8. **BM-002** — reconcile supporting copy after functional corrections without changing BM-001 headline until its final governed wording disposition.

## Wave 1 boundary

This Wave 1 desk review does not close:

- RATS-R01/R02 human first-use and capability comprehension;
- post-remediation recruiter-scan review of generated components;
- real screen-reader or other assistive-technology preflight;
- post-remediation internal QA/UAT and reliability testing;
- Captain walkthrough/UAT;
- final BM-001 wording decision;
- pilot/security/legal/Five Required Review gates.

PR #6 must remain Draft, open, unmerged, and undeployed.