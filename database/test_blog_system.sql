-- Test the complete blog system after running clean_blog_schema.sql
-- Run this to verify everything is working properly

-- Test 1: Verify all tables exist
SELECT 'Test 1: Checking if all blog tables exist' as test_name;
SELECT expected_tables.table_name, 
       CASE WHEN t.table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (
    VALUES ('blog_categories'), ('blog_posts'), ('blog_tags'), ('blog_post_tags'), ('blog_analytics')
) AS expected_tables(table_name)
LEFT JOIN information_schema.tables t 
    ON t.table_name = expected_tables.table_name 
    AND t.table_schema = 'public';

-- Test 2: Check categories were inserted
SELECT 'Test 2: Checking blog categories' as test_name;
SELECT id, name, slug, color FROM blog_categories ORDER BY id;

-- Test 3: Test the trigger by inserting a post
SELECT 'Test 3: Testing category auto-sync trigger' as test_name;
INSERT INTO blog_posts (
    title, 
    slug, 
    excerpt, 
    content, 
    author, 
    category_id,
    featured
) VALUES (
    'Test Post - Trigger Check',
    'test-trigger-post',
    'Testing if category name gets auto-populated',
    'This is a test post to verify the trigger works correctly.',
    'Test Author',
    1, -- Design Tips
    false
);

-- Test 4: Verify trigger worked
SELECT 'Test 4: Verifying trigger populated category name' as test_name;
SELECT 
    id,
    title,
    category_id,
    category, -- This should be 'Design Tips'
    slug,
    CASE 
        WHEN category = 'Design Tips' THEN '✅ TRIGGER WORKS' 
        ELSE '❌ TRIGGER FAILED' 
    END as trigger_status
FROM blog_posts 
WHERE slug = 'test-trigger-post';

-- Test 5: Test the join query that the API will use
SELECT 'Test 5: Testing API-style query with category join' as test_name;
SELECT 
    bp.id,
    bp.title,
    bp.category,
    bc.name as category_from_join,
    bc.color as category_color
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
WHERE bp.slug = 'test-trigger-post';

-- Test 6: Clean up test data
DELETE FROM blog_posts WHERE slug = 'test-trigger-post';

-- Test 7: Final verification
SELECT 'Test 7: Blog system ready!' as test_name;
SELECT 
    (SELECT COUNT(*) FROM blog_categories) as categories_count,
    (SELECT COUNT(*) FROM blog_tags) as tags_count,
    (SELECT COUNT(*) FROM blog_posts) as posts_count,
    '🎉 READY FOR PRODUCTION' as status;