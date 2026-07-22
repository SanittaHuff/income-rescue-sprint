import { describe, expect, it } from "vitest";
import { validateCanonicalFields } from "../../src/domain/experience/service.js";
import { buildComponentTrace, createNewComponentVersion, linkEvidenceToComponent } from "../../src/domain/resume-component/service.js";
import type { EvidenceItem } from "../../src/domain/evidence/types.js";
import type { ExperienceRecord } from "../../src/domain/experience/types.js";
import type { ResumeComponent } from "../../src/domain/resume-component/types.js";

const now = new Date().toISOString();
const evidence: EvidenceItem = {
  evidenceId: "11111111-1111-4111-8111-111111111111", sourceId: "22222222-2222-4222-8222-222222222222",
  sourceLocation: "Resume 2024, page 2", exactTextOrFact: "Administered Azure DevOps",
  evidenceType: "responsibility", confidence: "high", verificationStatus: "verified", restrictions: [],
  version: 1, createdAt: now, updatedAt: now, createdBy: "captain", lastUpdatedBy: "captain",
};
const component: ResumeComponent = {
  componentId: "33333333-3333-4333-8333-333333333333", logicalComponentId: "44444444-4444-4444-8444-444444444444",
  componentType: "bullet", text: "Administered Azure DevOps", evidenceLinks: [], experienceLinks: [],
  certificationStatus: "draft", approvedLanes: ["B3A"], restrictions: [], truthGateStatus: "not_run", qaStatus: "not_run",
  version: 1, createdAt: now, updatedAt: now, createdBy: "chief", lastUpdatedBy: "chief",
};
const experience: ExperienceRecord = {
  experienceId: "55555555-5555-4555-8555-555555555555", employer: "Microsoft", viaVendor: "Aditi Consulting",
  canonicalTitle: "Systems Administrator 2", contractStatus: "Contract", location: "Remote", startDate: "2023-09-01", endDate: "2024-12-01",
  evidenceLinks: [evidence.evidenceId], verifiedResponsibilities: [], verifiedTools: [], verifiedOutcomes: [], holdOrVerifyFlags: [], lifecycleStatus: "verified",
  version: 1, createdAt: now, updatedAt: now, createdBy: "captain", lastUpdatedBy: "captain",
};

describe("Evidence-to-Component integration", () => {
  it("AT-03 canonical field changes require an active decision", () => {
    const result = validateCanonicalFields(experience, { canonicalTitle: "Senior Azure Architect" });
    expect(result.decisionRequired).toBe(true);
    expect(result.changedFields).toContain("canonicalTitle");
  });

  it("AT-05 certified edits create a new immutable version", () => {
    const certified = { ...component, certificationStatus: "certified" as const, truthGateStatus: "passed" as const, qaStatus: "passed" as const };
    const result = createNewComponentVersion(certified, { text: "Updated truthful wording" }, "66666666-6666-4666-8666-666666666666");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.priorVersionId).toBe(certified.componentId);
      expect(result.value.certificationStatus).toBe("draft");
    }
  });

  it("AT-12 original sources and prior versions remain recoverable", () => {
    const linked = linkEvidenceToComponent(component, [evidence], 1);
    expect(linked.ok).toBe(true);
    if (!linked.ok) return;
    const trace = buildComponentTrace(linked.value, [evidence], [component], ["decision-1"], ["evidence_linked"]);
    expect(trace.evidence.at(0)?.sourceLocation).toBe("Resume 2024, page 2");
    expect(trace.priorVersions.at(0)?.componentId).toBe(component.componentId);
  });
});
