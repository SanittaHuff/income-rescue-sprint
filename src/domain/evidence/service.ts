import type { Actor, Result, UUID } from "../common.js";
import { domainError, type DomainError } from "../errors.js";
import type { EvidenceItem } from "./types.js";

export interface EvidenceRepository {
  get(id: UUID): Promise<EvidenceItem | null>;
  save(item: EvidenceItem): Promise<void>;
}

export interface AuditWriter {
  append(input: {
    entityType: string;
    entityId: UUID;
    eventType: string;
    actor: Actor;
    reason?: string;
    previousState?: unknown;
    newState?: unknown;
  }): Promise<void>;
}

export class EvidenceService {
  constructor(private readonly repo: EvidenceRepository, private readonly audit: AuditWriter) {}

  async verifyEvidence(
    evidenceId: UUID,
    actor: Actor,
    verificationEvidence: string,
    expectedVersion: number,
  ): Promise<Result<EvidenceItem, DomainError>> {
    const current = await this.repo.get(evidenceId);
    if (!current) return { ok: false, error: domainError("NOT_FOUND", "Evidence was not found.") };
    if (current.version !== expectedVersion) return { ok: false, error: domainError("VERSION_CONFLICT", "A newer version exists.") };
    if (!current.sourceLocation.trim()) return { ok: false, error: domainError("SOURCE_LOCATION_REQUIRED", "A recoverable source location is required.") };
    if (!verificationEvidence.trim()) return { ok: false, error: domainError("VERIFICATION_EVIDENCE_REQUIRED", "Verification evidence is required.") };
    if (!["captured", "needs_verification"].includes(current.verificationStatus)) {
      return { ok: false, error: domainError("INVALID_STATE_TRANSITION", "Evidence cannot be verified from its current status.") };
    }
    if (current.restrictions.some((r) => r.blocksUse && !r.resolvedAt)) {
      return { ok: false, error: domainError("UNRESOLVED_RESTRICTION", "A blocking restriction must be resolved first.") };
    }

    const updated: EvidenceItem = {
      ...current,
      verificationStatus: "verified",
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: actor.id,
    };
    await this.repo.save(updated);
    await this.audit.append({
      entityType: "evidence",
      entityId: evidenceId,
      eventType: "evidence_verified",
      actor,
      previousState: current,
      newState: updated,
      reason: verificationEvidence,
    });
    return { ok: true, value: updated };
  }
}
