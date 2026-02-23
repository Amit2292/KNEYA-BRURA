import Link from 'next/link'
import type { Metadata } from 'next'
import { getRootCategories } from '@/lib/db/queries'

export const metadata: Metadata = {
  title: 'כל הקטגוריות',
  description: 'עיין בכל הקטגוריות ומצא מוצרים מומלצים מאליאקספרס עם מחיר ברור בשקלים.',
}

export const revalidate = 3600

export default async function CategoriesPage() {
  const categories = await getRootCategories().catch(() => [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">כל הקטגוריות</h1>

      <div className="space-y-10">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{cat.icon ?? '📦'}</span>
              <Link href={`/c/${cat.slug}`} className="text-2xl font-bold text-gray-900 hover:text-brand-700">
                {cat.name_he}
              </Link>
            </div>

            {cat.children && cat.children.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mr-10">
                {cat.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/c/${cat.slug}/${sub.slug}`}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-brand-400 hover:text-brand-700 transition-colors text-center"
                  >
                    {sub.name_he}
                  </Link>
                ))}
                <Link
                  href={`/c/${cat.slug}`}
                  className="bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-brand-400 transition-colors text-center"
                >
                  לכל {cat.name_he}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
