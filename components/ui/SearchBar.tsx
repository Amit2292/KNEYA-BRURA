'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SearchBarProps {
  size?: 'lg' | 'sm'
  defaultValue?: string
  placeholder?: string
}

export function SearchBar({ size = 'lg', defaultValue = '', placeholder = 'חפשו מוצר, קטגוריה או מותג...' }: SearchBarProps) {
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
      <div className={`relative flex items-center bg-white rounded-full border border-gray-200 shadow-sm ${isLarge ? 'h-12' : 'h-10'}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none pr-4 pl-12 ${isLarge ? 'text-base' : 'text-sm'} text-gray-700 placeholder-gray-400`}
        />
        <button
          type="submit"
          className="absolute left-2 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:bg-primary-700"
          aria-label="חיפוש"
        >
          <span className="material-symbols-outlined text-lg">search</span>
        </button>
      </div>
    </form>
  )
}
