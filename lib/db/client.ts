import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-service-key'

// Public client (respects RLS)
// We use `any` generic here because Supabase v2 requires its own internal schema type
// format. Application-level types are defined in lib/db/types.ts and used at query sites.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey)

// Service role client (bypasses RLS - server-side only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = createClient<any>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL
  const anon = process.env.SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  return Boolean(
    url && !url.includes('placeholder') &&
    anon && !anon.includes('placeholder') &&
    service && !service.includes('placeholder')
  )
}
