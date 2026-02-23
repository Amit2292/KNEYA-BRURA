import { supabase, supabaseAdmin } from './client'
import type { Product, Category, Offer, AffiliateLink, ProductWithOffer, CategoryWithChildren } from './types'

// =====================
// CATEGORIES
// =====================

export async function getRootCategories(): Promise<CategoryWithChildren[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name_he')

  if (error) throw error

  const roots = data as CategoryWithChildren[]

  // Load children for each root
  const withChildren = await Promise.all(
    roots.map(async (cat) => {
      const { data: children } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', cat.id)
        .order('name_he')
      return { ...cat, children: children ?? [] }
    })
  )

  return withChildren
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithChildren | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  const { data: children } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', data.id)
    .order('name_he')

  return { ...data, children: children ?? [] }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// =====================
// PRODUCTS
// =====================

export interface ProductFilters {
  categoryId?: string
  minRating?: number
  maxPrice?: number
  minPrice?: number
  freeShippingOnly?: boolean
  minTrustScore?: number
  isFeatured?: boolean
  isDailyDeal?: boolean
  isBestSeller?: boolean
  search?: string
  sortBy?: 'trust_score' | 'rating' | 'orders_count' | 'price_ils'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export async function getProducts(filters: ProductFilters = {}): Promise<{ products: ProductWithOffer[]; total: number }> {
  let query = supabase
    .from('products')
    .select('*, offers(*), affiliate_links(*)', { count: 'exact' })

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }
  if (filters.minRating !== undefined) {
    query = query.gte('rating', filters.minRating)
  }
  if (filters.minTrustScore !== undefined) {
    query = query.gte('trust_score', filters.minTrustScore)
  }
  if (filters.isFeatured) {
    query = query.eq('is_featured', true)
  }
  if (filters.isDailyDeal) {
    query = query.eq('is_daily_deal', true)
  }
  if (filters.isBestSeller) {
    query = query.eq('is_best_seller', true)
  }
  if (filters.search) {
    query = query.ilike('title_he', `%${filters.search}%`)
  }

  const sortField = filters.sortBy ?? 'trust_score'
  const sortOrder = filters.sortOrder ?? 'desc'

  if (sortField !== 'price_ils') {
    query = query.order(sortField, { ascending: sortOrder === 'asc' })
  } else {
    // Sort by price requires joining with offers - do it client-side for now
    query = query.order('trust_score', { ascending: false })
  }

  const limit = filters.limit ?? 24
  const offset = filters.offset ?? 0
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  let products = (data ?? []) as ProductWithOffer[]

  // Apply price filter and sort on offers if needed
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.freeShippingOnly) {
    products = products.filter((p) => {
      const offer = p.offers?.[0]
      if (!offer) return false
      if (filters.freeShippingOnly && !offer.is_free_shipping) return false
      if (filters.minPrice !== undefined && (offer.total_ils ?? 0) < filters.minPrice) return false
      if (filters.maxPrice !== undefined && (offer.total_ils ?? Infinity) > filters.maxPrice) return false
      return true
    })
  }

  if (filters.sortBy === 'price_ils') {
    products.sort((a, b) => {
      const aPrice = a.offers?.[0]?.total_ils ?? Infinity
      const bPrice = b.offers?.[0]?.total_ils ?? Infinity
      return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice
    })
  }

  return { products, total: count ?? products.length }
}

export async function getProductBySlug(slug: string): Promise<ProductWithOffer | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, offers(*), affiliate_links(*), category:categories(*)')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as ProductWithOffer
}

export async function getProductById(id: string): Promise<ProductWithOffer | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, offers(*), affiliate_links(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as ProductWithOffer
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithOffer[]> {
  const { products } = await getProducts({ isFeatured: true, limit })
  return products
}

export async function getDailyDeals(limit = 12): Promise<ProductWithOffer[]> {
  const { products } = await getProducts({ isDailyDeal: true, limit })
  return products
}

export async function getBestSellers(limit = 8): Promise<ProductWithOffer[]> {
  const { products } = await getProducts({ isBestSeller: true, limit })
  return products
}

export async function getProductsByCategory(
  categoryId: string,
  filters: Omit<ProductFilters, 'categoryId'> = {}
): Promise<{ products: ProductWithOffer[]; total: number }> {
  return getProducts({ ...filters, categoryId })
}

// =====================
// CLICKS
// =====================

export async function recordClick(productId: string, referrer?: string, userAgent?: string): Promise<void> {
  await supabaseAdmin.from('clicks').insert({
    product_id: productId,
    referrer: referrer ?? null,
    user_agent: userAgent ?? null,
  })
}

export async function getTopClickedProducts(days = 7, limit = 20): Promise<{ product_id: string; click_count: number }[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabaseAdmin
    .from('clicks')
    .select('product_id')
    .gte('created_at', since)

  if (error || !data) return []

  // Count manually
  const counts: Record<string, number> = {}
  for (const row of data) {
    counts[row.product_id] = (counts[row.product_id] ?? 0) + 1
  }

  return Object.entries(counts)
    .map(([product_id, click_count]) => ({ product_id, click_count }))
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, limit)
}

// =====================
// SYNC JOBS
// =====================

export async function startSyncJob(jobName: string, meta: Record<string, unknown> = {}): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('sync_jobs')
    .insert({ job_name: jobName, status: 'running', meta })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

export async function finishSyncJob(
  jobId: string,
  status: 'success' | 'failed',
  meta?: Record<string, unknown>,
  error?: string
): Promise<void> {
  await supabaseAdmin.from('sync_jobs').update({
    status,
    finished_at: new Date().toISOString(),
    ...(meta ? { meta } : {}),
    ...(error ? { error } : {}),
  }).eq('id', jobId)
}

export async function getRecentSyncJobs(limit = 50): Promise<import('./types').SyncJob[]> {
  const { data, error } = await supabaseAdmin
    .from('sync_jobs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

// =====================
// FX RATES
// =====================

export async function getFxRate(base: string, quote: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('fx_rates')
    .select('rate')
    .eq('base', base)
    .eq('quote', quote)
    .single()

  if (error || !data) return null
  return data.rate
}

export async function upsertFxRate(base: string, quote: string, rate: number): Promise<void> {
  await supabaseAdmin.from('fx_rates').upsert(
    { base, quote, rate, updated_at: new Date().toISOString() },
    { onConflict: 'base,quote' }
  )
}

// =====================
// OFFERS + AFFILIATE LINKS (upsert helpers)
// =====================

export async function upsertProduct(product: Partial<Product> & { slug: string; title_raw: string }): Promise<Product> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .upsert(product, { onConflict: 'ae_product_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function upsertOffer(offer: Partial<Offer> & { product_id: string }): Promise<void> {
  // Delete existing offer for product and re-insert
  await supabaseAdmin.from('offers').delete().eq('product_id', offer.product_id)
  await supabaseAdmin.from('offers').insert(offer)
}

export async function upsertAffiliateLink(link: Partial<AffiliateLink> & { product_id: string; affiliate_url: string }): Promise<void> {
  await supabaseAdmin
    .from('affiliate_links')
    .upsert(link, { onConflict: 'product_id' })
}

export async function getProductsNeedingLocalization(limit = 20): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .is('title_he', null)
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function updateProductLocalization(
  id: string,
  updates: { title_he?: string; short_summary_he?: string; pros?: string[]; cons?: string[] }
): Promise<void> {
  await supabaseAdmin.from('products').update(updates).eq('id', id)
}
