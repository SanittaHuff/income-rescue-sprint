import type { ISODateTime, UUID } from "../common.js";

export interface AuditEvent {
  eventId: UUID;
  entityType: string;
  entityId: UUID;
  eventType: string;
  previousState?: unknown;
  newState?: unknown;
  actor: string;
  occurredAt: ISODateTime;
  reason?: string;
  evidenceOrDecisionLinks: UUID[];
  correlationId?: UUID;
}
