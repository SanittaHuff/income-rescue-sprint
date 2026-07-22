import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateMigrationSet } from "../../src/persistence/validation/migration-validator.js";

const directory = new URL("../../src/persistence/migrations/", import.meta.url);
const files = readdirSync(directory)
  .filter((name: string) => name.endsWith(".sql"))
  .sort()
  .map((name: string) => ({ name, sql: readFileSync(new URL(name, directory), "utf8") }));

describe("migration set", () => {
  it("contains all required tables and no unapproved destructive SQL", () => {
    const result = validateMigrationSet(files);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.filesChecked).toBe(6);
    expect(result.tables).toContain("audit_events");
  });
});
