import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { JsonFileWorkflowStore } from "../../src/persistence/adapters/json-file-workflow-store.js";
import type { StoredWorkflowRecord } from "../../src/persistence/adapters/workflow-store.js";

const record: StoredWorkflowRecord = {
  workflowId: "wf-persistent", stage: "evidence", savedAt: new Date().toISOString(),
  evidence: { evidenceId: "e", sourceId: "s", sourceLocation: "resume", exactTextOrFact: "fact", evidenceType: "responsibility", confidence: "high", verificationStatus: "verified", restrictions: [], version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "captain", lastUpdatedBy: "captain" },
  component: { componentId: "c", logicalComponentId: "lc", componentType: "bullet", text: "fact", evidenceLinks: ["e"], experienceLinks: [], certificationStatus: "certified", approvedLanes: ["B3A"], restrictions: [], truthGateStatus: "passed", qaStatus: "passed", version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "chief", lastUpdatedBy: "chief" },
};

describe("JsonFileWorkflowStore", () => {
  it("persists a workflow across store instances", async () => {
    const directory = await mkdtemp(join(tmpdir(), "lvhq-store-"));
    const file = join(directory, "workflows.json");
    try {
      await new JsonFileWorkflowStore(file).save(record);
      const restored = await new JsonFileWorkflowStore(file).load(record.workflowId);
      expect(restored?.stage).toBe("evidence");
    } finally { await rm(directory, { recursive: true, force: true }); }
  });
});
