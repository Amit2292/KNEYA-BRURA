export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Category, 'id'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Product, 'id'>>
      }
      offers: {
        Row: Offer
        Insert: Omit<Offer, 'id'> & { id?: string }
        Update: Partial<Omit<Offer, 'id'>>
      }
      affiliate_links: {
        Row: AffiliateLink
        Insert: Omit<AffiliateLink, 'id'> & { id?: string }
        Update: Partial<Omit<AffiliateLink, 'id'>>
      }
      fx_rates: {
        Row: FxRate
        Insert: Omit<FxRate, 'id'> & { id?: string }
        Update: Partial<Omit<FxRate, 'id'>>
      }
      clicks: {
        Row: Click
        Insert: Omit<Click, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<Click, 'id'>>
      }
      sync_jobs: {
        Row: SyncJob
        Insert: Omit<SyncJob, 'id' | 'started_at'> & { id?: string }
        Update: Partial<Omit<SyncJob, 'id'>>
      }
      admins: {
        Row: Admin
        Insert: Omit<Admin, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<Admin, 'id'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export interface Category {
  id: string
  name_he: string
  slug: string
  parent_id: string | null
  ae_category_id: string | null
  icon: string | null
  created_at: string
}

export interface Product {
  id: string
  ae_product_id: string | null
  title_raw: string
  title_he: string | null
  slug: string
  category_id: string | null
  images: string[]
  rating: number | null
  orders_count: number
  seller_name: string | null
  seller_score: number | null
  trust_score: number
  short_summary_he: string | null
  pros: string[]
  cons: string[]
  is_featured: boolean
  is_daily_deal: boolean
  is_best_seller: boolean
  last_synced_at: string | null
  created_at: string
  updated_at: string
}

export interface Offer {
  id: string
  product_id: string
  price: number | null
  shipping_price: number
  currency: string
  price_ils: number | null
  shipping_ils: number
  total_ils: number | null
  delivery_min_days: number | null
  delivery_max_days: number | null
  is_free_shipping: boolean
  last_checked_at: string
}

export interface AffiliateLink {
  id: string
  product_id: string
  tracking_id: string | null
  affiliate_url: string
  last_generated_at: string
}

export interface FxRate {
  id: string
  base: string
  quote: string
  rate: number
  updated_at: string
}

export interface Click {
  id: string
  product_id: string
  created_at: string
  referrer: string | null
  user_agent: string | null
}

export interface SyncJob {
  id: string
  job_name: string
  status: 'running' | 'success' | 'failed'
  started_at: string
  finished_at: string | null
  meta: Json
  error: string | null
}

export interface Admin {
  id: string
  user_id: string
  email: string
  created_at: string
}

// Extended types with joins
export interface ProductWithOffer extends Product {
  offers?: Offer[]
  affiliate_links?: AffiliateLink[]
  category?: Category
}

export interface CategoryWithChildren extends Category {
  children?: Category[]
}
