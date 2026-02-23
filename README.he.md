# קנייה-ברורה - README

**מחיר ברור, משלוח ברור, קליק אחד לקנייה**

אתר שיווק שותפים לישראל - מציג מוצרים מ-AliExpress עם מחיר ברור בשקלים, זמן משלוח ודירוג אמינות.

---

## תוכן עניינים

1. [דרישות מוקדמות](#דרישות-מוקדמות)
2. [הגדרת Supabase](#הגדרת-supabase)
3. [הגדרת משתני סביבה](#הגדרת-משתני-סביבה)
4. [הרצה מקומית](#הרצה-מקומית)
5. [פריסה ל-Vercel](#פריסה-ל-vercel)
6. [הגדרת Cron Jobs](#הגדרת-cron-jobs)
7. [הגדרת API AliExpress](#הגדרת-api-aliexpress)
8. [מצב הדגמה](#מצב-הדגמה)
9. [פתרון בעיות](#פתרון-בעיות)

---

## דרישות מוקדמות

- Node.js 20+
- חשבון Supabase (חינמי מספיק ל-MVP)
- חשבון Vercel (חינמי)
- מפתחות API של AliExpress (אופציונלי - ניתן לעבוד במצב הדגמה)

---

## הגדרת Supabase

### 1. יצירת פרויקט

1. גשו ל-[supabase.com](https://supabase.com) וצרו חשבון
2. לחצו "New Project"
3. בחרו שם, סיסמת DB, ואזור קרוב (Frankfurt/EU מומלץ)
4. המתינו לסיום האתחול (כ-2 דקות)

### 2. הרצת Migrations

1. בלוח הבקרה של Supabase לחצו על **SQL Editor**
2. העתיקו והריצו את הקבצים לפי הסדר:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`

### 3. הגדרת Auth

1. ב-Supabase לחצו **Authentication > Settings**
2. כבו "Enable email confirmations" לפיתוח
3. צרו משתמש מנהל: **Authentication > Users > Add user**
4. הכניסו אימייל וסיסמה

### 4. הוספת מנהל לטבלת admins

הריצו ב-SQL Editor:

```sql
INSERT INTO admins (user_id, email)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-admin@example.com'),
  'your-admin@example.com'
);
```

---

## הגדרת משתני סביבה

### 1. העתקת קובץ הדוגמה

```bash
cp .env.example .env.local
```

### 2. מילוי הערכים

פתחו `.env.local` ומלאו:

**Supabase (חובה):**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

מצאו את הערכים ב-Supabase > Settings > API

**Admin:**
```
ADMIN_EMAILS=your-admin@example.com
```

**Cron Secret:**
```
CRON_SECRET=סיסמה-ארוכה-ואקראית-כאן
```

**AliExpress (אופציונלי - ראו מצב הדגמה):**
```
AE_APP_KEY=your_app_key
AE_APP_SECRET=your_app_secret
AE_TRACKING_ID=your_tracking_id
```

**FX (אופציונלי):**
```
FX_FALLBACK_RATE_ILS=3.75
# FX_API_URL=https://api.exchangerate-api.com/v4/latest/USD
```

**Next.js Public:**
```
NEXT_PUBLIC_SITE_URL=https://your-domain.co.il
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## הרצה מקומית

> **חשוב:** כל הפקודות הבאות חייבות לרוץ מתוך תיקיית הפרויקט `kenya-brura`.
> אם אתם בתיקיית הבית (`~`) - עברו לפרויקט קודם:

```bash
cd kenya-brura
```

### 1. התקנת תלויות

```bash
npm install
```

### 2. הרצת Seed

```bash
npm run seed
```

הסקריפט יוסיף קטגוריות ו-12 מוצרי דוגמה.

### 3. הפעלת שרת הפיתוח

```bash
npm run dev
```

האתר יהיה זמין ב-[http://localhost:3000](http://localhost:3000)

לוח הבקרה: [http://localhost:3000/admin](http://localhost:3000/admin)

### 4. הרצת Cron ידנית (פיתוח)

```bash
# סנכרון יומי
npm run cron:daily-sync

# רענון מחירים
npm run cron:price-refresh

# לוקליזציה
npm run cron:localize
```

**הערה:** הריצו עם CRON_SECRET מוגדר ב-.env.local

---

## פריסה ל-Vercel

### 1. דחיפת קוד ל-GitHub

```bash
git init
git add .
git commit -m "init: kenya-brura affiliate site"
git remote add origin https://github.com/username/kenya-brura.git
git push -u origin main
```

### 2. חיבור ל-Vercel

1. גשו ל-[vercel.com](https://vercel.com)
2. לחצו "New Project"
3. ייבאו את ה-repo מ-GitHub
4. Vercel יזהה אוטומטית את Next.js

### 3. הגדרת משתני סביבה ב-Vercel

ב-Vercel Dashboard > Project > Settings > Environment Variables:

הוסיפו את כל משתני הסביבה מ-.env.local (כולל NEXT_PUBLIC_*)

**חשוב:** הוסיפו גם לסביבת Preview ו-Production

### 4. Deploy ראשוני

לחצו "Deploy" - הפריסה תימשך כ-3-5 דקות.

### 5. הגדרת Domain מותאם

1. ב-Vercel > Settings > Domains
2. הוסיפו את הדומיין שלכם
3. הוסיפו CNAME records ב-DNS provider
4. עדכנו `NEXT_PUBLIC_SITE_URL` לדומיין החדש

---

## הגדרת Cron Jobs

### Vercel Cron (ייצור)

Cron Jobs מוגדרים ב-`vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/daily-sync", "schedule": "30 3 * * *" },
    { "path": "/api/cron/price-refresh", "schedule": "0 */12 * * *" },
    { "path": "/api/cron/localize", "schedule": "0 * * * *" }
  ]
}
```

**לאפשר Cron ב-Vercel:**
1. Vercel > Project > Settings > Cron Jobs
2. ודאו שה-plan שלכם תומך ב-Cron (Pro plan)
3. **חלופה חינמית:** השתמשו ב-[cron-job.org](https://cron-job.org) עם Auth header

**אבטחת Cron עם CRON_SECRET:**

ב-Vercel, Cron Requests נשלחות עם Authorization header אוטומטי.
וודאו שה-`CRON_SECRET` מוגדר ב-Environment Variables.

### הרצה ידנית

```bash
curl -X POST https://your-domain.co.il/api/cron/daily-sync \
  -H "x-cron-secret: YOUR_CRON_SECRET"
```

---

## הגדרת API AliExpress

### 1. רישום לתוכנית שותפים

1. גשו ל-[portals.aliexpress.com](https://portals.aliexpress.com)
2. צרו חשבון ובקשו אישור כ-Affiliate
3. לאחר אישור: My Account > Developer > Create App

### 2. קבלת מפתחות

- `APP_KEY` - מזהה האפליקציה
- `APP_SECRET` - סוד האפליקציה (שמרו בבטחה!)
- `TRACKING_ID` - מזהה מעקב לעמלות

### 3. עדכון Category IDs

ב-`config/categories.ts` עדכנו `ae_category_id` לפי תיעוד AliExpress API:

```typescript
{ slug: 'dash-cameras', name_he: 'מצלמות דרך', ae_category_id: 'REAL_ID_HERE' }
```

לרשימת Category IDs הרשמיים - בדקו ב-AliExpress Portals > API Documentation.

### 4. אימות חיבור

```bash
# בדיקה שהסנכרון עובד
npm run cron:daily-sync
```

---

## מצב הדגמה

**אם AE_APP_KEY לא מוגדר**, האתר רץ אוטומטית במצב הדגמה:

- מוצגים 12 מוצרי דוגמה מ-`lib/aliexpress/mock.ts`
- קישורי שותפים הם דוגמה בלבד
- כל שאר הפונקציות עובדות רגיל (מסד נתונים, חישוב מחיר, trust score)
- באנר "מצב הדגמה" מוצג בראש האתר

**לצאת ממצב הדגמה:** הוסיפו AE_APP_KEY ל-.env.local

---

## פתרון בעיות

### שגיאת "npm error Missing script: seed / dev"

הפקודה רצה מחוץ לתיקיית הפרויקט. עברו לתיקייה הנכונה:

```bash
cd ~/Documents/GitHub/sp500-predictor/kenya-brura
npm run seed
npm run dev
```

### שגיאת "Missing SUPABASE_URL"

וודאו שקובץ `.env.local` קיים ומכיל את כל הערכים הנדרשים.

### מוצרים לא מוצגים

1. הריצו `npm run seed` להוספת נתוני דוגמה
2. בדקו שה-migration רץ בהצלחה ב-Supabase

### שגיאות API AliExpress

**"Invalid sign"** - ודאו ש-AE_APP_SECRET נכון
**"API rate limit"** - האתר מגביל בקשות אוטומטית, המתינו כמה דקות
**"Method not found"** - ודאו ש-AE_API_BASE_URL נכון לפי האזור שלכם

### Cron לא רץ

1. וודאו שCRON_SECRET מוגדר ב-Vercel Environment Variables
2. בדקו את לוח הבקרה Vercel > Cron Jobs
3. הריצו ידנית עם curl לבדיקה

### שגיאות RTL

כל הרכיבים כוללים `dir="rtl"`. אם נראה שבר layout - בדקו שה-html root כולל `dir="rtl"`.

### לוקליזציה לא עובדת

- ללא OPENAI_API_KEY: הלוקליזציה מייצרת טקסט placeholder - תקין
- עם OPENAI_API_KEY: וודאו שהמפתח תקין ויש קרדיטים

### הוספת קטגוריות חדשות

1. עדכנו `config/categories.ts`
2. הריצו `npm run seed` (אין מחיקה, רק upsert)
3. הריצו `npm run cron:daily-sync` לסנכרון מוצרים

---

## מבנה הפרויקט

```
kenya-brura/
- app/                  # Next.js App Router
  - (public)/          # דפים ציבוריים
  - admin/             # לוח בקרה
  - api/               # API routes
  - c/[slug]/          # קטגוריות
  - p/[slug]/          # דפי מוצר
  - go/[slug]/         # מעקב קליקים + redirect
- components/          # React components
  - layout/            # Header, Footer
  - product/           # ProductCard, PriceBlock, TrustBadge...
  - ui/                # FilterDrawer, DemoModeBanner
  - admin/             # ProductEditForm
- lib/                 # Logic
  - aliexpress/        # API client
  - auth/              # Admin auth
  - db/                # Supabase queries
  - fx/                # שער חליפין
  - guides/            # מדריכים (Markdown)
  - localize/          # תרגום לעברית
  - seo/               # Metadata, JSON-LD
  - sync/              # סנכרון מוצרים
  - trust/             # חישוב Trust Score
- config/              # קטגוריות, הגדרות אתר
- content/guides/      # מדריכים (Markdown)
- scripts/             # seed.ts
- supabase/migrations/ # SQL migrations
```

---

## הוספת מוצרים ידנית

ניתן להוסיף מוצרים ישירות דרך לוח הבקרה:
1. `/admin/products`
2. לחצו "ערוך" על מוצר קיים
3. עדכנו שם עברי, סיכום, יתרונות וחסרונות

---

## אחריות ורישיון

- קוד זה ניתן לשימוש לפרויקטים אישיים ומסחריים
- ודאו שאתם עומדים בתנאי השירות של AliExpress Affiliate Program
- הצגת גילוי נאות מלא לפני כל CTA - כבר מובנה בקוד

---

*קנייה-ברורה - שקיפות מלאה בכל קנייה*
