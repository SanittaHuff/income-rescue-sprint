# Income Rescue Sprint — P0 Human Review Gate

**Status:** Internal panel execution in progress / Wave 1 substantial / Wave 2 active / Captain walkthrough and UAT deferred  
**Branch:** `p0-companion-remediation`  
**Pull request:** #6 — Draft / unmerged  
**Authority:** Review only; no merge, deployment, pilot, production, certification, or release authority

## 1. Purpose

Complete the professional product-review, human-usability, assistive-technology, remediation, and acceptance evidence that automation cannot truthfully provide before PR #6 may be considered for readiness, merge, deployment, or a later gate.

This gate implements the Captain-approved order:

1. Internal multidisciplinary panel review in safe parallel
2. Consolidated findings and accepted revision implementation
3. Real assistive-technology preflight, internal QA/UAT reliability review, and Critical/High blocker closure
4. Captain walkthrough and formal Captain UAT
5. Governed PR readiness, merge, deployment, and next-gate decision

Captain’s earlier first-screen observations remain valid product findings. They are not formal UAT evidence.

## 2. Internal-only panel boundary

The SME panel is internal only. It uses simulated professional perspectives to examine the actual working product, including:

- Brand Management
- Recruiter / ATS
- Workforce Development / Job-Seeker Experience
- UX and Accessibility
- Security, Privacy, and Data Governance
- QA / UAT and Reliability
- Product Management and other relevant perspectives when needed

No external SME recruitment, outreach, engagement, or independent-review dependency is authorized. Internal panel findings are preliminary product evidence, not independent certification or external validation.

## 3. Required test build

Use the `p0-companion-remediation` branch at or after the latest verified automated checkpoint recorded in `docs/P0-COMPANION-IMPLEMENTATION-QA-CHECKPOINT.md` and any later tested remediation checkpoint explicitly included in the human-review package.

For current Next Best Action and user-control remediation, also read `docs/P0-NEXT-BEST-ACTION-USER-CONTROL-CHECKPOINT.md`.

Do not use the current public `main` deployment as a substitute. It does not contain the complete P0 remediation.

## 4. Data boundary

Use fictional or synthetic information only.

Do not enter:

- real passwords or authentication codes;
- Social Security numbers or government identifiers;
- financial, medical, or insurance information;
- private candidate information;
- confidential customer or employer information;
- production credentials;
- real participant data.

## 5. Current WGZ execution metrics

These percentages are working program-control estimates synchronized to the Command Center. They do not represent product, pilot, production, certification, commercialization, or release readiness. Growth in automated test coverage does not by itself increase these percentages.

| Work item | Status | Completion | Estimated active time remaining | Owner |
|---|---|---:|---:|---|
| Overall internal review and readiness program | Wave 1 substantial / Wave 2 active | 46% | Existing 10–18 Chief work-hour estimate retained pending human evidence, plus 1–2 hours Captain UAT | Chief; Captain at Wave 4 |
| Internal Brand Management review | Substantial desk pass / BM-001 open | 80% | 60–90 minutes | Chief |
| Internal Recruiter / ATS retest | Substantial desk retest / human evidence open | 70% | 2–3 hours | Chief |
| Internal Workforce / Job-Seeker review | Substantial desk pass / post-remediation scenario evidence open | 75% | 60–90 minutes | Chief |
| UX / Accessibility desk review | Substantial desk pass | 75% | 60–90 minutes desk reconciliation | Chief |
| Real assistive-technology preflight | Dependency open / Wave 3 | 45% | 2–4 hours after revisions; real AT access dependent | Chief; Captain device participation only if required |
| Internal Security / Privacy / Data Governance review | Substantial desk pass / pilot architecture gate preserved | 75% | 90–120 minutes | Chief |
| Pending-capability scope analysis | Preliminary classification substantially complete | 90% | 45–60 minutes after remaining Wave 1 evidence | Chief recommendation; Captain only at genuine scope gate |
| Consolidated findings and accepted revisions | Accepted remediation substantial / Wave 2 active | 70% | 3–6 hours; defect-volume dependent | Chief |
| Internal QA/UAT, regression, and Critical/High retest | Automated regression current / human reliability open | 55% | 3–7 hours after remaining revisions; defect-volume dependent | Chief |
| Captain walkthrough and formal UAT | Wave 4 / not active | 10% | 1–2 hours after Waves 1–3 | Captain / Chief Coach Mode |
| PR readiness and next-gate decision | Wave 5 / blocked | 20% | 30–60 minutes after prerequisites | Chief recommendation / Captain decision |

Time estimates are active-work estimates, not calendar promises. A blocked item holds at its last verified percentage until its dependency is met.

## 6. Wave 1 — Internal panel review in safe parallel

### A. Internal Brand Management

Review the actual product for:

- headline and value proposition;
- product promise and message hierarchy;
- resume-component and customized-resume clarity;
- naming and terminology;
- voice and tone;
- differentiation;
- sensitive-context wording.

Track `BM-001`: the first-use headline does not yet clearly surface that the user can build, revise, store, reuse, and assemble resume components into customized resumes.

### B. Internal Recruiter / ATS revised-product retest

Follow `docs/RECRUITER-ATS-BASELINE-AND-P0-RETEST.md` using synthetic data.

At minimum:

1. Create one strong accomplishment and one uncertain or recovered memory.
2. Review evidence and observe the edit-reset behavior.
3. Create at least two resume components.
4. Evaluate recruiter scan, credibility, specificity, and ATS readability.
5. Add and prioritize two fictional opportunities.
6. Test four synthetic recruiter messages:
   - ordinary outreach;
   - interview request;
   - incomplete job lead;
   - suspicious redacted request.
7. Evaluate whether the product is sufficiently useful without a real ATS parser, keyword comparison, resume-file generation, live AI model, or mailbox connector at this gate.
8. Recommend whether missing capabilities are required before PR readiness, Captain UAT, pilot, or a later roadmap gate.

### C. Internal Workforce / Job-Seeker review

Test representative synthetic scenarios involving:

- career gaps;
- contract work;
- recovered memories;
- limited documentation;
- discouraged or overwhelmed users;
- user control;
- one Next Best Action;
- dignity and non-shaming language.

Explicitly retest the user-control scenarios preserved in `docs/P0-NEXT-BEST-ACTION-USER-CONTROL-CHECKPOINT.md`: held opportunities must remain outside the active queue until deliberately reactivated, pause must preserve state without creating false completion, and an opportunity recommendation must preserve the user’s recorded next step when present.

### D. Internal UX / Accessibility desk review

Review:

- first-use comprehension;
- discoverability;
- task flow;
- focus design;
- content hierarchy;
- mobile and 200%-equivalent reflow;
- navigation and dynamic status behavior;
- known accessibility risk areas.

Real assistive-technology testing occurs in Wave 3 after accepted revisions are implemented.

### E. Internal Security / Privacy / Data Governance review

Review:

- local-data behavior;
- secret-shaped-value rejection;
- persistence and export boundaries;
- permission and connector disclosures;
- agent authority and unavailable actions;
- misuse and safe-failure behavior;
- future production-security dependencies.

### F. Pending-capability scope analysis

Keep these capabilities visible until disposition:

- real ATS parser;
- job-description keyword comparison;
- resume-file generation or export;
- captioned tutorial videos;
- live conversational AI;
- mailbox, calendar, job-board, and cloud-storage connectors.

Do not silently treat them as complete, mandatory now, cancelled, or authorized for implementation.

## 7. Wave 2 — Consolidated findings and accepted revisions

For every finding:

- preserve a permanent ID;
- record perspective and scenario;
- distinguish observation, evidence, inference, and recommendation;
- assign severity and confidence;
- identify the affected gate;
- disposition as Accept, Modify, Reject, or Defer;
- assign owner and dependency;
- implement accepted revisions;
- update tests, documentation, and traceability.

Current supplemental workflow-integrity findings are preserved in `docs/P0-NEXT-BEST-ACTION-USER-CONTROL-CHECKPOINT.md` and must remain included in consolidated reconciliation.

## 8. Wave 3 — Real AT, internal QA/UAT, regression, and blocker closure

### Real assistive-technology preflight

Use at least one real screen reader and keyboard-only navigation. Additional low-vision or voice-control testing should be added when available.

Minimum scenarios:

- Skip to workspace
- First-use dialog focus and Escape behavior
- Main module navigation
- Experience Evidence form and review confirmation
- Career Companion open, content, action navigation, Escape, and focus return
- Recruiter Email Review form, dynamic result, caution flags, and reply draft
- Connections & Agent Controls permission list
- Privacy dialog
- Export and import confirmation
- Toast and status announcements
- 200% zoom or equivalent reflow

Record browser, operating system, assistive technology and version, expected behavior, actual behavior, severity, reproducibility, remediation, and retest evidence.

### Internal QA/UAT and reliability review

Run end-to-end functional, regression, safe-failure, portability, data-boundary, navigation, state-migration, and representative internal UAT scenarios against the revised build. Returning-workspace scenarios must verify that legacy recommendation acknowledgments cannot inflate current readiness after the verified-progress remediation.

### Critical / High blocker closure

No required Critical or High finding may remain without verified correction and retest or a defensible governed later-gate deferral with owner, dependency, and evidence.

## 9. Wave 4 — Captain walkthrough and formal UAT

Captain walkthrough and UAT begin only after Waves 1–3 are complete or defensibly deferred through governance.

Captain should receive a reconciled candidate and should not serve as the primary internal tester or defect finder.

The walkthrough is guided in Coach Mode, one screen and task at a time. Formal UAT records acceptance-focused observations and decisions against the revised Application Under Test.

## 10. Wave 5 — PR readiness and next-gate decision

After Captain UAT, prepare one consolidated decision package covering whether PR #6 may:

- leave Draft;
- merge;
- deploy;
- advance to the next governed product gate.

A successful workflow run, automated preflight, internal panel review, or Captain UAT does not by itself grant pilot, production, security, legal, accessibility-certification, commercialization, or public-release authority.

## 11. Finding governance

Every finding must include:

- Permanent ID
- Internal perspective or Captain role
- Scenario
- Observation
- Evidence
- Severity
- User, recruiter, ATS, accessibility, security, privacy, or product impact
- Recommendation
- Required before PR readiness?
- Required before Captain UAT?
- Required before pilot?
- Confidence
- Governed disposition: Accept / Modify / Reject / Defer
- Owner
- Verification evidence after correction

## 12. Stop conditions

Stop advancement and keep PR #6 Draft if any of these occur:

- a material capability is misunderstood as connected or autonomous;
- candidate facts can enter resume content without required user review;
- independent verification is confused with self-review;
- pasted recruiter-email text is persisted or exported unexpectedly;
- sensitive values are accepted contrary to prototype safeguards;
- a user Hold or Pause is overridden by active recommendation/progress behavior;
- recommendation acknowledgment can create readiness without underlying workflow progress;
- a keyboard or assistive-technology user cannot complete a core scenario;
- a Critical or High finding lacks an owner and remediation plan;
- test data crosses the synthetic-data boundary;
- Captain is asked to begin formal UAT before the internal review and remediation gates are complete.

## 13. Completion boundary

The human gate is complete only when:

- all required internal panel perspectives are performed or explicitly narrowed through governance;
- accepted revisions are implemented and traced;
- real assistive-technology preflight and post-revision reliability testing are complete;
- all required Critical and High findings are corrected and retested or defensibly deferred;
- pending capabilities receive explicit scope disposition;
- Captain walkthrough and formal UAT are complete;
- results are synchronized into CBOM, WGZ, the registers, issue #5, PR #6, and the repository;
- PR #6 receives a separate governed readiness decision.

Completion of this gate does not grant security, privacy, legal, pilot, production, commercial, or release approval.