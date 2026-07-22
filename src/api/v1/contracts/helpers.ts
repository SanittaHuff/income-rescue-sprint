import type { Result } from "../../../domain/common.js";
import type { DomainError } from "../../../domain/errors.js";
import type { ErrorEnvelope, SuccessEnvelope } from "./envelope.js";

export const successEnvelope = <T>(data: T, requestId: string, version?: number): SuccessEnvelope<T> => ({
  data,
  meta: { requestId, timestamp: new Date().toISOString(), ...(version === undefined ? {} : { version }) },
});

export const errorEnvelope = (error: DomainError, requestId: string): ErrorEnvelope => ({
  error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}), requestId },
});

export const toEnvelope = <T>(result: Result<T, DomainError>, requestId: string, version?: number): SuccessEnvelope<T> | ErrorEnvelope =>
  result.ok ? successEnvelope(result.value, requestId, version) : errorEnvelope(result.error, requestId);
