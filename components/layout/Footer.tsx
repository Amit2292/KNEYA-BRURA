import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400 text-sm" dir="rtl">
      <p className="mb-2">&copy; {new Date().getFullYear()} {SITE_CONFIG.name} - כל הזכויות שמורות</p>
      <p className="max-w-2xl mx-auto leading-relaxed mb-4">
        חלק מהקישורים באתר הם קישורי שותפים. אם תקנו דרך הקישור, ייתכן שנקבל עמלה קטנה ללא עלות נוספת עבורכם.
      </p>
      <div className="flex justify-center gap-6 flex-wrap">
        <Link href="/disclaimer" className="hover:text-primary transition-colors">גילוי נאות</Link>
        <Link href="/privacy" className="hover:text-primary transition-colors">מדיניות פרטיות</Link>
        <Link href="/terms" className="hover:text-primary transition-colors">תנאי שימוש</Link>
      </div>
    </footer>
  )
}
