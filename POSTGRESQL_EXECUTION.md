# PostgreSQL Execution

PostgreSQL is the production-grade relational database selected for the Resume Product. The migration files create the permanent tables, relationships, indexes, and safety constraints used to preserve evidence, experience records, resume components, decisions, versions, and audit history.

## What structural validation proves

Structural validation confirms that the SQL files exist, are ordered, contain the required tables and indexes, and avoid unapproved destructive commands. It does not prove that a real PostgreSQL server accepts every statement or that the resulting constraints behave correctly at runtime.

## What actual execution proves

Actual execution requires a running PostgreSQL server and the `psql` client. The migration runner applies each SQL file to a real test database with stop-on-error enabled. A successful run proves that PostgreSQL accepts the schema. Follow-up integration tests must then insert and query representative records to verify relationships and constraints.

## Current runtime limitation

The current build container does not include PostgreSQL, `psql`, Docker, or Podman. An attempted package installation did not complete within the execution window. Therefore, the project may claim migration structure validation, but not real PostgreSQL execution.

## Ready-to-run path

1. Start PostgreSQL with `docker compose -f docker-compose.postgres.yml up -d` in a Docker-capable environment.
2. Set `DATABASE_URL=postgres://income_rescue:local_test_only@localhost:5432/income_rescue_test`.
3. Run `scripts/run-postgres-migrations.sh`.
4. Run database integration tests and preserve the output as release evidence.
