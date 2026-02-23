'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProductWithOffer } from '@/lib/db/types'

interface Props {
  product: ProductWithOffer
}

export function ProductEditForm({ product }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title_he: product.title_he ?? '',
    short_summary_he: product.short_summary_he ?? '',
    pros: (product.pros ?? []).join('\n'),
    cons: (product.cons ?? []).join('\n'),
    is_featured: product.is_featured,
    is_daily_deal: product.is_daily_deal,
    is_best_seller: product.is_best_seller,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title_he: form.title_he,
        short_summary_he: form.short_summary_he,
        pros: form.pros.split('\n').map((s) => s.trim()).filter(Boolean),
        cons: form.cons.split('\n').map((s) => s.trim()).filter(Boolean),
        is_featured: form.is_featured,
        is_daily_deal: form.is_daily_deal,
        is_best_seller: form.is_best_seller,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'שגיאה בשמירה')
    } else {
      setSuccess(true)
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Raw title */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">שם מקורי (AliExpress)</p>
        <p className="text-sm text-gray-700">{product.title_raw}</p>
        <p className="text-xs text-gray-400 mt-1">ID: {product.ae_product_id ?? product.id}</p>
      </div>

      {/* Hebrew title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">שם בעברית</label>
        <input
          type="text"
          value={form.title_he}
          onChange={(e) => setForm({ ...form, title_he: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">סיכום קצר</label>
        <textarea
          value={form.short_summary_he}
          onChange={(e) => setForm({ ...form, short_summary_he: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">יתרונות (שורה אחת לכל אחד)</label>
          <textarea
            value={form.pros}
            onChange={(e) => setForm({ ...form, pros: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">חסרונות (שורה אחת לכל אחד)</label>
          <textarea
            value={form.cons}
            onChange={(e) => setForm({ ...form, cons: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Flags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">דגלים</label>
        <div className="flex gap-6">
          {[
            { key: 'is_featured' as const, label: 'מומלץ' },
            { key: 'is_daily_deal' as const, label: 'מבצע יומי' },
            { key: 'is_best_seller' as const, label: 'נמכר הרבה' },
          ].map((flag) => (
            <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[flag.key]}
                onChange={(e) => setForm({ ...form, [flag.key]: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">{flag.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">נשמר בהצלחה</div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium px-8 py-2.5 rounded-lg transition-colors"
      >
        {saving ? 'שומר...' : 'שמור'}
      </button>
    </form>
  )
}
