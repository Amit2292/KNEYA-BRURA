import Link from 'next/link'
import Image from 'next/image'
import { getTrustResult } from '@/lib/trust/score'
import { formatIls } from '@/lib/fx/service'
import type { ProductWithOffer } from '@/lib/db/types'

interface ProductCardProps {
  product: ProductWithOffer
}

export function ProductCard({ product }: ProductCardProps) {
  const offer = product.offers?.[0]
  const trust = getTrustResult({
    rating: product.rating,
    orders_count: product.orders_count,
    seller_score: product.seller_score,
  })

  const mainImage = product.images?.[0] ?? 'https://placehold.co/300x300/e5e7eb/9ca3af?text=אין+תמונה'

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden" dir="rtl">
      {/* Image */}
      <Link href={`/p/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={mainImage}
          alt={product.title_he ?? product.title_raw}
          fill
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Badges overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {offer?.is_free_shipping && (
            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">
              משלוח חינם
            </span>
          )}
          {product.is_daily_deal && (
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-medium">
              מבצע יומי
            </span>
          )}
          {product.is_best_seller && (
            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
              🔥 נמכר הרבה
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/p/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-brand-700 mb-2 leading-snug">
            {product.title_he ?? product.title_raw}
          </h3>
        </Link>

        {/* Trust badge */}
        <div className="mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${trust.colorClass}`}>
            {trust.label}
          </span>
        </div>

        {/* Rating + Orders */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          {product.rating && (
            <span className="flex items-center gap-0.5">
              <span className="text-yellow-400">★</span>
              <span>{product.rating.toFixed(1)}</span>
            </span>
          )}
          {product.orders_count > 0 && (
            <span>
              {product.orders_count.toLocaleString('he-IL')} הזמנות
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {offer?.total_ils ? (
              <div className="text-lg font-bold text-gray-900">
                {formatIls(offer.total_ils)}
              </div>
            ) : (
              <div className="text-sm text-gray-500">מחיר לא זמין</div>
            )}
            {offer?.delivery_min_days && offer?.delivery_max_days && (
              <div className="text-xs text-gray-500">
                {offer.delivery_min_days}-{offer.delivery_max_days} ימים
              </div>
            )}
          </div>
          <Link
            href={`/p/${product.slug}`}
            className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            פרטים
          </Link>
        </div>
      </div>
    </div>
  )
}
