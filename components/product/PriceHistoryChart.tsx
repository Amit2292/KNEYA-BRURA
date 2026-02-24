interface PriceHistoryChartProps {
  currentPrice: number | null
}

export function PriceHistoryChart({ currentPrice }: PriceHistoryChartProps) {
  // Mock price history data - 6 data points over the last 6 months
  const basePrice = currentPrice ?? 500
  const mockData = [
    { label: 'לפני חצי שנה', price: Math.round(basePrice * 1.15) },
    { label: '', price: Math.round(basePrice * 1.08) },
    { label: '', price: Math.round(basePrice * 1.12) },
    { label: '', price: Math.round(basePrice * 1.05) },
    { label: '', price: Math.round(basePrice * 1.02) },
    { label: 'היום', price: basePrice },
  ]

  const maxPrice = Math.max(...mockData.map((d) => d.price))
  const isLowest = basePrice <= Math.min(...mockData.map((d) => d.price))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">היסטוריית מחירים</h3>
        {isLowest && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            מחיר שפל!
          </span>
        )}
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-28">
        {mockData.map((point, i) => {
          const heightPx = Math.round((point.price / maxPrice) * 96)
          const isCurrentMonth = i === mockData.length - 1
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-gray-500">
                {isCurrentMonth ? `₪${point.price}` : ''}
              </span>
              <div
                className={`w-full rounded-t-md price-bar ${
                  isCurrentMonth ? 'bg-primary-600' : 'bg-primary-200'
                }`}
                style={{ height: `${heightPx}px` }}
              />
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-gray-400">היום</span>
        <span className="text-[10px] text-gray-400">לפני חצי שנה</span>
      </div>
    </div>
  )
}
