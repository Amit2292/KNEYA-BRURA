-- Migration 001: Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- CATEGORIES
-- =====================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_he text NOT NULL,
  slug text UNIQUE NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  ae_category_id text,
  icon text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- =====================
-- PRODUCTS
-- =====================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ae_product_id text UNIQUE,
  title_raw text NOT NULL,
  title_he text,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  images jsonb DEFAULT '[]',
  rating numeric(3,2),
  orders_count int DEFAULT 0,
  seller_name text,
  seller_score numeric(5,2),
  trust_score int DEFAULT 0,
  short_summary_he text,
  pros jsonb DEFAULT '[]',
  cons jsonb DEFAULT '[]',
  is_featured boolean DEFAULT false,
  is_daily_deal boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_daily_deal ON products(is_daily_deal) WHERE is_daily_deal = true;
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller) WHERE is_best_seller = true;
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_trust_score ON products(trust_score DESC);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_products_updated_at();

-- =====================
-- OFFERS
-- =====================
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price numeric(10,2),
  shipping_price numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  price_ils numeric(10,2),
  shipping_ils numeric(10,2) DEFAULT 0,
  total_ils numeric(10,2),
  delivery_min_days int,
  delivery_max_days int,
  is_free_shipping boolean DEFAULT false,
  last_checked_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_offers_product_id ON offers(product_id);

-- =====================
-- AFFILIATE LINKS
-- =====================
CREATE TABLE IF NOT EXISTS affiliate_links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tracking_id text,
  affiliate_url text NOT NULL,
  last_generated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_links_product_id ON affiliate_links(product_id);

-- =====================
-- FX RATES
-- =====================
CREATE TABLE IF NOT EXISTS fx_rates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  base text NOT NULL,
  quote text NOT NULL,
  rate numeric(10,4) NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(base, quote)
);

-- Insert default USD->ILS fallback rate
INSERT INTO fx_rates (base, quote, rate)
VALUES ('USD', 'ILS', 3.75)
ON CONFLICT (base, quote) DO NOTHING;

-- =====================
-- CLICKS
-- =====================
CREATE TABLE IF NOT EXISTS clicks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  referrer text,
  user_agent text
);

CREATE INDEX IF NOT EXISTS idx_clicks_product_id_created_at ON clicks(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at DESC);

-- =====================
-- SYNC JOBS
-- =====================
CREATE TABLE IF NOT EXISTS sync_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_name text NOT NULL,
  status text NOT NULL DEFAULT 'running', -- running|success|failed
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  meta jsonb DEFAULT '{}',
  error text
);

CREATE INDEX IF NOT EXISTS idx_sync_jobs_job_name ON sync_jobs(job_name);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_status ON sync_jobs(status);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_started_at ON sync_jobs(started_at DESC);

-- =====================
-- ADMINS TABLE (optional)
-- =====================
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
