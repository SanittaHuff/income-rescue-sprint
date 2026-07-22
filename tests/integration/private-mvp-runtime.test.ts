import { describe, expect, it } from "vitest";
import { PrivateMvpRuntime } from "../../src/application/private-mvp-runtime.js";
import { makeComponent, makeEvidence } from "../support/factories.js";

describe("PrivateMvpRuntime", () => {
  it("certifies, assembles, matches, exports and restores one integrity-checked session", () => {
    const runtime = new PrivateMvpRuntime("session-1");
    const certified = runtime.certify(makeEvidence({ exactTextOrFact: "Administered Azure DevOps boards and migrations" }), makeComponent({ text: "Administered Azure DevOps boards and migrations" }));
    expect(certified.ok).toBe(true);
    const resume = runtime.assemble({ resumeId: "r1", candidateName: "Candidate", contactLine: "candidate@example.com", title: "Azure DevOps Administrator", targetLane: "B3A" });
    expect(resume.resume.plainText).toContain("Azure DevOps");
    const match = runtime.match({ jobTitle: "Azure DevOps Administrator", jobDescription: "Azure DevOps boards migrations" });
    expect(match.score).toBeGreaterThan(0);
    const exported = runtime.exportSession();
    expect(exported).toContain('"checksum"');
    const restored = new PrivateMvpRuntime("other");
    restored.importSession(exported);
    expect(restored.snapshot().certifiedComponents).toHaveLength(1);
    expect(restored.snapshot().auditTrail.some((event) => event.eventType === "session_imported")).toBe(true);
  });
  it("rejects malformed recovery exports", () => {
    const runtime = new PrivateMvpRuntime();
    expect(() => runtime.importSession("{}")) .toThrow("INVALID_SESSION_EXPORT");
  });
  it("rejects a modified export whose checksum no longer matches", () => {
    const runtime = new PrivateMvpRuntime("session-2");
    runtime.certify(makeEvidence(), makeComponent());
    const parsed = JSON.parse(runtime.exportSession());
    parsed.session.certifiedComponents[0].text = "Tampered statement";
    expect(() => new PrivateMvpRuntime().importSession(JSON.stringify(parsed))).toThrow("SESSION_CHECKSUM_MISMATCH");
  });
  it("does not duplicate records when the same identifiers are certified twice", () => {
    const runtime = new PrivateMvpRuntime("session-3");
    const evidence = makeEvidence();
    const component = makeComponent();
    runtime.certify(evidence, component);
    runtime.certify(evidence, component);
    expect(runtime.snapshot().evidence).toHaveLength(1);
    expect(runtime.snapshot().certifiedComponents).toHaveLength(1);
    expect(runtime.snapshot().auditTrail.filter((event) => event.eventType === "evidence_certified")).toHaveLength(1);
  });
  it("rejects oversized and unsafe recovery exports without changing current data", () => {
    const runtime = new PrivateMvpRuntime("safe");
    runtime.certify(makeEvidence(), makeComponent());
    const before = runtime.snapshot();
    expect(() => runtime.importSession("x".repeat(1_000_001))).toThrow("SESSION_EXPORT_TOO_LARGE");
    expect(() => runtime.importSession('{"__proto__":{"polluted":true}}')).toThrow("UNSAFE_SESSION_EXPORT");
    expect(runtime.snapshot().certifiedComponents).toHaveLength(before.certifiedComponents.length);
  });
  it("supports an explicit privacy reset", () => {
    const runtime = new PrivateMvpRuntime("reset");
    runtime.certify(makeEvidence(), makeComponent());
    runtime.clearSession();
    expect(runtime.snapshot().certifiedComponents).toHaveLength(0);
    expect(runtime.snapshot().evidence).toHaveLength(0);
  });
});
