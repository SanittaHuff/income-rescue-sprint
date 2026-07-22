import { describe, expect, it } from "vitest";
import { PrivateMvpUiController, initialPrivateMvpUiState } from "../../src/frontend/app/private-mvp-model.js";
import { renderPrivateMvpHtml } from "../../src/frontend/app/render-private-mvp.js";

describe("reconstructed v16-v30 behavior", () => {
  it("reports coverage and governed recommendation from certified evidence", () => {
    const c = new PrivateMvpUiController();
    c.update({ evidenceText:"Managed Azure DevOps boards", evidenceSource:"Prior resume", componentText:"Administered Azure DevOps boards and permissions.", targetLane:"Azure DevOps Administrator" });
    c.certifyCurrent(); c.assembleResume(); c.update({ jobDescription:"Required: Azure DevOps boards and permissions\nPreferred: PowerShell" });
    const s = c.evaluateMatch();
    expect(s.coverage.required.total).toBeGreaterThan(0);
    expect(s.recommendation).toBeTruthy();
    expect(s.matchConfidence).toBeTruthy();
  });
  it("blocks review checks until resume and match exist and then enables export after four checks", () => {
    const c = new PrivateMvpUiController();
    expect(c.setReviewCheck("wording", true).exportReady).toBe(false);
    c.update({ evidenceText:"Managed Azure DevOps boards", evidenceSource:"Prior resume", componentText:"Administered Azure DevOps boards.", targetLane:"Azure DevOps Administrator" });
    c.certifyCurrent(); c.assembleResume(); c.update({ jobDescription:"Required: Azure DevOps boards" }); c.evaluateMatch();
    for (const check of ["wording","evidenceTrace","roleLane","matchGaps"] as const) c.setReviewCheck(check,true);
    expect(c.snapshot().exportReady).toBe(true);
  });
  it("invalidates stale review after a sensitive change", () => {
    const c = new PrivateMvpUiController();
    c.update({ evidenceText:"Managed Azure DevOps boards", evidenceSource:"Prior resume", componentText:"Administered Azure DevOps boards.", targetLane:"Azure DevOps Administrator" });
    c.certifyCurrent(); c.assembleResume(); c.update({ jobDescription:"Required: Azure DevOps boards" }); c.evaluateMatch();
    for (const check of ["wording","evidenceTrace","roleLane","matchGaps"] as const) c.setReviewCheck(check,true);
    c.update({ jobDescription:"Required: Azure DevOps boards and PowerShell" });
    expect(c.snapshot().exportReady).toBe(false);
    expect(Object.values(c.snapshot().reviewChecklist).every((v)=>!v)).toBe(true);
  });
  it("renders evidence trace, export readiness, resume-only print, and two-step restore", () => {
    const html = renderPrivateMvpHtml(initialPrivateMvpUiState());
    for (const text of ["Evidence Trace","Export Readiness","Copy reviewed resume text","Print or Save as PDF","Confirm restore","Cancel","Backup date and time","Not listed"]) expect(html).toContain(text);
    expect(html).toContain("@media print");
    expect(html).toContain("allowed=['activeScreen'");
    expect(html).toContain("unsafe");
  });
});
