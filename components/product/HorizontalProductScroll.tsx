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
    <div>
      {title && (
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          {icon && <span className="material-symbols-outlined text-primary">{icon}</span>}
          {title}
        </h2>
      )}
      <div className="flex overflow-x-auto gap-4 pb-6 hide-scrollbar">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="carousel" />
        ))}
      </div>
    </div>
  )
}
