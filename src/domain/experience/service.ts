import type { ExperienceRecord } from "./types.js";

export interface CanonicalValidationResult {
  valid: boolean;
  changedFields: string[];
  decisionRequired: boolean;
}

export const validateCanonicalFields = (
  current: ExperienceRecord,
  proposed: Partial<Pick<ExperienceRecord, "employer" | "viaVendor" | "canonicalTitle" | "contractStatus" | "location" | "startDate" | "endDate">>,
): CanonicalValidationResult => {
  const changedFields = Object.entries(proposed)
    .filter(([key, value]) => value !== current[key as keyof ExperienceRecord])
    .map(([key]) => key);
  return { valid: changedFields.length === 0, changedFields, decisionRequired: changedFields.length > 0 };
};
