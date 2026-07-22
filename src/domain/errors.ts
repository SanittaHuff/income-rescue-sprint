export type DomainErrorCode =
  | "EVIDENCE_REQUIRED"
  | "EVIDENCE_NOT_VERIFIED"
  | "SOURCE_LOCATION_REQUIRED"
  | "SOURCE_NOT_FOUND"
  | "UNRESOLVED_RESTRICTION"
  | "INVALID_STATE_TRANSITION"
  | "VERSION_CONFLICT"
  | "CANONICAL_FIELD_CHANGE_REQUIRES_DECISION"
  | "CANONICAL_FIELD_EVIDENCE_MISSING"
  | "CERTIFIED_COMPONENT_REQUIRES_NEW_VERSION"
  | "UNSUPPORTED_SKILL_OR_CLAIM"
  | "HISTORICAL_RECORD_DELETE_BLOCKED"
  | "AUDIT_EVENT_REQUIRED"
  | "TRUTH_GATE_NOT_PASSED"
  | "QA_NOT_PASSED"
  | "DECISION_REQUIRED"
  | "DECISION_NOT_ACTIVE"
  | "DECISION_SCOPE_MISMATCH"
  | "AUTHORITY_REQUIRED"
  | "VERIFICATION_EVIDENCE_REQUIRED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "FORBIDDEN";

export interface DomainError {
  code: DomainErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export const domainError = (
  code: DomainErrorCode,
  message: string,
  details?: Record<string, unknown>,
): DomainError => ({ code, message, ...(details ? { details } : {}) });
