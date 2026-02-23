/**
 * Seed script - inserts categories, subcategories, and 12 demo products.
 * Run: npm run seed
 */

import { createClient } from '@supabase/supabase-js'
import { computeTrustScore } from '../lib/trust/score'
import { CATEGORY_CONFIG } from '../config/categories'

// Load env - tsx handles this via --env-file or we use dynamic import
// tsx supports reading .env.local automatically when using tsx
// If needed, set env vars before running: export $(cat .env.local | xargs)

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface DemoProduct {
  ae_product_id: string
  title_raw: string
  title_he: string
  slug: string
  category_slug: string
  images: string[]
  rating: number
  orders_count: number
  seller_name: string
  seller_score: number
  short_summary_he: string
  pros: string[]
  cons: string[]
  is_featured: boolean
  is_daily_deal: boolean
  price_usd: number
  shipping_usd: number
  delivery_min: number
  delivery_max: number
}

const DEMO_PRODUCTS: DemoProduct[] = [
  // === רכב ===
  {
    ae_product_id: 'demo-car-001',
    title_raw: 'Car DVR 4K Dash Camera WiFi Night Vision 170 Wide Angle',
    title_he: 'מצלמת דרך 4K עם WiFi וראיית לילה',
    slug: 'matzlemet-derekh-4k-wifi-demo-car-001',
    category_slug: 'dash-cameras',
    images: ['https://placehold.co/400x400/1d4ed8/white?text=4K+DVR'],
    rating: 4.8,
    orders_count: 8432,
    seller_name: 'DriveProShop',
    seller_score: 97.2,
    short_summary_he: 'מצלמת דרך 4K עם ראיית לילה מתקדמת וחיבור WiFi לסמארטפון. מתאימה למי שרוצה תיעוד איכותי בתנאי לילה. פחות מתאימה למי שמחפש מצלמה עם GPS מובנה.',
    pros: ['רזולוציה 4K חדה', 'ראיית לילה WDR', 'חיבור WiFi לנייד'],
    cons: ['אין GPS מובנה', 'קובצי וידאו גדולים', 'הוראות באנגלית בלבד'],
    is_featured: true,
    is_daily_deal: false,
    price_usd: 29.99,
    shipping_usd: 0,
    delivery_min: 15,
    delivery_max: 28,
  },
  {
    ae_product_id: 'demo-car-002',
    title_raw: 'Universal Car Phone Holder Dashboard 360 Rotation Suction Cup',
    title_he: 'מחזיק טלפון לרכב 360 מעלות - ספיגת אוויר',
    slug: 'machzik-telefon-rakav-360-demo-car-002',
    category_slug: 'phone-holders',
    images: ['https://placehold.co/400x400/2563eb/white?text=Phone+Holder'],
    rating: 4.7,
    orders_count: 15230,
    seller_name: 'MobileCarStore',
    seller_score: 95.8,
    short_summary_he: 'מחזיק טלפון יציב עם ספיגת אוויר חזקה וסיבוב 360 מעלות. מתאים לרוב הטלפונים. פחות מתאים לטלפונים גדולים מ-7 אינץ\'.',
    pros: ['יציבות גבוהה', 'סיבוב 360 מעלות', 'התקנה קלה'],
    cons: ['לא לטלפונים מאוד גדולים', 'פלסטיק בסיסי', 'עלול לסלוק בחום'],
    is_featured: false,
    is_daily_deal: true,
    price_usd: 7.99,
    shipping_usd: 0,
    delivery_min: 14,
    delivery_max: 25,
  },
  {
    ae_product_id: 'demo-car-003',
    title_raw: 'Car Interior LED Strip Lights RGB Ambient Lighting Kit USB 5V',
    title_he: 'תאורת LED אווירה לרכב - RGB עם USB',
    slug: 'taorat-led-uvira-rakav-rgb-demo-car-003',
    category_slug: 'interior-lighting',
    images: ['https://placehold.co/400x400/7c3aed/white?text=LED+Car'],
    rating: 4.6,
    orders_count: 5621,
    seller_name: 'LightingPlus',
    seller_score: 93.1,
    short_summary_he: 'רצועות LED RGB לאווירה ברכב עם אספקת USB. מתאים למי שרוצה תאורת אווירה בקלות. פחות מתאים לרכבים ישנים ללא יציאת USB.',
    pros: ['צבעים מגוונים', 'חיבור USB פשוט', 'גמיש ניתן לחיתוך'],
    cons: ['ייתכן הסחת דעת בלילה', 'כבל חשוף', 'אחריות מוגבלת'],
    is_featured: false,
    is_daily_deal: false,
    price_usd: 11.50,
    shipping_usd: 0,
    delivery_min: 18,
    delivery_max: 32,
  },
  {
    ae_product_id: 'demo-car-004',
    title_raw: 'Car Trunk Organizer Foldable Storage Box Multifunctional Travel',
    title_he: 'ארגונית לרכב - ארגז מתקפל לתא המטען',
    slug: 'argonit-rakav-aron-metkabel-demo-car-004',
    category_slug: 'travel-gadgets',
    images: ['https://placehold.co/400x400/0891b2/white?text=Car+Organizer'],
    rating: 4.5,
    orders_count: 3100,
    seller_name: 'CarAccessoriesHub',
    seller_score: 91.5,
    short_summary_he: 'ארגונית לתא המטען עם חלוקה לתאים ומתקפלת. מתאים לנסיעות ארוכות ולמשפחות. פחות מתאים לרכבים קטנים עם מטען צר.',
    pros: ['מתקפל לאחסון', 'חלוקה לתאים', 'חומר עמיד'],
    cons: ['גודל מוגבל', 'ניחוח פלסטיק חדש', 'לא עמיד במים'],
    is_featured: true,
    is_daily_deal: false,
    price_usd: 14.90,
    shipping_usd: 0,
    delivery_min: 20,
    delivery_max: 35,
  },

  // === כלבים ===
  {
    ae_product_id: 'demo-dog-001',
    title_raw: 'Interactive Dog Puzzle Toy Slow Feeder IQ Training Level 3',
    title_he: 'צעצוע פאזל אינטראקטיבי לכלב - אכילה איטית',
    slug: 'tzatzua-pazzel-kelev-akhila-itit-demo-dog-001',
    category_slug: 'dog-toys',
    images: ['https://placehold.co/400x400/16a34a/white?text=Dog+Puzzle'],
    rating: 4.9,
    orders_count: 12045,
    seller_name: 'PetJoyShop',
    seller_score: 98.1,
    short_summary_he: 'צעצוע פאזל שמגרה את הכלב נפשית ומאט אכילה. מתאים לכלבים חכמים שמשתעממים. פחות מתאים לכלבים אגרסיביים מאוד.',
    pros: ['גירוי נפשי מצוין', 'מאט אכילה', 'קל לניקוי'],
    cons: ['לא לכלבים אגרסיביים', 'מידה אחת בלבד', 'פלסטיק ABS'],
    is_featured: true,
    is_daily_deal: false,
    price_usd: 9.99,
    shipping_usd: 0,
    delivery_min: 16,
    delivery_max: 28,
  },
  {
    ae_product_id: 'demo-dog-002',
    title_raw: 'Dog Hiking Backpack Outdoor Saddle Bag Reflective Waterproof',
    title_he: 'תרמיל גב לכלב - ציוד חוץ עמיד מים',
    slug: 'tarmil-gav-kelev-tziyud-khuz-demo-dog-002',
    category_slug: 'outdoor-gear',
    images: ['https://placehold.co/400x400/15803d/white?text=Dog+Backpack'],
    rating: 4.7,
    orders_count: 6782,
    seller_name: 'PetOutdoor',
    seller_score: 96.4,
    short_summary_he: 'תרמיל לכלב לטיולים עם הפרדת תאים ובד עמיד מים. מתאים לכלבים בינוניים-גדולים שרגילים לטיולים. פחות מתאים לכלבים קטנים או לא מאומנים.',
    pros: ['עמיד מים', 'רצועות מחזירות אור', 'תאים מאורגנים'],
    cons: ['לא לכלבים קטנים', 'דרוש אילוף ראשוני', 'מידות לא תמיד מדויקות'],
    is_featured: false,
    is_daily_deal: true,
    price_usd: 24.99,
    shipping_usd: 0,
    delivery_min: 17,
    delivery_max: 30,
  },
  {
    ae_product_id: 'demo-dog-003',
    title_raw: 'Reflective Dog Leash Heavy Duty Nylon 2m Training Lead Handle',
    title_he: 'רצועה לכלב ניילון חזק עם פסי זוהר',
    slug: 'rtzu-kelev-nailon-hazak-zohir-demo-dog-003',
    category_slug: 'leashes-collars',
    images: ['https://placehold.co/400x400/166534/white?text=Dog+Leash'],
    rating: 4.6,
    orders_count: 22100,
    seller_name: 'PetBasicsStore',
    seller_score: 94.7,
    short_summary_he: 'רצועה ניילון חזקה עם פסי זוהר לנראות בלילה. מתאימה לרוב הכלבים. פחות מתאימה לכלבים שמושכים חזק מאוד.',
    pros: ['חומר עמיד', 'פסי זוהר ללילה', 'אבזם ברזל'],
    cons: ['ידית קשה', 'לא לכלבים מושכים', 'צבע יכול לדעוך'],
    is_featured: false,
    is_daily_deal: false,
    price_usd: 5.99,
    shipping_usd: 0,
    delivery_min: 13,
    delivery_max: 22,
  },
  {
    ae_product_id: 'demo-dog-004',
    title_raw: 'Foldable Pet Travel Carrier Bag Airline Approved Breathable Mesh',
    title_he: 'תיק נשיאה מתקפל לכלב - מאושר לטיסות',
    slug: 'tik-nesia-metkabel-kelev-tisa-demo-dog-004',
    category_slug: 'travel-carriers',
    images: ['https://placehold.co/400x400/14532d/white?text=Pet+Carrier'],
    rating: 4.5,
    orders_count: 4320,
    seller_name: 'TravelPetStore',
    seller_score: 92.3,
    short_summary_he: 'תיק נשיאה עם רשת אוורור לכלבים קטנים. מאושר לרוב חברות התעופה. מתאים לכלבים עד 6 ק"ג. פחות מתאים לכלבים גדולים.',
    pros: ['מאושר לטיסות', 'רשת אוורור', 'כיסים נוספים'],
    cons: ['לכלבים קטנים בלבד', 'לא עמיד מים', 'ייתכן עיכוב במשלוח'],
    is_featured: true,
    is_daily_deal: false,
    price_usd: 19.99,
    shipping_usd: 0,
    delivery_min: 19,
    delivery_max: 33,
  },

  // === מובייל ===
  {
    ae_product_id: 'demo-mobile-001',
    title_raw: '65W GaN USB-C Fast Charger 3 Port PD QC4 Multi-port Adapter',
    title_he: 'מטען GaN 65W עם 3 פורטים - USB-C ו-USB-A',
    slug: 'maten-gan-65w-3-portim-demo-mobile-001',
    category_slug: 'chargers',
    images: ['https://placehold.co/400x400/6d28d9/white?text=65W+GaN'],
    rating: 4.8,
    orders_count: 9870,
    seller_name: 'PowerTechShop',
    seller_score: 97.6,
    short_summary_he: 'מטען GaN קומפקטי 65W עם 3 פורטים לטעינה מהירה של מספר מכשירים בו-זמנית. מתאים לנייד, מחשב נייד וטאבלט. פחות מתאים למי שמחפש כבל מצורף.',
    pros: ['טכנולוגיית GaN קומפקטית', '65W לנייד וlaptop', '3 פורטים בו-זמנית'],
    cons: ['ללא כבל', 'אין תעודה ישראלית', 'חם בשימוש מלא'],
    is_featured: true,
    is_daily_deal: false,
    price_usd: 16.99,
    shipping_usd: 0,
    delivery_min: 15,
    delivery_max: 27,
  },
  {
    ae_product_id: 'demo-mobile-002',
    title_raw: 'Adjustable Phone Stand Desk Holder Foldable Aluminum Tablet',
    title_he: 'מעמד טלפון וטאבלט - אלומיניום מתכוונן',
    slug: 'maamed-telefon-tablyet-aluminium-demo-mobile-002',
    category_slug: 'phone-stands',
    images: ['https://placehold.co/400x400/4c1d95/white?text=Phone+Stand'],
    rating: 4.7,
    orders_count: 18600,
    seller_name: 'DeskGadgetStore',
    seller_score: 96.1,
    short_summary_he: 'מעמד אלומיניום עם זווית מתכווננת לטלפון וטאבלט עד 13 אינץ\'. מתאים לשולחן עבודה ולטיולים. פחות מתאים לטאבלטים גדולים מ-12 אינץ\'.',
    pros: ['אלומיניום יציב', 'זווית מתכווננת', 'מתקפל לשינוע'],
    cons: ['אין מעמד אחורי', 'לא עמיד במכות', 'גמישות זווית מוגבלת'],
    is_featured: false,
    is_daily_deal: true,
    price_usd: 8.49,
    shipping_usd: 0,
    delivery_min: 12,
    delivery_max: 22,
  },
  {
    ae_product_id: 'demo-mobile-003',
    title_raw: 'Phone Camera Lens Kit Wide Angle Macro Fisheye Clip On 3 in 1',
    title_he: 'ערכת עדשות לטלפון - זווית רחבה, מקרו ופישאיי',
    slug: 'arakat-adashot-telefon-3-in-1-demo-mobile-003',
    category_slug: 'phone-photography',
    images: ['https://placehold.co/400x400/5b21b6/white?text=Lens+Kit'],
    rating: 4.5,
    orders_count: 7340,
    seller_name: 'PhotoMobileShop',
    seller_score: 93.8,
    short_summary_he: 'ערכת 3 עדשות לצילום שיפור ניכר: זווית רחבה, מקרו ופישאיי. מתאים לחובבי צילום עם סמארטפון. פחות מתאים לצלמים מקצועיים.',
    pros: ['שיפור ניכר בצילום', 'קיט 3 ב-1', 'חיבור ייחכ קלה'],
    cons: ['לא לכל דגם', 'עיוות בשוליים', 'לא כמו עדשה מקצועית'],
    is_featured: false,
    is_daily_deal: false,
    price_usd: 12.99,
    shipping_usd: 0,
    delivery_min: 17,
    delivery_max: 30,
  },
  {
    ae_product_id: 'demo-mobile-004',
    title_raw: 'USB-C to Lightning Cable 1M 2.4A Fast Charging Data Transfer MFi',
    title_he: 'כבל USB-C ל-Lightning - 1 מטר טעינה מהירה',
    slug: 'kevel-usbc-lightning-1m-demo-mobile-004',
    category_slug: 'cables-adapters',
    images: ['https://placehold.co/400x400/3730a3/white?text=USB-C+Cable'],
    rating: 4.6,
    orders_count: 31200,
    seller_name: 'CableElite',
    seller_score: 95.2,
    short_summary_he: 'כבל USB-C ל-Lightning במחיר נגיש עם תמיכה בטעינה מהירה. מתאים לאייפון עם מטען USB-C. פחות מתאים למי שזקוק לכבל MFi מאושר רשמית.',
    pros: ['טעינה מהירה 2.4A', 'מחיר נגיש', 'עמיד לכיפוף'],
    cons: ['לא MFi מאושר', 'אין אחריות ישראלית', 'ייתכן שאינו עמיד לאורך זמן'],
    is_featured: false,
    is_daily_deal: true,
    price_usd: 4.99,
    shipping_usd: 0,
    delivery_min: 14,
    delivery_max: 24,
  },
]

async function main() {
  console.log('🌱 מתחיל הזרעת נתונים...\n')

  // 1. Upsert categories and subcategories
  console.log('📂 מוסיף קטגוריות...')

  const categoryIds: Record<string, string> = {}

  for (const catConfig of CATEGORY_CONFIG) {
    const { data: cat, error } = await supabase
      .from('categories')
      .upsert(
        {
          name_he: catConfig.name_he,
          slug: catConfig.slug,
          ae_category_id: catConfig.ae_category_id,
          icon: catConfig.icon,
          parent_id: null,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single()

    if (error) {
      console.error(`  שגיאה בקטגוריה ${catConfig.slug}:`, error.message)
      continue
    }

    categoryIds[catConfig.slug] = cat.id
    console.log(`  ✓ ${catConfig.name_he} (${cat.id})`)

    for (const sub of catConfig.subcategories) {
      const { data: subCat, error: subErr } = await supabase
        .from('categories')
        .upsert(
          {
            name_he: sub.name_he,
            slug: sub.slug,
            ae_category_id: sub.ae_category_id,
            parent_id: cat.id,
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .single()

      if (subErr) {
        console.error(`    שגיאה בתת-קטגוריה ${sub.slug}:`, subErr.message)
        continue
      }

      categoryIds[sub.slug] = subCat.id
      console.log(`    ✓ ${sub.name_he}`)
    }
  }

  // 2. Upsert products
  console.log('\n📦 מוסיף מוצרי דוגמה...')

  const FX_RATE = Number(process.env.FX_FALLBACK_RATE_ILS ?? '3.75')

  for (const demo of DEMO_PRODUCTS) {
    const categoryId = categoryIds[demo.category_slug]
    if (!categoryId) {
      console.error(`  תת-קטגוריה לא נמצאה: ${demo.category_slug}`)
      continue
    }

    const trustScore = computeTrustScore({
      rating: demo.rating,
      orders_count: demo.orders_count,
      seller_score: demo.seller_score,
    })

    // Upsert product
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .upsert(
        {
          ae_product_id: demo.ae_product_id,
          title_raw: demo.title_raw,
          title_he: demo.title_he,
          slug: demo.slug,
          category_id: categoryId,
          images: demo.images,
          rating: demo.rating,
          orders_count: demo.orders_count,
          seller_name: demo.seller_name,
          seller_score: demo.seller_score,
          trust_score: trustScore,
          short_summary_he: demo.short_summary_he,
          pros: demo.pros,
          cons: demo.cons,
          is_featured: demo.is_featured,
          is_daily_deal: demo.is_daily_deal,
          is_best_seller: demo.orders_count >= 1000,
          last_synced_at: new Date().toISOString(),
        },
        { onConflict: 'ae_product_id' }
      )
      .select('id')
      .single()

    if (prodErr) {
      console.error(`  שגיאה במוצר ${demo.title_he}:`, prodErr.message)
      continue
    }

    // Delete old offer and insert new
    await supabase.from('offers').delete().eq('product_id', product.id)
    await supabase.from('offers').insert({
      product_id: product.id,
      price: demo.price_usd,
      shipping_price: demo.shipping_usd,
      currency: 'USD',
      price_ils: Math.round(demo.price_usd * FX_RATE * 100) / 100,
      shipping_ils: Math.round(demo.shipping_usd * FX_RATE * 100) / 100,
      total_ils: Math.round((demo.price_usd + demo.shipping_usd) * FX_RATE * 100) / 100,
      delivery_min_days: demo.delivery_min,
      delivery_max_days: demo.delivery_max,
      is_free_shipping: demo.shipping_usd === 0,
      last_checked_at: new Date().toISOString(),
    })

    // Insert demo affiliate link
    await supabase.from('affiliate_links').upsert({
      product_id: product.id,
      tracking_id: process.env.AE_TRACKING_ID ?? 'demo',
      affiliate_url: `https://www.aliexpress.com/item/${demo.ae_product_id}.html?aff_fcid=demo&sk=demo`,
      last_generated_at: new Date().toISOString(),
    })

    console.log(`  ✓ ${demo.title_he} - אמון: ${trustScore}/100`)
  }

  // 3. Upsert FX rate
  console.log('\n💱 מוסיף שער חליפין...')
  await supabase
    .from('fx_rates')
    .upsert({ base: 'USD', quote: 'ILS', rate: FX_RATE, updated_at: new Date().toISOString() }, { onConflict: 'base,quote' })
  console.log(`  ✓ 1 USD = ${FX_RATE} ILS`)

  console.log('\n✅ הזרעה הושלמה בהצלחה!')
  console.log('\nלהרצת סנכרון ראשוני עם AliExpress (אם יש מפתח API):')
  console.log('  npm run cron:daily-sync')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
