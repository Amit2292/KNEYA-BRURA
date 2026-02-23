import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: 'תנאי שימוש',
  description: 'תנאי השימוש של קנייה-ברורה.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">תנאי שימוש</h1>
      <p className="text-sm text-gray-500 mb-8">עדכון אחרון: ינואר 2025</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">שימוש באתר</h2>
          <p className="text-sm">
            {SITE_CONFIG.name} הוא אתר מידע ושיווק שותפים. השימוש באתר מותנה בהסכמה לתנאים אלה.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">אחריות מחירים</h2>
          <p className="text-sm">
            המחירים המוצגים הם משוערים ועשויים להשתנות. המחיר הסופי נקבע ב-AliExpress בזמן הרכישה. אנחנו לא אחראים לשינויי מחיר.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">מוצרים ואחריות</h2>
          <p className="text-sm">
            אנחנו לא מוכרים מוצרים ישירות. כל הרכישות מבוצעות דרך AliExpress. אנחנו לא אחראים לאיכות המוצרים, זמני משלוח, או בעיות עסקה.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">הגבלת אחריות</h2>
          <p className="text-sm">
            האתר מסופק "כמו שהוא". אין אנו אחראים לנזקים ישירים או עקיפים הנובעים מהשימוש באתר.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">יצירת קשר</h2>
          <p className="text-sm">
            לשאלות: <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-brand-600 hover:underline">{SITE_CONFIG.contactEmail}</a>
          </p>
        </section>
      </div>
    </div>
  )
}
