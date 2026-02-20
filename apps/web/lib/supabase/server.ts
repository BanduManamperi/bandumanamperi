import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableDefaultKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

const validateEnvVars = () => {
    if (!supabaseUrl || !supabasePublishableDefaultKey) {
        const errorMessage =
            '❌ Missing Supabase environment variables!\n\n' +
            'Required variables:\n' +
            '  - NEXT_PUBLIC_SUPABASE_URL\n' +
            '  - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY\n\n' +
            'Add them to .env.local for local development\n' +
            'Or add them to your deployment platform\'s environment variables\n\n' +
            'Get your credentials from: https://app.supabase.com → Project Settings → API'

        console.error(errorMessage)
        throw new Error('Missing Supabase environment variables. Check server logs for details.')
    }
}

export async function createClient() {
    validateEnvVars()
    return createSupabaseClient(supabaseUrl!, supabasePublishableDefaultKey!)
}
