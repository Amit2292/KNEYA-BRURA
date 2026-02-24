interface FeatureBadgesProps {
  isFreeShipping: boolean
  isRecommendedSeller: boolean
  hasCoupon?: boolean
}

export function FeatureBadges({ isFreeShipping, isRecommendedSeller, hasCoupon = false }: FeatureBadgesProps) {
  const badges = [
    isFreeShipping && { icon: 'local_shipping', label: 'משלוח חינם' },
    isRecommendedSeller && { icon: 'verified', label: 'מוכר מומלץ' },
    hasCoupon && { icon: 'confirmation_number', label: 'קופון בלעדי' },
  ].filter(Boolean) as { icon: string; label: string }[]

  if (badges.length === 0) return null

  return (
    <div className="flex items-center justify-center gap-6" dir="rtl">
      {badges.map((badge) => (
        <div key={badge.icon} className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-600 text-xl">{badge.icon}</span>
          </div>
          <span className="text-[10px] text-gray-600 font-medium">{badge.label}</span>
        </div>
      ))}
    </div>
  )
}
