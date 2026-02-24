'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: 'home', label: 'בית' },
  { href: '/categories', icon: 'grid_view', label: 'קטגוריות' },
  { href: '/deals', icon: 'favorite', label: 'מועדפים' },
  { href: '/deals', icon: 'sell', label: 'דילים' },
]

export function BottomNav() {
  const pathname = usePathname()

  // Hide on product pages where sticky CTA takes the bottom
  const isProductPage = pathname.startsWith('/p/')
  if (isProductPage) return null

  return (
    <nav
      className="md:hidden fixed bottom-0 right-0 left-0 z-50 bg-white border-t border-slate-200 pb-safe"
      dir="rtl"
    >
      <div className="max-w-lg mx-auto flex items-center justify-between py-2 px-4">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={`${item.href}-${i}`}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-slate-400 hover:text-primary'
              }`}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'wght' 600, 'FILL' 1" : "'wght' 400, 'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
