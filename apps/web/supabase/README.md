# Supabase Setup

This directory contains SQL migration files for setting up the Supabase database.

## Setup Instructions

1. **Create a Supabase project** at [https://app.supabase.com](https://app.supabase.com)

2. **Run the migration**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `migrations/001_create_artworks_table.sql`
   - Execute the SQL

3. **Set up Storage**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `artworks`
   - Configure public access or RLS policies based on your needs:
     - For public read access: Set the bucket to public
     - For authenticated access: Create RLS policies

4. **Get your API credentials**:
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key
   - Add them to your `.env.local` file:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

## Storage Bucket Setup

After creating the `artworks` bucket, you may want to set up policies:

### Public Read Access (if you want public access to images)
```sql
-- Allow public read access to the artworks bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'artworks');
```

### Authenticated Upload Only
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'artworks' AND
    auth.role() = 'authenticated'
  );
```

Adjust these policies based on your security requirements.



