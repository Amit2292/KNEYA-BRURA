import { Suspense } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterChips } from '@/components/ui/FilterChips'
import { getProducts } from '@/lib/db/queries'
import type { ProductFilters } from '@/lib/db/queries'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q ?? ''
  const sort = params.sort
  const page = Number(params.page ?? '1')
  const limit = 12

  const filters: ProductFilters = {
    search: query || undefined,
    limit,
    offset: (page - 1) * limit,
  }

  if (sort === 'price') {
    filters.sortBy = 'price_ils'
    filters.sortOrder = 'asc'
  } else if (sort === 'trust_score') {
    filters.sortBy = 'trust_score'
    filters.sortOrder = 'desc'
  } else if (sort === 'newest') {
    filters.sortBy = 'rating'
    filters.sortOrder = 'desc'
  }

  const { products, total } = await getProducts(filters).catch(() => ({ products: [], total: 0 }))

  return (
    <div dir="rtl" className="max-w-2xl mx-auto px-4 py-4">
      {/* Search bar */}
      <div className="mb-4">
        <SearchBar size="sm" defaultValue={query} />
      </div>

      {/* Filter chips */}
      <Suspense fallback={null}>
        <div className="mb-4">
          <FilterChips />
        </div>
      </Suspense>

      {/* Results count */}
      {query && (
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">{total}</span> תוצאות עבור &quot;{query}&quot;
        </p>
      )}

      {/* Product list */}
      <ProductGrid
        products={products}
        layout="list"
        emptyMessage={query ? `לא נמצאו תוצאות עבור "${query}"` : 'חפשו מוצר כדי להציג תוצאות'}
      />

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center gap-2 mt-6">
          {page > 1 && (
            <a
              href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}${sort ? `&sort=${sort}` : ''}`}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
            >
              הקודם
            </a>
          )}
          {page * limit < total && (
            <a
              href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}${sort ? `&sort=${sort}` : ''}`}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-700"
            >
              הבא
            </a>
          )}
        </div>
      )}
    </div>
  )
}
