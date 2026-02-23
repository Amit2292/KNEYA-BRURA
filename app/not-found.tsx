import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4" dir="rtl">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">דף לא נמצא</h1>
        <p className="text-gray-600 mb-8">
          הדף שחיפשתם לא קיים או הוסר.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            לדף הבית
          </Link>
          <Link
            href="/categories"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            לקטגוריות
          </Link>
        </div>
      </div>
    </div>
  )
}
