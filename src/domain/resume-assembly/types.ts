import type { UUID } from "../common.js";

export interface CertifiedResumeComponentInput {
  componentId: UUID;
  componentType: "summary" | "skill" | "bullet" | "role_block" | "achievement" | "other_approved";
  text: string;
  certificationStatus: "certified";
  approvedLanes: string[];
}

export interface ResumeAssemblyRequest {
  resumeId: UUID;
  title: string;
  targetLane: string;
  candidateName: string;
  contactLine: string;
  components: CertifiedResumeComponentInput[];
}

export interface AssembledResume {
  resumeId: UUID;
  title: string;
  targetLane: string;
  plainText: string;
  html: string;
  componentIds: UUID[];
  warnings: string[];
}
