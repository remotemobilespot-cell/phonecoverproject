// Add case_type column to orders table via Supabase API
import { supabase } from '../src/supabaseClient.js';

async function addCaseTypeColumn() {
  try {
    console.log('Adding case_type column to orders table...');
    
    // We'll have to do this through direct SQL since Supabase doesn't allow schema changes via the client
    // Let's try to update existing orders to have case_type first
    
    console.log('Updating existing orders with default case_type...');
    
    // First, let's try to see if we can select case_type to check if it exists
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('case_type')
        .limit(1);
      
      if (error && error.message.includes('does not exist')) {
        console.log('❌ case_type column does not exist - need to add it manually via Supabase dashboard');
        console.log('\n📋 Manual steps needed:');
        console.log('1. Go to Supabase Dashboard > SQL Editor');
        console.log('2. Run this SQL command:');
        console.log('   ALTER TABLE orders ADD COLUMN case_type VARCHAR(20) DEFAULT \'regular\';');
        console.log('   ALTER TABLE orders ADD CONSTRAINT check_case_type CHECK (case_type IN (\'regular\', \'magsafe\'));');
        console.log('\n3. Then run the frontend again');
        return;
      } else {
        console.log('✅ case_type column already exists');
      }
    } catch (e) {
      console.log('Error checking case_type column:', e.message);
    }

    // Update existing orders to have case_type based on some logic
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, phone_model, phone_model_id');
    
    if (fetchError) {
      console.error('Error fetching orders:', fetchError);
      return;
    }

    console.log(`Found ${orders.length} orders to update`);
    
    // Update each order with a default case_type
    for (const order of orders) {
      // Default to regular, but we could make it smarter
      const caseType = 'regular';
      
      const { error: updateError } = await supabase
        .from('orders')
        .update({ case_type: caseType })
        .eq('id', order.id);
      
      if (updateError) {
        console.log(`❌ Failed to update order ${order.id}:`, updateError.message);
      } else {
        console.log(`✅ Updated order ${order.id} with case_type: ${caseType}`);
      }
    }

  } catch (error) {
    console.error('Error adding case_type column:', error);
  }
}

addCaseTypeColumn();