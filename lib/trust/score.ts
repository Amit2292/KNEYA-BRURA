export interface TrustInput {
  rating: number | null
  orders_count: number
  seller_score: number | null
}

export interface TrustResult {
  score: number
  label: string
  badges: string[]
  colorClass: string
  isRecommended: boolean
}

export function computeTrustScore(input: TrustInput): number {
  const { rating, orders_count, seller_score } = input

  // Rating points (max 45)
  let ratingPoints = 20
  if (rating !== null) {
    if (rating >= 4.8) ratingPoints = 45
    else if (rating >= 4.6) ratingPoints = 40
    else if (rating >= 4.4) ratingPoints = 32
    else ratingPoints = 20
  }

  // Orders count points (max 35)
  let ordersPoints = 8
  if (orders_count >= 5000) ordersPoints = 35
  else if (orders_count >= 1000) ordersPoints = 28
  else if (orders_count >= 200) ordersPoints = 18
  else ordersPoints = 8

  // Seller score points (max 20)
  let sellerPoints = 5
  if (seller_score !== null) {
    if (seller_score >= 95) sellerPoints = 20
    else if (seller_score >= 90) sellerPoints = 15
    else if (seller_score >= 85) sellerPoints = 10
    else sellerPoints = 5
  }

  return ratingPoints + ordersPoints + sellerPoints
}

export function getTrustLabel(score: number): string {
  if (score >= 80) return 'מומלץ מאוד'
  if (score >= 65) return 'קנייה בטוחה'
  if (score >= 50) return 'בחירה טובה'
  return 'בדוק לפני קנייה'
}

export function getTrustBadges(input: TrustInput): string[] {
  const badges: string[] = []

  if (input.orders_count >= 1000) {
    badges.push('נמכר הרבה')
  }

  if (input.rating !== null && input.rating >= 4.6) {
    badges.push('דירוג גבוה')
  }

  return badges
}

export function getTrustColorClass(score: number): string {
  if (score >= 80) return 'text-green-700 bg-green-50 border-green-200'
  if (score >= 65) return 'text-blue-700 bg-blue-50 border-blue-200'
  if (score >= 50) return 'text-yellow-700 bg-yellow-50 border-yellow-200'
  return 'text-gray-600 bg-gray-50 border-gray-200'
}

export function getTrustResult(input: TrustInput): TrustResult {
  const score = computeTrustScore(input)
  const label = getTrustLabel(score)
  const badges = getTrustBadges(input)
  const colorClass = getTrustColorClass(score)
  const isRecommended = score >= 65

  return { score, label, badges, colorClass, isRecommended }
}
