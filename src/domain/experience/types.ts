import type { ISODateTime, UUID, VersionedEntity } from "../common.js";

export type ExperienceStatus = "draft" | "evidence_linked" | "verified" | "restricted" | "superseded" | "archived";

export interface HoldFlag {
  flagId: UUID;
  reason: string;
  blocking: boolean;
  resolvedByDecisionId?: UUID;
}

export interface ExperienceRecord extends VersionedEntity {
  experienceId: UUID;
  employer: string;
  viaVendor?: string;
  canonicalTitle: string;
  contractStatus: string;
  location: string;
  startDate: string;
  endDate?: string;
  evidenceLinks: UUID[];
  verifiedResponsibilities: string[];
  verifiedTools: string[];
  verifiedOutcomes: string[];
  holdOrVerifyFlags: HoldFlag[];
  lifecycleStatus: ExperienceStatus;
  archivedAt?: ISODateTime;
}
