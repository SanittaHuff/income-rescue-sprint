import { describe, expect, it } from "vitest";
import { PrivateMvpUiController } from "../../src/frontend/app/private-mvp-model.js";

describe("private MVP UI controller", () => {
  it("blocks incomplete certification", () => {
    const c = new PrivateMvpUiController();
    const result = c.certifyCurrent();
    expect(result.certifiedCount).toBe(0);
    expect(result.statusMessage).toContain("Add the experience");
  });
  it("certifies, assembles, matches, and exports a session", () => {
    const c = new PrivateMvpUiController();
    c.update({ evidenceText: "Administered Azure DevOps boards and permissions", evidenceSource: "Prior resume and project notes", componentText: "Administered Azure DevOps boards, permissions, and sprint workflows.", targetLane: "Azure DevOps Administrator" });
    expect(c.certifyCurrent().certifiedCount).toBe(1);
    expect(c.assembleResume().resumeText).toContain("PROFESSIONAL EXPERIENCE");
    c.update({ jobDescription: "Azure DevOps administrator with boards permissions and sprint workflow experience" });
    expect(c.evaluateMatch().matchScore).toBeGreaterThan(0);
    expect(c.exportSession().sessionExport).toContain("certifiedComponents");
  });
});

it("navigates missing or partial evidence into recovery without certification", () => {
  const controller = new PrivateMvpUiController();
  controller.update({
    evidenceText: "Genuine project experience remembered by the user",
    evidenceSource: "",
    confidenceLevel: "partial",
    componentText: "Supported a governed technical workflow.",
  });
  const state = controller.certifyCurrent();
  expect(state.certifiedCount).toBe(0);
  expect(state.statusMessage).toContain("could not fully verify");
});

it("identifies historical resumes as the highest ROI recovery starting point", () => {
  const controller = new PrivateMvpUiController();
  const state = controller.selectRecoveryRoute("roi");
  expect(state.recoveryRoute).toBe("roi");
  expect(state.statusMessage).toContain("historical resumes first");
});
