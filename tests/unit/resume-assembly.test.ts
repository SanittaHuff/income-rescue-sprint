import { describe, expect, it } from "vitest";
import { assembleRecruiterResume } from "../../src/domain/resume-assembly/service.js";

describe("resume assembly", () => {
  it("uses only certified components approved for the target lane", () => {
    const result = assembleRecruiterResume({
      resumeId: "11111111-1111-4111-8111-111111111111", title: "Azure DevOps Administrator", targetLane: "B3A",
      candidateName: "Sample Candidate", contactLine: "email@example.com",
      components: [
        { componentId: "22222222-2222-4222-8222-222222222222", componentType: "summary", text: "Governed Azure operations professional.", certificationStatus: "certified", approvedLanes: ["B3A"] },
        { componentId: "33333333-3333-4333-8333-333333333333", componentType: "bullet", text: "Administered Azure DevOps workflows.", certificationStatus: "certified", approvedLanes: ["B3A"] },
        { componentId: "44444444-4444-4444-8444-444444444444", componentType: "bullet", text: "Unrelated migration statement.", certificationStatus: "certified", approvedLanes: ["B1"] },
      ],
    });
    expect(result.plainText).toContain("Administered Azure DevOps workflows");
    expect(result.plainText).not.toContain("Unrelated migration statement");
    expect(result.componentIds).toHaveLength(2);
  });
});
