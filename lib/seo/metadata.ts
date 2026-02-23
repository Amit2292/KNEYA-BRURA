import type { Metadata } from 'next'
import type { Product, Category } from '@/lib/db/types'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'קנייה-ברורה'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kenya-brura.co.il'

export function buildSiteMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} - מחיר ברור, משלוח ברור, קליק אחד לקנייה`,
      template: `%s | ${SITE_NAME}`,
    },
    description: 'השוו מחירים ומצאו מוצרים מאליאקספרס עם מחיר ברור בשקלים, זמן אספקה ודירוג אמון. ללא הפתעות.',
    openGraph: {
      siteName: SITE_NAME,
      locale: 'he_IL',
      type: 'website',
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: SITE_URL,
    },
  }
}

export function buildProductMetadata(product: Product, offer?: { total_ils?: number | null }): Metadata {
  const title = product.title_he ?? product.title_raw
  const description = product.short_summary_he
    ?? `${title} - מחיר, משלוח ומידע מלא. דירוג אמון: ${product.trust_score}/100.`
  const priceStr = offer?.total_ils ? ` | ${offer.total_ils} ש"ח` : ''

  return {
    title: `${title}${priceStr}`,
    description,
    openGraph: {
      title,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: 'website',
    },
  }
}

export function buildCategoryMetadata(category: Category): Metadata {
  return {
    title: `${category.name_he} - מוצרים מומלצים`,
    description: `מוצרי ${category.name_he} מומלצים עם מחיר ברור בשקלים, דירוג אמון ומידע משלוח. ללא הפתעות.`,
    openGraph: {
      title: `${category.name_he} - ${SITE_NAME}`,
      description: `מוצרי ${category.name_he} מומלצים`,
    },
  }
}

export function buildProductJsonLd(product: Product, offer?: { total_ils?: number | null; price_ils?: number | null }) {
  const title = product.title_he ?? product.title_raw
  const image = product.images?.[0]

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: product.short_summary_he ?? title,
    image: image ? [image] : undefined,
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          bestRating: '5',
          worstRating: '1',
          reviewCount: product.orders_count ?? 0,
        }
      : undefined,
    offers: offer?.price_ils
      ? {
          '@type': 'Offer',
          priceCurrency: 'ILS',
          price: offer.price_ils,
          availability: 'https://schema.org/InStock',
          seller: product.seller_name ? { '@type': 'Organization', name: product.seller_name } : undefined,
        }
      : undefined,
  }
}
