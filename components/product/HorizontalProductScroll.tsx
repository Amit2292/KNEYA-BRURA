import { ProductCard } from './ProductCard'
import type { ProductWithOffer } from '@/lib/db/types'

interface HorizontalProductScrollProps {
  products: ProductWithOffer[]
  title?: string
  icon?: string
}

export function HorizontalProductScroll({ products, title, icon }: HorizontalProductScrollProps) {
  if (products.length === 0) return null

  return (
    <section>
      {title && (
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          {icon && <span className="material-symbols-outlined text-primary-600">{icon}</span>}
          {title}
        </h2>
      )}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar scroll-snap-x pb-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="carousel" />
        ))}
      </div>
    </section>
  )
}
