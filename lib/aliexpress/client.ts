/**
 * AliExpress Affiliate API Client
 *
 * IMPORTANT: This client uses the AliExpress Affiliate Open Platform API.
 * You must register at https://portals.aliexpress.com/ to get credentials.
 * Verify endpoint paths against official API documentation before use.
 *
 * DEMO MODE: If AE_APP_KEY is not set, the client returns mock data.
 */

import { signRequest } from './signing'
import { AE_CONFIG } from './config'
import {
  getMockProducts,
  getMockProductDetail,
  getMockAffiliateLink,
  type AEProduct,
} from './mock'

function isDemoMode(): boolean {
  return !process.env.AE_APP_KEY
}

function getCredentials() {
  return {
    appKey: process.env.AE_APP_KEY ?? '',
    appSecret: process.env.AE_APP_SECRET ?? '',
    trackingId: process.env.AE_TRACKING_ID ?? 'default',
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendRequest<T>(
  method: string,
  params: Record<string, string>,
  retries = AE_CONFIG.MAX_RETRIES
): Promise<T> {
  const { appKey, appSecret } = getCredentials()

  const signed = signRequest(method, params, appKey, appSecret)

  const url = new URL(AE_CONFIG.BASE_URL)
  Object.entries(signed).forEach(([k, v]) => url.searchParams.append(k, v))

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sleep(AE_CONFIG.RATE_LIMIT_DELAY_MS)

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const json = await res.json()

      if (json.error_response) {
        throw new Error(
          `AE API Error: ${json.error_response.msg} (code: ${json.error_response.code})`
        )
      }

      return json as T
    } catch (err) {
      if (attempt === retries) throw err
      await sleep(AE_CONFIG.RETRY_DELAY_MS * attempt)
    }
  }

  throw new Error('Max retries exceeded')
}

// =====================
// PUBLIC API METHODS
// =====================

export interface SearchProductsResult {
  products: AEProduct[]
  total: number
  page: number
  pageSize: number
}

export async function searchProducts(
  query: string,
  aeCategoryId?: string,
  page = 1,
  pageSize = AE_CONFIG.DEFAULT_PAGE_SIZE
): Promise<SearchProductsResult> {
  if (isDemoMode()) {
    return {
      products: getMockProducts(aeCategoryId, page, pageSize),
      total: 12,
      page,
      pageSize,
    }
  }

  const { trackingId } = getCredentials()

  const params: Record<string, string> = {
    keywords: query,
    page_no: String(page),
    page_size: String(pageSize),
    tracking_id: trackingId,
    target_currency: 'USD',
    target_language: 'EN',
    sort: 'SALE_PRICE_ASC',
  }

  if (aeCategoryId) {
    params.category_ids = aeCategoryId
  }

  const res = await sendRequest<Record<string, unknown>>(
    AE_CONFIG.ENDPOINTS.AFFILIATE_PRODUCT_QUERY,
    params
  )

  // Parse response structure based on AliExpress API docs
  const result = (res as Record<string, unknown>)
  const queryResult = (result['aliexpress_affiliate_product_query_response'] as Record<string, unknown> | undefined)
    ?.resp_result as Record<string, unknown> | undefined

  const products: AEProduct[] = []
  const items = (queryResult?.result as Record<string, unknown> | undefined)?.products as
    | { item?: unknown[] }
    | undefined

  if (items?.item) {
    for (const item of items.item) {
      products.push(item as AEProduct)
    }
  }

  return {
    products,
    total: Number((queryResult?.result as Record<string, unknown> | undefined)?.total_record_count ?? 0),
    page,
    pageSize,
  }
}

export async function getProductDetails(aeProductId: string): Promise<AEProduct | null> {
  if (isDemoMode()) {
    return getMockProductDetail(aeProductId)
  }

  const { trackingId } = getCredentials()

  const res = await sendRequest<Record<string, unknown>>(
    AE_CONFIG.ENDPOINTS.AFFILIATE_PRODUCT_DETAIL,
    {
      product_ids: aeProductId,
      tracking_id: trackingId,
      target_currency: 'USD',
      target_language: 'EN',
    }
  )

  const result = (res['aliexpress_affiliate_product_detail_get_response'] as Record<string, unknown> | undefined)
    ?.resp_result as Record<string, unknown> | undefined

  const products = (result?.result as Record<string, unknown> | undefined)?.products as
    | { item?: unknown[] }
    | undefined

  if (products?.item?.[0]) {
    return products.item[0] as AEProduct
  }

  return null
}

export async function getTrendingProducts(
  aeCategoryId: string,
  page = 1,
  pageSize = AE_CONFIG.DEFAULT_PAGE_SIZE
): Promise<SearchProductsResult> {
  if (isDemoMode()) {
    return {
      products: getMockProducts(aeCategoryId, page, pageSize),
      total: 12,
      page,
      pageSize,
    }
  }

  const { trackingId } = getCredentials()

  const res = await sendRequest<Record<string, unknown>>(
    AE_CONFIG.ENDPOINTS.AFFILIATE_HOTPRODUCT_QUERY,
    {
      category_id: aeCategoryId,
      page_no: String(page),
      page_size: String(pageSize),
      tracking_id: trackingId,
      target_currency: 'USD',
      target_language: 'EN',
    }
  )

  const result = (res['aliexpress_affiliate_hotproduct_query_response'] as Record<string, unknown> | undefined)
    ?.resp_result as Record<string, unknown> | undefined

  const products: AEProduct[] = []
  const items = (result?.result as Record<string, unknown> | undefined)?.products as
    | { item?: unknown[] }
    | undefined

  if (items?.item) {
    for (const item of items.item) {
      products.push(item as AEProduct)
    }
  }

  return {
    products,
    total: Number((result?.result as Record<string, unknown> | undefined)?.total_record_count ?? 0),
    page,
    pageSize,
  }
}

export async function generateAffiliateLink(
  productUrlOrId: string,
  trackingId?: string
): Promise<string | null> {
  const creds = getCredentials()
  const tid = trackingId ?? creds.trackingId

  if (isDemoMode()) {
    return getMockAffiliateLink(productUrlOrId, tid)
  }

  const res = await sendRequest<Record<string, unknown>>(
    AE_CONFIG.ENDPOINTS.AFFILIATE_LINK_GENERATE,
    {
      promotion_link_type: '0',
      source_values: productUrlOrId,
      tracking_id: tid,
    }
  )

  const result = (res['aliexpress_affiliate_link_generate_response'] as Record<string, unknown> | undefined)
    ?.resp_result as Record<string, unknown> | undefined

  const links = (result?.result as Record<string, unknown> | undefined)?.promotion_links as
    | { item?: Array<{ promotion_link?: string }> }
    | undefined

  return links?.item?.[0]?.promotion_link ?? null
}
