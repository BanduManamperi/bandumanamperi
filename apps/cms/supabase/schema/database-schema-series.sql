-- Series, editions and versions
--
-- Run once in the Supabase SQL Editor. Safe to re-run: every step checks
-- whether it has already been applied.
--
-- What it does
-- 1. Adds a `series` table: a named group of works with its own description
--    and cover, which can exist before any artwork is uploaded into it.
-- 2. Links each artwork to a series (series_id), with an optional number
--    within it (series_number).
-- 3. Lets an artwork point at an original work as an edition (numbered copy)
--    or a version (another take), with the edition size kept on the original.
-- 4. Keeps the old text column artworks.series in step with series_id in both
--    directions, so the website, studio and any not-yet-updated CMS keep
--    working. It can be dropped once nothing reads it.
-- 5. Turns today's series names into series records and links their works.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Series
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (btrim(name) <> ''),
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,            -- public URL, like artworks.thumbnail_path
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One series per name, ignoring case and surrounding spaces
CREATE UNIQUE INDEX IF NOT EXISTS idx_series_name_unique ON series (lower(btrim(name)));
CREATE INDEX IF NOT EXISTS idx_series_status ON series (status);

ALTER TABLE series ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to published series" ON series;
CREATE POLICY "Allow public read access to published series"
  ON series FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Allow authenticated read on series" ON series;
CREATE POLICY "Allow authenticated read on series"
  ON series FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert on series" ON series;
CREATE POLICY "Allow authenticated insert on series"
  ON series FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update on series" ON series;
CREATE POLICY "Allow authenticated update on series"
  ON series FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete on series" ON series;
CREATE POLICY "Allow authenticated delete on series"
  ON series FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_series_updated_at ON series;
CREATE TRIGGER update_series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- "Wings of Certainty" -> "wings-of-certainty"
CREATE OR REPLACE FUNCTION series_slugify(value TEXT)
RETURNS TEXT AS $$
  SELECT coalesce(
    nullif(btrim(regexp_replace(lower(btrim(value)), '[^a-z0-9]+', '-', 'g'), '-'), ''),
    'series'
  );
$$ LANGUAGE sql IMMUTABLE;

-- A slug no other series uses: "fish", then "fish-2", "fish-3", ...
CREATE OR REPLACE FUNCTION series_unique_slug(value TEXT)
RETURNS TEXT AS $$
DECLARE
  base TEXT := series_slugify(value);
  candidate TEXT := base;
  n INTEGER := 1;
BEGIN
  WHILE EXISTS (SELECT 1 FROM series WHERE slug = candidate) LOOP
    n := n + 1;
    candidate := base || '-' || n;
  END LOOP;
  RETURN candidate;
END;
$$ LANGUAGE plpgsql;

-- Find a series by name (ignoring case and spaces), creating it if missing.
CREATE OR REPLACE FUNCTION series_find_or_create(series_name TEXT)
RETURNS UUID AS $$
DECLARE
  found UUID;
BEGIN
  IF nullif(btrim(series_name), '') IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT id INTO found FROM series WHERE lower(btrim(name)) = lower(btrim(series_name));
  IF found IS NULL THEN
    INSERT INTO series (name, slug)
    VALUES (btrim(series_name), series_unique_slug(series_name))
    RETURNING id INTO found;
  END IF;
  RETURN found;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 2 and 3. Artwork columns
-- ---------------------------------------------------------------------------

ALTER TABLE artworks ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES series(id) ON DELETE SET NULL;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS series_number INTEGER;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS parent_artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS relation_type TEXT;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS relation_number INTEGER;
-- Kept on the original work: how many editions exist in total ("of 10")
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS edition_size INTEGER;
-- The camera file name the image was uploaded as ("IMG_8471"), kept as a reference
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS source_filename TEXT;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artworks_relation_type_check') THEN
    ALTER TABLE artworks ADD CONSTRAINT artworks_relation_type_check
      CHECK (relation_type IS NULL OR relation_type IN ('edition', 'version'));
  END IF;

  -- A link to an original and its type always come together
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artworks_relation_pair_check') THEN
    ALTER TABLE artworks ADD CONSTRAINT artworks_relation_pair_check
      CHECK ((parent_artwork_id IS NULL) = (relation_type IS NULL));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artworks_not_own_parent_check') THEN
    ALTER TABLE artworks ADD CONSTRAINT artworks_not_own_parent_check
      CHECK (parent_artwork_id IS NULL OR parent_artwork_id <> id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artworks_positive_numbers_check') THEN
    ALTER TABLE artworks ADD CONSTRAINT artworks_positive_numbers_check
      CHECK (
        (series_number IS NULL OR series_number > 0) AND
        (relation_number IS NULL OR relation_number > 0) AND
        (edition_size IS NULL OR edition_size > 0)
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_artworks_series_id ON artworks (series_id);
CREATE INDEX IF NOT EXISTS idx_artworks_parent ON artworks (parent_artwork_id);
-- No two works share a number within the same series, or the same edition/version number of one original
CREATE UNIQUE INDEX IF NOT EXISTS idx_artworks_series_number_unique
  ON artworks (series_id, series_number) WHERE series_id IS NOT NULL AND series_number IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_artworks_relation_number_unique
  ON artworks (parent_artwork_id, relation_type, relation_number)
  WHERE parent_artwork_id IS NOT NULL AND relation_number IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 4. Keep artworks.series (text) and artworks.series_id in step
-- ---------------------------------------------------------------------------
--
-- Whichever one a writer changes wins:
-- - new code sets series_id   -> the text is filled in from the series name
-- - old code sets series text -> the series is found or created, and linked
-- Clearing either one clears both.

CREATE OR REPLACE FUNCTION artworks_sync_series()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.series_id IS NOT NULL THEN
      NEW.series := (SELECT name FROM series WHERE id = NEW.series_id);
    ELSE
      NEW.series_id := series_find_or_create(NEW.series);
      NEW.series := (SELECT name FROM series WHERE id = NEW.series_id);
    END IF;
  ELSIF NEW.series_id IS DISTINCT FROM OLD.series_id THEN
    NEW.series := (SELECT name FROM series WHERE id = NEW.series_id);
  ELSIF NEW.series IS DISTINCT FROM OLD.series THEN
    NEW.series_id := series_find_or_create(NEW.series);
    NEW.series := (SELECT name FROM series WHERE id = NEW.series_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS artworks_sync_series ON artworks;
CREATE TRIGGER artworks_sync_series
  BEFORE INSERT OR UPDATE ON artworks
  FOR EACH ROW
  EXECUTE FUNCTION artworks_sync_series();

-- Renaming a series updates the text on its works
CREATE OR REPLACE FUNCTION series_propagate_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.name IS DISTINCT FROM OLD.name THEN
    UPDATE artworks SET series = NEW.name WHERE series_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS series_propagate_name ON series;
CREATE TRIGGER series_propagate_name
  AFTER UPDATE OF name ON series
  FOR EACH ROW
  EXECUTE FUNCTION series_propagate_name();

-- ---------------------------------------------------------------------------
-- 5. Bring existing data across
-- ---------------------------------------------------------------------------

-- A series record for every name in use, then link the works. Where a name is
-- spelled more than one way ("FISH", "Fish "), keep the most used spelling,
-- and on a tie the one entered first.
DO $$
DECLARE
  spelling RECORD;
BEGIN
  FOR spelling IN
    SELECT DISTINCT ON (lower(name)) name
    FROM (
      SELECT btrim(series) AS name, count(*) AS uses, min(created_at) AS first_used
      FROM artworks
      WHERE nullif(btrim(series), '') IS NOT NULL
      GROUP BY btrim(series)
    ) AS spellings
    ORDER BY lower(name), uses DESC, first_used ASC
  LOOP
    PERFORM series_find_or_create(spelling.name);
  END LOOP;
END $$;

UPDATE artworks a
SET series_id = s.id
FROM series s
WHERE a.series_id IS NULL
  AND nullif(btrim(a.series), '') IS NOT NULL
  AND lower(btrim(a.series)) = lower(btrim(s.name));

-- Keep the camera file name of works titled only by it
UPDATE artworks
SET source_filename = btrim(title)
WHERE source_filename IS NULL
  AND title ~* '^\s*IMG[_ -]?\d*\s*$';

COMMIT;

-- ---------------------------------------------------------------------------
-- To undo (run manually if ever needed; the series text column is untouched)
-- ---------------------------------------------------------------------------
-- BEGIN;
-- DROP TRIGGER IF EXISTS artworks_sync_series ON artworks;
-- DROP FUNCTION IF EXISTS artworks_sync_series();
-- DROP FUNCTION IF EXISTS series_propagate_name() CASCADE;
-- ALTER TABLE artworks
--   DROP COLUMN IF EXISTS series_id, DROP COLUMN IF EXISTS series_number,
--   DROP COLUMN IF EXISTS parent_artwork_id, DROP COLUMN IF EXISTS relation_type,
--   DROP COLUMN IF EXISTS relation_number, DROP COLUMN IF EXISTS edition_size,
--   DROP COLUMN IF EXISTS source_filename;
-- DROP TABLE IF EXISTS series;
-- DROP FUNCTION IF EXISTS series_find_or_create(TEXT), series_unique_slug(TEXT), series_slugify(TEXT);
-- COMMIT;
