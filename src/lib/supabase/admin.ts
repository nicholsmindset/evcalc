import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Supabase admin client with service role key.
 * Bypasses Row Level Security — use only in:
 * - Supabase Edge Functions
 * - Server-side operations (API routes, server actions)
 * NEVER expose to the browser.
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
