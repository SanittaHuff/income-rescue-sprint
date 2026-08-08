# Income Rescue Sprint — P0 Human Evidence Results Template

**Use with:** `docs/P0-HUMAN-EVIDENCE-EXECUTION-RUNBOOK.md`  
**Branch under review:** `p0-companion-remediation`  
**Authority:** Evidence capture only. This file does not grant approval, certification, merge, deployment, pilot, production, commercialization, or release authority.

## Privacy and data rule

Use fictional or synthetic task data only. Do not record real passwords, authentication codes, government identifiers, financial or medical information, confidential employer/customer information, production credentials, or other sensitive participant information.

Use reviewer role or a neutral reviewer label instead of private identifying information unless a separately governed evidence process explicitly requires identity.

# Session metadata

**Session ID:**  
**Date/time:**  
**Facilitator / evidence recorder:**  
**Reviewer role:**  
**Relevant expertise, if applicable:**  
**Build artifact ID:**  
**Build digest / checksum, if available:**  
**Branch / commit:**  
**Operating system:**  
**Browser and version:**  
**Assistive technology and version, if applicable:**  
**Input method:**  
**Viewport / device / zoom condition:**  
**Clean browser profile used for first-use test?:** Yes / No  
**Synthetic-data boundary maintained?:** Yes / No  

# A. First-use comprehension evidence

## RATS-R01 — Product purpose and boundaries within 60 seconds

**Reviewer answer — What does the product help you do?**  

**Reviewer answer — What can it do automatically?**  

**Reviewer answer — What cannot it do / what is not connected?**  

**Reviewer answer — Has it run a real ATS scan?**  

**Observation:**  
**Material misunderstanding present?:** Yes / No  
**Severity if issue found:**  
**Recommendation:**  
**Proposed disposition:** Accept / Modify / Reject / Defer  

## RATS-R02 — Career Companion capability comprehension

**Reviewer description of the Career Companion:**  

**Actions reviewer believes it can perform:**  

**Unavailable actions reviewer correctly identified:**  

**Any belief that it is a connected autonomous/live external AI agent?:** Yes / No  
**Observation:**  
**Severity if issue found:**  
**Recommendation:**  
**Proposed disposition:** Accept / Modify / Reject / Defer  

## RATS-R05 — Discovery of major product areas

**Experience Evidence found without facilitator direction?:** Yes / No  
**Recruiter Email Review found without facilitator direction?:** Yes / No  
**Connections & Agent Controls found without facilitator direction?:** Yes / No  
**Help Tips / Getting Started used voluntarily?:**  
**Wrong-path recovery behavior:**  
**Mobile / reflow discovery observation:**  
**Severity if issue found:**  

## RATS-R12 — Written walkthrough sufficiency

**Could reviewer complete core first-use tasks with written guidance?:** Yes / No  
**Where additional instruction was needed:**  
**Would missing captioned videos block this gate?:**  
**Reviewer rationale:**  
**Proposed gate for videos:** PR readiness / Captain UAT / controlled pilot / later roadmap  

# B. Evidence and resume-component human review

## RATS-R07 — Experience Evidence prompt quality

### Synthetic Experience A
**Scope/context sufficient?:**  
**Action clarity:**  
**Tool relevance:**  
**Result specificity:**  
**Additional question reviewer would ask:**  

### Synthetic Experience B
**Uncertainty was clear?:**  
**Prompt supported recovered memory without shaming?:**  
**Additional question reviewer would ask:**  

**Overall RATS-R07 observation:**  
**Severity if issue found:**  
**Recommendation:**  
**Proposed disposition:** Accept / Modify / Reject / Defer  

## RATS-R08 — Six-second recruiter scan of resume components

### Component 1
**What reviewer noticed first:**  
**Action clear?:**  
**Concise?:**  
**Credible?:**  
**ATS-readable plain text?:**  
**Unsupported claim suspected?:**  
**Faithful to source evidence after reveal?:**  

### Component 2
**What reviewer noticed first:**  
**Action clear?:**  
**Concise?:**  
**Credible?:**  
**ATS-readable plain text?:**  
**Unsupported claim suspected?:**  
**Faithful to source evidence after reveal?:**  

**Overall recruiter-scan observation:**  
**Severity if issue found:**  
**Recommendation:**  
**Proposed disposition:** Accept / Modify / Reject / Defer  

# C. Recruiter-message review evidence

## RATS-R03 / RATS-R04

### Message 1 — ordinary outreach
**Detected signals useful?:**  
**Draft natural/professional?:**  
**Draft appropriately tailored?:**  
**Legitimacy boundary clear?:**  
**Observation:**  

### Message 2 — interview request
**Detected signals useful?:**  
**Draft interview-aware?:**  
**Draft natural/professional?:**  
**Observation:**  

### Message 3 — incomplete lead
**Missing-detail guidance useful?:**  
**Draft asks appropriate questions?:**  
**Observation:**  

### Message 4 — suspicious redacted request
**Cautions visible and proportionate?:**  
**Draft defaults to non-engagement pending independent verification?:**  
**Any unsafe engagement recommendation?:** Yes / No  
**Observation:**  

**Overall RATS-R03 observation:**  
**Overall RATS-R04 observation:**  
**Severity if issue found:**  
**Recommendation:**  
**Proposed disposition:** Accept / Modify / Reject / Defer  

# D. Missing-capability disposition evidence

## RATS-R09 and related scope evidence

| Capability | Required before PR readiness | Required before Captain UAT | Required before controlled pilot | Later roadmap | Reviewer rationale |
|---|---|---|---|---|---|
| Real ATS parser |  |  |  |  |  |
| Job-description keyword comparison |  |  |  |  |  |
| Resume-file generation/export |  |  |  |  |  |
| Captioned tutorial videos |  |  |  |  |  |
| Live conversational AI |  |  |  |  |  |
| Mailbox/calendar/job-board/cloud-storage connectors |  |  |  |  |  |

These are reviewer recommendations only and do not authorize implementation.

# E. Next Best Action and user-control evidence

## RATS-R10 / WF-003 / UX-003 / WF-004

**Active opportunity recommended instead of held opportunity?:** Yes / No  
**Stored user next step surfaced?:** Yes / No  
**Recommendation rationale understandable?:** Yes / No  
**Pause preserved state?:** Yes / No  
**Pause avoided false completion/readiness increase?:** Yes / No  
**Reviewer felt able to override/change direction?:** Yes / No  
**Reviewer answer — helpful or restrictive?:**  
**Observation:**  
**Severity if issue found:**  
**Recommendation:**  

# F. Real assistive-technology evidence

## RATS-R11 — Keyboard-only route

| Scenario | Completed? | Expected behavior | Actual behavior | Focus/keyboard issue | Severity |
|---|---|---|---|---|---|
| Skip to workspace |  |  |  |  |  |
| First-use dialog focus and Escape |  |  |  |  |  |
| Main module navigation |  |  |  |  |  |
| Experience Evidence form/review |  |  |  |  |  |
| Career Companion open/navigation/Escape/focus return |  |  |  |  |  |
| Recruiter Email Review dynamic result |  |  |  |  |  |
| Connections & Agent Controls |  |  |  |  |  |
| Privacy dialog |  |  |  |  |  |
| Export confirmation |  |  |  |  |  |
| Import confirmation |  |  |  |  |  |
| Next Best Action / Pause |  |  |  |  |  |

## RATS-R11 — Screen-reader announcement route

| Surface | Meaningful announcement? | Operable? | Observation | Severity |
|---|---|---|---|---|
| Page/workspace purpose |  |  |  |  |
| Major navigation destinations |  |  |  |  |
| Form labels/hints/validation |  |  |  |  |
| Evidence review-state changes |  |  |  |  |
| Career Companion state/actions |  |  |  |  |
| Recruiter result/cautions/draft |  |  |  |  |
| Toast/status announcements |  |  |  |  |
| Dialogs and close/Escape behavior |  |  |  |  |
| Agent permission/unavailable actions |  |  |  |  |
| Next Best Action and user controls |  |  |  |  |

## 200% or equivalent reflow

**Major navigation usable?:**  
**Career Companion usable without unacceptable viewport domination?:**  
**Recruiter Email Review usable?:**  
**Connections & Agent Controls usable?:**  
**Evidence task usable?:**  
**Next Best Action usable?:**  
**Clipping/overlap/hidden controls/horizontal discovery observed?:**  
**Severity if issue found:**  

# G. New finding record

Duplicate this section for each newly discovered issue.

**Permanent ID assigned during Chief reconciliation:**  
**Existing gate ID, if applicable:**  
**Reviewer role:**  
**Scenario:**  
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

# H. Session closeout

**Scenarios attempted:**  
**Scenarios blocked/skipped:**  
**Stop condition triggered?:** Yes / No  
**If yes, describe:**  
**Any Critical/High issue discovered?:** Yes / No  
**Synthetic-data boundary maintained throughout?:** Yes / No  
**Human comprehension evidence captured?:** Yes / No  
**Recruiter/ATS human evidence captured?:** Yes / No / Not available in this session  
**Real AT evidence captured?:** Yes / No / Not available in this session  
**Ready for Chief reconciliation?:** Yes / No  

## Truth boundary

Completing this template records evidence only. It does not itself close RATS findings, authorize implementation, certify accessibility or security, complete Five Required Reviews, begin Captain UAT, authorize pilot use, merge PR #6, deploy the branch, or release the product.