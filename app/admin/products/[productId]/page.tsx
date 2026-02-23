import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { getProductById } from '@/lib/db/queries'
import { ProductEditForm } from '@/components/admin/ProductEditForm'

interface Props {
  params: { productId: string }
}

export default async function AdminProductEditPage({ params }: Props) {
  await requireAdmin()

  const product = await getProductById(params.productId).catch(() => null)
  if (!product) notFound()

  return (
    <div className="min-h-screen" dir="rtl">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">
            &larr; מוצרים
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">עריכת מוצר</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <ProductEditForm product={product} />
      </div>
    </div>
  )
}
