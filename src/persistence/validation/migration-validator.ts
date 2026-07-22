export interface MigrationValidationResult {
  valid: boolean;
  filesChecked: number;
  tables: string[];
  indexes: string[];
  errors: string[];
}

const tablePattern = /CREATE TABLE IF NOT EXISTS\s+([a-z_]+)/gi;
const indexPattern = /CREATE (?:UNIQUE )?INDEX IF NOT EXISTS\s+([a-z_]+)/gi;

export const validateMigrationSet = (files: Array<{ name: string; sql: string }>): MigrationValidationResult => {
  const errors: string[] = [];
  const tables: string[] = [];
  const indexes: string[] = [];

  for (const file of files) {
    if (!file.sql.trim().endsWith(";")) errors.push(`${file.name}: SQL must end with a semicolon.`);
    if (/DROP TABLE|TRUNCATE TABLE|CASCADE/i.test(file.sql)) errors.push(`${file.name}: destructive SQL requires separate approval.`);
    if (!/CREATE /i.test(file.sql)) errors.push(`${file.name}: no creation statement found.`);
    for (const match of file.sql.matchAll(tablePattern)) if (match[1]) tables.push(match[1]);
    for (const match of file.sql.matchAll(indexPattern)) if (match[1]) indexes.push(match[1]);
  }

  const requiredTables = [
    "source_records", "evidence_items", "experience_records", "experience_record_evidence",
    "resume_components", "resume_component_evidence", "resume_component_experience",
    "decisions_exceptions", "decision_affected_records", "entity_versions", "audit_events",
  ];
  for (const table of requiredTables) if (!tables.includes(table)) errors.push(`Required table missing: ${table}`);

  return { valid: errors.length === 0, filesChecked: files.length, tables: [...new Set(tables)], indexes: [...new Set(indexes)], errors };
};
