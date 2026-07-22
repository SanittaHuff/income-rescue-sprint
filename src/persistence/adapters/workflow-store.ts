import type { EvidenceItem } from "../../domain/evidence/types.js";
import type { ResumeComponent } from "../../domain/resume-component/types.js";

export interface StoredWorkflowRecord {
  workflowId: string;
  evidence: EvidenceItem;
  component: ResumeComponent;
  stage: string;
  savedAt: string;
}

export interface WorkflowStore {
  save(record: StoredWorkflowRecord): Promise<void>;
  load(workflowId: string): Promise<StoredWorkflowRecord | null>;
  remove(workflowId: string): Promise<void>;
}

export class InMemoryWorkflowStore implements WorkflowStore {
  private readonly records = new Map<string, StoredWorkflowRecord>();

  async save(record: StoredWorkflowRecord): Promise<void> {
    this.records.set(record.workflowId, structuredClone(record));
  }

  async load(workflowId: string): Promise<StoredWorkflowRecord | null> {
    const record = this.records.get(workflowId);
    return record ? structuredClone(record) : null;
  }

  async remove(workflowId: string): Promise<void> {
    this.records.delete(workflowId);
  }
}

export class BrowserLocalStorageWorkflowStore implements WorkflowStore {
  constructor(private readonly prefix = "lvhq:resume-workflow:") {}

  async save(record: StoredWorkflowRecord): Promise<void> {
    globalThis.localStorage.setItem(`${this.prefix}${record.workflowId}`, JSON.stringify(record));
  }

  async load(workflowId: string): Promise<StoredWorkflowRecord | null> {
    const value = globalThis.localStorage.getItem(`${this.prefix}${workflowId}`);
    if (!value) return null;
    try {
      return JSON.parse(value) as StoredWorkflowRecord;
    } catch {
      return null;
    }
  }

  async remove(workflowId: string): Promise<void> {
    globalThis.localStorage.removeItem(`${this.prefix}${workflowId}`);
  }
}
