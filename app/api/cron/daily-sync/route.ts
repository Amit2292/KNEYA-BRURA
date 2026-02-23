import { NextRequest, NextResponse } from 'next/server'
import { validateCronSecret } from '@/lib/auth/admin'
import { startSyncJob, finishSyncJob } from '@/lib/db/queries'
import { syncCategoryProducts } from '@/lib/sync/products'
import { refreshDailyRate } from '@/lib/fx/service'
import { CATEGORY_CONFIG } from '@/config/categories'
import { supabaseAdmin } from '@/lib/db/client'

export async function POST(request: NextRequest) {
  if (!validateCronSecret(request.headers.get('x-cron-secret'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobId = await startSyncJob('daily-sync', {
    categories: CATEGORY_CONFIG.map((c) => c.slug),
  }).catch(() => null)

  let totalSynced = 0
  let totalFailed = 0
  const errors: string[] = []

  try {
    // Refresh FX rate first
    await refreshDailyRate()

    // Sync each configured category
    for (const catConfig of CATEGORY_CONFIG) {
      if (!catConfig.ae_category_id) {
        console.log(`[daily-sync] Skipping ${catConfig.slug} - no ae_category_id`)
        continue
      }

      // Get DB category ID by slug
      const { data: dbCatRaw } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', catConfig.slug)
        .single()

      const dbCat = dbCatRaw as { id: string } | null

      if (!dbCat) {
        errors.push(`Category not found in DB: ${catConfig.slug}`)
        continue
      }

      const result = await syncCategoryProducts(
        dbCat.id,
        catConfig.ae_category_id,
        process.env.AE_TRACKING_ID
      ).catch((err) => {
        errors.push(`Failed to sync ${catConfig.slug}: ${err.message}`)
        return { synced: 0, failed: 0 }
      })

      totalSynced += result.synced
      totalFailed += result.failed

      // Also sync subcategories
      for (const sub of catConfig.subcategories) {
        if (!sub.ae_category_id) continue

        const { data: dbSubRaw } = await supabaseAdmin
          .from('categories')
          .select('id')
          .eq('slug', sub.slug)
          .single()

        const dbSub = dbSubRaw as { id: string } | null
        if (!dbSub) continue

        const subResult = await syncCategoryProducts(
          dbSub.id,
          sub.ae_category_id,
          process.env.AE_TRACKING_ID
        ).catch((err) => {
          errors.push(`Failed to sync ${sub.slug}: ${err.message}`)
          return { synced: 0, failed: 0 }
        })

        totalSynced += subResult.synced
        totalFailed += subResult.failed
      }
    }

    if (jobId) {
      await finishSyncJob(jobId, 'success', {
        synced: totalSynced,
        failed: totalFailed,
        errors,
      })
    }

    return NextResponse.json({
      ok: true,
      synced: totalSynced,
      failed: totalFailed,
      errors,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (jobId) {
      await finishSyncJob(jobId, 'failed', {}, message)
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Also support GET for Vercel Cron
export { POST as GET }
