'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: 'home', label: 'בית' },
  { href: '/categories', icon: 'category', label: 'קטגוריות' },
  { href: '/deals', icon: 'local_fire_department', label: 'מבצעים' },
  { href: '/guides', icon: 'menu_book', label: 'מדריכים' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 right-0 left-0 z-50 bg-white border-t border-gray-200 pb-safe"
      dir="rtl"
    >
      <div className="flex items-stretch">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-primary-600'
              }`}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'wght' 600, 'FILL' 1" : "'wght' 400, 'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
