import { getTrustResult, type TrustInput } from '@/lib/trust/score'

interface TrustBadgeProps {
  input: TrustInput
  showScore?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function TrustBadge({ input, showScore = true, size = 'md' }: TrustBadgeProps) {
  const trust = getTrustResult(input)

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  return (
    <div className="flex flex-wrap items-center gap-2" dir="rtl">
      {/* Main trust label */}
      <span
        className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]} ${trust.colorClass}`}
      >
        {trust.score >= 80 && <span>✓</span>}
        {trust.label}
        {showScore && (
          <span className="opacity-70 text-xs">({trust.score}/100)</span>
        )}
      </span>

      {/* Badges */}
      {trust.badges.map((badge) => (
        <span
          key={badge}
          className={`inline-flex items-center rounded-full border bg-gray-50 text-gray-700 border-gray-200 ${sizeClasses[size]}`}
        >
          {badge === 'נמכר הרבה' && '🔥 '}
          {badge === 'דירוג גבוה' && '⭐ '}
          {badge}
        </span>
      ))}

      {/* Free shipping badge */}
      {input.orders_count >= 0 && (
        <FreeShippingBadge show={false} size={size} />
      )}
    </div>
  )
}

interface FreeShippingBadgeProps {
  show: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function FreeShippingBadge({ show, size = 'md' }: FreeShippingBadgeProps) {
  if (!show) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 text-green-700 font-medium ${sizeClasses[size]}`}
    >
      משלוח חינם
    </span>
  )
}
