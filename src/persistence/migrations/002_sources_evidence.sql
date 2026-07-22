CREATE TABLE IF NOT EXISTS source_records (
  source_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type varchar(40) NOT NULL,
  title text,
  original_uri text,
  checksum varchar(128),
  captured_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  archived_at timestamptz,
  CONSTRAINT source_reference_present CHECK (title IS NOT NULL OR original_uri IS NOT NULL OR checksum IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_source_records_checksum ON source_records(checksum) WHERE checksum IS NOT NULL;

CREATE TABLE IF NOT EXISTS evidence_items (
  evidence_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES source_records(source_id) ON DELETE RESTRICT,
  source_location text NOT NULL CHECK (btrim(source_location) <> ''),
  exact_text_or_fact text NOT NULL CHECK (btrim(exact_text_or_fact) <> ''),
  evidence_type varchar(40) NOT NULL,
  confidence varchar(16) NOT NULL CHECK (confidence IN ('confirmed','high','medium','low','unknown')),
  verification_status varchar(24) NOT NULL CHECK (verification_status IN ('captured','needs_verification','verified','superseded','rejected')),
  restrictions jsonb NOT NULL DEFAULT '[]'::jsonb,
  replacement_evidence_id uuid REFERENCES evidence_items(evidence_id) ON DELETE RESTRICT,
  rejection_reason text,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  last_updated_by text NOT NULL,
  archived_at timestamptz,
  CONSTRAINT superseded_requires_replacement CHECK (verification_status <> 'superseded' OR replacement_evidence_id IS NOT NULL),
  CONSTRAINT rejected_requires_reason CHECK (verification_status <> 'rejected' OR rejection_reason IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_evidence_source_id ON evidence_items(source_id);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON evidence_items(verification_status);
CREATE INDEX IF NOT EXISTS idx_evidence_active_verified ON evidence_items(evidence_id) WHERE verification_status='verified' AND archived_at IS NULL;
