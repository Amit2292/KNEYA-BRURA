import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { getRecentSyncJobs, getTopClickedProducts } from '@/lib/db/queries'
import { supabaseAdmin } from '@/lib/db/client'
import type { SyncJob } from '@/lib/db/types'

async function getProductCount(): Promise<number> {
  try {
    const r = await supabaseAdmin.from('products').select('id', { count: 'exact', head: true })
    return (r.count as number | null) ?? 0
  } catch { return 0 }
}

async function getClickCount(): Promise<number> {
  try {
    const r = await supabaseAdmin.from('clicks').select('id', { count: 'exact', head: true })
    return (r.count as number | null) ?? 0
  } catch { return 0 }
}

export default async function AdminDashboard() {
  await requireAdmin()

  const [syncJobs, topClicked, productCount, clickCount] = await Promise.all([
    getRecentSyncJobs(10).catch((): SyncJob[] => []),
    getTopClickedProducts(7, 5).catch((): { product_id: string; click_count: number }[] => []),
    getProductCount(),
    getClickCount(),
  ])

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Admin header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">לוח בקרה - קנייה-ברורה</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-brand-600">
              לאתר
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="סה&quot;כ מוצרים" value={productCount} />
          <StatCard label="סה&quot;כ לחיצות" value={clickCount} />
          <StatCard
            label="סנכרונים אחרונים"
            value={syncJobs.filter((j: SyncJob) => j.status === 'success').length}
          />
          <StatCard
            label="שגיאות סנכרון"
            value={syncJobs.filter((j: SyncJob) => j.status === 'failed').length}
            danger={syncJobs.filter((j: SyncJob) => j.status === 'failed').length > 0}
          />
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { href: '/admin/products', label: 'ניהול מוצרים', icon: '📦' },
            { href: '/admin/categories', label: 'ניהול קטגוריות', icon: '🗂️' },
            { href: '/admin/analytics', label: 'אנליטיקה', icon: '📊' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-brand-300 transition-all text-center"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-semibold text-gray-900">{item.label}</div>
            </Link>
          ))}
        </div>

        {/* Cron triggers */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">הרצת משימות ידנית</h2>
          <div className="flex flex-wrap gap-3">
            <CronButton path="/api/cron/daily-sync" label="סנכרון יומי" />
            <CronButton path="/api/cron/price-refresh" label="רענון מחירים" />
            <CronButton path="/api/cron/localize" label="לוקליזציה" />
          </div>
          <p className="text-xs text-gray-400 mt-3">דורש CRON_SECRET להגדרה בסביבת הפיתוח</p>
        </div>

        {/* Recent sync jobs */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">יומן סנכרונים</h2>
          {syncJobs.length === 0 ? (
            <p className="text-sm text-gray-500">אין יומן סנכרונים</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="text-right py-2 px-3">משימה</th>
                    <th className="text-right py-2 px-3">סטטוס</th>
                    <th className="text-right py-2 px-3">התחלה</th>
                    <th className="text-right py-2 px-3">פרטים</th>
                  </tr>
                </thead>
                <tbody>
                  {syncJobs.map((job: SyncJob) => (
                    <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{job.job_name}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'success' ? 'bg-green-100 text-green-700' :
                          job.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {job.status === 'success' ? 'הצלחה' : job.status === 'failed' ? 'שגיאה' : 'רץ'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-500">
                        {new Date(job.started_at).toLocaleString('he-IL')}
                      </td>
                      <td className="py-2 px-3 text-gray-500 text-xs max-w-xs truncate">
                        {job.error ?? JSON.stringify(job.meta)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top clicked */}
        {topClicked.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">מוצרים פופולריים (7 ימים)</h2>
            <ol className="space-y-2">
              {topClicked.map((item: { product_id: string; click_count: number }, i: number) => (
                <li key={item.product_id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{i + 1}.</span>
                  <span className="flex-1 mx-3 text-gray-700 truncate">{item.product_id}</span>
                  <span className="font-medium text-brand-700">{item.click_count} לחיצות</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return (
    <div className={`bg-white border rounded-xl p-5 text-center ${danger && value > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <div className={`text-3xl font-bold ${danger && value > 0 ? 'text-red-600' : 'text-gray-900'}`}>
        {value.toLocaleString('he-IL')}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  )
}

function CronButton({ path, label }: { path: string; label: string }) {
  return (
    <form action={path} method="POST">
      <button
        type="submit"
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
      >
        {label}
      </button>
    </form>
  )
}

function AdminLogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button type="submit" className="text-sm text-gray-600 hover:text-red-600">
        התנתקות
      </button>
    </form>
  )
}
