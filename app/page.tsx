import Link from 'next/link'
import { ProductGrid } from '@/components/product/ProductGrid'
import { HorizontalProductScroll } from '@/components/product/HorizontalProductScroll'
import { SearchBar } from '@/components/ui/SearchBar'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { getFeaturedProducts, getDailyDeals, getBestSellers } from '@/lib/db/queries'
import { SITE_CONFIG } from '@/config/site'
import { CATEGORY_CONFIG } from '@/config/categories'

export const revalidate = 3600

export default async function HomePage() {
  const [featured, deals, bestSellers] = await Promise.all([
    getFeaturedProducts(8).catch(() => []),
    getDailyDeals(8).catch(() => []),
    getBestSellers(6).catch(() => []),
  ])

  return (
    <div dir="rtl">
      {/* Hero */}
      <section className="bg-white pt-8 pb-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            {SITE_CONFIG.tagline}
          </h1>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            {SITE_CONFIG.subtitle}
          </p>
          <div className="max-w-md mx-auto">
            <SearchBar size="lg" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-base font-bold text-gray-900 mb-4 text-center">קטגוריות חכמות</h2>
          <div className="grid grid-cols-3 gap-4">
            {CATEGORY_CONFIG.map((cat) => (
              <CategoryIcon
                key={cat.slug}
                icon={cat.icon}
                label={cat.name_he}
                href={`/c/${cat.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Hot Deals - horizontal scroll */}
        {deals.length > 0 && (
          <HorizontalProductScroll
            products={deals}
            title="דילים חמים"
            icon="local_fire_department"
          />
        )}

        {/* Most Purchased Today */}
        {bestSellers.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-600">trending_up</span>
              נרכש הכי הרבה היום
            </h2>
            <div className="space-y-3">
              {bestSellers.slice(0, 4).map((product) => (
                <MostPurchasedCard key={product.id} product={product} />
              ))}
            </div>
            <Link
              href="/deals"
              className="block text-center text-sm text-primary-600 font-medium mt-4 hover:underline"
            >
              לפרטים ומוצרים נוספים
            </Link>
          </section>
        )}

        {/* Featured products grid */}
        {featured.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">מוצרים מומלצים</h2>
            <ProductGrid products={featured} />
          </section>
        )}

        {/* Why Buy From Us */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">למה לקנות אצלנו?</h2>
          <div className="space-y-3">
            <WhyCard
              icon="payments"
              title="מחירים בהירים ידידותיים"
              description="מחירים בשקלים כולל כל המיסים, שער המרה מעודכן בכל עת."
            />
            <WhyCard
              icon="search"
              title="חיפושים נוחיים"
              description="AI שלנו מוצא עבורכם את הדילים הכי שווים על סמך ציון מהימנות גבוה."
            />
            <WhyCard
              icon="local_shipping"
              title="עדכונים בזמן אמת"
              description="כל המוצרים מתעדכנים כל יום, מאליאקספרס ישירות אליכם."
            />
            <WhyCard
              icon="verified"
              title="מוכרים קרובים ואמינים"
              description="כל מוכר מקבל ציון, כך שתוכלו לדעת שהמוצר בדרך ושייגיע בשלום."
            />
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-primary-600 rounded-2xl p-6 text-center text-white">
          <h2 className="text-lg font-bold mb-2">הנצרמו לעדכוני הדילים הכי חמים ביותר</h2>
          <p className="text-sm text-primary-100 mb-4">
            הצטרפו ותהיו הראשונים לדעת על הדילים החדשים כל בוקר.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Link
              href="/deals"
              className="flex-1 bg-white text-primary-700 font-semibold py-3 px-6 rounded-xl text-sm hover:bg-primary-50 transition-colors"
            >
              הצטרפו לעדכונים
            </Link>
          </div>
          <p className="text-xs text-primary-200 mt-3">או הירשמו בחינם</p>
        </section>

        {/* Affiliate disclosure */}
        <p className="text-xs text-gray-400 text-center">
          שקיפות מלאה: אם תקנו דרך הקישורים באתר, ייתכן שנקבל עמלה קטנה ללא עלות נוספת עבורכם. זה מה שמאפשר לנו להמשיך לפעול.
        </p>

        {/* Cookie consent */}
        <CookieConsent />
      </div>
    </div>
  )
}

// Most purchased today card - compact horizontal layout
import Image from 'next/image'
import { formatIls } from '@/lib/fx/service'
import type { ProductWithOffer } from '@/lib/db/types'

function MostPurchasedCard({ product }: { product: ProductWithOffer }) {
  const offer = product.offers?.[0]
  const mainImage = product.images?.[0] ?? 'https://placehold.co/80x80/e5e7eb/9ca3af?text=אין+תמונה'
  const title = product.title_he ?? product.title_raw

  return (
    <Link
      href={`/p/${product.slug}`}
      className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm transition-shadow"
    >
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        <Image src={mainImage} alt={title} fill className="object-contain p-1" sizes="64px" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">ראה מחיר מלא</p>
      </div>
      <div className="text-left flex-shrink-0">
        {offer?.total_ils ? (
          <div className="text-sm font-bold text-primary-700">{formatIls(offer.total_ils)}</div>
        ) : (
          <div className="text-xs text-gray-400">-</div>
        )}
      </div>
    </Link>
  )
}

function WhyCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-primary-600">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function CookieConsent() {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-md mx-auto text-center">
        <p className="text-xs text-gray-600 mb-3">
          אנו משתמשים בעוגיות (Cookies) כדי להעניק לך את החוויה הטובה ביותר באתר ולנתח את השימוש בו.{' '}
          <Link href="/privacy" className="text-primary-600 underline">מדיניות פרטיות</Link>
        </p>
        <div className="flex gap-2 justify-center">
          <button className="text-xs border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50">
            הגדרות
          </button>
          <button className="text-xs bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 font-medium">
            אני מסכים/ה
          </button>
        </div>
      </div>
    </div>
  )
}
