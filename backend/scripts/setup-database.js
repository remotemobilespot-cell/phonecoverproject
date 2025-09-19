import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'database_setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📄 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 0) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          query: statement + ';' 
        });

        if (error) {
          // Try direct query execution
          const { error: directError } = await supabase
            .from('store_locations')
            .select('*')
            .limit(1);
            
          if (directError && statement.toLowerCase().includes('create table')) {
            console.log(`⚠️  Table might already exist, continuing...`);
          } else if (error.message.includes('does not exist')) {
            console.log(`⚠️  Skipping statement due to dependency: ${error.message}`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.log('Statement:', statement.substring(0, 100) + '...');
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
    }

    // Verify the setup by checking data
    console.log('\n🔍 Verifying database setup...');
    
    const { data: locations, error: locError } = await supabase
      .from('store_locations')
      .select('*')
      .limit(5);

    if (locError) {
      console.error('❌ Error checking store_locations:', locError.message);
    } else {
      console.log(`✅ Store locations table: ${locations?.length || 0} records found`);
      if (locations && locations.length > 0) {
        console.log('Sample location:', {
          name: locations[0].name,
          coordinates: `${locations[0].latitude}, ${locations[0].longitude}`
        });
      }
    }

    const { data: testimonials, error: testError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(3);

    if (testError) {
      console.error('❌ Error checking testimonials:', testError.message);
    } else {
      console.log(`✅ Testimonials table: ${testimonials?.length || 0} records found`);
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\nYou can now:');
    console.log('1. View locations in the FindMachine page');
    console.log('2. See the interactive map with coordinates');
    console.log('3. Use the testimonials slider');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Run the setup
setupDatabase();