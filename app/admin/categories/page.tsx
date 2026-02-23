import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { getRootCategories } from '@/lib/db/queries'

export default async function AdminCategoriesPage() {
  await requireAdmin()
  const categories = await getRootCategories().catch(() => [])

  return (
    <div className="min-h-screen" dir="rtl">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            &larr; לוח בקרה
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">ניהול קטגוריות</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-bold text-gray-900">{cat.name_he}</h2>
                  <p className="text-xs text-gray-400">{cat.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/c/${cat.slug}`}
                    target="_blank"
                    className="text-xs text-brand-600 hover:underline"
                  >
                    צפה
                  </Link>
                </div>
              </div>

              {cat.children && cat.children.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {cat.children.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <div className="text-sm font-medium text-gray-700">{sub.name_he}</div>
                      <div className="text-xs text-gray-400">{sub.slug}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          לשינוי קטגוריות עדכנו את config/categories.ts והריצו סקריפט הזרעה מחדש.
        </p>
      </div>
    </div>
  )
}
