import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ImageGallery } from '@/components/product/ImageGallery'
import { PriceBlock } from '@/components/product/PriceBlock'
import { DeliveryBlock } from '@/components/product/DeliveryBlock'
import { TrustBadge, FreeShippingBadge } from '@/components/product/TrustBadge'
import { ProsCons } from '@/components/product/ProsCons'
import { AffiliateCTA } from '@/components/product/AffiliateCTA'
import { getProductBySlug, getCategoryById } from '@/lib/db/queries'
import { buildProductMetadata, buildProductJsonLd } from '@/lib/seo/metadata'
import { SITE_CONFIG } from '@/config/site'

interface Props {
  params: { productSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.productSlug).catch(() => null)
  if (!product) return {}
  const offer = product.offers?.[0]
  return buildProductMetadata(product, offer)
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.productSlug).catch(() => null)
  if (!product) notFound()

  const offer = product.offers?.[0]
  const affiliateLink = product.affiliate_links?.[0]
  const hasAffiliateLink = Boolean(affiliateLink?.affiliate_url)

  // Load category for breadcrumb
  const category = product.category_id
    ? await getCategoryById(product.category_id).catch(() => null)
    : null

  const jsonLd = buildProductJsonLd(product, offer)

  const title = product.title_he ?? product.title_raw

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-600">בית</Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/c/${category.slug}`} className="hover:text-brand-600">{category.name_he}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Gallery */}
          <div>
            <ImageGallery images={product.images ?? []} alt={title} />
          </div>

          {/* Right: Product info */}
          <div className="space-y-5">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>

            {/* Trust + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <TrustBadge
                input={{
                  rating: product.rating,
                  orders_count: product.orders_count,
                  seller_score: product.seller_score,
                }}
                showScore={true}
              />
              {offer?.is_free_shipping && <FreeShippingBadge show={true} />}
              {product.is_best_seller && (
                <span className="text-xs px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-700 font-medium">
                  🔥 נמכר הרבה
                </span>
              )}
              {product.rating && (
                <span className="text-sm text-gray-600">
                  ★ {product.rating.toFixed(1)} ({product.orders_count.toLocaleString('he-IL')} הזמנות)
                </span>
              )}
            </div>

            {/* Summary */}
            {product.short_summary_he && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900 leading-relaxed">{product.short_summary_he}</p>
              </div>
            )}

            {/* Price block */}
            {offer && <PriceBlock offer={offer} />}

            {/* Delivery block */}
            {offer && <DeliveryBlock offer={offer} />}

            {/* CTA - desktop */}
            <div className="hidden md:block">
              <AffiliateCTA
                productSlug={params.productSlug}
                hasAffiliateLink={hasAffiliateLink}
              />
            </div>
          </div>
        </div>

        {/* Pros/Cons */}
        {(product.pros?.length > 0 || product.cons?.length > 0) && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">יתרונות וחסרונות</h2>
            <ProsCons pros={product.pros ?? []} cons={product.cons ?? []} />
          </section>
        )}

        {/* Seller info */}
        {product.seller_name && (
          <section className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">מידע על המוכר</h3>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <span>מוכר: {product.seller_name}</span>
              {product.seller_score && (
                <span>ציון מוכר: {product.seller_score.toFixed(1)}%</span>
              )}
            </div>
          </section>
        )}

        {/* Affiliate disclosure */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">{SITE_CONFIG.affiliateDisclosure}</p>
          <p className="text-xs text-gray-500 mt-1">{SITE_CONFIG.priceDisclaimer}</p>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden">
        <AffiliateCTA
          productSlug={params.productSlug}
          hasAffiliateLink={hasAffiliateLink}
          sticky={true}
        />
      </div>
    </>
  )
}
