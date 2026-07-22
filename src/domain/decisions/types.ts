import type { ISODateTime, UUID } from "../common.js";

export type DecisionType = "wording_exception" | "hold_resolution" | "source_correction" | "title_exception" | "date_exception" | "other_governed";
export type DecisionStatus = "active" | "superseded" | "revoked";

export interface DecisionException {
  decisionId: UUID;
  decisionType: DecisionType;
  authority: string;
  authorityReference: string;
  decisionText: string;
  affectedRecordIds: UUID[];
  effectiveDate: string;
  verificationEvidence: string;
  status: DecisionStatus;
  createdAt: ISODateTime;
  createdBy: string;
}
