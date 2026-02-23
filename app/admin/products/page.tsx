import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { getProducts } from '@/lib/db/queries'
import { formatIls } from '@/lib/fx/service'

interface Props {
  searchParams: { page?: string; search?: string }
}

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireAdmin()

  const page = Number(searchParams.page ?? '1')
  const limit = 20
  const offset = (page - 1) * limit

  const { products, total } = await getProducts({
    search: searchParams.search,
    limit,
    offset,
    sortBy: 'trust_score',
  }).catch(() => ({ products: [], total: 0 }))

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen" dir="rtl">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              &larr; לוח בקרה
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-xl font-bold text-gray-900">ניהול מוצרים</h1>
          </div>
          <div className="text-sm text-gray-500">{total} מוצרים</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Search */}
        <form method="GET" className="flex gap-3 mb-6">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="חיפוש לפי שם..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
          <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">
            חפש
          </button>
        </form>

        {/* Products table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">שם</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">מחיר</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">אמון</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">דגלים</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const offer = product.offers?.[0]
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                          {product.title_he ?? product.title_raw}
                        </div>
                        <div className="text-xs text-gray-400">{product.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {offer?.total_ils ? formatIls(offer.total_ils) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.trust_score >= 80 ? 'bg-green-100 text-green-700' :
                          product.trust_score >= 65 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {product.trust_score}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {product.is_featured && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">מומלץ</span>}
                          {product.is_daily_deal && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">מבצע</span>}
                          {product.is_best_seller && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">נמכר</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/p/${product.slug}`}
                            target="_blank"
                            className="text-xs text-brand-600 hover:underline"
                          >
                            צפה
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-xs text-gray-600 hover:underline"
                          >
                            ערוך
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link href={`/admin/products?page=${page - 1}`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                הקודם
              </Link>
            )}
            <span className="text-sm text-gray-600">עמוד {page} מתוך {totalPages}</span>
            {page < totalPages && (
              <Link href={`/admin/products?page=${page + 1}`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                הבא
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
