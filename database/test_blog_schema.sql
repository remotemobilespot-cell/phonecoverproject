-- Test script to verify the blog schema works correctly
-- Run this after running blog_schema.sql

-- Test 1: Verify categories were created
SELECT 'Categories created:' as test;
SELECT id, name, slug FROM blog_categories ORDER BY id;

-- Test 2: Test inserting a blog post
INSERT INTO blog_posts (
    title, 
    slug, 
    excerpt, 
    content, 
    author, 
    category_id, 
    category,
    featured,
    meta_title,
    meta_description
) VALUES (
    'Test Blog Post',
    'test-blog-post',
    'This is a test excerpt',
    'This is the full content of the test blog post.',
    'Test Author',
    1, -- Design Tips
    'Design Tips',
    false,
    'Test Blog Post - SEO Title',
    'This is a test meta description for SEO'
);

-- Test 3: Verify the post was inserted with proper category relationship
SELECT 'Test post created:' as test;
SELECT 
    bp.id, 
    bp.title, 
    bp.category,
    bc.name as category_name,
    bc.color as category_color
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
WHERE bp.slug = 'test-blog-post';

-- Test 4: Clean up test data
DELETE FROM blog_posts WHERE slug = 'test-blog-post';
SELECT 'Test completed successfully!' as result;