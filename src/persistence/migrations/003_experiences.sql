CREATE TABLE IF NOT EXISTS experience_records (
  experience_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer text NOT NULL,
  via_vendor text,
  canonical_title text NOT NULL,
  contract_status varchar(24) NOT NULL,
  location text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  verified_responsibilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  verified_tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  verified_outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  hold_or_verify_flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  lifecycle_status varchar(24) NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  last_updated_by text NOT NULL,
  archived_at timestamptz,
  CONSTRAINT valid_experience_dates CHECK (end_date IS NULL OR end_date >= start_date)
);
CREATE TABLE IF NOT EXISTS experience_record_evidence (
  experience_id uuid NOT NULL REFERENCES experience_records(experience_id) ON DELETE RESTRICT,
  evidence_id uuid NOT NULL REFERENCES evidence_items(evidence_id) ON DELETE RESTRICT,
  relation_type varchar(32) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  PRIMARY KEY (experience_id, evidence_id, relation_type)
);
