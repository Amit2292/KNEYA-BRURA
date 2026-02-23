import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth/admin'
import { supabaseAdmin } from '@/lib/db/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const allowed = ['title_he', 'short_summary_he', 'pros', 'cons', 'is_featured', 'is_daily_deal', 'is_best_seller']
  const updates: Record<string, unknown> = {}

  for (const key of allowed) {
    if (key in body) {
      updates[key] = body[key]
    }
  }

  const { error } = await supabaseAdmin
    .from('products')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(updates as any)
    .eq('id', params.productId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
