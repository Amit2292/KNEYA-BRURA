-- Migration 002: Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- =====================
-- PUBLIC READ POLICIES
-- =====================

-- Categories: anyone can read
CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

-- Products: anyone can read
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (true);

-- Offers: anyone can read
CREATE POLICY "Public read offers"
  ON offers FOR SELECT
  USING (true);

-- Affiliate links: anyone can read
CREATE POLICY "Public read affiliate_links"
  ON affiliate_links FOR SELECT
  USING (true);

-- FX rates: anyone can read
CREATE POLICY "Public read fx_rates"
  ON fx_rates FOR SELECT
  USING (true);

-- =====================
-- CLICKS: server-side insert via service role
-- Note: clicks are inserted via service_role key on server, bypasses RLS
-- No anon insert policy needed - service role bypasses RLS
-- =====================
CREATE POLICY "Service role manages clicks"
  ON clicks FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================
-- ADMIN WRITE POLICIES
-- Authenticated users with admin role can do CRUD
-- Using a helper function to check admin status
-- =====================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- Check if user is in admins table
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories: admin can CRUD
CREATE POLICY "Admin CRUD categories"
  ON categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Products: admin can CRUD
CREATE POLICY "Admin CRUD products"
  ON products FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Offers: admin can CRUD
CREATE POLICY "Admin CRUD offers"
  ON offers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Affiliate links: admin can CRUD
CREATE POLICY "Admin CRUD affiliate_links"
  ON affiliate_links FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- FX rates: admin can CRUD
CREATE POLICY "Admin CRUD fx_rates"
  ON fx_rates FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Sync jobs: admin can read
CREATE POLICY "Admin read sync_jobs"
  ON sync_jobs FOR SELECT
  USING (is_admin());

-- Admins table: admin can read own record
CREATE POLICY "Admin read admins"
  ON admins FOR SELECT
  USING (user_id = auth.uid() OR is_admin());
