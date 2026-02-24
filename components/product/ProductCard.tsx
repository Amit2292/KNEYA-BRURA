import Link from 'next/link'
import Image from 'next/image'
import { getTrustResult } from '@/lib/trust/score'
import { formatIls } from '@/lib/fx/service'
import type { ProductWithOffer } from '@/lib/db/types'

interface ProductCardProps {
  product: ProductWithOffer
  variant?: 'grid' | 'carousel' | 'list'
}

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const offer = product.offers?.[0]
  const trust = getTrustResult({
    rating: product.rating,
    orders_count: product.orders_count,
    seller_score: product.seller_score,
  })

  const mainImage = product.images?.[0] ?? 'https://placehold.co/300x300/e5e7eb/9ca3af?text=אין+תמונה'
  const title = product.title_he ?? product.title_raw

  if (variant === 'carousel') {
    return <CarouselCard product={product} offer={offer} title={title} mainImage={mainImage} />
  }

  if (variant === 'list') {
    return <ListCard product={product} offer={offer} title={title} mainImage={mainImage} trustScore={trust.score} />
  }

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden" dir="rtl">
      <Link href={`/p/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 left-2">
          <TrustCircle score={trust.score} />
        </div>
        {offer?.is_free_shipping && (
          <span className="absolute top-2 right-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">
            משלוח חינם
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/p/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-brand-700 mb-2 leading-snug">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          {product.rating && (
            <span className="flex items-center gap-0.5">
              <span className="text-yellow-400">★</span>
              <span>{product.rating.toFixed(1)}</span>
            </span>
          )}
          {product.orders_count > 0 && (
            <span>{product.orders_count.toLocaleString('he-IL')} הזמנות</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {offer?.total_ils ? (
              <div className="text-lg font-bold text-gray-900">{formatIls(offer.total_ils)}</div>
            ) : (
              <div className="text-sm text-gray-500">מחיר לא זמין</div>
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

function TrustCircle({ score }: { score: number }) {
  const displayScore = (score / 10).toFixed(1)
  const bgColor = score >= 80 ? 'bg-green-600' : score >= 65 ? 'bg-blue-600' : score >= 50 ? 'bg-yellow-500' : 'bg-gray-500'

  return (
    <div className={`w-10 h-10 rounded-full ${bgColor} text-white flex flex-col items-center justify-center shadow-md`}>
      <span className="text-xs font-bold leading-none">{displayScore}</span>
      <span className="text-[7px] leading-none opacity-80">ציון אמון</span>
    </div>
  )
}

function CarouselCard({
  product,
  offer,
  title,
  mainImage,
}: {
  product: ProductWithOffer
  offer?: ProductWithOffer['offers'] extends (infer T)[] | undefined ? T : never
  title: string
  mainImage: string
}) {
  return (
    <Link
      href={`/p/${product.slug}`}
      className="flex-shrink-0 w-40 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      dir="rtl"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image src={mainImage} alt={title} fill className="object-contain p-2" sizes="160px" />
        {product.is_daily_deal && (
          <span className="absolute top-2 right-2 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
            מבצע!
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-2 leading-snug">{title}</h3>
        {offer?.total_ils ? (
          <div className="text-sm font-bold text-gray-900">{formatIls(offer.total_ils)}</div>
        ) : (
          <div className="text-xs text-gray-500">מחיר לא זמין</div>
        )}
      </div>
    </Link>
  )
}

function ListCard({
  product,
  offer,
  title,
  mainImage,
  trustScore,
}: {
  product: ProductWithOffer
  offer?: ProductWithOffer['offers'] extends (infer T)[] | undefined ? T : never
  title: string
  mainImage: string
  trustScore: number
}) {
  const displayScore = (trustScore / 10).toFixed(1)
  const scoreBg = trustScore >= 80 ? 'bg-green-600' : trustScore >= 65 ? 'bg-blue-600' : trustScore >= 50 ? 'bg-yellow-500' : 'bg-gray-500'

  const lastChecked = offer?.last_checked_at
    ? new Date(offer.last_checked_at).toLocaleDateString('he-IL', {
        day: 'numeric',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm" dir="rtl">
      <Link href={`/p/${product.slug}`} className="block relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <Image src={mainImage} alt={title} fill className="object-contain p-4" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className={`absolute top-3 left-3 w-14 h-14 rounded-full ${scoreBg} text-white flex flex-col items-center justify-center shadow-lg`}>
          <span className="text-[10px] opacity-80">ציון אמון</span>
          <span className="text-lg font-bold leading-none">{displayScore}</span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/p/${product.slug}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">{title}</h3>
        </Link>

        {(offer?.is_free_shipping || product.orders_count > 0) && (
          <p className="text-xs text-gray-500 mb-3">
            {offer?.is_free_shipping && 'משלוח חינם'}
            {offer?.is_free_shipping && product.orders_count > 0 && ' | '}
            {product.orders_count > 0 && `${product.orders_count.toLocaleString('he-IL')} הזמנות`}
          </p>
        )}

        {offer && (
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 text-center bg-primary-50 rounded-lg py-2 px-3">
              <div className="text-[10px] text-gray-500">סה״כ לתשלום</div>
              <div className="text-lg font-bold text-primary-700">
                {offer.total_ils ? formatIls(offer.total_ils) : '-'}
              </div>
            </div>
            <div className="flex-1 text-center py-2 px-3">
              <div className="text-[10px] text-gray-500">משלוח</div>
              <div className="text-sm font-medium text-gray-700">
                {offer.is_free_shipping ? (
                  <span className="text-green-600">חינם</span>
                ) : offer.shipping_ils ? formatIls(offer.shipping_ils) : '-'}
              </div>
            </div>
            <div className="flex-1 text-center py-2 px-3">
              <div className="text-[10px] text-gray-500">מחיר מוצר</div>
              <div className="text-sm font-medium text-gray-700">
                {offer.price_ils ? formatIls(offer.price_ils) : '-'}
              </div>
            </div>
          </div>
        )}

        <p className="text-[10px] text-gray-400 mb-3">
          * ייתכן מע״מ או מכס בהתאם לחוק. שער המרה משוער.
        </p>
        {lastChecked && (
          <p className="text-[10px] text-gray-400 mb-3">עודכן לאחרונה: {lastChecked}</p>
        )}

        <Link
          href={`/p/${product.slug}`}
          className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">open_in_new</span>
            לפרטים והזמנה
          </span>
        </Link>
      </div>
    </div>
  )
}
