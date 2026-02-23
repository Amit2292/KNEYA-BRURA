import type { Offer } from '@/lib/db/types'

interface DeliveryBlockProps {
  offer: Offer
}

export function DeliveryBlock({ offer }: DeliveryBlockProps) {
  const { delivery_min_days, delivery_max_days, is_free_shipping } = offer

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5" dir="rtl">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">מידע משלוח</h3>

      {/* Delivery window */}
      {delivery_min_days && delivery_max_days ? (
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">📦</div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              הגעה משוערת: {delivery_min_days}-{delivery_max_days} ימים
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              מספירת ימי עסקים ממועד ההזמנה
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-3">זמן משלוח לא ידוע</p>
      )}

      {/* Free shipping */}
      {is_free_shipping && (
        <div className="flex items-center gap-2 py-2 px-3 bg-green-50 rounded-lg border border-green-200">
          <span className="text-green-700 text-lg">✓</span>
          <span className="text-sm font-semibold text-green-700">משלוח חינם</span>
        </div>
      )}

      {/* Shipping disclaimer */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500">
          זמן המשלוח משוער ועשוי להשתנות בהתאם לעומס, מיקום, ומכס.
        </p>
        <p className="text-xs text-gray-500">
          הזמנות מעל 75$ עשויות לחייב מכס בישראל.
        </p>
      </div>
    </div>
  )
}
