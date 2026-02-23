import { formatIls } from '@/lib/fx/service'
import type { Offer } from '@/lib/db/types'

interface PriceBlockProps {
  offer: Offer
  isApproximateRate?: boolean
}

export function PriceBlock({ offer, isApproximateRate = false }: PriceBlockProps) {
  const lastChecked = offer.last_checked_at
    ? new Date(offer.last_checked_at).toLocaleDateString('he-IL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5" dir="rtl">
      {/* Price */}
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900">
          {offer.price_ils ? formatIls(offer.price_ils) : 'מחיר לא זמין'}
        </div>
        <div className="text-sm text-gray-500 mt-1">מחיר מוצר</div>
      </div>

      {/* Shipping */}
      <div className="flex items-center justify-between py-2 border-t border-gray-100">
        <span className="text-sm text-gray-600">משלוח</span>
        <span className="text-sm font-medium text-gray-900">
          {offer.is_free_shipping ? (
            <span className="text-green-700 font-semibold">חינם</span>
          ) : offer.shipping_ils ? (
            formatIls(offer.shipping_ils)
          ) : (
            'לא ידוע'
          )}
        </span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-2 border-t border-gray-200 bg-gray-50 rounded-lg px-3 mt-2">
        <span className="text-sm font-semibold text-gray-700">סה"כ משוער</span>
        <span className="text-xl font-bold text-brand-700">
          {offer.total_ils ? formatIls(offer.total_ils) : '-'}
        </span>
      </div>

      {/* Disclaimers */}
      <div className="mt-3 space-y-1">
        {isApproximateRate && (
          <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
            שער המרה משוער
          </p>
        )}
        <p className="text-xs text-gray-500">
          ייתכן מע"מ או מכס בהתאם לחוק ולסכום הקנייה.
        </p>
        {lastChecked && (
          <p className="text-xs text-gray-400">
            המחיר עודכן לאחרונה: {lastChecked}
          </p>
        )}
      </div>
    </div>
  )
}
