import Link from 'next/link'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getFeaturedProducts, getDailyDeals, getBestSellers, getRootCategories } from '@/lib/db/queries'
import { SITE_CONFIG } from '@/config/site'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const [featured, deals, bestSellers, categories] = await Promise.all([
    getFeaturedProducts(8).catch(() => []),
    getDailyDeals(6).catch(() => []),
    getBestSellers(8).catch(() => []),
    getRootCategories().catch(() => []),
  ])

  return (
    <div dir="rtl">
      {/* Hero */}
      <section className="bg-gradient-to-bl from-brand-700 to-brand-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {SITE_CONFIG.name}
          </h1>
          <p className="text-xl md:text-2xl text-brand-100 mb-8">
            {SITE_CONFIG.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/categories"
              className="bg-white text-brand-700 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors text-lg"
            >
              לכל הקטגוריות
            </Link>
            <Link
              href="/deals"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-lg"
            >
              מבצעים יומיים
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900">מחיר ברור בשקלים</h3>
              <p className="text-sm text-gray-600 mt-1">מחיר + משלוח + סה"כ. ללא הפתעות.</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900">זמן משלוח ברור</h3>
              <p className="text-sm text-gray-600 mt-1">טווח ימים משוער לפני הקנייה.</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-900">דירוג אמון</h3>
              <p className="text-sm text-gray-600 mt-1">ציון מ-0 עד 100 על בסיס דירוג, הזמנות ומוכר.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

        {/* Categories */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">קטגוריות</h2>
              <Link href="/categories" className="text-sm text-brand-600 hover:underline">לכל הקטגוריות</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/c/${cat.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md hover:border-brand-300 transition-all"
                >
                  <div className="text-4xl mb-2">{cat.icon ?? '📦'}</div>
                  <div className="font-semibold text-gray-900">{cat.name_he}</div>
                  {cat.children && cat.children.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {cat.children.length} תת-קטגוריות
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Daily deals */}
        {deals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                <span className="text-red-600">🔥</span> מבצעים יומיים
              </h2>
              <Link href="/deals" className="text-sm text-brand-600 hover:underline">לכל המבצעים</Link>
            </div>
            <ProductGrid products={deals} />
          </section>
        )}

        {/* Featured / Best sellers */}
        {(featured.length > 0 || bestSellers.length > 0) && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">מוצרים מומלצים</h2>
            </div>
            <ProductGrid products={featured.length > 0 ? featured : bestSellers} />
          </section>
        )}

        {/* How it works teaser */}
        <section className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-2">איך זה עובד?</h2>
          <p className="text-blue-700 mb-4 text-sm">
            אנחנו מאגדים מוצרים מאליאקספרס, מחשבים מחיר ברור בשקלים ומספקים דירוג אמינות.
          </p>
          <Link
            href="/how-it-works"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            קרא עוד
          </Link>
        </section>

        {/* Affiliate disclosure */}
        <p className="text-xs text-gray-400 text-center">
          {SITE_CONFIG.affiliateDisclosure}
        </p>
      </div>
    </div>
  )
}
