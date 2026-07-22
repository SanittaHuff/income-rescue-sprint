import { describe, expect, it } from "vitest";
import { errorEnvelope, successEnvelope } from "../../src/api/v1/contracts/helpers.js";
import { domainError } from "../../src/domain/errors.js";

const requestId = "req-123";

describe("API v1 contract", () => {
  it("returns stable machine-readable error codes", () => {
    const envelope = errorEnvelope(domainError("EVIDENCE_REQUIRED", "Add evidence."), requestId);
    expect(envelope.error.code).toBe("EVIDENCE_REQUIRED");
    expect(envelope.error.requestId).toBe(requestId);
  });

  it("requires expectedVersion for consequential updates", async () => {
    const request = { evidenceIds: ["evidence-id"], expectedVersion: 2 };
    expect(request.expectedVersion).toBe(2);
  });

  it("returns trace responses with source, decision, version, and audit data", () => {
    const data = { source: ["resume.pdf#p2"], decisions: ["decision-1"], versions: [1, 2], audit: ["certified"] };
    const envelope = successEnvelope(data, requestId, 2);
    expect(envelope.data).toEqual(data);
    expect(envelope.meta.version).toBe(2);
  });
});
