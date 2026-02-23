import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'איך זה עובד',
  description: 'הסבר על משלוח, תשלום, מכס, החזרות ועוד - הכל על קנייה מאליאקספרס לישראל.',
}

const faq = [
  {
    q: 'כמה זמן לוקח המשלוח לישראל?',
    a: 'בדרך כלל 15-35 ימי עסקים. בעונות עמוסות (סייל 11/11, חגים) עד 60 יום. אנחנו מציגים זמן משוער בכל מוצר.',
  },
  {
    q: 'כמה עולה המשלוח?',
    a: 'רוב המוצרים כוללים משלוח חינם. מוצרים כבדים או גדולים עלולים לכלול עלות משלוח. אנחנו מציגים בבירור "משלוח חינם" כשרלוונטי.',
  },
  {
    q: 'האם יש מכס בישראל?',
    a: 'הזמנות מעל 75 דולר עשויות לחויב במע"מ ומכס בישראל, לפי תקנות המכס. מוצרים מסוימים פטורים. המחיר שאנחנו מציגים הוא לפני מכס אפשרי.',
  },
  {
    q: 'איך מחזירים מוצר?',
    a: 'ניתן לפתוח מחלוקת דרך מרכז ההגנה של AliExpress תוך 60 ימים מקבלת ההזמנה. שמרו תמונות של המוצר עם הגעתו.',
  },
  {
    q: 'האם התשלום בטוח?',
    a: 'התשלום מבוצע ישירות באתר AliExpress בהצפנה מאובטחת. אנחנו לא מקבלים פרטי תשלום ואיננו מעורבים בעסקה.',
  },
  {
    q: 'מה ה-AliExpress Protection?',
    a: 'AliExpress מציעה הגנת קונים - כסף מוחזר אם מוצר לא הגיע או לא תואם לתיאור. הגנה פעילה עד לפתיחת מחלוקת.',
  },
  {
    q: 'איך עובד דירוג האמון שלכם?',
    a: 'דירוג האמון (0-100) מחשב: דירוג הקונים (עד 45 נקודות), מספר ההזמנות (עד 35 נקודות), ציון המוכר (עד 20 נקודות). 80+ = מומלץ מאוד.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">איך זה עובד</h1>
      <p className="text-lg text-gray-600 mb-10">
        אנחנו מאגדים מוצרים מ-AliExpress ומציגים מידע ברור: מחיר בשקלים, זמן משלוח ודירוג אמינות - כדי שתוכלו לקנות בביטחון.
      </p>

      {/* Steps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">4 שלבים פשוטים</h2>
        <div className="space-y-4">
          {[
            { step: '1', title: 'בחרו מוצר', desc: 'גלשו בקטגוריות ומצאו מוצרים עם דירוג אמון גבוה.' },
            { step: '2', title: 'בדקו מחיר ומשלוח', desc: 'ראו מחיר ברור בשקלים - כולל משלוח וסה"כ. פלוס זמן הגעה משוער.' },
            { step: '3', title: 'לחצו "קנה עכשיו"', desc: 'תועברו ישירות לדף המוצר ב-AliExpress. התשלום מתבצע שם בלבד.' },
            { step: '4', title: 'קבלו את המוצר', desc: 'AliExpress שולחת ישירות לביתכם. מעקב שילוח זמין באתר AliExpress.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start bg-white border border-gray-200 rounded-xl p-5">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">שאלות נפוצות</h2>
        <div className="space-y-4">
          {faq.map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
              <p className="text-sm text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate disclosure */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-semibold text-amber-900 mb-2">גילוי נאות</h3>
        <p className="text-sm text-amber-800">
          אם תקנו דרך הקישורים באתר, ייתכן שנקבל עמלה קטנה ללא עלות נוספת עבורכם. זה עוזר לנו לממן את השירות.
        </p>
        <Link href="/disclaimer" className="text-sm text-amber-700 hover:underline mt-2 inline-block">
          קרא עוד בעמוד גילוי נאות
        </Link>
      </div>
    </div>
  )
}
