import type { MetadataRoute } from 'next'
import { getRootCategories, getProducts } from '@/lib/db/queries'
import { getAllGuides } from '@/lib/guides'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kenya-brura.co.il'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/categories`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/deals`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/guides`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/how-it-works`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Categories
  const categories = await getRootCategories().catch(() => [])
  for (const cat of categories) {
    urls.push({ url: `${SITE_URL}/c/${cat.slug}`, changeFrequency: 'daily', priority: 0.8 })
    for (const sub of cat.children ?? []) {
      urls.push({ url: `${SITE_URL}/c/${cat.slug}/${sub.slug}`, changeFrequency: 'daily', priority: 0.7 })
    }
  }

  // Products
  const { products } = await getProducts({ limit: 1000 }).catch(() => ({ products: [] }))
  for (const product of products) {
    urls.push({
      url: `${SITE_URL}/p/${product.slug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
      lastModified: product.updated_at,
    })
  }

  // Guides
  const guides = await getAllGuides().catch(() => [])
  for (const guide of guides) {
    urls.push({ url: `${SITE_URL}/g/${guide.slug}`, changeFrequency: 'monthly', priority: 0.5 })
  }

  return urls
}
