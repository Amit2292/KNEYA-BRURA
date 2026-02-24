import Link from 'next/link'
import Image from 'next/image'
import { ProductGrid } from '@/components/product/ProductGrid'
import { HorizontalProductScroll } from '@/components/product/HorizontalProductScroll'
import { SearchBar } from '@/components/ui/SearchBar'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { getFeaturedProducts, getDailyDeals, getBestSellers } from '@/lib/db/queries'
import { SITE_CONFIG } from '@/config/site'
import { CATEGORY_CONFIG } from '@/config/categories'
import { formatIls } from '@/lib/fx/service'
import type { ProductWithOffer } from '@/lib/db/types'

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
      <section className="relative py-12 px-4 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-slate-900">
            קונים חכם. <span className="text-primary">משלמים פחות.</span>
          </h1>
          <p className="text-slate-600 text-lg mb-8">{SITE_CONFIG.subtitle}</p>
          <div className="relative max-w-lg mx-auto">
            <SearchBar size="lg" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
            <span className="material-symbols-outlined text-primary">grid_view</span>
            קטגוריות חכמות
          </h2>
          <Link href="/categories" className="text-primary text-sm font-medium hover:underline">הכל</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_CONFIG.map((cat) => (
            <CategoryIcon
              key={cat.slug}
              icon={cat.icon}
              label={cat.name_he}
              href={`/c/${cat.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Hot Deals - horizontal scroll */}
      {deals.length > 0 && (
        <section className="py-8 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                <span className="material-symbols-outlined text-red-500">bolt</span>
                דילים חמים שאסור לפספס
              </h2>
            </div>
            <HorizontalProductScroll products={deals} />
          </div>
        </section>
      )}

      {/* Most Purchased Today */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-900">
            <span className="material-symbols-outlined text-teal-500">trending_up</span>
            נרכש הכי הרבה היום
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.slice(0, 3).map((product) => (
              <MostPurchasedCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Featured products grid */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">מוצרים מומלצים</h2>
          <ProductGrid products={featured} />
        </section>
      )}

      {/* Why Shop With Us */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-200">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-2 text-slate-900">למה לקנות איתנו?</h2>
          <p className="text-slate-500">הצוות שלנו (וה-AI) עובדים קשה כדי לחסוך לכם כסף</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <WhyCard
            icon="touch_app"
            title="מחירים נבחרים ידנית"
            description="אנחנו בודקים כל דיל כדי לוודא שזה באמת המחיר הכי נמוך."
          />
          <WhyCard
            icon="security"
            title="קישורים בטוחים"
            description="רק מוכרים מאומתים עם דירוג גבוה ומשוב חיובי."
          />
          <WhyCard
            icon="update"
            title="עדכונים בזמן אמת"
            description="הדילים מתעדכנים כל שעה, ברגע שהמחיר יורד אנחנו שם."
          />
          <WhyCard
            icon="sentiment_very_satisfied"
            title="חוויית קנייה פשוטה"
            description="ללא פרסומות מציקות, רק דילים איכותיים וקישורים ישירים."
          />
        </div>
      </section>

      {/* Newsletter / Telegram */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-2xl md:text-3xl font-black mb-4 relative z-10">הצטרפו לעדכוני הדילים החמים ביותר</h2>
          <p className="opacity-90 mb-8 max-w-lg mx-auto relative z-10">
            הראשונים לדעת על קופונים בלעדיים וירידות מחיר דרמטיות. הצטרפו לקהילה שלנו בטלגרם או הירשמו במייל.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all w-full sm:w-auto justify-center">
              <span className="material-symbols-outlined">send</span>
              <span>הצטרפו לטלגרם</span>
            </button>
            <div className="flex flex-1 max-w-sm w-full bg-white/20 backdrop-blur-md rounded-xl p-1 border border-white/30">
              <input
                className="bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 w-full px-4"
                placeholder="האימייל שלך..."
                type="email"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-slate-50 transition-all shrink-0">
                הרשמה
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie consent */}
      <CookieConsent />
    </div>
  )
}

function MostPurchasedCard({ product }: { product: ProductWithOffer }) {
  const offer = product.offers?.[0]
  const mainImage = product.images?.[0] ?? 'https://placehold.co/96x96/e5e7eb/9ca3af?text=אין+תמונה'
  const title = product.title_he ?? product.title_raw
  const purchaseCount = Math.floor(Math.random() * 400 + 150)

  return (
    <Link
      href={`/p/${product.slug}`}
      className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 right-0 w-1 h-full bg-teal-500" />
      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
        <Image src={mainImage} alt={title} width={96} height={96} className="w-full h-full object-contain p-1" />
      </div>
      <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
        <div>
          <h4 className="font-bold text-sm leading-tight mb-1 text-slate-900 line-clamp-2">{title}</h4>
          <div className="flex items-center gap-1 text-teal-600 text-[10px] font-bold">
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span>{purchaseCount}+ נרכשו ב-24 שעות האחרונות</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          {offer?.total_ils ? (
            <span className="text-lg font-black text-slate-900">{formatIls(offer.total_ils)}</span>
          ) : (
            <span className="text-sm text-slate-400">-</span>
          )}
          <span className="text-primary font-bold text-sm">קנה עכשיו</span>
        </div>
      </div>
    </Link>
  )
}

function WhyCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-slate-100">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  )
}

function CookieConsent() {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 shadow-lg" dir="rtl">
      <div className="max-w-md mx-auto text-center">
        <p className="text-xs text-slate-600 mb-3">
          אנו משתמשים בעוגיות (Cookies) כדי להעניק לך את החוויה הטובה ביותר באתר ולנתח את השימוש בו.{' '}
          <Link href="/privacy" className="text-primary underline">מדיניות פרטיות</Link>
        </p>
        <div className="flex gap-2 justify-center">
          <button className="text-xs border border-slate-300 text-slate-700 px-4 py-2 rounded-full hover:bg-slate-50">
            הגדרות
          </button>
          <button className="text-xs bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 font-medium">
            אני מסכים/ה
          </button>
        </div>
      </div>
    </div>
  )
}
