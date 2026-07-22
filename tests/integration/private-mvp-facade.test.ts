import { describe, expect, it } from "vitest";
import { buildResumePackage, evaluateJobMatch } from "../../src/application/private-mvp-facade.js";
import type { CertifiedResumeComponentInput } from "../../src/domain/resume-assembly/types.js";

const base = (id: string, type: CertifiedResumeComponentInput["componentType"], text: string): CertifiedResumeComponentInput => ({
  componentId: id, componentType: type, text, approvedLanes: ["B3A"], certificationStatus: "certified",
});

describe("private MVP facade", () => {
  it("assembles, validates, and exports a certified resume", () => {
    const result = buildResumePackage({ resumeId: "r1", candidateName: "Sanitta Huff", contactLine: "email", title: "Azure DevOps Administrator", targetLane: "B3A", components: [
      base("s", "summary", "Azure operations professional."),
      base("b", "bullet", "Administered Azure DevOps boards and workflows."),
    ] });
    expect(result.resume.componentIds).toHaveLength(2);
    expect(result.rtf).toContain("\\rtf1");
    expect(result.ats.passed).toBe(true);
  });
  it("normalizes common technology aliases during job matching", () => {
    const result = evaluateJobMatch({ jobTitle: "ADO Administrator", jobDescription: "Azure DevOps and PowerShell", certifiedComponentTexts: ["Azure DevOps administration with PowerShell"] });
    expect(result.supportedTerms).toContain("azure-devops");
    expect(result.supportedTerms).toContain("powershell");
  });
});
