import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: 'מדיניות פרטיות',
  description: 'מדיניות הפרטיות של קנייה-ברורה.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">מדיניות פרטיות</h1>
      <p className="text-sm text-gray-500 mb-8">עדכון אחרון: ינואר 2025</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">מידע שאנחנו אוספים</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>לוגים של צפיות בדפים (ללא זיהוי אישי)</li>
            <li>לחיצות על קישורי שותפים (אנונימי)</li>
            <li>קובצי עוגיות אנליטיקה (אם מותקן)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">מה אנחנו לא עושים</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>לא מוכרים מידע לצדדים שלישיים</li>
            <li>לא מאחסנים פרטי תשלום</li>
            <li>לא דורשים הרשמה לשימוש</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">צדדים שלישיים</h2>
          <p className="text-sm">
            AliExpress עשויה לאסוף מידע כשאתם עוברים לאתר שלהם. עיינו במדיניות הפרטיות של AliExpress.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">יצירת קשר</h2>
          <p className="text-sm">
            לשאלות בנוגע לפרטיות: <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-brand-600 hover:underline">{SITE_CONFIG.contactEmail}</a>
          </p>
        </section>
      </div>
    </div>
  )
}
