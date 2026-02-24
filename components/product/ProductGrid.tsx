import { ProductCard } from './ProductCard'
import type { ProductWithOffer } from '@/lib/db/types'

interface ProductGridProps {
  products: ProductWithOffer[]
  layout?: 'grid' | 'list'
  emptyMessage?: string
}

export function ProductGrid({ products, layout = 'grid', emptyMessage = 'אין מוצרים להצגה' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500" dir="rtl">
        <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">search_off</span>
        <p className="text-lg font-medium">{emptyMessage}</p>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-4" dir="rtl">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="list" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" dir="rtl">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="grid" />
      ))}
    </div>
  )
}
