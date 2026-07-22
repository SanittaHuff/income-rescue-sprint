import { z } from "zod";

export const resumeComponentSchema = z.object({
  componentId: z.string().uuid(),
  logicalComponentId: z.string().uuid(),
  componentType: z.enum(["summary", "skill", "bullet", "role_block", "achievement", "other_approved"]),
  text: z.string().trim().min(1),
  evidenceLinks: z.array(z.string().uuid()),
  experienceLinks: z.array(z.string().uuid()),
  certificationStatus: z.enum(["draft", "evidence_linked", "qa_reviewed", "certified", "restricted", "superseded", "retired"]),
  approvedLanes: z.array(z.string()),
  restrictions: z.array(z.string()),
  truthGateStatus: z.enum(["not_run", "passed", "failed", "blocked"]),
  qaStatus: z.enum(["not_run", "passed", "failed", "needs_review"]),
  skillClassification: z.enum(["verified", "adjacent", "learning", "unclaimed"]).optional(),
  priorVersionId: z.string().uuid().optional(),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().min(1),
  lastUpdatedBy: z.string().min(1),
  archivedAt: z.string().datetime().optional(),
}).superRefine((value, ctx) => {
  if (value.certificationStatus === "certified") {
    if (value.evidenceLinks.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Certified components require verified evidence." });
    if (value.truthGateStatus !== "passed") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Truth Gate must pass before certification." });
    if (value.qaStatus !== "passed") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "QA must pass before certification." });
  }
});
