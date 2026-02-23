import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { getTopClickedProducts } from '@/lib/db/queries'
import { supabaseAdmin } from '@/lib/db/client'

export default async function AdminAnalyticsPage() {
  await requireAdmin()

  const [topWeekly, topMonthly] = await Promise.all([
    getTopClickedProducts(7, 10),
    getTopClickedProducts(30, 10),
  ])

  // Get category click counts (30 days)
  const { data: recentClicksRaw } = await supabaseAdmin
    .from('clicks')
    .select('product_id, created_at')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  const recentClicks = (recentClicksRaw ?? []) as { product_id: string; created_at: string }[]

  const clicksByDay: Record<string, number> = {}
  for (const click of recentClicks) {
    const day = click.created_at.slice(0, 10)
    clicksByDay[day] = (clicksByDay[day] ?? 0) + 1
  }

  const chartData = Object.entries(clicksByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)

  return (
    <div className="min-h-screen" dir="rtl">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            &larr; לוח בקרה
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">אנליטיקה</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Daily clicks chart - simple bar */}
        {chartData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">לחיצות יומיות (14 ימים אחרונים)</h2>
            <div className="flex items-end gap-1 h-24">
              {chartData.map(([date, count]) => {
                const max = Math.max(...chartData.map(([, c]) => c))
                const height = max > 0 ? Math.round((count / max) * 100) : 0
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">{count}</span>
                    <div
                      className="w-full bg-brand-500 rounded-t"
                      style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                    />
                    <span className="text-xs text-gray-400 rotate-45 origin-right" style={{ fontSize: '9px' }}>
                      {date.slice(5)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Top products this week */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">מוצרים פופולריים - 7 ימים</h2>
            {topWeekly.length === 0 ? (
              <p className="text-sm text-gray-500">אין נתונים</p>
            ) : (
              <ol className="space-y-3">
                {topWeekly.map((item, i) => (
                  <li key={item.product_id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-medium">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 truncate max-w-40">{item.product_id.slice(0, 16)}...</span>
                    </div>
                    <span className="font-semibold text-brand-700">{item.click_count}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">מוצרים פופולריים - 30 ימים</h2>
            {topMonthly.length === 0 ? (
              <p className="text-sm text-gray-500">אין נתונים</p>
            ) : (
              <ol className="space-y-3">
                {topMonthly.map((item, i) => (
                  <li key={item.product_id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-medium">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 truncate max-w-40">{item.product_id.slice(0, 16)}...</span>
                    </div>
                    <span className="font-semibold text-brand-700">{item.click_count}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
