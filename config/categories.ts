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
    icon: 'laptop_mac',
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
    slug: 'fashion',
    name_he: 'אופנה',
    icon: 'checkroom',
    ae_category_id: '100003070',
    subcategories: [
      { slug: 'mens', name_he: 'גברים', ae_category_id: null },
      { slug: 'womens', name_he: 'נשים', ae_category_id: null },
      { slug: 'accessories', name_he: 'אקססוריז', ae_category_id: null },
      { slug: 'shoes', name_he: 'נעליים', ae_category_id: null },
    ],
  },
  {
    slug: 'sports',
    name_he: 'ספורט',
    icon: 'fitness_center',
    ae_category_id: '200000783',
    subcategories: [
      { slug: 'fitness', name_he: 'כושר', ae_category_id: null },
      { slug: 'outdoor', name_he: 'ציוד חוץ', ae_category_id: null },
      { slug: 'cycling', name_he: 'אופניים', ae_category_id: null },
      { slug: 'swimming', name_he: 'שחייה', ae_category_id: null },
    ],
  },
  {
    slug: 'car',
    name_he: 'רכב',
    icon: 'directions_car',
    ae_category_id: '100003070',
    subcategories: [
      { slug: 'dash-cameras', name_he: 'מצלמות דרך', ae_category_id: '200003498' },
      { slug: 'phone-holders', name_he: 'מחזיקי טלפון', ae_category_id: '200003525' },
      { slug: 'interior-lighting', name_he: 'תאורת פנים', ae_category_id: '200003517' },
      { slug: 'travel-gadgets', name_he: "גאדג'טים לנסיעה", ae_category_id: null },
    ],
  },
  {
    slug: 'gadgets',
    name_he: "גאדג'טים",
    icon: 'toys_and_games',
    ae_category_id: null,
    subcategories: [
      { slug: 'smart-home', name_he: 'בית חכם', ae_category_id: null },
      { slug: 'phone-accessories', name_he: 'אביזרי טלפון', ae_category_id: null },
      { slug: 'chargers', name_he: 'מטענים', ae_category_id: '200003506' },
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
