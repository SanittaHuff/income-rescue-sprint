# Income Rescue Sprint — Recruiter / ATS Baseline and P0 Retest Gate

**Date:** August 6, 2026  
**Product:** Income Rescue Sprint  
**Organization:** Quiet Bridge Research  
**Branch under review:** `p0-companion-remediation`  
**Pull request:** #6 — Draft / unmerged  
**Automated QA checkpoint:** `530ec201012d6d1389d30f16586af239b7e0814d`  
**Review status:** Internal baseline frozen; targeted human retest pending

## 1. Purpose

Preserve the Recruiter/ATS and job-seeker findings that caused the broader SME and Captain UAT sequence to pause, record what the P0 build actually corrected, and define the targeted retest required before PR #6 or later formal reviews may advance.

This is an internal evidence-backed product assessment. It is not an independent Senior Recruiter review, ATS certification, accessibility certification, Five Required Reviews pass, or release approval.

## 2. Original baseline findings

| ID | Baseline finding | Severity | P0 disposition | Current state |
|---|---|---:|---|---|
| RATS-B01 | The promised AI Companion was not visibly present in the working product. | High | Accept | **Resolved for prototype scope.** A visible Career Companion is present with truthful boundaries. It remains prototype guidance, not a connected AI agent. |
| RATS-B02 | Agent permissions and approval limits were not visible. | High | Accept | **Resolved for prototype scope.** Five permission levels now distinguish explanation, suggestion, internal drafting, approval, and unavailable external action. |
| RATS-B03 | Email capability and connector status were unclear or absent. | High | Accept | **Partially resolved.** A safe user-supplied recruiter-email review demonstration and capability-status center now work. No live mailbox connector exists or is claimed. |
| RATS-B04 | Tutorial/video promises were represented by placeholders rather than usable instruction. | Medium | Modify | **Partially resolved.** Working written walkthroughs are available. Video production remains truthfully labeled planned. |
| RATS-B05 | User self-review was labeled “verified,” which could imply employer, source, or third-party verification. | High | Accept | **Resolved.** Governed states distinguish Reviewed by you, Needs your review, Supported by a source, and Independently verified. Legacy data migrates safely. |
| RATS-B06 | The product could be mistaken for an ATS parser or connected application tool without stronger capability disclosures. | High | Accept | **Resolved at disclosure level.** UI, privacy, readiness, agent controls, and README state that no ATS parser, mailbox, job board, sending, or automatic application capability is connected. |
| RATS-B07 | Core product value was stronger than its visible “collection of tools” presentation; the Companion needed to orchestrate the workflow. | Medium | Modify | **Improved, not fully resolved.** The Companion now navigates core areas and P0 tools, but it is still a bounded prototype shell rather than a live conversational orchestration layer. |

## 3. Verified revised-product strengths

### RATS-S01 — Truthful evidence governance

The revised product preserves a recruiter-relevant distinction between candidate self-review and genuine independent verification. Resume eligibility, progress, Next Best Action, import, export, and edit-reset behavior use the same governed state model.

**Recruiter value:** reduces the risk that self-entered experience is presented as externally validated.

### RATS-S02 — Memory-first intake remains dignified

The product tells users they may begin with memory and add supporting information later. This supports long careers, contract work, incomplete records, career transitions, and job seekers who do not possess formal proof for every experience.

**Recruiter value:** can surface richer source material without pretending uncertain memories are final facts.

### RATS-S03 — Recruiter-email review is a useful bridge feature

The new local review detects common work-arrangement, employment-type, pay, requested-action, and caution signals. It produces an editable reply draft while clearly stating that no mailbox is connected and nothing is sent.

**Recruiter/job-seeker value:** helps a user slow down, identify missing details, respond more professionally, and recognize suspicious requests without granting the product external access.

### RATS-S04 — Agent permission transparency is unusually explicit

The Connections & Agent Controls center tells users which activities are working locally, bounded demonstrations, planned connectors, or prohibited in the current build.

**Trust value:** reduces inflated “AI agent” expectations and gives future connector/security review a visible control surface.

### RATS-S05 — One Next Best Action reduces overload

The product continues to direct attention to one evidence-based next step while preserving user choice and internal navigation.

**Job-seeker value:** useful for discouraged or overwhelmed users who need momentum more than another long checklist.

## 4. Material issues corrected during implementation QA

The following defects were found by direct use, browser testing, accessibility preflight, or screenshot review and corrected before the baseline was frozen:

- Companion assets were present but not loaded by the product page.
- A broad wording-replacement function changed “Independently verified” into self-review language.
- Recruiter-email safety logic blocked the redacted risk phrases it needed to analyze.
- W-2 contract language was classified only as generic Contract.
- The sprint progress bar lacked an accessible name.
- Companion action buttons and agent-permission descriptions had insufficient contrast.
- The memory-first reassurance panel displayed dark text on a dark background.

## 5. Open findings requiring targeted human retest

| ID | Open question | Severity | Required evidence | Gate |
|---|---|---:|---|---|
| RATS-R01 | Can a first-time job seeker explain within 60 seconds what the product does and does not do? | High | Human comprehension test using the actual revised product | Before PR leaves Draft |
| RATS-R02 | Do users understand that the Career Companion is useful guidance but not a connected conversational AI agent? | High | Ask users to describe available and unavailable actions without prompting | Before PR leaves Draft |
| RATS-R03 | Is the recruiter-email review genuinely useful, appropriately cautious, and clear that sender legitimacy is not verified? | High | Senior Recruiter/ATS or experienced talent-acquisition retest with synthetic messages | Before PR leaves Draft |
| RATS-R04 | Does the response draft sound natural, professional, and appropriately tailored across recruiter outreach, interview requests, follow-ups, and suspicious messages? | Medium | Review multiple representative synthetic messages | Before targeted SME closes |
| RATS-R05 | Can users discover Recruiter Email Review and Connections & Agent Controls when module navigation requires horizontal scrolling? | Medium | Desktop, mobile, keyboard, and low-vision discovery observation | Before UX review disposition |
| RATS-R06 | Does the open Companion dominate too much of the mobile or 200%-equivalent viewport, even though it is scrollable and closable? | Medium | Human mobile/reflow usability observation | Before UX review disposition |
| RATS-R07 | Are Experience Evidence prompts sufficient to recover scope, actions, tools, constraints, and measurable impact—not only duties? | High | Recruiter/resume strategist review of at least two synthetic evidence journeys | Before Captain UAT |
| RATS-R08 | Are resume components concise, credible, ATS-readable, and useful for a six-second recruiter scan? | High | Generate and review synthetic components against the evidence source | Before Captain UAT |
| RATS-R09 | Is the absence of a real ATS parser, job-description keyword comparison, and resume-file export acceptable for the intended prototype gate? | High | Explicit SME disposition: required now, required before pilot, or later roadmap | Before Captain UAT scope decision |
| RATS-R10 | Does “one next action” feel empowering rather than restrictive across different job-seeker states? | Medium | Human scenario testing with override/navigation observation | Before Workforce/Job-Seeker review closes |
| RATS-R11 | Do a real screen reader and other relevant assistive technologies announce the Companion, dialogs, navigation, status changes, and dynamic review results correctly? | High | Manual assistive-technology preflight | Before PR leaves Draft |
| RATS-R12 | Are the written walkthroughs sufficient until actual captioned videos are produced? | Medium | First-use comprehension and task-completion evidence | Before Captain UAT scope decision |

## 6. Targeted retest procedure

Use only fictional or synthetic information.

1. Begin with a cleared browser profile and complete first use without prior instruction.
2. Ask the reviewer to explain:
   - the product’s main purpose;
   - what the Companion can do now;
   - what is not connected;
   - what “Reviewed by you” means;
   - whether the product has run an ATS scan.
3. Create:
   - one clear accomplishment;
   - one incomplete or uncertain memory;
   - one item supported by a source note.
4. Review and edit evidence, confirm review-reset behavior, and create at least two resume components.
5. Evaluate the components for recruiter scan, credibility, specificity, ATS readability, and unsupported claims.
6. Add at least two fictional opportunities and assess scoring and Next Best Action.
7. Review at least four synthetic recruiting messages:
   - ordinary recruiter outreach;
   - interview request;
   - incomplete job lead;
   - suspicious request involving redacted risk language.
8. Inspect Connections & Agent Controls and ask the reviewer to identify every unavailable external action.
9. Repeat core discovery on mobile or 200%-equivalent reflow.
10. Perform manual screen-reader/assistive-technology preflight under the separately governed accessibility procedure.

## 7. Required retest result format

For each open finding, record:

- Finding ID
- Reviewer role and relevant expertise
- Scenario exercised
- Observation
- Reproducible evidence
- Severity
- Recommendation
- Required before PR readiness?
- Required before Captain UAT?
- Required before external pilot?
- Confidence
- Governed disposition: Accept / Modify / Reject / Defer

## 8. Pass criteria for this gate

The targeted retest gate may close only when:

- RATS-R01, RATS-R02, RATS-R03, RATS-R07, RATS-R08, RATS-R09, and RATS-R11 have explicit evidence and disposition;
- every Critical or High defect required before PR readiness is corrected and retested;
- deferred items have an owner, dependency, and later gate;
- the results are synchronized to the governing control chain;
- no reviewer recommendation is represented as certification or release authority.

## 9. Current decision boundary

The P0 implementation and automated QA are complete for the current branch. Human comprehension, real assistive-technology preflight, targeted Recruiter/ATS retesting, and formal disposition remain open.

PR #6 must remain Draft, open, unmerged, and undeployed until the governing review decides that the remaining pre-merge evidence is sufficient.
