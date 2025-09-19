-- Simple test seed with one blog post
-- Run this AFTER running clean_blog_schema.sql

INSERT INTO blog_posts (
    title, 
    slug, 
    excerpt, 
    content, 
    author, 
    category_id, -- This will auto-populate the category field via trigger
    featured, 
    image_url, 
    read_time,
    meta_title, 
    meta_description, 
    meta_keywords,
    interactive_elements,
    structured_data
) VALUES (
    'Top 10 Custom Phone Case Design Ideas',
    'top-10-custom-phone-case-ideas',
    'Discover the most creative phone case designs that will make your device stand out.',
    'Creating a custom phone case is an art form. Here are our top 10 design ideas that will inspire your next creation.

## 1. Minimalist Geometric Patterns
Simple shapes and clean lines create sophisticated designs that never go out of style.

## 2. Personal Photography
Transform your favorite photos into wearable memories with high-quality printing.

## 3. Typography Art
Express yourself with meaningful quotes and beautiful typography.',
    'Design Team',
    1, -- Design Tips category (will auto-populate category field)
    true,
    '/images/blog/design-ideas.jpg',
    '5 min read',
    'Top 10 Custom Phone Case Design Ideas | PrintPhoneCover',
    'Get inspired with creative phone case design ideas. Professional tips and design tools included.',
    'custom phone case, design ideas, personalized cases',
    '[
        {
            "type": "case_preview",
            "title": "Try These Designs",
            "designs": [
                {"name": "Geometric Grid", "preview_url": "/designs/grid.jpg"},
                {"name": "Photo Collage", "preview_url": "/designs/collage.jpg"}
            ]
        }
    ]'::jsonb,
    '{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Top 10 Custom Phone Case Design Ideas",
        "author": {"@type": "Person", "name": "Design Team"}
    }'::jsonb
);

-- Verify the post was created with proper category sync
SELECT 
    id, 
    title, 
    category_id, 
    category, 
    slug,
    featured
FROM blog_posts 
WHERE slug = 'top-10-custom-phone-case-ideas';