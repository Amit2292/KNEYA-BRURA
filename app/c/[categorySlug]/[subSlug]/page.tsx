import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterDrawer } from '@/components/ui/FilterDrawer'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/db/queries'
import { buildCategoryMetadata } from '@/lib/seo/metadata'

interface Props {
  params: { categorySlug: string; subSlug: string }
  searchParams: {
    minRating?: string
    minTrust?: string
    freeShipping?: string
    sortBy?: string
    page?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sub = await getCategoryBySlug(params.subSlug).catch(() => null)
  if (!sub) return {}
  return buildCategoryMetadata(sub)
}

export const revalidate = 3600

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const [parentCat, subCat] = await Promise.all([
    getCategoryBySlug(params.categorySlug).catch(() => null),
    getCategoryBySlug(params.subSlug).catch(() => null),
  ])

  if (!subCat) notFound()

  const page = Number(searchParams.page ?? '1')
  const limit = 24
  const offset = (page - 1) * limit

  const { products, total } = await getProductsByCategory(subCat.id, {
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
        {parentCat && (
          <>
            <Link href={`/c/${params.categorySlug}`} className="hover:text-brand-600">{parentCat.name_he}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium">{subCat.name_he}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{subCat.name_he}</h1>
          <p className="text-sm text-gray-500 mt-1">{total} מוצרים</p>
        </div>
        <FilterDrawer />
      </div>

      <ProductGrid products={products} emptyMessage="לא נמצאו מוצרים בתת-קטגוריה זו" />

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={`/c/${params.categorySlug}/${params.subSlug}?page=${page - 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              הקודם
            </Link>
          )}
          <span className="text-sm text-gray-600">עמוד {page} מתוך {totalPages}</span>
          {page < totalPages && (
            <Link href={`/c/${params.categorySlug}/${params.subSlug}?page=${page + 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              הבא
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
