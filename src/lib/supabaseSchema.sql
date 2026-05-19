-- ============================================
-- RazzShares Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PORTFOLIO PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  logo_url TEXT,
  visit_url TEXT,
  twitter_url TEXT,
  telegram_url TEXT,
  discord_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  company TEXT,
  feedback TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HOMEPAGE CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text', -- text, number, url, image
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default homepage content
INSERT INTO homepage_content (key, value, type) VALUES
  ('hero_headline', 'Web3 Content Creator & Community Moderator', 'text'),
  ('hero_subheadline', 'Helping crypto projects grow through content, engagement, and ecosystem building.', 'text'),
  ('hero_image', '', 'image'),
  ('stats_projects', '50', 'number'),
  ('stats_reach', '500K', 'text'),
  ('stats_communities', '30', 'number'),
  ('stats_threads', '1000', 'number'),
  ('about_bio', 'Passionate Web3 enthusiast with deep expertise in crypto community building, content creation, and ambassador programs. I''ve worked with 50+ blockchain projects across DeFi, NFT, and Layer 2 ecosystems.', 'text')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SOCIAL LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  handle TEXT,
  visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default social links
INSERT INTO social_links (platform, url, handle) VALUES
  ('twitter', 'https://twitter.com/razzshares', '@razzshares'),
  ('telegram', 'https://t.me/razzshares', '@razzshares'),
  ('discord', 'https://discord.gg/razzshares', 'razzshares'),
  ('email', 'mailto:razzshares@gmail.com', 'razzshares@gmail.com')
ON CONFLICT (platform) DO NOTHING;

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SEO SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_image TEXT,
  keywords TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default SEO settings
INSERT INTO seo_settings (page, title, description, keywords) VALUES
  ('home', 'RazzShares | Web3 Content Creator & Community Moderator', 'Helping crypto projects grow through content, engagement, and ecosystem building.', 'Web3, crypto, content creator, community moderator, ambassador'),
  ('portfolio', 'Portfolio | RazzShares', 'Explore Web3 projects and campaigns by RazzShares.', 'Web3 portfolio, crypto projects, blockchain work'),
  ('about', 'About | RazzShares', 'Learn about RazzShares - Web3 content creator and community builder.', 'about RazzShares, Web3 creator'),
  ('contact', 'Contact | RazzShares', 'Get in touch with RazzShares for Web3 collaboration.', 'contact RazzShares, hire Web3 creator')
ON CONFLICT (page) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read portfolio" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (featured = true);
CREATE POLICY "Public read homepage_content" ON homepage_content FOR SELECT USING (true);
CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (visible = true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Admin write portfolio" ON portfolio_projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write homepage_content" ON homepage_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write social_links" ON social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write seo_settings" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read all testimonials" ON testimonials FOR SELECT USING (auth.role() = 'authenticated');

-- Contact submissions: public insert, admin read
CREATE POLICY "Public insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contact" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update contact" ON contact_submissions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete contact" ON contact_submissions FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read seo_settings" ON seo_settings FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS
-- Run in Storage section or via this SQL
-- ============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);
