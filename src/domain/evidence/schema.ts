import { z } from "zod";

export const restrictionSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  blocksUse: z.boolean(),
  resolvedAt: z.string().datetime().optional(),
});

export const evidenceItemSchema = z.object({
  evidenceId: z.string().uuid(),
  sourceId: z.string().uuid(),
  sourceLocation: z.string().trim().min(1),
  exactTextOrFact: z.string().trim().min(1),
  evidenceType: z.enum([
    "title", "employer", "vendor", "date", "location", "responsibility",
    "tool", "outcome", "limitation", "education", "certification", "other",
  ]),
  confidence: z.enum(["confirmed", "high", "medium", "low", "unknown"]),
  verificationStatus: z.enum(["captured", "needs_verification", "verified", "superseded", "rejected"]),
  restrictions: z.array(restrictionSchema).default([]),
  replacementEvidenceId: z.string().uuid().optional(),
  rejectionReason: z.string().min(1).optional(),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().min(1),
  lastUpdatedBy: z.string().min(1),
  archivedAt: z.string().datetime().optional(),
}).superRefine((value, ctx) => {
  if (value.verificationStatus === "superseded" && !value.replacementEvidenceId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Superseded evidence requires a replacement evidence ID." });
  }
  if (value.verificationStatus === "rejected" && !value.rejectionReason) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Rejected evidence requires a rejection reason." });
  }
});

export type EvidenceItemInput = z.infer<typeof evidenceItemSchema>;
