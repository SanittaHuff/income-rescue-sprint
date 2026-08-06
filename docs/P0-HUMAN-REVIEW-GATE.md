# Income Rescue Sprint — P0 Human Review Gate

**Status:** Prepared / Not yet executed  
**Branch:** `p0-companion-remediation`  
**Pull request:** #6 — Draft / unmerged  
**Authority:** Review only; no merge, deployment, pilot, production, certification, or release authority

## 1. Purpose

Complete the human evidence that automation cannot truthfully provide before PR #6 may be considered ready for review, merge, or deployment.

This gate combines three bounded activities:

1. Targeted Recruiter / ATS revised-product retest
2. Human capability-comprehension review
3. Real assistive-technology preflight

These activities may be scheduled separately, but their findings must be reconciled together.

## 2. Required test build

Use the `p0-companion-remediation` branch at or after the final verified automated checkpoint recorded in `docs/P0-COMPANION-IMPLEMENTATION-QA-CHECKPOINT.md`.

Do not test the current public `main` deployment as a substitute; it does not contain the complete P0 remediation.

## 3. Data boundary

Use fictional or synthetic information only.

Do not enter:

- real passwords or authentication codes;
- Social Security numbers or government identifiers;
- financial, medical, or insurance information;
- private candidate information;
- confidential customer or employer information;
- production credentials;
- real participant data.

## 4. Session A — First-time comprehension

### Reviewer

A person who has not been coached on the product screens immediately before testing.

### Procedure

1. Begin with cleared local storage.
2. Complete the first-use welcome.
3. Explore the product for no more than five minutes without help.
4. Ask the reviewer to explain, in their own words:
   - What is this product for?
   - What does Experience Evidence mean?
   - What does “Reviewed by you” mean?
   - Has the product verified the user’s employment or evidence?
   - Is the Career Companion a live AI agent?
   - Can the product read or send email?
   - Has the product run a real ATS scan?
   - What happens to the user’s data?
5. Ask the reviewer to find:
   - Experience Evidence;
   - Recruiter Email Review;
   - Connections & Agent Controls;
   - Privacy & Trust;
   - Export.

### Passing evidence

The reviewer can accurately explain the product’s purpose and boundaries without being corrected on a material claim, and can locate every required area.

## 5. Session B — Recruiter / ATS revised-product retest

### Reviewer

A Senior Recruiter, talent-acquisition professional, resume strategist, ATS administrator, or career-services professional with direct employer feedback.

### Procedure

Follow `docs/RECRUITER-ATS-BASELINE-AND-P0-RETEST.md` and `docs/SME-REVIEW-01-SENIOR-RECRUITER-ATS.md` using synthetic data.

At minimum:

1. Create one strong accomplishment and one uncertain/recovered memory.
2. Review evidence and observe the edit-reset behavior.
3. Create at least two resume components.
4. Evaluate recruiter scan, credibility, specificity, and ATS readability.
5. Add and prioritize two fictional opportunities.
6. Test four synthetic recruiter messages:
   - ordinary outreach;
   - interview request;
   - incomplete job lead;
   - suspicious redacted request.
7. Evaluate whether the product is sufficiently useful without a real ATS parser, keyword comparison, resume-file generation, live AI model, or mailbox connector at this product gate.
8. Recommend which missing capabilities are:
   - required before Captain UAT;
   - required before pilot;
   - later roadmap items.

### Passing evidence

Every High baseline question has an explicit recommendation, evidence, confidence level, and required gate.

## 6. Session C — Assistive-technology preflight

### Reviewer

A tester using at least one real screen reader and keyboard-only navigation. Additional low-vision or voice-control testing should be added when available.

### Minimum scenarios

- Skip to workspace
- First-use dialog focus and Escape behavior
- Main module navigation
- Experience Evidence form and review confirmation
- Career Companion open, content, action navigation, Escape, and focus return
- Recruiter Email Review form, dynamic result, caution flags, and reply draft
- Connections & Agent Controls permission list
- Privacy dialog
- Export and import confirmation
- Toast/status announcements
- 200% zoom or equivalent reflow

### Record

- Browser and operating system
- Assistive technology and version
- Scenario
- Expected announcement or behavior
- Actual announcement or behavior
- Severity
- Reproducibility
- Remediation and retest evidence

### Passing evidence

No Critical or High barrier remains for the tested scenarios. This is still a preflight, not accessibility certification.

## 7. Finding governance

Every finding must include:

- Permanent ID
- Reviewer and expertise
- Scenario
- Observation
- Evidence
- Severity
- User/recruiter/ATS/accessibility impact
- Recommendation
- Required before PR readiness?
- Required before Captain UAT?
- Required before pilot?
- Confidence
- Governed disposition: Accept / Modify / Reject / Defer
- Owner
- Verification evidence after correction

## 8. Stop conditions

Stop the review and keep PR #6 Draft if any of these occur:

- a material capability is misunderstood as connected or autonomous;
- candidate facts can enter resume content without required user review;
- independent verification is confused with self-review;
- real pasted email text is persisted or exported unexpectedly;
- sensitive values are accepted contrary to prototype safeguards;
- a keyboard or assistive-technology user cannot complete a core scenario;
- a Critical or High finding lacks an owner and remediation plan;
- test data crosses the synthetic-data boundary.

## 9. Completion boundary

The human gate is complete only when:

- all required sessions are performed or a governed decision explicitly narrows the requirement;
- all Critical and High findings are corrected and retested or formally deferred to a later gate with defensible rationale;
- ATS parser/keyword comparison and video requirements receive explicit scope disposition;
- the consolidated results are synchronized into CBOM/WGZ and the repository;
- PR #6 receives a separately governed decision on whether it may leave Draft.

Completion of this gate does not grant security, privacy, legal, pilot, production, commercial, or release approval.
