/**
 * Category configuration with AliExpress category ID mappings.
 * Replace ae_category_id values with actual IDs from AliExpress API docs.
 * See: https://portals.aliexpress.com/categories.html
 */

export interface CategoryConfig {
  slug: string
  name_he: string
  icon: string // Material Symbol icon name
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
    slug: 'electronics',
    name_he: 'אלקטרוניקה',
    icon: 'devices',
    ae_category_id: '44',
    subcategories: [
      { slug: 'headphones', name_he: 'אוזניות', ae_category_id: '200000463' },
      { slug: 'speakers', name_he: 'רמקולים', ae_category_id: '200000466' },
      { slug: 'smart-watches', name_he: 'שעונים חכמים', ae_category_id: '200001013' },
      { slug: 'cameras', name_he: 'מצלמות', ae_category_id: '200000388' },
    ],
  },
  {
    slug: 'home',
    name_he: 'בית',
    icon: 'home',
    ae_category_id: '100003109',
    subcategories: [
      { slug: 'kitchen', name_he: 'מטבח', ae_category_id: null },
      { slug: 'lighting', name_he: 'תאורה', ae_category_id: null },
      { slug: 'organization', name_he: 'אחסון וסדר', ae_category_id: null },
      { slug: 'decor', name_he: 'עיצוב', ae_category_id: null },
    ],
  },
  {
    slug: 'kitchen',
    name_he: 'מטבח',
    icon: 'cooking',
    ae_category_id: null,
    subcategories: [
      { slug: 'appliances', name_he: 'מכשירי חשמל', ae_category_id: null },
      { slug: 'utensils', name_he: 'כלי מטבח', ae_category_id: null },
      { slug: 'storage', name_he: 'אחסון', ae_category_id: null },
    ],
  },
  {
    slug: 'gadgets',
    name_he: "גאדג'טים",
    icon: 'smart_toy',
    ae_category_id: null,
    subcategories: [
      { slug: 'smart-home', name_he: 'בית חכם', ae_category_id: null },
      { slug: 'phone-accessories', name_he: 'אביזרי טלפון', ae_category_id: null },
      { slug: 'chargers', name_he: 'מטענים', ae_category_id: '200003506' },
      { slug: 'cables-adapters', name_he: 'כבלים ומתאמים', ae_category_id: '200003503' },
    ],
  },
  {
    slug: 'fitness',
    name_he: 'כושר',
    icon: 'fitness_center',
    ae_category_id: '200000783',
    subcategories: [
      { slug: 'equipment', name_he: 'ציוד כושר', ae_category_id: null },
      { slug: 'outdoor', name_he: 'ציוד חוץ', ae_category_id: null },
      { slug: 'cycling', name_he: 'אופניים', ae_category_id: null },
      { slug: 'swimming', name_he: 'שחייה', ae_category_id: null },
    ],
  },
  {
    slug: 'trending',
    name_he: 'טרנדי',
    icon: 'local_fire_department',
    ae_category_id: null,
    subcategories: [
      { slug: 'viral', name_he: 'ויראלי', ae_category_id: null },
      { slug: 'seasonal', name_he: 'עונתי', ae_category_id: null },
      { slug: 'new-arrivals', name_he: 'חדשים', ae_category_id: null },
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
