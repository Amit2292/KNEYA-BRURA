/**
 * Category configuration with AliExpress category ID mappings.
 * Replace ae_category_id values with actual IDs from AliExpress API docs.
 * See: https://portals.aliexpress.com/categories.html
 */

export interface CategoryConfig {
  slug: string
  name_he: string
  icon: string
  ae_category_id: string | null
  subcategories: SubcategoryConfig[]
}

export interface SubcategoryConfig {
  slug: string
  name_he: string
  ae_category_id: string | null
}

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    slug: 'car',
    name_he: 'רכב',
    icon: '🚗',
    ae_category_id: '100003070', // Placeholder - verify in AliExpress docs
    subcategories: [
      { slug: 'dash-cameras', name_he: 'מצלמות דרך', ae_category_id: '200003498' },
      { slug: 'phone-holders', name_he: 'מחזיקי טלפון', ae_category_id: '200003525' },
      { slug: 'interior-lighting', name_he: 'תאורת פנים', ae_category_id: '200003517' },
      { slug: 'travel-gadgets', name_he: "גאדג'טים לנסיעה", ae_category_id: null },
    ],
  },
  {
    slug: 'dogs',
    name_he: 'כלבים',
    icon: '🐕',
    ae_category_id: '200000783', // Placeholder - verify in AliExpress docs
    subcategories: [
      { slug: 'dog-toys', name_he: 'צעצועים', ae_category_id: '200000888' },
      { slug: 'outdoor-gear', name_he: 'טיולים וציוד חוץ', ae_category_id: null },
      { slug: 'leashes-collars', name_he: 'רצועות וקולרים', ae_category_id: '200000889' },
      { slug: 'travel-carriers', name_he: 'נסיעות ונשיאה', ae_category_id: null },
    ],
  },
  {
    slug: 'mobile',
    name_he: 'מובייל',
    icon: '📱',
    ae_category_id: '100003109', // Placeholder - verify in AliExpress docs
    subcategories: [
      { slug: 'chargers', name_he: 'מטענים', ae_category_id: '200003506' },
      { slug: 'phone-stands', name_he: 'מעמדים', ae_category_id: null },
      { slug: 'phone-photography', name_he: 'צילום לטלפון', ae_category_id: null },
      { slug: 'cables-adapters', name_he: 'כבלים ומתאמים', ae_category_id: '200003503' },
    ],
  },
]

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORY_CONFIG.find((c) => c.slug === slug)
}

export function getSubcategoryBySlug(
  categorySlug: string,
  subSlug: string
): SubcategoryConfig | undefined {
  const cat = getCategoryBySlug(categorySlug)
  return cat?.subcategories.find((s) => s.slug === subSlug)
}
