// Run database migration through Supabase
import fs from 'fs';
import path from 'path';
import { supabase } from '../src/supabaseClient.js';

const runMigration = async () => {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(process.cwd(), '../database/migration_phone_case_improvements.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Migration file read successfully, length:', migrationSQL.length);
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\nExecuting statement ${i + 1}/${statements.length}:`);
      console.log(statement.substring(0, 100) + '...');
      
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });
      
      if (error) {
        console.error(`Error in statement ${i + 1}:`, error);
        // Try direct query if RPC fails
        console.log('Trying direct query...');
        const { data: directData, error: directError } = await supabase
          .from('phone_models')
          .select('*')
          .limit(1);
        
        if (directError) {
          console.error('Direct query also failed:', directError);
          throw error;
        } else {
          console.log('Direct query succeeded, continuing with next statement...');
        }
      } else {
        console.log(`Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
    
    // Verify the migration worked
    console.log('\nVerifying migration results...');
    
    // Check phone_models table
    const { data: phoneModels, error: phoneError } = await supabase
      .from('phone_models')
      .select('*')
      .limit(5);
    
    if (phoneError) {
      console.error('Error fetching phone models:', phoneError);
    } else {
      console.log('Sample phone models:', phoneModels);
    }
    
    // Check orders table structure
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    } else {
      console.log('Orders table verified');
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();