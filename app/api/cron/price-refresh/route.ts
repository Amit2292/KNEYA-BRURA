import { NextRequest, NextResponse } from 'next/server'
import { validateCronSecret } from '@/lib/auth/admin'
import { startSyncJob, finishSyncJob, getTopClickedProducts, getProductById } from '@/lib/db/queries'
import { getProductDetails } from '@/lib/aliexpress/client'
import { getUsdToIlsRate, convertToIls } from '@/lib/fx/service'
import { upsertOffer } from '@/lib/db/queries'
import { computeTrustScore } from '@/lib/trust/score'
import { supabaseAdmin } from '@/lib/db/client'

export async function POST(request: NextRequest) {
  if (!validateCronSecret(request.headers.get('x-cron-secret'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobId = await startSyncJob('price-refresh').catch(() => null)

  let refreshed = 0
  let failed = 0

  try {
    const topProducts = await getTopClickedProducts(7, 30)

    if (topProducts.length === 0) {
      if (jobId) await finishSyncJob(jobId, 'success', { refreshed: 0, message: 'No clicked products' })
      return NextResponse.json({ ok: true, refreshed: 0, message: 'No clicked products' })
    }

    const fxResult = await getUsdToIlsRate()
    const rate = fxResult.rate

    for (const { product_id } of topProducts) {
      try {
        const product = await getProductById(product_id)
        if (!product?.ae_product_id) continue

        const details = await getProductDetails(product.ae_product_id)
        if (!details) continue

        const price = parseFloat(details.app_sale_price ?? details.sale_price ?? '0')
        const shipping = 0
        const priceIls = convertToIls(price, rate)
        const shippingIls = convertToIls(shipping, rate)
        const totalIls = priceIls + shippingIls

        await upsertOffer({
          product_id,
          price,
          shipping_price: shipping,
          currency: details.app_sale_price_currency ?? 'USD',
          price_ils: priceIls,
          shipping_ils: shippingIls,
          total_ils: totalIls,
          delivery_min_days: 15,
          delivery_max_days: 35,
          is_free_shipping: shipping === 0,
          last_checked_at: new Date().toISOString(),
        })

        // Update trust score
        const rating = parseFloat(details.evaluate_rate ?? '0') || null
        const ordersCount = details.lastest_volume ?? 0
        const sellerScore = details.seller_feedback_rate ? parseFloat(details.seller_feedback_rate) : null
        const trustScore = computeTrustScore({ rating, orders_count: ordersCount, seller_score: sellerScore })

        await supabaseAdmin.from('products').update({
          rating: rating as number | null,
          orders_count: ordersCount,
          seller_score: sellerScore as number | null,
          trust_score: trustScore,
          is_best_seller: ordersCount >= 1000,
          last_synced_at: new Date().toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any).eq('id', product_id)

        refreshed++
      } catch (err) {
        console.error(`[price-refresh] Failed for ${product_id}:`, err)
        failed++
      }
    }

    if (jobId) await finishSyncJob(jobId, 'success', { refreshed, failed })
    return NextResponse.json({ ok: true, refreshed, failed })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (jobId) await finishSyncJob(jobId, 'failed', {}, message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export { POST as GET }
