import { describe, expect, it } from "vitest";
import { toRtf, validateAtsReadability } from "../../src/domain/resume-assembly/export.js";

const resume = {
  resumeId: "r1",
  title: "Azure DevOps Administrator",
  targetLane: "B3A",
  plainText: "Sanitta Huff\ncontact\nAzure DevOps Administrator\n\nPROFESSIONAL SUMMARY\nSummary\n\nPROFESSIONAL EXPERIENCE\n• Managed Azure DevOps\n",
  html: "<html></html>",
  componentIds: ["c1"],
  warnings: [],
};

describe("resume export", () => {
  it("creates Word-compatible RTF content", () => {
    expect(toRtf(resume)).toContain("\\rtf1");
    expect(toRtf(resume)).toContain("Azure DevOps Administrator");
  });
  it("passes basic ATS readability checks", () => {
    expect(validateAtsReadability(resume)).toEqual({ passed: true, warnings: [] });
  });
});
