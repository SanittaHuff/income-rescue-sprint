import { describe, expect, it } from "vitest";
import { assessClaimSupport, initialFourScreenState, recoveryOptions, validateEvidenceScreen } from "../../src/frontend/app/four-screen-model.js";

describe("four-screen model", () => {
  it("requires both experience and source", () => {
    expect(validateEvidenceScreen(initialFourScreenState())).toHaveLength(2);
  });
  it("recognizes shared meaningful wording", () => {
    expect(assessClaimSupport("Administered Azure DevOps boards and workflows", "Administered Azure DevOps workflows")).toBe(true);
  });
  it("preserves all governed recovery routes", () => {
    expect(recoveryOptions).toHaveLength(5);
    expect(recoveryOptions[2]).toContain("email");
  });
});
