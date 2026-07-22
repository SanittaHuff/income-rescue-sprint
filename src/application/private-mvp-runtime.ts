import { createHash } from "node:crypto";
import { z } from "zod";
import { completeEvidenceToComponentWorkflow } from "./evidence-to-component-workflow.js";
import { buildResumePackage, evaluateJobMatch } from "./private-mvp-facade.js";
import type { EvidenceItem } from "../domain/evidence/types.js";
import type { ResumeComponent } from "../domain/resume-component/types.js";
import type { ResumeAssemblyRequest } from "../domain/resume-assembly/types.js";
import type { JobMatchRequest } from "../domain/job-matching/types.js";

export interface SessionAuditEvent {
  eventId: string;
  eventType: "evidence_certified" | "session_imported";
  occurredAt: string;
  detail: string;
}

export interface PrivateMvpSession {
  sessionId: string;
  evidence: EvidenceItem[];
  certifiedComponents: ResumeComponent[];
  auditTrail: SessionAuditEvent[];
  lastUpdatedAt: string;
}

interface SessionEnvelope {
  formatVersion: 1;
  checksum: string;
  session: PrivateMvpSession;
}

const sessionSchema = z.object({
  sessionId: z.string().min(1),
  evidence: z.array(z.object({ evidenceId: z.string().min(1) }).passthrough()),
  certifiedComponents: z.array(z.object({ componentId: z.string().min(1), certificationStatus: z.string() }).passthrough()),
  auditTrail: z.array(z.object({ eventId: z.string().min(1), eventType: z.enum(["evidence_certified", "session_imported"]), occurredAt: z.string(), detail: z.string() })),
  lastUpdatedAt: z.string().min(1),
}).passthrough();

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonicalize(item)]));
  }
  return value;
};
const checksum = (session: PrivateMvpSession): string => createHash("sha256").update(JSON.stringify(canonicalize(session))).digest("hex");

export class PrivateMvpRuntime {
  private session: PrivateMvpSession;
  constructor(sessionId: string = crypto.randomUUID()) {
    this.session = { sessionId, evidence: [], certifiedComponents: [], auditTrail: [], lastUpdatedAt: new Date().toISOString() };
  }
  certify(evidence: EvidenceItem, component: ResumeComponent) {
    const result = completeEvidenceToComponentWorkflow(evidence, component);
    if (result.ok) {
      const evidenceExists = this.session.evidence.some((item) => item.evidenceId === result.value.evidence.evidenceId);
      const componentExists = this.session.certifiedComponents.some((item) => item.componentId === result.value.component.componentId);
      if (!evidenceExists) this.session.evidence.push(result.value.evidence);
      if (!componentExists) {
        this.session.certifiedComponents.push(result.value.component);
        this.session.auditTrail.push({ eventId: crypto.randomUUID(), eventType: "evidence_certified", occurredAt: new Date().toISOString(), detail: result.value.component.componentId });
      }
      if (!evidenceExists || !componentExists) this.session.lastUpdatedAt = new Date().toISOString();
    }
    return result;
  }
  assemble(request: Omit<ResumeAssemblyRequest, "components">) {
    return buildResumePackage({ ...request, components: this.session.certifiedComponents.filter((item) => item.certificationStatus === "certified").map((item) => ({ componentId: item.componentId, componentType: item.componentType, text: item.text, certificationStatus: "certified" as const, approvedLanes: item.approvedLanes })) });
  }
  match(request: Omit<JobMatchRequest, "certifiedComponentTexts">) {
    return evaluateJobMatch({ ...request, certifiedComponentTexts: this.session.certifiedComponents.map((item) => item.text) });
  }
  exportSession(): string {
    const envelope: SessionEnvelope = { formatVersion: 1, checksum: checksum(this.session), session: this.session };
    return JSON.stringify(envelope, null, 2);
  }
  importSession(serialized: string): void {
    if (new TextEncoder().encode(serialized).byteLength > 1_000_000) throw new Error("SESSION_EXPORT_TOO_LARGE");
    if (/\"(?:__proto__|prototype|constructor)\"\s*:/.test(serialized)) throw new Error("UNSAFE_SESSION_EXPORT");
    let raw: unknown;
    try { raw = JSON.parse(serialized); } catch { throw new Error("INVALID_SESSION_EXPORT"); }
    const envelope = z.object({ formatVersion: z.literal(1), checksum: z.string().length(64), session: sessionSchema }).safeParse(raw);
    if (!envelope.success) throw new Error("INVALID_SESSION_EXPORT");
    const parsed = envelope.data.session as unknown as PrivateMvpSession;
    if (checksum(parsed) !== envelope.data.checksum) throw new Error("SESSION_CHECKSUM_MISMATCH");
    const evidenceIds = new Set(parsed.evidence.map((item) => item.evidenceId));
    const componentIds = new Set(parsed.certifiedComponents.map((item) => item.componentId));
    if (evidenceIds.size !== parsed.evidence.length || componentIds.size !== parsed.certifiedComponents.length) throw new Error("DUPLICATE_SESSION_RECORD");
    this.session = structuredClone(parsed);
    this.session.auditTrail.push({ eventId: crypto.randomUUID(), eventType: "session_imported", occurredAt: new Date().toISOString(), detail: "Checksum verified" });
    this.session.lastUpdatedAt = new Date().toISOString();
  }
  clearSession(): void {
    this.session = { sessionId: crypto.randomUUID(), evidence: [], certifiedComponents: [], auditTrail: [], lastUpdatedAt: new Date().toISOString() };
  }
  snapshot(): PrivateMvpSession { return structuredClone(this.session); }
}
