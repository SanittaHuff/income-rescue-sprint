CREATE TABLE IF NOT EXISTS decisions_exceptions (
  decision_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type varchar(40) NOT NULL,
  authority varchar(40) NOT NULL,
  authority_reference text NOT NULL,
  decision_text text NOT NULL,
  effective_date date NOT NULL,
  verification_evidence text NOT NULL,
  status varchar(16) NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL
);
CREATE TABLE IF NOT EXISTS decision_affected_records (
  decision_id uuid NOT NULL REFERENCES decisions_exceptions(decision_id) ON DELETE RESTRICT,
  entity_type varchar(40) NOT NULL,
  entity_id uuid NOT NULL,
  application_status varchar(16) NOT NULL DEFAULT 'pending',
  applied_at timestamptz,
  applied_by text,
  PRIMARY KEY(decision_id, entity_type, entity_id)
);
