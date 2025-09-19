-- Clean Blog Schema for PrintPhoneCover
-- Run this to create all blog-related tables with proper relationships

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS blog_analytics CASCADE;
DROP TABLE IF EXISTS blog_post_tags CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_tags CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;

-- 1. Blog categories table (create first)
CREATE TABLE blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert default categories
INSERT INTO blog_categories (name, description, slug, color) VALUES
('Design Tips', 'Creative ideas and design inspiration for custom phone cases', 'design-tips', '#8B5CF6'),
('Photography', 'Professional photography tips for perfect phone case images', 'photography', '#10B981'),
('Technology', 'Innovation and technology behind our printing process', 'technology', '#3B82F6'),
('Protection', 'How custom cases protect your valuable devices', 'protection', '#F59E0B'),
('Trends', 'Latest design trends and popular patterns', 'trends', '#EF4444'),
('Process', 'Behind the scenes of our manufacturing process', 'process', '#6B7280');

-- 3. Blog posts table with proper category relationship
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    category_id INTEGER REFERENCES blog_categories(id),
    category VARCHAR(50), -- Backward compatibility
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    image_url VARCHAR(500),
    read_time VARCHAR(20),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- SEO Fields
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    canonical_url VARCHAR(500),
    og_title VARCHAR(255),
    og_description TEXT,
    og_image VARCHAR(500),
    og_type VARCHAR(50) DEFAULT 'article',
    twitter_title VARCHAR(255),
    twitter_description TEXT,
    twitter_image VARCHAR(500),
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    
    -- Interactive Elements
    interactive_elements JSONB DEFAULT '[]',
    related_products JSONB DEFAULT '[]',
    structured_data JSONB
);

-- 4. Blog tags table
CREATE TABLE blog_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Many-to-many relationship for blog posts and tags
CREATE TABLE blog_post_tags (
    blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

-- 6. SEO analytics table
CREATE TABLE blog_analytics (
    id SERIAL PRIMARY KEY,
    blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    visitor_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    view_duration INTEGER,
    bounce_rate BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create performance indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);

-- 8. Insert default tags
INSERT INTO blog_tags (name, slug) VALUES
('Custom Design', 'custom-design'),
('Phone Protection', 'phone-protection'),
('DIY', 'diy'),
('Personalization', 'personalization'),
('Mobile Accessories', 'mobile-accessories'),
('Art & Design', 'art-design'),
('Technology', 'technology'),
('Tutorial', 'tutorial'),
('Inspiration', 'inspiration'),
('Beginner Guide', 'beginner-guide');

-- 9. Create trigger to sync category name from category_id
CREATE OR REPLACE FUNCTION sync_blog_post_category()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.category_id IS NOT NULL THEN
        SELECT name INTO NEW.category 
        FROM blog_categories 
        WHERE id = NEW.category_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_post_category_sync
    BEFORE INSERT OR UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION sync_blog_post_category();

-- 10. Verify tables were created
SELECT 'Blog tables created successfully:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'blog_%' 
ORDER BY table_name;