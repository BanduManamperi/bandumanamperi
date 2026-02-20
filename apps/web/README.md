This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- A Supabase project ([create one here](https://app.supabase.com))

### Setup

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration (for SEO and metadata)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Contact Form (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=Bandu Manamperi Website <onboarding@resend.dev>
# CONTACT_EMAIL=bandumanamperi@yahoo.com   # optional; defaults to this address
```

You can find the Supabase values in your Supabase project settings under API. The `NEXT_PUBLIC_SITE_URL` should be set to your production domain when deploying (e.g., `https://yourdomain.com`).

**Contact form:** Sign up at [resend.com](https://resend.com), create an API key, and set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. Messages are sent to **bandumanamperi@yahoo.com** by default (override with `CONTACT_EMAIL` if needed). Use a verified domain in `RESEND_FROM_EMAIL` for production (e.g. `contact@yourdomain.com`).

3. Set up the Supabase database:

Create a table named `artworks` with the following schema:

```sql
CREATE TABLE artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  year TEXT,
  description TEXT,
  link TEXT,
  featured BOOLEAN DEFAULT false,
  category TEXT,
  medium TEXT,
  media JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Set up Supabase Storage:

- Create a storage bucket named `artworks`
- Configure public access or RLS policies as needed for your use case

5. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Environment Variables for Deployment

**IMPORTANT**: Before deploying, you must add your Supabase environment variables to your deployment platform:

#### For Vercel:
1. Go to your project settings on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., `https://yourdomain.com`)

4. Make sure to add them for all environments (Production, Preview, Development)
5. Redeploy your application after adding the variables

#### For Other Platforms (Netlify, AWS Amplify, etc.):
- Add the same environment variables in your platform's environment variable settings
- The variable names must start with `NEXT_PUBLIC_` to be accessible in the browser

#### Getting Your Supabase Credentials:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Note**: Without these environment variables, your deployed application will not be able to connect to Supabase and will show errors.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
