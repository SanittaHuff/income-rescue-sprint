import { describe, expect, it } from "vitest";
import { captainActionPanel, essentialInstructionSequence, restoreWorkflowDraft } from "../../src/frontend/state/evidence-to-component.js";

describe("Frontend workflow", () => {
  it("AT-09 keeps essential instructions readable by Read Aloud", () => {
    const text = essentialInstructionSequence(["Add supporting evidence", "Review the evidence trace"]);
    expect(text).toContain("Step 1: Add supporting evidence");
    expect(text).not.toContain("```");
  });

  it("AT-10 renders CAPTAIN ACTION REQUIRED separately", () => {
    const panel = captainActionPanel({ exactDecision: "Approve the exception", whyRequired: "It changes a canonical title." });
    expect(panel.heading).toBe("CAPTAIN ACTION REQUIRED");
    expect(panel.required).toBe(true);
  });

  it("F-03 restores the last safe draft after refresh", () => {
    const draft = restoreWorkflowDraft(JSON.stringify({ route: "/components/new", formData: { text: "Draft bullet" }, savedAt: new Date().toISOString() }));
    expect(draft?.formData.text).toBe("Draft bullet");
  });

  it("F-08 reads essential instructions in sequence", () => {
    const text = essentialInstructionSequence(["Capture evidence", "Verify evidence", "Create component"]);
    expect(text.split("\n")).toHaveLength(3);
    expect(text.indexOf("Capture")).toBeLessThan(text.indexOf("Verify"));
  });
});
