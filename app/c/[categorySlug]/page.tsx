import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterDrawer } from '@/components/ui/FilterDrawer'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/db/queries'
import { buildCategoryMetadata } from '@/lib/seo/metadata'

interface Props {
  params: { categorySlug: string }
  searchParams: {
    minRating?: string
    minTrust?: string
    freeShipping?: string
    sortBy?: string
    page?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.categorySlug).catch(() => null)
  if (!category) return {}
  return buildCategoryMetadata(category)
}

export const revalidate = 3600

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await getCategoryBySlug(params.categorySlug).catch(() => null)
  if (!category) notFound()

  const page = Number(searchParams.page ?? '1')
  const limit = 24
  const offset = (page - 1) * limit

  const { products, total } = await getProductsByCategory(category.id, {
    minRating: searchParams.minRating ? Number(searchParams.minRating) : undefined,
    minTrustScore: searchParams.minTrust ? Number(searchParams.minTrust) : undefined,
    freeShippingOnly: searchParams.freeShipping === '1',
    sortBy: (searchParams.sortBy as 'trust_score' | 'rating' | 'orders_count' | 'price_ils') ?? 'trust_score',
    limit,
    offset,
  }).catch(() => ({ products: [], total: 0 }))

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600">בית</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-brand-600">קטגוריות</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category.name_he}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name_he}</h1>
          <p className="text-sm text-gray-500 mt-1">{total} מוצרים</p>
        </div>
        <FilterDrawer />
      </div>

      {/* Subcategories */}
      {category.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {category.children.map((sub) => (
            <Link
              key={sub.id}
              href={`/c/${params.categorySlug}/${sub.slug}`}
              className="text-sm px-4 py-1.5 rounded-full border border-gray-300 hover:border-brand-500 hover:text-brand-700 transition-colors"
            >
              {sub.name_he}
            </Link>
          ))}
        </div>
      )}

      {/* Products */}
      <ProductGrid products={products} emptyMessage="לא נמצאו מוצרים בקטגוריה זו" />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/c/${params.categorySlug}?page=${page - 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              הקודם
            </Link>
          )}
          <span className="text-sm text-gray-600">
            עמוד {page} מתוך {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/c/${params.categorySlug}?page=${page + 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              הבא
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
