import { createClient } from '@supabase/supabase-js';

// IMPORTANT: This client bypasses RLS and should ONLY be used
// in server-side code for admin operations
// NEVER import this in client components or expose to the browser

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

export const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
