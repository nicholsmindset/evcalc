/**
 * A cookie-free Supabase client for use in generateStaticParams() and
 * other build-time contexts where Next.js request scope is unavailable.
 * Returns null when env vars are missing (local dev without Supabase configured).
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export function createStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient<Database>(url, key);
}
