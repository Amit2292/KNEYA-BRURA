import { NextRequest, NextResponse } from 'next/server'
import { validateCronSecret } from '@/lib/auth/admin'
import { startSyncJob, finishSyncJob, getProductsNeedingLocalization, updateProductLocalization } from '@/lib/db/queries'
import { localizeProduct } from '@/lib/localize/he'
import { supabaseAdmin } from '@/lib/db/client'

export async function POST(request: NextRequest) {
  if (!validateCronSecret(request.headers.get('x-cron-secret'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobId = await startSyncJob('localize').catch(() => null)

  let localized = 0
  let failed = 0

  try {
    const products = await getProductsNeedingLocalization(20)

    if (products.length === 0) {
      if (jobId) await finishSyncJob(jobId, 'success', { localized: 0, message: 'Nothing to localize' })
      return NextResponse.json({ ok: true, localized: 0 })
    }

    for (const product of products) {
      try {
        // Get category name for context
        let categoryName: string | undefined
        if (product.category_id) {
          const { data: catRaw } = await supabaseAdmin
            .from('categories')
            .select('name_he')
            .eq('id', product.category_id)
            .single()
          const cat = catRaw as { name_he: string } | null
          categoryName = cat?.name_he
        }

        const content = await localizeProduct(product, categoryName)

        await updateProductLocalization(product.id, {
          title_he: content.title_he,
          short_summary_he: content.short_summary_he,
          pros: content.pros,
          cons: content.cons,
        })

        localized++
      } catch (err) {
        console.error(`[localize] Failed for ${product.id}:`, err)
        failed++
      }

      // Rate limit OpenAI requests
      if (process.env.OPENAI_API_KEY) {
        await new Promise((r) => setTimeout(r, 500))
      }
    }

    if (jobId) await finishSyncJob(jobId, 'success', { localized, failed })
    return NextResponse.json({ ok: true, localized, failed })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (jobId) await finishSyncJob(jobId, 'failed', {}, message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export { POST as GET }
