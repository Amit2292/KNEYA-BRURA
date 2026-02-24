import { formatIls } from '@/lib/fx/service'
import type { Offer } from '@/lib/db/types'

interface PriceBlockProps {
  offer: Offer
  showDiscount?: boolean
}

export function PriceBlock({ offer, showDiscount = true }: PriceBlockProps) {
  const currentPrice = offer.total_ils
  // Simulate original price (30% higher) for discount display
  const originalPrice = currentPrice ? Math.round(currentPrice * 1.3) : null
  const discountPercent = currentPrice && originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null

  return (
    <div dir="rtl">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Current price */}
        <span className="text-4xl font-extrabold text-gray-900">
          {currentPrice ? formatIls(currentPrice) : 'מחיר לא זמין'}
        </span>

        {/* Discount + original price */}
        {showDiscount && discountPercent && discountPercent > 0 && originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-sm line-through text-gray-400">
              {formatIls(originalPrice)}
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
              {discountPercent}% הנחה
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-1">
        * ייתכן מע&quot;מ או מכס בהתאם לחוק. שער המרה משוער.
      </p>
    </div>
  )
}
