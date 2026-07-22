#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL, for example postgres://income_rescue:local_test_only@localhost:5432/income_rescue_test}"
command -v psql >/dev/null 2>&1 || { echo "psql is required but is not installed." >&2; exit 127; }

for migration in src/persistence/migrations/*.sql; do
  echo "Applying ${migration}"
  psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 --single-transaction -f "${migration}"
done

required_tables=(source_records evidence_items experience_records resume_components decisions_exceptions entity_versions audit_events)
for table in "${required_tables[@]}"; do
  present=$(psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -Atc "SELECT to_regclass('public.${table}') IS NOT NULL;")
  [[ "${present}" == "t" ]] || { echo "Missing required table: ${table}" >&2; exit 1; }
done

psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -Atc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
echo "POSTGRES_MIGRATIONS_COMPLETE"
