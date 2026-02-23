import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllGuides } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'מדריכי קנייה',
  description: 'מדריכי קנייה מפורטים לקניות מאליאקספרס - השוואות, המלצות וטיפים.',
}

export default async function GuidesPage() {
  const guides = await getAllGuides()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">מדריכי קנייה</h1>
      <p className="text-gray-600 mb-8">
        מדריכים מפורטים שיעזרו לכם לבחור את המוצר הנכון.
      </p>

      {guides.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-xl font-medium text-gray-700">מדריכים בקרוב</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/g/${guide.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-brand-300 transition-all"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{guide.description}</p>
              {guide.category && (
                <span className="inline-block mt-3 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {guide.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
