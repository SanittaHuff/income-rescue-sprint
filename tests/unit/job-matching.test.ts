import { describe, expect, it } from "vitest";
import { matchCertifiedResumeToJob } from "../../src/domain/job-matching/service.js";

describe("governed job matching", () => {
  it("reports supported terms and gaps without inventing fit", () => {
    const result = matchCertifiedResumeToJob({
      jobTitle: "Azure DevOps Administrator",
      jobDescription: "Manage Azure DevOps boards, pipelines, governance, Kubernetes, and Terraform.",
      certifiedComponentTexts: ["Administered Azure DevOps boards and governance workflows."],
    });
    expect(result.supportedTerms).toContain("azure");
    expect(result.supportedTerms).toContain("governance");
    expect(result.gaps).toContain("kubernetes");
    expect(result.explanation).toContain("not proof");
  });
  it("weights explicitly required gaps above preferred gaps", () => {
    const result = matchCertifiedResumeToJob({
      jobTitle: "Platform Administrator",
      jobDescription: "Required: Kubernetes and Terraform. Preferred: PowerShell. Azure DevOps administration is also used.",
      certifiedComponentTexts: ["Administered Azure DevOps governance and boards."],
    });
    expect(result.requiredGaps).toContain("kubernetes");
    expect(result.requiredGaps).toContain("terraform");
    expect(result.preferredGaps).toContain("powershell");
    expect(result.highestRoiNextStep).toContain("kubernetes");
  });
  it("normalizes common equivalent terminology", () => {
    const result = matchCertifiedResumeToJob({
      jobTitle: "ADO Admin",
      jobDescription: "Must have Azure DevOps administration and CI/CD pipelines.",
      certifiedComponentTexts: ["Administered ADO and managed CI/CD pipelines."],
    });
    expect(result.supportedTerms).toContain("azure-devops");
    expect(result.supportedTerms).toContain("ci-cd");
  });
});
