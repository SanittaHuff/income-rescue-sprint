import type { ISODateTime, UUID, VersionedEntity } from "../common.js";

export type EvidenceType =
  | "title" | "employer" | "vendor" | "date" | "location"
  | "responsibility" | "tool" | "outcome" | "limitation"
  | "education" | "certification" | "other";

export type Confidence = "confirmed" | "high" | "medium" | "low" | "unknown";
export type EvidenceStatus = "captured" | "needs_verification" | "verified" | "superseded" | "rejected";

export interface Restriction {
  code: string;
  description: string;
  blocksUse: boolean;
  resolvedAt?: ISODateTime;
}

export interface EvidenceItem extends VersionedEntity {
  evidenceId: UUID;
  sourceId: UUID;
  sourceLocation: string;
  exactTextOrFact: string;
  evidenceType: EvidenceType;
  confidence: Confidence;
  verificationStatus: EvidenceStatus;
  restrictions: Restriction[];
  replacementEvidenceId?: UUID;
  rejectionReason?: string;
  archivedAt?: ISODateTime;
}
