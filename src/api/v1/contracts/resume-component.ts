import type { ComponentType, ResumeComponent } from "../../../domain/resume-component/types.js";

export interface CreateResumeComponentRequest {
  componentType: ComponentType;
  text: string;
  approvedLanes?: string[];
  restrictions?: string[];
}

export interface LinkEvidenceRequest {
  evidenceIds: string[];
  expectedVersion: number;
}

export interface CreateComponentVersionRequest {
  changes: Partial<Pick<ResumeComponent, "text" | "approvedLanes" | "restrictions">>;
  reason: string;
  expectedVersion: number;
}
