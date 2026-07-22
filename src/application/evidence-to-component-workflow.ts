import type { EvidenceItem } from "../domain/evidence/types.js";
import { certifyComponent, linkEvidenceToComponent } from "../domain/resume-component/service.js";
import type { ResumeComponent } from "../domain/resume-component/types.js";
import type { DomainError } from "../domain/errors.js";
import type { Result } from "../domain/common.js";

export type WorkflowStage =
  | "evidence_capture"
  | "evidence_verification"
  | "component_draft"
  | "evidence_linking"
  | "truth_gate"
  | "qa_review"
  | "certification"
  | "complete";

export interface WorkflowSnapshot {
  stage: WorkflowStage;
  evidence: EvidenceItem;
  component: ResumeComponent;
  completedStages: WorkflowStage[];
  message: string;
}

export const verifyEvidenceLocally = (evidence: EvidenceItem): Result<EvidenceItem, DomainError> => {
  if (!evidence.sourceLocation.trim()) {
    return { ok: false, error: { code: "SOURCE_LOCATION_REQUIRED", message: "Add where this information came from." } };
  }
  if (!evidence.exactTextOrFact.trim()) {
    return { ok: false, error: { code: "VALIDATION_ERROR", message: "Add the experience or fact you want to verify." } };
  }
  if (evidence.restrictions.some((restriction) => restriction.blocksUse && !restriction.resolvedAt)) {
    return { ok: false, error: { code: "UNRESOLVED_RESTRICTION", message: "Resolve the blocking restriction before verification." } };
  }
  return {
    ok: true,
    value: {
      ...evidence,
      verificationStatus: "verified",
      version: evidence.version + 1,
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: "captain",
    },
  };
};

export const runTruthGate = (
  component: ResumeComponent,
  evidence: EvidenceItem[],
): Result<ResumeComponent, DomainError> => {
  if (evidence.length === 0) {
    return { ok: false, error: { code: "EVIDENCE_REQUIRED", message: "Add supporting information before Truth Gate review." } };
  }
  if (evidence.some((item) => item.verificationStatus !== "verified")) {
    return { ok: false, error: { code: "EVIDENCE_NOT_VERIFIED", message: "Verify the supporting information before Truth Gate review." } };
  }
  const normalizedText = component.text.toLowerCase();
  const supported = evidence.some((item) => {
    const words = item.exactTextOrFact.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
    return words.some((word) => normalizedText.includes(word));
  });
  if (!supported) {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_SKILL_OR_CLAIM",
        message: "We could not verify this statement with the information currently available.",
      },
    };
  }
  return {
    ok: true,
    value: {
      ...component,
      truthGateStatus: "passed",
      version: component.version + 1,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const passQaReview = (component: ResumeComponent): Result<ResumeComponent, DomainError> => {
  if (component.truthGateStatus !== "passed") {
    return { ok: false, error: { code: "TRUTH_GATE_NOT_PASSED", message: "Truth Gate must pass before QA review." } };
  }
  return {
    ok: true,
    value: {
      ...component,
      qaStatus: "passed",
      certificationStatus: "qa_reviewed",
      version: component.version + 1,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const completeEvidenceToComponentWorkflow = (
  evidenceInput: EvidenceItem,
  componentInput: ResumeComponent,
): Result<WorkflowSnapshot, DomainError> => {
  const verified = verifyEvidenceLocally(evidenceInput);
  if (!verified.ok) return verified;

  const linked = linkEvidenceToComponent(componentInput, [verified.value], componentInput.version);
  if (!linked.ok) return linked;

  const truthGate = runTruthGate(linked.value, [verified.value]);
  if (!truthGate.ok) return truthGate;

  const qa = passQaReview(truthGate.value);
  if (!qa.ok) return qa;

  const certified = certifyComponent(qa.value, [verified.value]);
  if (!certified.ok) return certified;

  return {
    ok: true,
    value: {
      stage: "complete",
      evidence: verified.value,
      component: certified.value,
      completedStages: [
        "evidence_capture",
        "evidence_verification",
        "component_draft",
        "evidence_linking",
        "truth_gate",
        "qa_review",
        "certification",
        "complete",
      ],
      message: "The resume component is certified and its evidence trace is preserved.",
    },
  };
};
