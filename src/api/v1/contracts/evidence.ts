import type { Confidence, EvidenceItem, EvidenceType, Restriction } from "../../../domain/evidence/types.js";

export interface CreateEvidenceRequest {
  sourceId: string;
  sourceLocation: string;
  exactTextOrFact: string;
  evidenceType: EvidenceType;
  confidence: Confidence;
  restrictions?: Restriction[];
}

export interface VerifyEvidenceRequest {
  reviewer: string;
  verificationEvidence: string;
  expectedVersion: number;
}

export type EvidenceResponse = EvidenceItem;
