'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SearchBarProps {
  size?: 'lg' | 'sm'
  defaultValue?: string
  placeholder?: string
}

export function SearchBar({ size = 'lg', defaultValue = '', placeholder = 'חפש מוצר או קטגוריה...' }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const isLarge = size === 'lg'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex items-center bg-white rounded-xl shadow-xl shadow-primary/5 p-1.5 border border-slate-200 ${isLarge ? '' : 'shadow-sm'}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-900 ${isLarge ? 'text-base' : 'text-sm'}`}
        />
        <button
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
          aria-label="חיפוש"
        >
          <span>{isLarge ? 'מצא דיל' : 'חפש'}</span>
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>
      </div>
    </form>
  )
}
