import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { assembleRecruiterResume } from "../../src/domain/resume-assembly/service.js";
import { exportProductionResume } from "../../src/domain/resume-assembly/production-export.js";

const resume = assembleRecruiterResume({
  resumeId: "00000000-0000-4000-8000-000000000111",
  title: "Azure DevOps Administrator",
  targetLane: "B3A",
  candidateName: "Sample Candidate",
  contactLine: "Seattle, WA | candidate@example.com | 555-0100",
  components: [
    { componentId: "00000000-0000-4000-8000-000000000112", componentType: "summary", text: "Technical operations professional with Azure DevOps governance experience.", certificationStatus: "certified", approvedLanes: ["B3A"] },
    { componentId: "00000000-0000-4000-8000-000000000113", componentType: "skill", text: "Azure DevOps", certificationStatus: "certified", approvedLanes: ["B3A"] },
    { componentId: "00000000-0000-4000-8000-000000000114", componentType: "bullet", text: "Administered governed work-item workflows and access controls.", certificationStatus: "certified", approvedLanes: ["B3A"] },
  ],
});

describe("production resume export", () => {
  it("creates non-empty DOCX and PDF files", async () => {
    const dir = await mkdtemp(join(tmpdir(), "resume-export-"));
    try {
      const result = await exportProductionResume(resume, join(dir, "resume"));
      const docx = Buffer.from(await readFile(result.docxPath, "binary"), "binary");
      const pdf = Buffer.from(await readFile(result.pdfPath, "binary"), "binary");
      expect(docx.byteLength).toBeGreaterThan(1000);
      expect(pdf.byteLength).toBeGreaterThan(1000);
      expect(docx.subarray(0, 2).toString()).toBe("PK");
      expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

it("creates readable multi-page production files for a longer governed resume", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resume-export-long-"));
  try {
    const longResume = assembleRecruiterResume({
      resumeId: "00000000-0000-4000-8000-000000000211",
      title: "Technical Operations and Azure DevOps Administrator",
      targetLane: "B3A",
      candidateName: "Sample Candidate",
      contactLine: "Seattle, WA | candidate@example.com | 555-0100",
      components: [
        { componentId: "00000000-0000-4000-8000-000000000212", componentType: "summary", text: "Technical operations professional with governed Azure DevOps, cloud support, service delivery, and business systems experience.", certificationStatus: "certified", approvedLanes: ["B3A"] },
        ...Array.from({ length: 8 }, (_, index) => ({ componentId: `00000000-0000-4000-8000-${String(300 + index).padStart(12, "0")}`, componentType: "skill" as const, text: ["Azure DevOps", "PowerShell", "KQL", "Azure Monitor", "YAML", "JSON", "REST APIs", "Power BI"][index]!, certificationStatus: "certified" as const, approvedLanes: ["B3A"] })),
        ...Array.from({ length: 28 }, (_, index) => ({ componentId: `00000000-0000-4000-8000-${String(500 + index).padStart(12, "0")}`, componentType: "bullet" as const, text: `Governed technical operations accomplishment ${index + 1} using verified tools, documented controls, cross-team coordination, and traceable outcomes.`, certificationStatus: "certified" as const, approvedLanes: ["B3A"] })),
      ],
    });
    const result = await exportProductionResume(longResume, join(dir, "long-resume"));
    const docx = Buffer.from(await readFile(result.docxPath, "binary"), "binary");
    const pdf = Buffer.from(await readFile(result.pdfPath, "binary"), "binary");
    expect(docx.byteLength).toBeGreaterThan(5000);
    expect(pdf.byteLength).toBeGreaterThan(3000);
    expect(pdf.toString("latin1")).toContain("/Type /Page");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
