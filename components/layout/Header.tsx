'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_CONFIG } from '@/config/site'

export function Header() {
  const pathname = usePathname()
  const isProductPage = pathname.startsWith('/p/')

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side (in RTL: left = end): menu + search */}
        <div className="flex items-center gap-1">
          {isProductPage ? (
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-600">arrow_forward</span>
            </Link>
          ) : (
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-600">menu</span>
            </button>
          )}
          <Link href="/search" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-600">search</span>
          </Link>
        </div>

        {/* Right side (in RTL: right = start): logo + icon */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-primary">{SITE_CONFIG.name}</span>
          <span className="material-symbols-outlined text-primary text-3xl">shopping_cart_checkout</span>
        </Link>
      </div>
    </header>
  )
}
