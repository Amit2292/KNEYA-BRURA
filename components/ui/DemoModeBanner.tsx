export function DemoModeBanner() {
  const isDemoMode = !process.env.AE_APP_KEY

  if (!isDemoMode) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 text-center text-sm text-amber-800" dir="rtl">
      <strong>מצב הדגמה</strong> - מוצגים נתוני דוגמה. לחיבור לאליאקספרס הגדר AE_APP_KEY בקובץ .env
    </div>
  )
}
