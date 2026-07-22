import type { Result } from "../common.js";
import { domainError, type DomainError } from "../errors.js";
import type { EvidenceItem } from "../evidence/types.js";
import type { ResumeComponent } from "./types.js";

export const certifyComponent = (
  component: ResumeComponent,
  linkedEvidence: EvidenceItem[],
): Result<ResumeComponent, DomainError> => {
  if (component.certificationStatus !== "qa_reviewed") {
    return { ok: false, error: domainError("INVALID_STATE_TRANSITION", "Component must be QA reviewed before certification.") };
  }
  if (linkedEvidence.length === 0) return { ok: false, error: domainError("EVIDENCE_REQUIRED", "Verified evidence is required.") };
  if (linkedEvidence.some((e) => e.verificationStatus !== "verified")) {
    return { ok: false, error: domainError("EVIDENCE_NOT_VERIFIED", "All linked evidence must be verified.") };
  }
  if (component.restrictions.length > 0) {
    return { ok: false, error: domainError("UNRESOLVED_RESTRICTION", "Blocking restrictions remain.") };
  }
  if (component.truthGateStatus !== "passed") return { ok: false, error: domainError("TRUTH_GATE_NOT_PASSED", "Truth Gate must pass.") };
  if (component.qaStatus !== "passed") return { ok: false, error: domainError("QA_NOT_PASSED", "QA must pass.") };

  return {
    ok: true,
    value: {
      ...component,
      certificationStatus: "certified",
      version: component.version + 1,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const linkEvidenceToComponent = (
  component: ResumeComponent,
  evidence: EvidenceItem[],
  expectedVersion: number,
): Result<ResumeComponent, DomainError> => {
  if (component.version !== expectedVersion) {
    return { ok: false, error: domainError("VERSION_CONFLICT", "A newer component version exists.") };
  }
  if (component.certificationStatus === "certified") {
    return { ok: false, error: domainError("CERTIFIED_COMPONENT_REQUIRES_NEW_VERSION", "Certified content requires a new version.") };
  }
  if (evidence.length === 0) {
    return { ok: false, error: domainError("EVIDENCE_REQUIRED", "Add supporting evidence to continue.") };
  }
  if (evidence.some((item) => item.verificationStatus !== "verified")) {
    return { ok: false, error: domainError("EVIDENCE_NOT_VERIFIED", "Verify the selected evidence before linking it.") };
  }
  return {
    ok: true,
    value: {
      ...component,
      evidenceLinks: [...new Set([...component.evidenceLinks, ...evidence.map((item) => item.evidenceId)])],
      certificationStatus: "evidence_linked",
      version: component.version + 1,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const createNewComponentVersion = (
  component: ResumeComponent,
  changes: Partial<Pick<ResumeComponent, "text" | "approvedLanes" | "restrictions">>,
  newComponentId: string,
): Result<ResumeComponent, DomainError> => {
  if (component.certificationStatus !== "certified") {
    return { ok: false, error: domainError("INVALID_STATE_TRANSITION", "Only certified components require immutable version creation.") };
  }
  return {
    ok: true,
    value: {
      ...component,
      ...changes,
      componentId: newComponentId,
      priorVersionId: component.componentId,
      certificationStatus: "draft",
      truthGateStatus: "not_run",
      qaStatus: "not_run",
      version: component.version + 1,
      updatedAt: new Date().toISOString(),
    },
  };
};

export interface ComponentTrace {
  component: ResumeComponent;
  evidence: EvidenceItem[];
  priorVersions: ResumeComponent[];
  decisions: string[];
  auditEvents: string[];
}

export const buildComponentTrace = (
  component: ResumeComponent,
  evidence: EvidenceItem[],
  priorVersions: ResumeComponent[] = [],
  decisions: string[] = [],
  auditEvents: string[] = [],
): ComponentTrace => ({ component, evidence, priorVersions, decisions, auditEvents });
