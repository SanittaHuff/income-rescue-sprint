import { describe, expect, it } from "vitest";
import { certifyComponent, linkEvidenceToComponent } from "../../src/domain/resume-component/service.js";
import type { EvidenceItem } from "../../src/domain/evidence/types.js";
import type { ResumeComponent } from "../../src/domain/resume-component/types.js";

const now = new Date().toISOString();
const base: ResumeComponent = {
  componentId: "11111111-1111-4111-8111-111111111111", logicalComponentId: "22222222-2222-4222-8222-222222222222",
  componentType: "bullet", text: "Supported accomplishment", evidenceLinks: [], experienceLinks: [], certificationStatus: "qa_reviewed",
  approvedLanes: ["B3A"], restrictions: [], truthGateStatus: "passed", qaStatus: "passed", version: 1,
  createdAt: now, updatedAt: now, createdBy: "chief", lastUpdatedBy: "chief",
};
const verified: EvidenceItem = {
  evidenceId: "33333333-3333-4333-8333-333333333333", sourceId: "44444444-4444-4444-8444-444444444444",
  sourceLocation: "Resume page 2", exactTextOrFact: "Supported accomplishment", evidenceType: "outcome", confidence: "confirmed",
  verificationStatus: "verified", restrictions: [], version: 1, createdAt: now, updatedAt: now, createdBy: "captain", lastUpdatedBy: "captain",
};

describe("resume component safety", () => {
  it("AT-01 rejects certification without verified evidence", () => {
    const result = certifyComponent(base, []);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("EVIDENCE_REQUIRED");
  });

  it("rejects certification with unverified evidence", () => {
    const result = certifyComponent(base, [{ ...verified, verificationStatus: "needs_verification" }]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("EVIDENCE_NOT_VERIFIED");
  });

  it("certifies when evidence, Truth Gate, and QA all pass", () => {
    const result = certifyComponent(base, [verified]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.certificationStatus).toBe("certified");
  });

  it("links only verified evidence and advances the state", () => {
    const draft = { ...base, certificationStatus: "draft" as const, truthGateStatus: "not_run" as const, qaStatus: "not_run" as const };
    const result = linkEvidenceToComponent(draft, [verified], 1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.certificationStatus).toBe("evidence_linked");
  });
});
