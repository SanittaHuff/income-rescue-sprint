import type { EvidenceItem } from "../../src/domain/evidence/types.js";
import type { ResumeComponent } from "../../src/domain/resume-component/types.js";
const now = "2026-07-20T00:00:00.000Z";
export const makeEvidence = (overrides: Partial<EvidenceItem> = {}): EvidenceItem => ({
  evidenceId: "11111111-1111-4111-8111-111111111111", sourceId: "22222222-2222-4222-8222-222222222222", sourceLocation: "Coach Mode interview", exactTextOrFact: "Azure DevOps administration", evidenceType: "responsibility", confidence: "high", verificationStatus: "needs_verification", restrictions: [], version: 1, createdAt: now, updatedAt: now, createdBy: "captain", lastUpdatedBy: "captain", ...overrides,
});
export const makeComponent = (overrides: Partial<ResumeComponent> = {}): ResumeComponent => ({
  componentId: "33333333-3333-4333-8333-333333333333", logicalComponentId: "44444444-4444-4444-8444-444444444444", componentType: "bullet", text: "Azure DevOps administration", evidenceLinks: [], experienceLinks: [], certificationStatus: "draft", approvedLanes: ["B3A"], restrictions: [], truthGateStatus: "not_run", qaStatus: "not_run", version: 1, createdAt: now, updatedAt: now, createdBy: "chief", lastUpdatedBy: "chief", ...overrides,
});
