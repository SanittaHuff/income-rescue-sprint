# Income Rescue Sprint — P0 Human Evidence Execution Runbook

**Date:** August 7, 2026  
**Branch:** `p0-companion-remediation`  
**Pull request:** #6 — Draft / unmerged  
**Use:** Human capability-comprehension, Recruiter/ATS human evidence, and real assistive-technology preflight  
**Authority:** Evidence collection only. No merge, deployment, pilot, production, certification, commercialization, or release authority.

## 1. Purpose

Turn the remaining human-dependent requirements in `docs/P0-HUMAN-REVIEW-GATE.md` and `docs/RECRUITER-ATS-BASELINE-AND-P0-RETEST.md` into one repeatable, evidence-producing review procedure.

This runbook does not replace those governing documents. If wording conflicts, the Human Review Gate and Recruiter/ATS baseline control.

This is not an external SME engagement packet and does not authorize recruiting or hiring external reviewers. A human who participates in the bounded review is providing usability or task evidence only unless a separately governed role says otherwise.

## 2. Required build and data boundary

Use the current tested `p0-human-review-build` artifact generated from the P0 branch. Do not substitute the public `main` deployment.

Before beginning:

- extract the complete review ZIP into one local folder;
- open `P0-REVIEW-START-HERE.txt` first;
- open `index.html` from the extracted folder;
- use a clean or cleared browser profile for the first-use comprehension scenario;
- use fictional or synthetic information only;
- do not enter real participant data, credentials, authentication codes, government identifiers, financial information, medical information, confidential employer/customer information, or production secrets.

The facilitator must stop the session if the synthetic-data boundary is crossed.

## 3. Evidence integrity rules

For the first-use comprehension portion:

- do not explain the product before the reviewer has completed the initial observation;
- do not point to controls unless the reviewer is blocked and the blockage itself has been recorded;
- do not correct a mistaken capability belief until the reviewer has stated it and the evidence recorder has captured it;
- capture the reviewer’s own words as closely as practical;
- distinguish what the reviewer actually observed from facilitator interpretation;
- record the exact browser, operating system, viewport/device condition, and assistive technology when applicable;
- do not convert a successful automated test into human evidence.

A human reviewer may pause or stop at any time. A stopped session remains valid evidence for the scenarios actually attempted.

## 4. Roles

### Facilitator / Evidence Recorder

The facilitator:

- prepares the correct tested build;
- reads only the neutral task instructions;
- records timestamps, observations, reviewer statements, errors, and recovery behavior;
- does not coach during an unprompted comprehension task;
- stops for a safety or data-boundary violation;
- routes findings to Chief for governed disposition.

### Human Reviewer

The human reviewer:

- uses the product as a first-time or representative user;
- describes what they believe the product can and cannot do;
- completes the assigned synthetic tasks without entering real sensitive information;
- reports confusion, friction, confidence, and perceived control.

### Recruiter / Talent-Acquisition Reviewer

Use this role only if a qualified person is already available within the approved review boundary. This runbook does not authorize external SME outreach or engagement.

### Assistive-Technology Reviewer

The reviewer uses at least one real screen reader plus keyboard-only navigation. Record the actual technology and version used. Additional low-vision or voice-control evidence may be added when available.

## 5. Standard synthetic test data

Use these examples unless the reviewer needs an equivalent fictional scenario.

### Experience A — clear accomplishment

Role: Platform Operations Coordinator  
Timeframe: 2024–2025  
What happened / action: The engineering group needed a repeatable way to keep ownership records current. I reconciled source mappings, updated the governed work board, and routed exceptions for review.  
Tools: Azure DevOps, CSV  
Result: Reduced unresolved ownership exceptions before the reporting deadline.  
Confidence: High confidence  
Source note: Synthetic project notes available.

### Experience B — recovered / uncertain memory

Role: Migration Support Specialist  
Timeframe: 2022–2023  
What happened / action: I remember helping troubleshoot a recurring migration-preparation issue and documenting the resolution path, but I am not certain of the exact number of cases.  
Tools: Microsoft 365, ticketing system  
Result: The documented steps were reused by the support team.  
Confidence: Needs review / recovered memory  
Source note: No supporting document in this synthetic scenario.

### Opportunity A — active

Title: Platform Administrator  
Company: Northstar Systems  
Fit: Strong  
Arrangement: Remote  
Urgency: Apply now  
Pay alignment: Meets target  
Evidence strength: 5  
Status: Ready to apply  
Next step: Tailor the approved component to the job posting.

### Opportunity B — held

Title: Senior Support Engineer  
Company: Cedar Ridge Technologies  
Fit: Strong  
Arrangement: Remote  
Urgency: Apply now  
Pay alignment: Meets target  
Evidence strength: 5  
Status: Hold  
Next step: Do not advance until I reactivate this role.

### Recruiter message 1 — ordinary outreach

Role: Platform Administrator  
Company: Northstar Systems  
Message: We saw your background and would like to discuss a remote Platform Administrator opening. Please let us know if you are interested and what times work for a short introductory call.

### Recruiter message 2 — interview request

Role: Platform Administrator  
Company: Northstar Systems  
Message: We would like to schedule a 30-minute interview next week. Please share your availability for a phone screen.

### Recruiter message 3 — incomplete lead

Role: Cloud Support Engineer  
Company: Cedar Ridge Technologies  
Message: We have an opening that may fit your background. Please reply if interested. The message does not include pay range, work arrangement, contract type, or a full job description.

### Recruiter message 4 — suspicious redacted request

Role: Support Analyst  
Company: Example Recruiting  
Message: This is a guaranteed job and instant hire. Complete the next step through a shortened link and send your Social Security number and bank account details through WhatsApp before the interview.

This message contains risk phrases only. Never enter actual identity, banking, authentication, or credential values.

# 6. Session A — First-use human capability comprehension

**Primary evidence targets:** RATS-R01, RATS-R02, RATS-R12, BM-001 supporting evidence.

## A1 — 60-second first impression

Start with a clean browser profile and the first-use welcome experience. Do not explain the product.

After no more than 60 seconds, ask exactly:

1. “What do you think this product helps you do?”
2. “What do you think it can do automatically?”
3. “What do you think it cannot do or is not connected to?”
4. “What do you think the Career Companion is?”
5. “Do you think this product has run an ATS scan on a resume or job description?”

Record the answers before clarifying anything.

### Evidence interpretation aid — not a new governance rule

Record whether the reviewer independently recognizes most of the current workflow:

- recover or organize work experience;
- turn reviewed evidence into reusable resume content;
- prioritize opportunities;
- receive one deliberate next action;
- retain human control;
- no connected mailbox, job board, live external AI agent, automatic job application, or real ATS parser.

Any belief that the product has already performed a real ATS scan, verified a recruiter’s legitimacy, connected to a mailbox/job board, or can autonomously apply/send should be recorded as a material comprehension failure for Chief disposition.

## A2 — Independent discovery

Ask:

“Without me showing you where to click, find the place where you would add work experience, the place where you would review a recruiter message, and the place where you would check what external actions are connected or unavailable.”

Record:

- first path attempted;
- whether each area is found without facilitator direction;
- time-to-discovery when practical;
- navigation confusion;
- whether Help Tips or Getting Started are used voluntarily;
- whether the reviewer can recover after choosing the wrong area.

This supplies evidence for RATS-R05 and RATS-R12.

## A3 — Memory-first evidence journey

Using Experience A and Experience B:

1. Add both experiences.
2. Review one item.
3. Edit the reviewed item and observe whether it returns to a review-needed state.
4. Explain in the reviewer’s own words what “Reviewed by you” means.
5. Ask whether the label sounds like employer, source, or third-party verification.

Record exact wording and confusion. Do not treat automated state-migration tests as a substitute for this human interpretation.

## A4 — Resume component journey

Create at least two resume components from reviewed synthetic evidence.

Ask the reviewer:

- “What facts in this wording came from the evidence you entered?”
- “Do you see anything that looks invented, inflated, or more certain than the evidence?”
- “Would you feel comfortable editing this before using it?”

Record whether the transparent local-draft explanation is noticed and understood.

# 7. Session B — Recruiter / ATS human evidence

**Primary evidence targets:** RATS-R03, RATS-R04, RATS-R07, RATS-R08, RATS-R09.

Use a recruiter, talent-acquisition, resume-strategy, or equivalent reviewer only when such a reviewer is available inside the approved review boundary. Do not create an external SME dependency from this runbook.

## B1 — Evidence quality

Review Experience A and Experience B after the user has completed the intake flow.

Rate each item for:

- scope and context;
- action clarity;
- tool relevance;
- result specificity;
- uncertainty labeling;
- usefulness for resume development.

Record what additional question, if any, a recruiter/resume strategist would ask before trusting the content for a real resume.

## B2 — Six-second component scan

Show the generated synthetic resume components without first showing the source evidence.

For each component, record:

- what the reviewer notices first;
- whether the action is clear;
- whether the wording is concise;
- whether it is credible;
- whether it is ATS-readable plain text;
- whether unsupported claims are suspected;
- whether it would help screen a candidate in a rapid recruiter scan.

Then reveal the source evidence and record whether the wording remains faithful to it.

## B3 — Recruiter-message review

Run all four standard synthetic recruiter messages.

For each message, record:

- whether the detected signals are useful;
- whether cautions are proportionate;
- whether the reply draft sounds natural and professional;
- whether the response is appropriately tailored to message type;
- whether the product makes clear that recruiter or employer legitimacy has not been independently verified;
- whether any draft encourages unsafe engagement after a visible caution.

Any unsafe engagement recommendation after a detected material caution is a stop-condition finding.

## B4 — Missing-capability disposition evidence

Ask the reviewer to classify each capability as one of:

- required before PR readiness;
- required before Captain UAT;
- required before controlled pilot;
- appropriate for a later roadmap gate.

Capabilities:

- real ATS parser;
- job-description keyword comparison;
- resume-file generation/export;
- captioned tutorial videos;
- live conversational AI;
- mailbox/calendar/job-board/cloud-storage connectors.

Record the rationale. This is reviewer evidence only; it does not authorize implementation.

# 8. Session C — Next Best Action and user control

**Primary evidence targets:** RATS-R10 plus human confirmation of WF-003, UX-003, and WF-004 remediation.

1. Add Opportunity A and Opportunity B.
2. Confirm Opportunity B is on Hold.
3. Open Next Best Action.
4. Ask what the product is recommending and why.
5. Ask whether the reviewer can identify the next step they previously entered.
6. Use `Pause for now`.
7. Return and confirm progress has not been falsely awarded for pausing.
8. Confirm the held opportunity did not become the active recommended opportunity.

Ask:

- “Does one next action feel helpful or restrictive?”
- “Do you feel you can override or change direction?”
- “Does the recommendation seem to respect the decision to put the second role on Hold?”

Record both positive and negative reactions.

# 9. Session D — Real assistive-technology preflight

**Primary evidence target:** RATS-R11 and Wave 3 AT requirement.

Use at least one real screen reader plus keyboard-only navigation. Record:

- operating system;
- browser and version;
- assistive technology and version;
- input method;
- viewport / zoom condition;
- date and reviewer.

Do not claim accessibility certification from this preflight.

## D1 — Keyboard-only core route

Without a mouse, exercise:

1. Skip to workspace.
2. First-use dialog focus movement and Escape behavior.
3. Main module navigation.
4. Experience Evidence form entry and review confirmation.
5. Career Companion open, content navigation, action navigation, Escape, and focus return.
6. Recruiter Email Review form, dynamic result, caution flags, and reply draft.
7. Connections & Agent Controls permission list.
8. Privacy dialog.
9. Export confirmation.
10. Import confirmation with synthetic data.
11. Next Best Action and Pause.

For every scenario, record expected behavior, actual behavior, whether the task completed, and any focus loss or keyboard trap.

## D2 — Screen-reader announcement route

With the real screen reader active, evaluate whether the reviewer can identify and operate:

- page and workspace purpose;
- major navigation destinations;
- form labels, hints, and validation feedback;
- review-state changes;
- Career Companion name, state, and actions;
- recruiter-review results and caution language;
- status/toast announcements;
- dialogs and close/Escape behavior;
- agent-permission levels and unavailable external actions;
- Next Best Action recommendation and user-control actions.

Record anything that is visually available but not meaningfully announced.

## D3 — 200% or equivalent reflow

At 200% browser zoom or an equivalent low-vision condition:

- repeat major navigation;
- open the Career Companion;
- use Recruiter Email Review;
- review Connections & Agent Controls;
- complete one evidence task;
- inspect Next Best Action.

Record clipping, overlap, hidden controls, excessive viewport domination, forced horizontal discovery, or loss of context.

# 10. Evidence record template

Create one record for every open RATS item tested and for every newly discovered issue.

**Finding / Evidence ID:**  
**Existing gate ID, if applicable:** RATS-R__ / BM-001 / WF-003 / UX-003 / WF-004 / other  
**Reviewer role:**  
**Relevant expertise:**  
**Date/time:**  
**Build / artifact used:**  
**OS / browser / AT / viewport:**  
**Scenario:**  
**Task instruction:**  
**Observation:**  
**Reviewer’s words:**  
**Expected behavior:**  
**Actual behavior:**  
**Reproducible evidence:**  
**Severity:**  
**Impact:**  
**Recommendation:**  
**Required before PR readiness?:**  
**Required before Captain UAT?:**  
**Required before controlled pilot?:**  
**Confidence:**  
**Proposed disposition:** Accept / Modify / Reject / Defer  
**Owner:**  
**Dependency:**  
**Retest evidence:**  

New defects should receive a permanent identifier during Chief reconciliation. Do not silently overwrite an existing finding.

# 11. Stop conditions

Stop advancement and preserve the evidence if any of the following occurs:

- the reviewer materially believes a live external capability exists when it does not;
- a user can place unsupported candidate facts into resume content without required review;
- self-review is mistaken for independent verification;
- recruiter-email text is persisted or exported unexpectedly;
- sensitive values are accepted contrary to the prototype safeguards;
- a visible caution still produces an unsafe engagement recommendation;
- Hold or Pause is overridden by downstream recommendation or progress behavior;
- a keyboard or assistive-technology user cannot complete a core scenario;
- a Critical or High finding has no clear owner/remediation path;
- the synthetic-data boundary is crossed;
- Captain is asked to begin formal UAT before the internal and Wave 3 evidence gates are complete.

A stop condition does not authorize the facilitator to redesign the product during the session. Record it and route it to Chief for governed remediation.

# 12. Session completion and Chief handoff

A human evidence session is complete when:

- every attempted scenario has a recorded outcome;
- skipped or blocked scenarios are explicitly marked;
- reviewer wording is separated from facilitator interpretation;
- new findings have reproducible evidence where possible;
- no result is described as certification, approval, or market validation;
- the evidence record is handed to Chief for reconciliation.

Chief then:

1. maps evidence to RATS-R01 through RATS-R12 and other open findings;
2. creates permanent IDs for new defects;
3. proposes Accept / Modify / Reject / Defer dispositions;
4. implements only already-authorized, reversible corrections;
5. reruns automated regression after code changes;
6. requests retest for corrected human-visible defects;
7. synchronizes verified evidence to PR #6, issue #5, CBOM / Command Center, and repository records;
8. keeps Captain walkthrough/UAT deferred until the governing entry criteria are met.

## Current boundary

Preparation of this runbook does not complete human comprehension, Recruiter/ATS human review, real assistive-technology testing, human reliability review, Captain UAT, Five Required Reviews, security/privacy/legal approval, pilot authorization, merge, deployment, commercialization, or release.