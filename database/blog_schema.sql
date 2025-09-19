-- Blog categories table (create first for foreign key reference)
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories first
INSERT INTO blog_categories (name, description, slug, color) VALUES
('Design Tips', 'Creative ideas and design inspiration for custom phone cases', 'design-tips', '#8B5CF6'),
('Photography', 'Professional photography tips for perfect phone case images', 'photography', '#10B981'),
('Technology', 'Innovation and technology behind our printing process', 'technology', '#3B82F6'),
('Protection', 'How custom cases protect your valuable devices', 'protection', '#F59E0B'),
('Trends', 'Latest design trends and popular patterns', 'trends', '#EF4444'),
('Process', 'Behind the scenes of our manufacturing process', 'process', '#6B7280')
ON CONFLICT (slug) DO NOTHING;

-- Blog posts table with SEO optimization
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    category_id INTEGER REFERENCES blog_categories(id),
    category VARCHAR(50), -- Keep for backward compatibility
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
    
    -- Schema.org structured data
    structured_data JSONB
);

-- Create indexes for performance and SEO
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);

-- Blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship for blog posts and tags
CREATE TABLE IF NOT EXISTS blog_post_tags (
    blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

-- SEO analytics table
CREATE TABLE IF NOT EXISTS blog_analytics (
    id SERIAL PRIMARY KEY,
    blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    visitor_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    view_duration INTEGER, -- in seconds
    bounce_rate BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some popular tags
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
('Beginner Guide', 'beginner-guide')
ON CONFLICT (slug) DO NOTHING;