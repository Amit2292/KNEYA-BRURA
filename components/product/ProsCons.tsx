interface ProsConsProps {
  pros: string[]
  cons: string[]
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  if (pros.length === 0 && cons.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
      {/* Pros */}
      {pros.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span>✓</span> יתרונות
          </h3>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0 text-green-500">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cons */}
      {cons.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <span>!</span> חסרונות
          </h3>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0 text-red-400">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
