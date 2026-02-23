import { ProductCard } from './ProductCard'
import type { ProductWithOffer } from '@/lib/db/types'

interface ProductGridProps {
  products: ProductWithOffer[]
  emptyMessage?: string
}

export function ProductGrid({ products, emptyMessage = 'אין מוצרים להצגה' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500" dir="rtl">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-lg font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      dir="rtl"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
