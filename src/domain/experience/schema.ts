import { z } from "zod";

export const experienceRecordSchema = z.object({
  experienceId: z.string().uuid(),
  employer: z.string().trim().min(1),
  viaVendor: z.string().trim().min(1).optional(),
  canonicalTitle: z.string().trim().min(1),
  contractStatus: z.string().trim().min(1),
  location: z.string().trim().min(1),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
  evidenceLinks: z.array(z.string().uuid()).min(1),
  verifiedResponsibilities: z.array(z.string()),
  verifiedTools: z.array(z.string()),
  verifiedOutcomes: z.array(z.string()),
  holdOrVerifyFlags: z.array(z.object({
    flagId: z.string().uuid(),
    reason: z.string().min(1),
    blocking: z.boolean(),
    resolvedByDecisionId: z.string().uuid().optional(),
  })),
  lifecycleStatus: z.enum(["draft", "evidence_linked", "verified", "restricted", "superseded", "archived"]),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().min(1),
  lastUpdatedBy: z.string().min(1),
  archivedAt: z.string().datetime().optional(),
}).refine((v) => !v.endDate || v.endDate >= v.startDate, {
  message: "End date must be on or after start date.",
  path: ["endDate"],
});
