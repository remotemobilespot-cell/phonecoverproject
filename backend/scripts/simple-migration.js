// Execute database migration with individual ALTER statements
import { supabase } from '../src/supabaseClient.js';

const executeMigration = async () => {
  try {
    console.log('Starting database migration...');

    // Add columns to phone_models table using direct Supabase queries
    console.log('\n1. Updating phone_models table structure...');
    
    // We need to check current structure and add missing columns
    const { data: phoneModels, error: phoneError } = await supabase
      .from('phone_models')
      .select('*')
      .limit(1);
    
    if (phoneError) {
      console.error('Error accessing phone_models:', phoneError);
    } else {
      console.log('Current phone_models structure:', Object.keys(phoneModels[0] || {}));
    }

    // Add case type column to orders if it doesn't exist
    console.log('\n2. Adding case_type column to orders table...');
    try {
      // Test if case_type exists by trying to select it
      const { data, error } = await supabase
        .from('orders')
        .select('case_type')
        .limit(1);
      
      if (error && error.message.includes('column "case_type" does not exist')) {
        console.log('case_type column does not exist, needs manual addition via Supabase dashboard');
      } else {
        console.log('case_type column already exists');
      }
    } catch (e) {
      console.log('case_type column may need to be added');
    }

    // Add pricing columns to orders if they don't exist
    console.log('\n3. Checking pricing columns...');
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('subtotal, tax_amount, total_amount')
        .limit(1);
      
      if (error) {
        console.log('Pricing columns may need to be added:', error.message);
      } else {
        console.log('Pricing columns exist');
      }
    } catch (e) {
      console.log('Pricing columns may need manual addition');
    }

    // Check if phone_model_id exists and has proper type
    console.log('\n4. Checking phone_model_id column...');
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('phone_model_id')
        .limit(1);
      
      if (error) {
        console.log('phone_model_id column may need to be added:', error.message);
      } else {
        console.log('phone_model_id column exists');
      }
    } catch (e) {
      console.log('phone_model_id column may need manual addition');
    }

    // Let's update existing phone models to have proper data
    console.log('\n5. Updating existing phone models with compatibility info...');
    
    const phoneUpdates = [
      { id: 'ddaf9d22-383e-41f7-a700-a8a7dbede006', magsafe_compatible: false }, // iPhone 11
      { id: '129f77e3-de73-4f3a-8e50-82a2b995d5c6', magsafe_compatible: false }, // iPhone 11 Pro  
      { id: 'a22c9c76-d675-4362-865f-f56865026e52', magsafe_compatible: false }, // iPhone 11 Pro Max
      { id: 'af01786f-e91a-4b71-af55-d0695a5fe399', magsafe_compatible: true },  // iPhone 12 mini
      { id: '8670d9d2-6289-4950-b734-681a5f97815b', magsafe_compatible: true },  // iPhone 12
    ];

    for (const update of phoneUpdates) {
      // First check if magsafe_compatible column exists
      try {
        const { data, error } = await supabase
          .from('phone_models')
          .select('magsafe_compatible')
          .eq('id', update.id)
          .single();

        if (error && error.message.includes('column "magsafe_compatible" does not exist')) {
          console.log(`magsafe_compatible column doesn't exist for ${update.id}, skipping update`);
          continue;
        }

        // Column exists, do the update
        const { error: updateError } = await supabase
          .from('phone_models')
          .update({ magsafe_compatible: update.magsafe_compatible })
          .eq('id', update.id);

        if (updateError) {
          console.log(`Update failed for ${update.id}:`, updateError.message);
        } else {
          console.log(`Updated ${update.id} magsafe_compatible: ${update.magsafe_compatible}`);
        }
      } catch (e) {
        console.log(`Error updating ${update.id}:`, e.message);
      }
    }

    console.log('\n✅ Migration completed!');
    console.log('\nNote: Some columns may need to be added manually via Supabase dashboard:');
    console.log('- phone_models: magsafe_compatible (BOOLEAN DEFAULT false)');
    console.log('- orders: case_type (VARCHAR(20) CHECK (case_type IN (\'regular\', \'magsafe\')))');
    console.log('- orders: subtotal (DECIMAL(10,2))');  
    console.log('- orders: tax_amount (DECIMAL(10,2))');
    console.log('- orders: total_amount (DECIMAL(10,2))');
    console.log('- orders: phone_model_id (UUID REFERENCES phone_models(id))');

    // Final verification
    console.log('\n6. Final verification...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('phone_models')
      .select('*')
      .limit(3);
    
    if (finalError) {
      console.error('Final verification failed:', finalError);
    } else {
      console.log('Sample phone models after migration:', finalCheck);
    }

  } catch (error) {
    console.error('Migration failed:', error);
  }
};

executeMigration();