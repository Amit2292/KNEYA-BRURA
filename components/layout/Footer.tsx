import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">{SITE_CONFIG.name}</h3>
            <p className="text-sm text-gray-600">{SITE_CONFIG.tagline}</p>
            <p className="text-xs text-gray-500 mt-3">{SITE_CONFIG.affiliateDisclosure}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">ניווט</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/categories" className="hover:text-brand-600">קטגוריות</Link></li>
              <li><Link href="/deals" className="hover:text-brand-600">מבצעים</Link></li>
              <li><Link href="/guides" className="hover:text-brand-600">מדריכים</Link></li>
              <li><Link href="/how-it-works" className="hover:text-brand-600">איך זה עובד</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">משפטי</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/disclaimer" className="hover:text-brand-600">גילוי נאות</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-600">מדיניות פרטיות</Link></li>
              <li><Link href="/terms" className="hover:text-brand-600">תנאי שימוש</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-xs text-gray-500 text-center">
          <p>
            {SITE_CONFIG.name} הוא אתר שיווק שותפים. רכישה דרך הקישורים עשויה להניב לנו עמלה ללא עלות נוספת עבורכם.
          </p>
          <p className="mt-1">
            {SITE_CONFIG.priceDisclaimer}
          </p>
          <p className="mt-2 text-gray-400">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
