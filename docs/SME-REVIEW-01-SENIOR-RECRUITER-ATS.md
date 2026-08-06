# SME Review 01 — Senior Recruiter / Resume and ATS

**Product:** Income Rescue Sprint  
**Family:** Life Vault HQ  
**Organization:** Quiet Bridge Research  
**Review stage:** External SME review before Captain UAT  
**Review authority:** Evaluation only; no pilot, production, security, legal, or release approval

## 1. Review purpose

Evaluate whether the Income Rescue Sprint prototype helps a job seeker convert truthful career evidence into recruiter-usable, ATS-conscious resume material and clear next actions without creating unsupported claims.

This review should identify the highest-value corrections required before Captain UAT. It is not a request to certify the product, approve a pilot, or validate production security.

## 2. Verified prototype boundary

The browser prototype currently provides:

- Memory-first Experience Evidence intake
- Explicit notice that proof or documents are not required to begin
- Draft resume components that remain subject to user review and approval
- Opportunity scoring and priority management
- One Next Best Action recommendation at a time
- Guided Mode and contextual Help Tips
- First-use welcome and Getting Started guidance
- Local JSON export, import, and deletion
- Sensitive-information warnings and prototype safeguards
- Comfort View, Reduce Motion, responsive behavior, and keyboard-conscious interaction
- Clear prototype, privacy, and readiness limitations

The prototype does **not** provide:

- An actual ATS parser or ATS compatibility guarantee
- Automated job applications
- Verified recruiter outreach or submission
- Backend accounts, cloud identity, or account recovery
- External connectors
- Production security certification
- Legal or regulatory approval
- Pilot or commercial-launch authorization

## 3. Recommended reviewer profile

The reviewer should have substantial current experience in at least one of these areas:

- Senior recruiting or talent acquisition
- Resume strategy and recruiter screening
- ATS implementation, administration, or resume parsing
- Career-services leadership with direct employer feedback

The reviewer should disclose relevant industries, typical role levels, ATS platforms used, and whether the review reflects recruiter judgment, ATS mechanics, or both.

## 4. Review method

1. Open the live GitHub Pages prototype on desktop.
2. Complete the first-use welcome without prior instruction.
3. Enter only fictional or synthetic information.
4. Create at least two Experience Evidence entries:
   - One clear, recent accomplishment
   - One incomplete or uncertain memory
5. Review and approve at least one generated resume component.
6. Add and score at least two fictional opportunities.
7. Follow the displayed Next Best Action.
8. Test Guided Mode, Help Tips, export, import, and deletion.
9. Repeat the core path at a narrow/mobile viewport if practical.
10. Record evidence for every finding.

Do not enter real candidate, employer-confidential, financial, medical, authentication, or government-identification information.

## 5. Evaluation scorecard

Use a 1–5 score for each area:

- **1 — Fails:** Materially confusing, misleading, or unusable
- **2 — Weak:** Major remediation required
- **3 — Adequate:** Usable with notable limitations
- **4 — Strong:** Clear and valuable with minor improvements
- **5 — Excellent:** Highly effective for the stated prototype purpose

### A. First-minute recruiter value

- Is the product’s purpose understandable within 60 seconds?
- Is the distinction between Experience Evidence and a finished resume clear?
- Does the interface communicate that truth and user approval take priority over keyword stuffing?
- Would a recruiter understand why this workflow may produce better source material?

### B. Experience Evidence quality

- Do prompts help users recover relevant scope, actions, tools, outcomes, and context?
- Can users safely capture incomplete memories without presenting them as facts?
- Does the workflow separate evidence from interpretation and resume wording?
- Are prompts likely to surface business impact rather than only duties?
- Does the process work for nontraditional, contract, freelance, caregiving, volunteer, or interrupted careers?

### C. Resume component usefulness

- Are drafted components concise enough for recruiter scanning?
- Are they specific without becoming inflated?
- Are role, action, tool, scope, and result represented appropriately?
- Does user approval meaningfully prevent fabricated or overstated claims?
- Can the output support multiple job targets without corrupting the source evidence?
- Is the language likely to remain readable to both recruiters and ATS software?

### D. ATS readiness and truth boundaries

- Does the product avoid implying that it has run a real ATS scan?
- Are keyword recommendations distinguishable from verified candidate experience?
- Is there a safe path for identifying missing keywords as learning or evidence gaps rather than silently adding them?
- Are standard headings, chronology, dates, employers, role titles, and skills treated consistently?
- Are formatting and export limitations explained clearly enough for a prototype?

### E. Opportunity prioritization

- Are scoring factors understandable and relevant to a job seeker?
- Does prioritization reflect fit, urgency, effort, compensation, work arrangement, and evidence strength appropriately?
- Could the scoring encourage applying to poor-fit roles?
- Can users understand and override the recommendation?
- Does the workflow reduce wasted application effort?

### F. Next Best Action

- Is one recommended action helpful or overly restrictive?
- Is the recommendation specific, achievable, and connected to the current evidence?
- Does it preserve user choice?
- Does it avoid implying an external action has occurred?
- Would it help a discouraged or overwhelmed job seeker regain momentum?

### G. Recruiter trust and adoption

- What would increase recruiter confidence in candidate-generated material?
- What product language sounds credible, unclear, inflated, or misleading?
- Which outputs would recruiters actually use or value?
- What would make a recruiter recommend this workflow to candidates?
- What would cause immediate rejection or loss of trust?

### H. Inclusive job-seeker experience

- Does the product work for users with long careers, employment gaps, contract histories, career changes, or limited documentation?
- Are instructions understandable without recruiting or resume expertise?
- Does the tone remain nonjudgmental and dignified?
- Are there points where a stressed user may abandon the workflow?

## 6. Required findings format

Record every finding using this structure:

| Field | Required response |
|---|---|
| Finding ID | `RATS-001`, `RATS-002`, etc. |
| Area | First-use, Evidence, Resume, ATS, Prioritization, Next Action, Trust, Inclusion, Other |
| Severity | Critical, High, Medium, Low |
| Observation | What happened |
| Evidence | Screen, wording, step, or reproducible behavior |
| Why it matters | Recruiter, candidate, ATS, business, or trust impact |
| Recommendation | Specific proposed correction |
| Required before Captain UAT? | Yes / No / Conditional |
| Required before external pilot? | Yes / No / Conditional |
| Confidence | High / Medium / Low |

### Severity definitions

- **Critical:** Misrepresentation, fabricated claims, unsafe disclosure, data-loss risk, or a failure that invalidates the core workflow
- **High:** Major recruiter/ATS credibility problem or significant abandonment risk
- **Medium:** Meaningful usability, clarity, consistency, or value limitation
- **Low:** Polish or optimization that does not block valid use

## 7. Reviewer summary

The reviewer should provide:

1. Overall score out of 5
2. Three strongest product qualities
3. Three highest-risk weaknesses
4. Five highest-ROI changes
5. Features or claims that should be removed, renamed, or constrained
6. Missing recruiter or ATS capability that is essential before Captain UAT
7. Clear recommendation:
   - Proceed to Captain UAT
   - Proceed after specified corrections
   - Repeat recruiter/ATS review after major remediation

## 8. Governance disposition after review

Each finding will be classified by Quiet Bridge Research as:

- **Accept** — implement as recommended
- **Modify** — adopt the intent with a governed adjustment
- **Reject** — do not adopt, with rationale
- **Defer** — preserve for a later phase with dependency and owner

No SME recommendation automatically changes the product, Constitution, CBOM, security boundary, or release authority. Accepted decisions must be synchronized through the governed control chain before being represented as approved or complete.

## 9. Current evidence references

- Repository README and prototype boundary
- `docs/FINAL-QA-FLIGHT-CHECK.md`
- Live GitHub Pages deployment
- Current `main` branch
- Automated Visible MVP Quality workflow

## 10. Completion boundary

This review is complete only when:

- The reviewer has exercised the defined synthetic-data workflow
- Every material finding includes reproducible evidence
- The reviewer summary and recommendation are complete
- Findings have been received and preserved for governed disposition

Completion of this SME review does not constitute pilot certification, production approval, security certification, legal approval, or commercial-launch authorization.
