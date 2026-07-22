CREATE TABLE IF NOT EXISTS entity_versions (
  entity_version_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type varchar(40) NOT NULL,
  logical_entity_id uuid NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  entity_snapshot jsonb NOT NULL,
  change_reason text NOT NULL,
  prior_version integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  UNIQUE(entity_type, logical_entity_id, version)
);
CREATE TABLE IF NOT EXISTS audit_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type varchar(40) NOT NULL,
  entity_id uuid NOT NULL,
  event_type varchar(64) NOT NULL,
  previous_state jsonb,
  new_state jsonb,
  actor text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  reason text,
  evidence_or_decision_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  correlation_id uuid
);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_events(entity_type, entity_id, occurred_at);
