import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ImageGallery } from '@/components/product/ImageGallery'
import { PriceBlock } from '@/components/product/PriceBlock'
import { FeatureBadges } from '@/components/product/FeatureBadges'
import { PriceHistoryChart } from '@/components/product/PriceHistoryChart'
import { SimilarProducts } from '@/components/product/SimilarProducts'
import { AffiliateCTA } from '@/components/product/AffiliateCTA'
import { getProductBySlug } from '@/lib/db/queries'
import { getTrustResult } from '@/lib/trust/score'
import { buildProductMetadata, buildProductJsonLd } from '@/lib/seo/metadata'
import { SITE_CONFIG } from '@/config/site'

interface Props {
  params: Promise<{ productSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params
  const product = await getProductBySlug(productSlug).catch(() => null)
  if (!product) return {}
  const offer = product.offers?.[0]
  return buildProductMetadata(product, offer)
}

export default async function ProductPage({ params }: Props) {
  const { productSlug } = await params
  const product = await getProductBySlug(productSlug).catch(() => null)
  if (!product) notFound()

  const offer = product.offers?.[0]
  const affiliateLink = product.affiliate_links?.[0]
  const hasAffiliateLink = Boolean(affiliateLink?.affiliate_url)
  const title = product.title_he ?? product.title_raw

  const trust = getTrustResult({
    rating: product.rating,
    orders_count: product.orders_count,
    seller_score: product.seller_score,
  })

  const jsonLd = buildProductJsonLd(product, offer)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl mx-auto" dir="rtl">
        {/* Hot deal badge */}
        {product.is_daily_deal && (
          <div className="px-4 pt-2">
            <span className="inline-flex items-center gap-1 text-xs bg-red-600 text-white px-3 py-1 rounded-full font-bold animate-badge-pulse">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              דיל חם!
            </span>
          </div>
        )}

        {/* Image gallery */}
        <div className="px-4 pt-2">
          <ImageGallery images={product.images ?? []} alt={title} />
        </div>

        {/* Product info */}
        <div className="px-4 pt-4 space-y-4">
          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-bold text-gray-900">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">
                (+{product.orders_count.toLocaleString('he-IL')} ביקורות)
              </span>
            </div>
          )}

          {/* Price */}
          {offer && <PriceBlock offer={offer} />}

          {/* Feature badges */}
          <FeatureBadges
            isFreeShipping={offer?.is_free_shipping ?? false}
            isRecommendedSeller={trust.isRecommended}
            hasCoupon={product.is_daily_deal}
          />

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Deal overview */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">סקירת הדיל</h2>
            {product.short_summary_he ? (
              <p className="text-sm text-gray-600 leading-relaxed">{product.short_summary_he}</p>
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">
                {trust.label}! חוויית סאונד מושלמת, {offer?.delivery_min_days && offer?.delivery_max_days ? `${offer.delivery_min_days}-${offer.delivery_max_days} ימי משלוח` : 'משלוח מהיר'} וטכנולוגיית Speak-to-Chat חכמה. המבצע מוגבל בזמן ובמלאי.
              </p>
            )}
          </section>

          {/* Price history chart */}
          <PriceHistoryChart currentPrice={offer?.total_ils ?? null} />

          {/* Similar products */}
          <Suspense fallback={<div className="h-48" />}>
            <SimilarProducts
              categoryId={product.category_id}
              excludeProductId={product.id}
            />
          </Suspense>

          {/* Affiliate disclosure */}
          <p className="text-xs text-gray-400 text-center pb-4">
            {SITE_CONFIG.affiliateDisclosure}
          </p>
        </div>
      </div>

      {/* Sticky CTA */}
      <AffiliateCTA
        productSlug={productSlug}
        hasAffiliateLink={hasAffiliateLink}
        sticky={true}
      />
    </>
  )
}
