import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both naming conventions for the anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    '';

// Validate environment variables and provide helpful error messages
const validateEnvVars = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        const errorMessage =
            '❌ Missing Supabase environment variables!\n\n' +
            'Required variables:\n' +
            '  - NEXT_PUBLIC_SUPABASE_URL\n' +
            '  - NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n' +
            'Local development: Add them to .env.local\n' +
            'Production: Add them to your deployment platform\'s environment variables\n\n' +
            'Get your credentials from: https://app.supabase.com → Project Settings → API';

        // Log error but don't throw during module initialization (allows build to complete)
        console.error(errorMessage);

        if (typeof window !== 'undefined') {
            console.error('The application will not function correctly without these variables.');
        }

        return false;
    }
    return true;
};

// Validate on module load (but don't throw to allow build to complete)
const isValid = validateEnvVars();

// Create Supabase client
// If env vars are missing, create client with placeholder strings (will fail at API call time)
export const supabase: SupabaseClient = createClient(
    supabaseUrl || (isValid ? '' : 'MISSING_NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey || (isValid ? '' : 'MISSING_NEXT_PUBLIC_SUPABASE_ANON_KEY')
);

export const isSupabaseConfigured = () => {
    return !!(supabaseUrl && supabaseAnonKey);
};
