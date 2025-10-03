// Add order_number column and update existing orders
import { supabase } from '../src/supabaseClient.js';

const addOrderNumberColumn = async () => {
  console.log('🔧 Adding order_number column to orders table...');
  
  try {
    // Test if the column already exists
    const { data: testData, error: testError } = await supabase
      .from('orders')
      .select('order_number')
      .limit(1);
    
    if (testError && testError.message.includes('does not exist')) {
      console.log('❌ order_number column does not exist - you need to add it via Supabase dashboard SQL Editor');
      console.log('\n📋 SQL to run in Supabase Dashboard > SQL Editor:');
      console.log('---');
      console.log('ALTER TABLE orders ADD COLUMN order_number text;');
      console.log('CREATE UNIQUE INDEX idx_orders_order_number ON orders(order_number);');
      console.log('---');
      console.log('\nThen run this script again to update existing orders.');
      return;
    } else {
      console.log('✅ order_number column exists or query succeeded');
      
      // Update existing orders without order numbers
      const { data: ordersToUpdate, error: fetchError } = await supabase
        .from('orders')
        .select('id, created_at')
        .is('order_number', null)
        .order('created_at', { ascending: true });
      
      if (fetchError) {
        console.error('❌ Error fetching orders:', fetchError);
        return;
      }
      
      console.log(`📦 Found ${ordersToUpdate?.length || 0} orders without order numbers`);
      
      if (ordersToUpdate && ordersToUpdate.length > 0) {
        // Generate order numbers for existing orders
        console.log('🔄 Updating existing orders with order numbers...');
        
        for (let i = 0; i < ordersToUpdate.length; i++) {
          const order = ordersToUpdate[i];
          const date = new Date(order.created_at);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const orderNumber = `PC-${year}${month}${day}-${String(i + 1).padStart(4, '0')}`;
          
          const { error: updateError } = await supabase
            .from('orders')
            .update({ order_number: orderNumber })
            .eq('id', order.id);
          
          if (updateError) {
            console.error(`❌ Error updating order ${order.id}:`, updateError);
          } else {
            console.log(`✅ Updated order ${order.id} with order number: ${orderNumber}`);
          }
        }
        
        console.log(`🎉 Successfully updated ${ordersToUpdate.length} orders`);
      } else {
        console.log('✅ All orders already have order numbers');
      }
      
      // Test the order number generation function
      console.log('\n🧪 Testing order number generation:');
      const testOrderNumber = generateOrderNumber();
      console.log(`Generated test order number: ${testOrderNumber}`);
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
};

// Generate a user-friendly order number (format: PC-YYYYMMDD-XXXX)
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  return `PC-${year}${month}${day}-${random}`;
};

console.log('🚀 Starting order number migration...');
addOrderNumberColumn().then(() => {
  console.log('✅ Migration complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});