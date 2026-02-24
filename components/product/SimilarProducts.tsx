import { HorizontalProductScroll } from './HorizontalProductScroll'
import { getProducts } from '@/lib/db/queries'

interface SimilarProductsProps {
  categoryId: string | null
  excludeProductId: string
}

export async function SimilarProducts({ categoryId, excludeProductId }: SimilarProductsProps) {
  if (!categoryId) return null

  const { products } = await getProducts({
    categoryId,
    limit: 8,
  }).catch(() => ({ products: [] }))

  const filtered = products.filter((p) => p.id !== excludeProductId)
  if (filtered.length === 0) return null

  return (
    <section>
      <h2 className="text-base font-bold text-gray-900 mb-4">דילים דומים שאולי תאהבו</h2>
      <HorizontalProductScroll products={filtered} />
    </section>
  )
}
