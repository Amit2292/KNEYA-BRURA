import type { Metadata } from 'next'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getDailyDeals } from '@/lib/db/queries'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: 'מבצעים יומיים',
  description: 'המבצעים הכי טובים מאליאקספרס היום - מחיר ברור בשקלים, דירוג אמון ומשלוח ברור.',
}

export const revalidate = 1800 // 30 minutes

export default async function DealsPage() {
  const deals = await getDailyDeals(48).catch(() => [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-red-500">🔥</span> מבצעים יומיים
        </h1>
        <p className="text-gray-600 mt-2">
          מוצרים במחיר מיוחד - מחיר ברור בשקלים, דירוג אמון, זמן משלוח.
        </p>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏷️</div>
          <p className="text-xl font-medium text-gray-700">אין מבצעים פעילים כרגע</p>
          <p className="text-gray-500 mt-2">חזרו מחר לבדוק מבצעים חדשים</p>
        </div>
      ) : (
        <ProductGrid products={deals} />
      )}

      <p className="text-xs text-gray-400 text-center mt-10">
        {SITE_CONFIG.affiliateDisclosure}
      </p>
    </div>
  )
}
