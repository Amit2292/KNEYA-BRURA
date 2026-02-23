/**
 * Hebrew localization service.
 * Uses OpenAI if OPENAI_API_KEY is set; otherwise generates deterministic placeholders.
 */

import type { Product } from '@/lib/db/types'

export interface LocalizedContent {
  title_he: string
  short_summary_he: string
  pros: string[]
  cons: string[]
}

const CATEGORY_CONTEXT: Record<string, string> = {
  'מצלמות דרך': 'מצלמת רכב',
  'מחזיקי טלפון': 'מחזיק טלפון לרכב',
  'תאורת פנים': 'תאורת LED לרכב',
  "גאדג'טים לנסיעה": 'אביזר נסיעה לרכב',
  'צעצועים': 'צעצוע לכלב',
  'טיולים וציוד חוץ': 'ציוד חוץ לכלב',
  'רצועות וקולרים': 'ציוד לכלב',
  'נסיעות ונשיאה': 'תיק/נשאית לכלב',
  'מטענים': 'מטען USB',
  'מעמדים': 'מעמד לטלפון',
  'צילום לטלפון': 'אביזר צילום',
  'כבלים ומתאמים': 'כבל/מתאם',
}

export async function localizeProduct(product: Product, categoryName?: string): Promise<LocalizedContent> {
  if (process.env.OPENAI_API_KEY) {
    return await localizeWithOpenAI(product, categoryName)
  }
  return localizeWithPlaceholders(product, categoryName)
}

async function localizeWithOpenAI(product: Product, categoryName?: string): Promise<LocalizedContent> {
  const { default: OpenAI } = await import('openai')
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const context = categoryName ? CATEGORY_CONTEXT[categoryName] ?? categoryName : 'מוצר'

  const prompt = `אתה כותב תוכן בעברית לאתר קניות.
מוצר: "${product.title_raw}"
קטגוריה: ${context}

כתוב בעברית תמציתית ישרה (ללא הגזמה). חובה:
1. שם מוצר קצר בעברית (עד 8 מילים)
2. סיכום קצר (עד 2 משפטים) כולל "למי זה מתאים" ו"למי פחות מתאים"
3. 3 יתרונות (כל אחד עד 6 מילים)
4. 3 חסרונות (כל אחד עד 6 מילים)

חוקים:
- אל תשתמש בפסיק גרשיים (") בתוך משפטים
- אל תשתמש במקף ארוך (-)
- סגנון: ישיר, שקוף, ללא הייפ

ענה בפורמט JSON בלבד:
{
  "title_he": "...",
  "short_summary_he": "...",
  "pros": ["...", "...", "..."],
  "cons": ["...", "...", "..."]
}`

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 400,
    temperature: 0.3,
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('No OpenAI response')

  const parsed = JSON.parse(content)
  return {
    title_he: sanitizeHebrew(parsed.title_he ?? ''),
    short_summary_he: sanitizeHebrew(parsed.short_summary_he ?? ''),
    pros: (parsed.pros ?? []).map((p: string) => sanitizeHebrew(p)).slice(0, 3),
    cons: (parsed.cons ?? []).map((c: string) => sanitizeHebrew(c)).slice(0, 3),
  }
}

function sanitizeHebrew(text: string): string {
  // Remove em dashes and replace with hyphen
  return text
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .trim()
}

function localizeWithPlaceholders(product: Product, categoryName?: string): LocalizedContent {
  const context = categoryName ? CATEGORY_CONTEXT[categoryName] ?? categoryName : 'מוצר'

  // Deterministic title - take first meaningful words from raw title
  const words = product.title_raw
    .replace(/[^\w\s]/g, ' ')
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 4)
    .join(' ')

  const title_he = `${context} - ${words}`.slice(0, 60)

  const short_summary_he = `${context} איכותי עם ביקורות טובות. מתאים למי שמחפש מוצר אמין במחיר סביר. פחות מתאים למי שזקוק לאחריות ישראלית.`

  const prosTemplates: Record<string, string[]> = {
    'מצלמות דרך': ['רזולוציה גבוהה', 'קלה להתקנה', 'מחיר נמוך למתחילים'],
    'מחזיקי טלפון': ['מחיר נגיש', 'תואם רוב הטלפונים', 'קל להסרה'],
    'תאורת פנים': ['צבעים מגוונים', 'התקנה ללא כלים', 'חיסכון בחשמל'],
    "גאדג'טים לנסיעה": ['שימושי לנסיעות', 'קל ונוח', 'אחסון יעיל'],
    'צעצועים': ['מגרה נפשית', 'חומר עמיד', 'קל לניקוי'],
    'טיולים וציוד חוץ': ['קל לנשיאה', 'חומר עמיד', 'מתאים לכל מזג אוויר'],
    'רצועות וקולרים': ['חזק ועמיד', 'חזרה בטוחה', 'עיצוב פשוט'],
    'נסיעות ונשיאה': ['מאושר לטיסות', 'קל משקל', 'אחסון נוח'],
    'מטענים': ['טעינה מהירה', 'כמה פורטים', 'טכנולוגיית GaN'],
    'מעמדים': ['זווית מתכווננת', 'אלומיניום קל', 'מתקפל לשינוע'],
    'צילום לטלפון': ['שיפור ניכר בצילום', 'קל לחיבור', 'מתאים לסמארטפון'],
    'כבלים ומתאמים': ['תמיכה בתקן', 'עמיד לשימוש', 'מהיר ויעיל'],
  }

  const consTemplates: Record<string, string[]> = {
    'מצלמות דרך': ['אין אחריות ישראלית', 'אפליקציה בסינית', 'הוראות לא בעברית'],
    'מחזיקי טלפון': ['פלסטיק בסיסי', 'לא לטלפונים גדולים', 'עשוי להתרופף עם הזמן'],
    'תאורת פנים': ['אין שלט רחוק', 'חוט חשוף', 'עלול להפריע בלילה'],
    "גאדג'טים לנסיעה": ['חומר לא פרימיום', 'גודל לא לכולם', 'ניחוח פלסטיק חדש'],
    'צעצועים': ['לא לכלבים אגרסיביים', 'גודל בינוני בלבד', 'צבעים עלולים להתפוגג'],
    'טיולים וציוד חוץ': ['לא מיועד לגשם כבד', 'מידות מוגבלות', 'ריפוד בסיסי'],
    'רצועות וקולרים': ['מידות מוגבלות', 'ללא ריפוד', 'נעילה פשוטה'],
    'נסיעות ונשיאה': ['לא מומלץ לכלבים גדולים', 'אוורור מוגבל', 'ייתכן עיכוב בהגעה'],
    'מטענים': ['כבל לא כלול', 'ללא תעודה ישראלית', 'אין אחריות מקומית'],
    'מעמדים': ['יציבות בינונית', 'לא לטאבלטים', 'גמישות מוגבלת'],
    'צילום לטלפון': ['לא לכל דגם', 'איכות לא כמו מקצועי', 'ייתכן עיוות בשוליים'],
    'כבלים ומתאמים': ['אין אחריות מקומית', 'לא לכל מכשיר', 'ייתכן עיכוב במשלוח'],
  }

  const catName = categoryName ?? ''
  const pros = prosTemplates[catName] ?? ['מחיר תחרותי', 'ביקורות טובות', 'משלוח מהיר יחסית']
  const cons = consTemplates[catName] ?? ['אין אחריות ישראלית', 'הוראות לא בעברית', 'זמן אספקה ארוך יחסית']

  return { title_he, short_summary_he, pros: pros.slice(0, 3), cons: cons.slice(0, 3) }
}
