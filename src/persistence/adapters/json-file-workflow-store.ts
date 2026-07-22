import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { StoredWorkflowRecord, WorkflowStore } from "./workflow-store.js";

export class JsonFileWorkflowStore implements WorkflowStore {
  constructor(private readonly filePath: string) {}
  private async readAll(): Promise<Record<string, StoredWorkflowRecord>> {
    try { return JSON.parse(await readFile(this.filePath, "utf8")) as Record<string, StoredWorkflowRecord>; }
    catch (error) {
      if ((error as { code?: string }).code === "ENOENT") return {};
      throw error;
    }
  }
  private async writeAll(records: Record<string, StoredWorkflowRecord>): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporary = `${this.filePath}.tmp`;
    await writeFile(temporary, JSON.stringify(records, null, 2), "utf8");
    await rename(temporary, this.filePath);
  }
  async save(record: StoredWorkflowRecord): Promise<void> {
    const records = await this.readAll();
    records[record.workflowId] = structuredClone(record);
    await this.writeAll(records);
  }
  async load(workflowId: string): Promise<StoredWorkflowRecord | null> {
    const records = await this.readAll();
    return records[workflowId] ? structuredClone(records[workflowId]) : null;
  }
  async remove(workflowId: string): Promise<void> {
    const records = await this.readAll();
    delete records[workflowId];
    await this.writeAll(records);
  }
}
