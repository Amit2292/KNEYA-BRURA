'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SITE_CONFIG } from '@/config/site'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-700">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/categories" className="hover:text-brand-600 transition-colors">קטגוריות</Link>
            <Link href="/deals" className="hover:text-brand-600 transition-colors">מבצעים</Link>
            <Link href="/guides" className="hover:text-brand-600 transition-colors">מדריכים</Link>
            <Link href="/how-it-works" className="hover:text-brand-600 transition-colors">איך זה עובד</Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="פתח תפריט"
          >
            <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-700"></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden py-3 border-t border-gray-100 flex flex-col gap-3 text-sm font-medium text-gray-700">
            <Link href="/categories" onClick={() => setMenuOpen(false)} className="hover:text-brand-600">קטגוריות</Link>
            <Link href="/deals" onClick={() => setMenuOpen(false)} className="hover:text-brand-600">מבצעים</Link>
            <Link href="/guides" onClick={() => setMenuOpen(false)} className="hover:text-brand-600">מדריכים</Link>
            <Link href="/how-it-works" onClick={() => setMenuOpen(false)} className="hover:text-brand-600">איך זה עובד</Link>
          </nav>
        )}
      </div>
    </header>
  )
}
