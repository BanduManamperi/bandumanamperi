-- CV Entries table
CREATE TABLE IF NOT EXISTS cv_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  year text NOT NULL DEFAULT '',
  title text NOT NULL,
  subtitle text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Index for querying by section
CREATE INDEX IF NOT EXISTS idx_cv_entries_section ON cv_entries (section, sort_order ASC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_cv_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cv_entries_updated_at
  BEFORE UPDATE ON cv_entries
  FOR EACH ROW EXECUTE FUNCTION update_cv_entries_updated_at();

-- RLS
ALTER TABLE cv_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cv_entries_select_public" ON cv_entries
  FOR SELECT USING (true);

CREATE POLICY "cv_entries_insert_authenticated" ON cv_entries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "cv_entries_update_authenticated" ON cv_entries
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "cv_entries_delete_authenticated" ON cv_entries
  FOR DELETE USING (auth.role() = 'authenticated');
