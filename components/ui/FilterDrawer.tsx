'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface FilterState {
  minRating?: number
  minPrice?: number
  maxPrice?: number
  freeShippingOnly?: boolean
  minTrustScore?: number
  sortBy?: string
}

export function FilterDrawer() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const currentFilters: FilterState = {
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    freeShippingOnly: searchParams.get('freeShipping') === '1',
    minTrustScore: searchParams.get('minTrust') ? Number(searchParams.get('minTrust')) : undefined,
    sortBy: searchParams.get('sortBy') ?? 'trust_score',
  }

  const applyFilters = useCallback((filters: FilterState) => {
    const params = new URLSearchParams()
    if (filters.minRating) params.set('minRating', String(filters.minRating))
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters.freeShippingOnly) params.set('freeShipping', '1')
    if (filters.minTrustScore) params.set('minTrust', String(filters.minTrustScore))
    if (filters.sortBy && filters.sortBy !== 'trust_score') params.set('sortBy', filters.sortBy)

    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }, [router, pathname])

  return (
    <div dir="rtl">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <span>סינון ומיון</span>
        <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Filter panel */}
      {isOpen && (
        <FilterPanel
          current={currentFilters}
          onApply={applyFilters}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

interface FilterPanelProps {
  current: FilterState
  onApply: (filters: FilterState) => void
  onClose: () => void
}

function FilterPanel({ current, onApply, onClose }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(current)

  return (
    <div className="mt-2 p-5 border border-gray-200 rounded-xl bg-white shadow-lg w-full max-w-sm" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">סינון ומיון</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      {/* Sort */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">מיון לפי</label>
        <select
          value={filters.sortBy ?? 'trust_score'}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="trust_score">דירוג אמון</option>
          <option value="rating">דירוג קונים</option>
          <option value="orders_count">פופולריות</option>
          <option value="price_ils">מחיר - מנמוך לגבוה</option>
        </select>
      </div>

      {/* Min Trust Score */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">אמינות מינימלית</label>
        <div className="flex gap-2">
          {[
            { label: 'הכל', value: undefined },
            { label: 'בחירה טובה (50+)', value: 50 },
            { label: 'קנייה בטוחה (65+)', value: 65 },
            { label: 'מומלץ (80+)', value: 80 },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => setFilters({ ...filters, minTrustScore: opt.value })}
              className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                filters.minTrustScore === opt.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-gray-300 hover:border-brand-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Free shipping */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.freeShippingOnly ?? false}
            onChange={(e) => setFilters({ ...filters, freeShippingOnly: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">משלוח חינם בלבד</span>
        </label>
      </div>

      {/* Min rating */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">דירוג מינימלי</label>
        <select
          value={filters.minRating ?? ''}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">הכל</option>
          <option value="4.5">4.5 ומעלה ★★★★★</option>
          <option value="4.0">4.0 ומעלה ★★★★</option>
          <option value="3.5">3.5 ומעלה ★★★</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onApply(filters)}
          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 rounded-lg text-sm transition-colors"
        >
          החל סינון
        </button>
        <button
          onClick={() => {
            setFilters({})
            onApply({})
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          נקה
        </button>
      </div>
    </div>
  )
}
