import { describe, expect, it } from "vitest";
import { InMemoryWorkflowStore } from "../../src/persistence/adapters/workflow-store.js";
import type { StoredWorkflowRecord } from "../../src/persistence/adapters/workflow-store.js";

const record = (): StoredWorkflowRecord => ({
  workflowId: "wf-1",
  stage: "component_draft",
  savedAt: new Date().toISOString(),
  evidence: {
    evidenceId: "e-1", sourceId: "s-1", sourceLocation: "Prior resume", exactTextOrFact: "Administered Azure DevOps boards",
    evidenceType: "responsibility", confidence: "high", verificationStatus: "verified", restrictions: [], version: 1,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "captain", lastUpdatedBy: "captain",
  },
  component: {
    componentId: "c-1", logicalComponentId: "lc-1", componentType: "bullet", text: "Administered Azure DevOps boards",
    certificationStatus: "draft", approvedLanes: [], restrictions: [], truthGateStatus: "not_run", qaStatus: "not_run",
    version: 1, evidenceLinks: [], experienceLinks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    createdBy: "chief", lastUpdatedBy: "chief",
  },
});

describe("InMemoryWorkflowStore", () => {
  it("saves, restores, and removes a workflow without sharing mutable references", async () => {
    const store = new InMemoryWorkflowStore();
    const input = record();
    await store.save(input);
    input.stage = "mutated";
    const restored = await store.load("wf-1");
    expect(restored?.stage).toBe("component_draft");
    await store.remove("wf-1");
    expect(await store.load("wf-1")).toBeNull();
  });
});
