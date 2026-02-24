'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SORT_OPTIONS = [
  { key: 'price', label: 'מחיר', icon: 'attach_money' },
  { key: 'trust_score', label: 'ציון אמון', icon: 'verified' },
  { key: 'newest', label: 'חדש ביותר', icon: 'schedule' },
  { key: 'brand', label: 'מותג', icon: 'label' },
] as const

export function FilterChips() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSort = searchParams.get('sort') ?? ''

  function handleSort(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (activeSort === key) {
      params.delete('sort')
    } else {
      params.set('sort', key)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1" dir="rtl">
      {SORT_OPTIONS.map((option) => {
        const isActive = activeSort === option.key
        return (
          <button
            key={option.key}
            onClick={() => handleSort(option.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              isActive
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{option.icon}</span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
