'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

interface AffiliateCTAProps {
  productSlug: string
  hasAffiliateLink: boolean
  className?: string
  sticky?: boolean
}

export function AffiliateCTA({ productSlug, hasAffiliateLink, className = '', sticky = false }: AffiliateCTAProps) {
  const href = hasAffiliateLink ? `/go/${productSlug}` : `/p/${productSlug}`

  return (
    <div
      className={`${sticky ? 'fixed bottom-0 right-0 left-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50 md:relative md:border-0 md:shadow-none md:p-0' : ''} ${className}`}
      dir="rtl"
    >
      <Link
        href={href}
        target={hasAffiliateLink ? '_blank' : undefined}
        rel={hasAffiliateLink ? 'noopener noreferrer nofollow' : undefined}
        className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-lg py-4 px-8 rounded-xl transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        לקנייה ב-AliExpress
      </Link>
      {!sticky && (
        <p className="text-xs text-gray-500 text-center mt-2 px-2">
          {SITE_CONFIG.affiliateDisclosure}
        </p>
      )}
    </div>
  )
}
