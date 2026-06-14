-- Standalone exhibitions (upcoming shows without linked artworks yet)
CREATE TABLE IF NOT EXISTS standalone_exhibitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  venue TEXT NOT NULL,
  about TEXT NOT NULL DEFAULT '',
  curator TEXT NOT NULL DEFAULT '',
  dates TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  cover_image TEXT,
  exhibition_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  type TEXT NOT NULL DEFAULT 'solo',
  other_artists TEXT,
  highlight_on_homepage BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_standalone_exhibitions_status ON standalone_exhibitions(status);
CREATE INDEX IF NOT EXISTS idx_standalone_exhibitions_start_date ON standalone_exhibitions(start_date);
CREATE INDEX IF NOT EXISTS idx_standalone_exhibitions_highlight ON standalone_exhibitions(highlight_on_homepage);
CREATE INDEX IF NOT EXISTS idx_standalone_exhibitions_dates ON standalone_exhibitions(dates);

ALTER TABLE standalone_exhibitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published standalone exhibitions"
  ON standalone_exhibitions
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Allow authenticated insert on standalone exhibitions"
  ON standalone_exhibitions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on standalone exhibitions"
  ON standalone_exhibitions
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on standalone exhibitions"
  ON standalone_exhibitions
  FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_standalone_exhibitions_updated_at
  BEFORE UPDATE ON standalone_exhibitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
