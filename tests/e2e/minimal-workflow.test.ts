import { describe, expect, it } from "vitest";
import { completeEvidenceToComponentWorkflow } from "../../src/application/evidence-to-component-workflow.js";
import { renderWorkflowError, renderWorkflowSuccess } from "../../src/frontend/minimal/render.js";
import type { EvidenceItem } from "../../src/domain/evidence/types.js";
import type { ResumeComponent } from "../../src/domain/resume-component/types.js";

const now = new Date().toISOString();
const evidence: EvidenceItem = {
  evidenceId: "11111111-1111-4111-8111-111111111111", sourceId: "22222222-2222-4222-8222-222222222222",
  sourceLocation: "Resume page 2", exactTextOrFact: "Administered Azure DevOps workflows", evidenceType: "responsibility",
  confidence: "high", verificationStatus: "needs_verification", restrictions: [], version: 1,
  createdAt: now, updatedAt: now, createdBy: "captain", lastUpdatedBy: "captain",
};
const component: ResumeComponent = {
  componentId: "33333333-3333-4333-8333-333333333333", logicalComponentId: "44444444-4444-4444-8444-444444444444",
  componentType: "bullet", text: "Administered Azure DevOps workflows", evidenceLinks: [], experienceLinks: [],
  certificationStatus: "draft", approvedLanes: ["B3A"], restrictions: [], truthGateStatus: "not_run", qaStatus: "not_run",
  version: 1, createdAt: now, updatedAt: now, createdBy: "chief", lastUpdatedBy: "chief",
};

describe("minimal end-to-end workflow", () => {
  it("completes evidence through certification and renders an accessible success page", () => {
    const result = completeEvidenceToComponentWorkflow(evidence, component);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.component.certificationStatus).toBe("certified");
    const html = renderWorkflowSuccess(result.value);
    expect(html).toContain("Resume Component Certified");
    expect(html).toContain("Evidence Trace");
    expect(html).toContain("Captain actions:</strong> None");
  });

  it("blocks unsupported wording and offers recovery navigation", () => {
    const result = completeEvidenceToComponentWorkflow(evidence, { ...component, text: "Led enterprise cybersecurity architecture" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("UNSUPPORTED_SKILL_OR_CLAIM");
    const html = renderWorkflowError(result.error);
    expect(html).toContain("We could not verify this statement");
    expect(html).toContain("Search historical resume documents");
    expect(html).toContain("memory support only");
  });
});
