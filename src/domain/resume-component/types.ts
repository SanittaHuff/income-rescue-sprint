import type { ISODateTime, UUID, VersionedEntity } from "../common.js";

export type ComponentType = "summary" | "skill" | "bullet" | "role_block" | "achievement" | "other_approved";
export type CertificationStatus = "draft" | "evidence_linked" | "qa_reviewed" | "certified" | "restricted" | "superseded" | "retired";
export type TruthGateStatus = "not_run" | "passed" | "failed" | "blocked";
export type QaStatus = "not_run" | "passed" | "failed" | "needs_review";
export type SkillClassification = "verified" | "adjacent" | "learning" | "unclaimed";

export interface ResumeComponent extends VersionedEntity {
  componentId: UUID;
  logicalComponentId: UUID;
  componentType: ComponentType;
  text: string;
  evidenceLinks: UUID[];
  experienceLinks: UUID[];
  certificationStatus: CertificationStatus;
  approvedLanes: string[];
  restrictions: string[];
  truthGateStatus: TruthGateStatus;
  qaStatus: QaStatus;
  skillClassification?: SkillClassification;
  priorVersionId?: UUID;
  archivedAt?: ISODateTime;
}
