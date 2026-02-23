import { getTrendingProducts, getProductDetails, generateAffiliateLink } from '@/lib/aliexpress/client'
import { computeTrustScore } from '@/lib/trust/score'
import { getUsdToIlsRate, convertToIls } from '@/lib/fx/service'
import { upsertProduct, upsertOffer, upsertAffiliateLink } from '@/lib/db/queries'
import type { AEProduct } from '@/lib/aliexpress/mock'
import type { Product } from '@/lib/db/types'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 100)
}

function parseDeliveryDays(shipToDays?: string): { min: number; max: number } {
  if (!shipToDays) return { min: 15, max: 35 }
  const days = parseInt(shipToDays, 10)
  if (isNaN(days)) return { min: 15, max: 35 }
  return { min: Math.max(7, days - 5), max: days + 10 }
}

export async function syncProductFromAE(
  aeProduct: AEProduct,
  categoryId: string,
  trackingId?: string
): Promise<string | null> {
  try {
    const fxResult = await getUsdToIlsRate()
    const rate = fxResult.rate

    const price = parseFloat(aeProduct.app_sale_price ?? aeProduct.sale_price ?? '0')
    const shipping = 0 // AliExpress often shows free shipping
    const priceIls = convertToIls(price, rate)
    const shippingIls = convertToIls(shipping, rate)
    const totalIls = priceIls + shippingIls

    const rating = parseFloat(aeProduct.evaluate_rate ?? '0') || null
    const ordersCount = aeProduct.lastest_volume ?? 0
    const sellerScore = aeProduct.seller_feedback_rate
      ? parseFloat(aeProduct.seller_feedback_rate)
      : null

    const trustScore = computeTrustScore({
      rating,
      orders_count: ordersCount,
      seller_score: sellerScore,
    })

    const delivery = parseDeliveryDays(aeProduct.ship_to_days)

    // Build slug - use product_id to ensure uniqueness
    const baseSlug = slugify(aeProduct.product_title)
    const slug = `${baseSlug}-${aeProduct.product_id}`.slice(0, 120)

    const productData: Partial<Product> & { slug: string; title_raw: string } = {
      ae_product_id: aeProduct.product_id,
      title_raw: aeProduct.product_title,
      slug,
      category_id: categoryId,
      images: [
        aeProduct.product_main_image_url,
        ...(aeProduct.product_small_image_urls ?? []),
      ].filter(Boolean),
      rating,
      orders_count: ordersCount,
      seller_name: aeProduct.shop_id ?? null,
      seller_score: sellerScore,
      trust_score: trustScore,
      is_best_seller: ordersCount >= 1000,
      last_synced_at: new Date().toISOString(),
    }

    const product = await upsertProduct(productData)

    await upsertOffer({
      product_id: product.id,
      price,
      shipping_price: shipping,
      currency: aeProduct.app_sale_price_currency ?? 'USD',
      price_ils: priceIls,
      shipping_ils: shippingIls,
      total_ils: totalIls,
      delivery_min_days: delivery.min,
      delivery_max_days: delivery.max,
      is_free_shipping: shipping === 0,
      last_checked_at: new Date().toISOString(),
    })

    // Generate affiliate link
    const tid = trackingId ?? process.env.AE_TRACKING_ID ?? 'default'
    const affiliateUrl = await generateAffiliateLink(aeProduct.product_detail_url, tid)
    if (affiliateUrl) {
      await upsertAffiliateLink({
        product_id: product.id,
        tracking_id: tid,
        affiliate_url: affiliateUrl,
        last_generated_at: new Date().toISOString(),
      })
    }

    return product.id
  } catch (err) {
    console.error(`[Sync] Failed to sync product ${aeProduct.product_id}:`, err)
    return null
  }
}

export async function syncCategoryProducts(
  categoryId: string,
  aeCategoryId: string,
  trackingId?: string,
  page = 1
): Promise<{ synced: number; failed: number }> {
  let synced = 0
  let failed = 0

  const result = await getTrendingProducts(aeCategoryId, page)

  for (const product of result.products) {
    const id = await syncProductFromAE(product, categoryId, trackingId)
    if (id) synced++
    else failed++
  }

  return { synced, failed }
}
