import { getFxRate, upsertFxRate } from '@/lib/db/queries'

const FALLBACK_RATE = Number(process.env.FX_FALLBACK_RATE_ILS ?? '3.75')
const FX_API_URL = process.env.FX_API_URL

// In-memory cache for rate (single-process, expires in 1 hour)
let cachedRate: number | null = null
let cachedAt: number | null = null
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export interface FxResult {
  rate: number
  isApproximate: boolean
  lastUpdated?: string
}

export async function getUsdToIlsRate(): Promise<FxResult> {
  // Check in-memory cache
  if (cachedRate && cachedAt && Date.now() - cachedAt < CACHE_TTL_MS) {
    return { rate: cachedRate, isApproximate: !FX_API_URL }
  }

  // Try to fetch from API if configured
  if (FX_API_URL) {
    try {
      const rate = await fetchFromApi()
      if (rate && rate > 0) {
        cachedRate = rate
        cachedAt = Date.now()
        await upsertFxRate('USD', 'ILS', rate)
        return { rate, isApproximate: false, lastUpdated: new Date().toISOString() }
      }
    } catch (err) {
      console.error('[FX] Failed to fetch rate from API:', err)
    }
  }

  // Try DB
  try {
    const dbRate = await getFxRate('USD', 'ILS')
    if (dbRate) {
      cachedRate = dbRate
      cachedAt = Date.now()
      return { rate: dbRate, isApproximate: !FX_API_URL }
    }
  } catch {
    // Ignore DB errors
  }

  // Fallback
  return { rate: FALLBACK_RATE, isApproximate: true }
}

async function fetchFromApi(): Promise<number | null> {
  if (!FX_API_URL) return null

  const res = await fetch(FX_API_URL, { signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error(`FX API returned ${res.status}`)

  const json = await res.json()

  // Support common FX API response formats
  // Format 1: { rates: { ILS: 3.75 } }
  if (json.rates?.ILS) return Number(json.rates.ILS)

  // Format 2: { USD_ILS: 3.75 }
  if (json['USD_ILS']) return Number(json['USD_ILS'])

  // Format 3: { result: "success", rates: { ILS: 3.75 } }
  if (json.result === 'success' && json.rates?.ILS) return Number(json.rates.ILS)

  // Format 4: { data: { ILS: { value: 3.75 } } }
  if (json.data?.ILS?.value) return Number(json.data.ILS.value)

  return null
}

export function convertToIls(usdAmount: number, rate: number): number {
  return Math.round(usdAmount * rate * 100) / 100
}

export function formatIls(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export async function refreshDailyRate(): Promise<void> {
  if (!FX_API_URL) return

  try {
    const rate = await fetchFromApi()
    if (rate && rate > 0) {
      await upsertFxRate('USD', 'ILS', rate)
      cachedRate = rate
      cachedAt = Date.now()
      console.log(`[FX] Rate refreshed: 1 USD = ${rate} ILS`)
    }
  } catch (err) {
    console.error('[FX] Rate refresh failed:', err)
  }
}
