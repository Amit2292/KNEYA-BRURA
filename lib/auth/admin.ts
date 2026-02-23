import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS ?? ''
  return emails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createServerClient<any>(
    process.env.SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.SUPABASE_ANON_KEY ?? 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any)
            )
          } catch {
            // Ignore in Server Components
          }
        },
      },
    }
  )
}

export async function getSession() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  const email = session.user.email?.toLowerCase() ?? ''
  const adminEmails = getAdminEmails()

  if (!adminEmails.includes(email)) {
    redirect('/admin/login?error=unauthorized')
  }

  return { userId: session.user.id, email }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession()
    if (!session) return false

    const email = session.user.email?.toLowerCase() ?? ''
    const adminEmails = getAdminEmails()
    return adminEmails.includes(email)
  } catch {
    return false
  }
}

export function validateCronSecret(headerValue: string | null): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return headerValue === secret
}
