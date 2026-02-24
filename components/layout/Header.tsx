'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_CONFIG } from '@/config/site'

export function Header() {
  const pathname = usePathname()
  const isProductPage = pathname.startsWith('/p/')

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Right side: back arrow on product pages, logo otherwise */}
          {isProductPage ? (
            <Link href="/" className="p-2 -mr-2 rounded-lg hover:bg-gray-100">
              <span className="material-symbols-outlined text-gray-700">arrow_forward</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold text-brand-700">{SITE_CONFIG.name}</span>
            </Link>
          )}

          {/* Center: site name on product pages */}
          {isProductPage && (
            <Link href="/" className="text-sm font-bold text-brand-700">
              {SITE_CONFIG.name}
            </Link>
          )}

          {/* Left side */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 rounded-lg hover:bg-gray-100">
              <span className="material-symbols-outlined text-gray-700">search</span>
            </Link>

            {/* Desktop nav */}
            {!isProductPage && (
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 mr-4">
                <Link href="/categories" className="hover:text-brand-600 transition-colors">קטגוריות</Link>
                <Link href="/deals" className="hover:text-brand-600 transition-colors">מבצעים</Link>
                <Link href="/guides" className="hover:text-brand-600 transition-colors">מדריכים</Link>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
