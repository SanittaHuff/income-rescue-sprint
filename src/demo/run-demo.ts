import { writeFile } from "node:fs/promises";
import { completeEvidenceToComponentWorkflow } from "../application/evidence-to-component-workflow.js";
import { renderWorkflowError, renderWorkflowSuccess } from "../frontend/minimal/render.js";
import type { EvidenceItem } from "../domain/evidence/types.js";
import type { ResumeComponent } from "../domain/resume-component/types.js";

const now = new Date().toISOString();
const evidence: EvidenceItem = {
  evidenceId: "11111111-1111-4111-8111-111111111111",
  sourceId: "22222222-2222-4222-8222-222222222222",
  sourceLocation: "Historical resume, Microsoft via Aditi section",
  exactTextOrFact: "Administered Azure DevOps work items, permissions, and process workflows.",
  evidenceType: "responsibility",
  confidence: "high",
  verificationStatus: "needs_verification",
  restrictions: [],
  version: 1,
  createdAt: now,
  updatedAt: now,
  createdBy: "captain",
  lastUpdatedBy: "captain",
};
const component: ResumeComponent = {
  componentId: "33333333-3333-4333-8333-333333333333",
  logicalComponentId: "44444444-4444-4444-8444-444444444444",
  componentType: "bullet",
  text: "Administered Azure DevOps work items, permissions, and process workflows.",
  evidenceLinks: [],
  experienceLinks: [],
  certificationStatus: "draft",
  approvedLanes: ["Azure DevOps Administration"],
  restrictions: [],
  truthGateStatus: "not_run",
  qaStatus: "not_run",
  version: 1,
  createdAt: now,
  updatedAt: now,
  createdBy: "chief",
  lastUpdatedBy: "chief",
};

const result = completeEvidenceToComponentWorkflow(evidence, component);
const html = result.ok ? renderWorkflowSuccess(result.value) : renderWorkflowError(result.error);
await writeFile("minimal-ui-demo.html", html, "utf8");
console.log(result.ok ? "DEMO_COMPLETE" : `DEMO_BLOCKED:${result.error.code}`);
