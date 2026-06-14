-- Add structured schedule fields to standalone exhibitions
ALTER TABLE standalone_exhibitions
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS start_time TIME,
  ADD COLUMN IF NOT EXISTS end_time TIME;

ALTER TABLE standalone_exhibitions
  ALTER COLUMN dates DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_standalone_exhibitions_start_date
  ON standalone_exhibitions(start_date);
