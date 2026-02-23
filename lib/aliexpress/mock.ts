// Demo mode mock responses - used when AE_APP_KEY is not set

export interface AEProduct {
  product_id: string
  product_title: string
  product_main_image_url: string
  product_small_image_urls?: string[]
  app_sale_price: string
  app_sale_price_currency: string
  original_price: string
  sale_price: string
  evaluate_rate: string
  lastest_volume: number
  target_sale_price: string
  target_sale_price_currency: string
  hot_product_commission_rate?: string
  product_detail_url: string
  platform_product_type?: string
  shop_id?: string
  shop_url?: string
  seller_feedback_rate?: string
  ship_to_days?: string
  logistics_id?: string
  relevant_market_commission_rate?: string
}

const MOCK_PRODUCTS: AEProduct[] = [
  {
    product_id: 'demo-001',
    product_title: 'Car DVR Dash Camera 4K WiFi Night Vision Wide Angle',
    product_main_image_url: 'https://placehold.co/400x400/1d4ed8/white?text=מצלמת+דרך',
    app_sale_price: '29.99',
    app_sale_price_currency: 'USD',
    original_price: '45.00',
    sale_price: '29.99',
    evaluate_rate: '4.8',
    lastest_volume: 8432,
    target_sale_price: '29.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-001.html',
    seller_feedback_rate: '97.2',
    ship_to_days: '20',
  },
  {
    product_id: 'demo-002',
    product_title: 'Universal Car Phone Holder Dashboard Mount 360 Degree',
    product_main_image_url: 'https://placehold.co/400x400/1d4ed8/white?text=מחזיק+טלפון',
    app_sale_price: '7.99',
    app_sale_price_currency: 'USD',
    original_price: '15.00',
    sale_price: '7.99',
    evaluate_rate: '4.7',
    lastest_volume: 15230,
    target_sale_price: '7.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-002.html',
    seller_feedback_rate: '95.8',
    ship_to_days: '18',
  },
  {
    product_id: 'demo-003',
    product_title: 'Car Interior LED Strip Light RGB Ambient Lighting USB',
    product_main_image_url: 'https://placehold.co/400x400/1d4ed8/white?text=תאורת+פנים',
    app_sale_price: '11.50',
    app_sale_price_currency: 'USD',
    original_price: '20.00',
    sale_price: '11.50',
    evaluate_rate: '4.6',
    lastest_volume: 5621,
    target_sale_price: '11.50',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-003.html',
    seller_feedback_rate: '93.1',
    ship_to_days: '22',
  },
  {
    product_id: 'demo-004',
    product_title: 'Multi-function Car Organizer Travel Storage Bag',
    product_main_image_url: 'https://placehold.co/400x400/1d4ed8/white?text=גאדג&apos;ט+רכב',
    app_sale_price: '14.90',
    app_sale_price_currency: 'USD',
    original_price: '22.00',
    sale_price: '14.90',
    evaluate_rate: '4.5',
    lastest_volume: 3100,
    target_sale_price: '14.90',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-004.html',
    seller_feedback_rate: '91.5',
    ship_to_days: '25',
  },
  {
    product_id: 'demo-005',
    product_title: 'Interactive Dog Toy Slow Feeder Puzzle IQ Training',
    product_main_image_url: 'https://placehold.co/400x400/16a34a/white?text=צעצוע+כלב',
    app_sale_price: '9.99',
    app_sale_price_currency: 'USD',
    original_price: '18.00',
    sale_price: '9.99',
    evaluate_rate: '4.9',
    lastest_volume: 12045,
    target_sale_price: '9.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-005.html',
    seller_feedback_rate: '98.1',
    ship_to_days: '20',
  },
  {
    product_id: 'demo-006',
    product_title: 'Dog Hiking Backpack Outdoor Adventure Pet Carrier',
    product_main_image_url: 'https://placehold.co/400x400/16a34a/white?text=ציוד+חוץ+כלב',
    app_sale_price: '24.99',
    app_sale_price_currency: 'USD',
    original_price: '38.00',
    sale_price: '24.99',
    evaluate_rate: '4.7',
    lastest_volume: 6782,
    target_sale_price: '24.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-006.html',
    seller_feedback_rate: '96.4',
    ship_to_days: '21',
  },
  {
    product_id: 'demo-007',
    product_title: 'Reflective Dog Leash Heavy Duty Nylon Training Lead',
    product_main_image_url: 'https://placehold.co/400x400/16a34a/white?text=רצועת+כלב',
    app_sale_price: '5.99',
    app_sale_price_currency: 'USD',
    original_price: '10.00',
    sale_price: '5.99',
    evaluate_rate: '4.6',
    lastest_volume: 22100,
    target_sale_price: '5.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-007.html',
    seller_feedback_rate: '94.7',
    ship_to_days: '17',
  },
  {
    product_id: 'demo-008',
    product_title: 'Foldable Pet Travel Carrier Bag Airline Approved Dog Cat',
    product_main_image_url: 'https://placehold.co/400x400/16a34a/white?text=נשיאת+כלב',
    app_sale_price: '19.99',
    app_sale_price_currency: 'USD',
    original_price: '32.00',
    sale_price: '19.99',
    evaluate_rate: '4.5',
    lastest_volume: 4320,
    target_sale_price: '19.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-008.html',
    seller_feedback_rate: '92.3',
    ship_to_days: '23',
  },
  {
    product_id: 'demo-009',
    product_title: '65W GaN USB-C Fast Charger Multi-Port PD Adapter',
    product_main_image_url: 'https://placehold.co/400x400/7c3aed/white?text=מטען+מהיר',
    app_sale_price: '16.99',
    app_sale_price_currency: 'USD',
    original_price: '28.00',
    sale_price: '16.99',
    evaluate_rate: '4.8',
    lastest_volume: 9870,
    target_sale_price: '16.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-009.html',
    seller_feedback_rate: '97.6',
    ship_to_days: '19',
  },
  {
    product_id: 'demo-010',
    product_title: 'Adjustable Phone Stand Desk Holder Foldable Aluminum',
    product_main_image_url: 'https://placehold.co/400x400/7c3aed/white?text=מעמד+טלפון',
    app_sale_price: '8.49',
    app_sale_price_currency: 'USD',
    original_price: '14.00',
    sale_price: '8.49',
    evaluate_rate: '4.7',
    lastest_volume: 18600,
    target_sale_price: '8.49',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-010.html',
    seller_feedback_rate: '96.1',
    ship_to_days: '16',
  },
  {
    product_id: 'demo-011',
    product_title: 'Phone Camera Lens Kit Wide Angle Macro Fisheye 3 in 1',
    product_main_image_url: 'https://placehold.co/400x400/7c3aed/white?text=עדשות+צילום',
    app_sale_price: '12.99',
    app_sale_price_currency: 'USD',
    original_price: '20.00',
    sale_price: '12.99',
    evaluate_rate: '4.5',
    lastest_volume: 7340,
    target_sale_price: '12.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-011.html',
    seller_feedback_rate: '93.8',
    ship_to_days: '21',
  },
  {
    product_id: 'demo-012',
    product_title: 'USB-C to Lightning Cable 1M MFi Certified Fast Charging',
    product_main_image_url: 'https://placehold.co/400x400/7c3aed/white?text=כבל+USB',
    app_sale_price: '4.99',
    app_sale_price_currency: 'USD',
    original_price: '9.00',
    sale_price: '4.99',
    evaluate_rate: '4.6',
    lastest_volume: 31200,
    target_sale_price: '4.99',
    target_sale_price_currency: 'USD',
    product_detail_url: 'https://www.aliexpress.com/item/demo-012.html',
    seller_feedback_rate: '95.2',
    ship_to_days: '18',
  },
]

export function getMockProducts(aeCategoryId?: string, page = 1, pageSize = 20): AEProduct[] {
  const start = (page - 1) * pageSize
  return MOCK_PRODUCTS.slice(start, start + pageSize)
}

export function getMockProductDetail(productId: string): AEProduct | null {
  return MOCK_PRODUCTS.find((p) => p.product_id === productId) ?? null
}

export function getMockAffiliateLink(productUrlOrId: string, trackingId: string): string {
  return `https://www.aliexpress.com/item/${productUrlOrId}.html?aff_fcid=demo&aff_tt=demo&aff_platform=portals-tool&sk=${trackingId}`
}
