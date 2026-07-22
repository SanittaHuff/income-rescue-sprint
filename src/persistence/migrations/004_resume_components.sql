CREATE TABLE IF NOT EXISTS resume_components (
  component_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logical_component_id uuid NOT NULL,
  component_type varchar(32) NOT NULL,
  text_content text NOT NULL CHECK (btrim(text_content) <> ''),
  certification_status varchar(24) NOT NULL DEFAULT 'draft',
  approved_lanes jsonb NOT NULL DEFAULT '[]'::jsonb,
  restrictions jsonb NOT NULL DEFAULT '[]'::jsonb,
  truth_gate_status varchar(16) NOT NULL DEFAULT 'not_run',
  qa_status varchar(16) NOT NULL DEFAULT 'not_run',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  prior_version_id uuid REFERENCES resume_components(component_id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  last_updated_by text NOT NULL,
  archived_at timestamptz,
  UNIQUE(logical_component_id, version),
  CONSTRAINT certified_requires_gates CHECK (certification_status <> 'certified' OR (truth_gate_status='passed' AND qa_status='passed'))
);
CREATE TABLE IF NOT EXISTS resume_component_evidence (
  component_id uuid NOT NULL REFERENCES resume_components(component_id) ON DELETE RESTRICT,
  evidence_id uuid NOT NULL REFERENCES evidence_items(evidence_id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  PRIMARY KEY(component_id, evidence_id)
);
CREATE TABLE IF NOT EXISTS resume_component_experience (
  component_id uuid NOT NULL REFERENCES resume_components(component_id) ON DELETE RESTRICT,
  experience_id uuid NOT NULL REFERENCES experience_records(experience_id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  PRIMARY KEY(component_id, experience_id)
);
