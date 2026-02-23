// AliExpress API configuration
// IMPORTANT: Verify endpoint paths against your official API documentation.
// These are placeholders based on the AliExpress Affiliate Open Platform.
// Register at: https://portals.aliexpress.com/
export const AE_CONFIG = {
  // Base URL from env - change per your region
  BASE_URL: process.env.AE_API_BASE_URL ?? 'https://api-sg.aliexpress.com/sync',

  // API method names (verify in official AliExpress API docs)
  ENDPOINTS: {
    AFFILIATE_PRODUCT_QUERY: 'aliexpress.affiliate.product.query',
    AFFILIATE_PRODUCT_DETAIL: 'aliexpress.affiliate.product.detail.get',
    AFFILIATE_HOTPRODUCT_QUERY: 'aliexpress.affiliate.hotproduct.query',
    AFFILIATE_LINK_GENERATE: 'aliexpress.affiliate.link.generate',
    AFFILIATE_ORDER_LIST: 'aliexpress.affiliate.order.list',
  },

  // Default values
  DEFAULT_PAGE_SIZE: 20,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  RATE_LIMIT_DELAY_MS: 200,

  // API version
  API_VERSION: '2.0',

  // Signature method
  SIGN_METHOD: 'md5',
} as const
