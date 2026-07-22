import type { DomainErrorCode } from "../../../domain/errors.js";

export interface SuccessEnvelope<T> {
  data: T;
  meta: { requestId: string; timestamp: string; version?: number };
}

export interface ErrorEnvelope {
  error: {
    code: DomainErrorCode;
    message: string;
    details?: Record<string, unknown>;
    requestId: string;
  };
}
