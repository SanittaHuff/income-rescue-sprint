export type EvidenceUiState = "idle" | "loading" | "loaded" | "saving" | "saved" | "needs_verification" | "verified" | "rejected" | "superseded" | "error";
export type ExperienceUiState = "draft" | "evidence_linked" | "verified" | "blocked_by_hold" | "restricted" | "superseded" | "archived";
export type ComponentUiState = "draft" | "evidence_linked" | "truth_gate_running" | "truth_gate_failed" | "truth_gate_blocked" | "qa_pending" | "qa_reviewed" | "certified" | "restricted" | "superseded" | "retired";
export type ApprovalUiState = "not_required" | "required" | "submitted" | "approved" | "approved_with_changes" | "held" | "rejected" | "more_evidence_requested" | "synchronization_pending" | "verified";

export interface CoachModeState {
  active: boolean;
  step: number;
  totalSteps: number;
  instruction: string;
  exactAction?: string;
  awaitingVerification: boolean;
  resumable: boolean;
}

export interface CaptainActionPanelState {
  required: boolean;
  heading: "CAPTAIN ACTION REQUIRED";
  exactDecision?: string;
  whyRequired?: string;
  currentValue?: string;
  proposedValue?: string;
  recommendation?: string;
  defaultSafeOutcome?: string;
}

export interface PersistedWorkflowDraft {
  route: string;
  formData: Record<string, unknown>;
  savedAt: string;
}

export const restoreWorkflowDraft = (serialized: string | null): PersistedWorkflowDraft | null => {
  if (!serialized) return null;
  try {
    const value = JSON.parse(serialized) as PersistedWorkflowDraft;
    if (!value.route || !value.savedAt || typeof value.formData !== "object") return null;
    return value;
  } catch {
    return null;
  }
};

export const essentialInstructionSequence = (instructions: string[]): string =>
  instructions.map((instruction, index) => `Step ${index + 1}: ${instruction}`).join("\n");

export const captainActionPanel = (
  input: Omit<CaptainActionPanelState, "required" | "heading">,
): CaptainActionPanelState => ({ required: true, heading: "CAPTAIN ACTION REQUIRED", ...input });
