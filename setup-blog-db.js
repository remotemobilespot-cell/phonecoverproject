// Setup blog database tables and data
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// You'll need to set these environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fvxpyyhyewzvjkjrfney.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const setupBlogDatabase = async () => {
  console.log('🚀 Setting up blog database...');
  
  try {
    // First, let's check if the tables exist
    console.log('1. Checking if blog tables exist...');
    
    const { data: tables, error } = await supabase
      .from('blog_posts')
      .select('count', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      console.log('❌ Blog tables do not exist');
      console.log('📋 Manual setup required:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Open the SQL Editor');
      console.log('3. Run the contents of database/blog_schema.sql');
      console.log('4. Run the contents of database/simple_blog_seed.sql');
      console.log('');
      console.log('Or copy and paste this SQL:');
      console.log('================================');
      
      // Read and display the SQL files
      try {
        const schemaSQL = fs.readFileSync(join(__dirname, 'database', 'blog_schema.sql'), 'utf8');
        console.log(schemaSQL);
        console.log('\n-- Then run this seed data:');
        const seedSQL = fs.readFileSync(join(__dirname, 'database', 'simple_blog_seed.sql'), 'utf8');
        console.log(seedSQL);
      } catch (fileError) {
        console.log('Could not read SQL files. Please run them manually from the database folder.');
      }
    } else if (error) {
      console.log('❌ Database connection error:', error);
    } else {
      console.log('✅ Blog tables exist!');
      console.log('📊 Current blog posts:', tables);
      
      if (tables === 0) {
        console.log('⚠️  No blog posts found. Adding sample data...');
        // We could add sample data here, but it's safer to use the SQL files
        console.log('Please run database/simple_blog_seed.sql to add sample posts');
      }
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
};

setupBlogDatabase();