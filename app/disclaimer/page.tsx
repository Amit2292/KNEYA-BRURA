import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: 'גילוי נאות - שיווק שותפים',
  description: 'מדיניות שיווק השותפים של קנייה-ברורה. שקיפות מלאה על עמלות.',
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">גילוי נאות</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <p className="text-lg">
          {SITE_CONFIG.name} הוא אתר שיווק שותפים (Affiliate Marketing).
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">מה זה אומר?</h2>
          <p>
            חלק מהקישורים באתר זה הם קישורי שותפים. כשאתם לוחצים על קישור ומבצעים רכישה ב-AliExpress, אנחנו עשויים לקבל עמלה קטנה מ-AliExpress - ללא עלות נוספת עבורכם.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">האם זה משפיע על המחירים?</h2>
          <p>
            לא. המחיר שאתם משלמים הוא זהה בין אם הגעתם דרכנו ובין אם לא. העמלה שולמת על ידי AliExpress ולא מתווספת למחיר.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">האם זה משפיע על המלצות שלנו?</h2>
          <p>
            אנחנו מנסים להציג מוצרים על בסיס דירוג אמון אובייקטיבי - דירוג קונים, מספר הזמנות וציון מוכר. עם זאת, חשוב שתדעו שיש לנו אינטרס כלכלי.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">שקיפות לגבי מחירים</h2>
          <p>
            המחירים מוצגים בשקלים חדשים (ILS) על בסיס שער המרה. השערים עשויים להשתנות. המחיר הסופי נקבע ב-AliExpress בזמן הרכישה בפועל.
          </p>
          <p className="mt-2">
            ייתכן מע"מ או מכס על הזמנות הנכנסות לישראל בהתאם לחוק ולסכום הקנייה.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">תוכנית השותפים של AliExpress</h2>
          <p>
            אנחנו משתתפים בתוכנית AliExpress Affiliate Program. כל הרכישות מבוצעות ישירות ב-AliExpress, ואנחנו לא צד לעסקה.
          </p>
        </section>
      </div>

      <div className="mt-10 p-5 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm font-semibold text-blue-900 mb-1">שורת גילוי נאות שמופיעה באתר:</p>
        <p className="text-sm text-blue-700 italic">{SITE_CONFIG.affiliateDisclosure}</p>
      </div>
    </div>
  )
}
