import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGuideBySlug, getAllGuides } from '@/lib/guides'
import { SITE_CONFIG } from '@/config/site'

interface Props {
  params: { guideSlug: string }
}

export async function generateStaticParams() {
  const guides = await getAllGuides()
  return guides.map((g) => ({ guideSlug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await getGuideBySlug(params.guideSlug)
  if (!guide) return {}
  return {
    title: guide.title,
    description: guide.description,
    openGraph: { title: guide.title, description: guide.description },
  }
}

export default async function GuidePage({ params }: Props) {
  const guide = await getGuideBySlug(params.guideSlug)
  if (!guide) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600">בית</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-brand-600">מדריכים</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{guide.title}</span>
      </nav>

      {/* Guide content */}
      <article className="prose prose-gray max-w-none">
        <div
          className="guide-content"
          dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
          dir="rtl"
        />
      </article>

      {/* Affiliate disclosure */}
      <div className="mt-10 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs text-amber-800">{SITE_CONFIG.affiliateDisclosure}</p>
      </div>
    </div>
  )
}
