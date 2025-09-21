import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateStoreHours() {
  console.log('🕒 Updating store hours...');

  try {
    // Houston Rosslyn: Monday to Saturday: 10am - 9pm, Sunday: 12pm - 6pm
    const houstonUpdate = await supabase
      .from('store_locations')
      .update({ hours: 'Mon-Sat: 10am-9pm, Sun: 12pm-6pm' })
      .or('name.ilike.%Houston%Rosslyn%,name.ilike.%Rosslyn%');
    
    console.log('✅ Houston Rosslyn hours updated:', houstonUpdate);

    // Bay City: 7am - 11pm
    const bayCityUpdate = await supabase
      .from('store_locations')
      .update({ hours: '7am-11pm' })
      .ilike('name', '%Bay City%');
    
    console.log('✅ Bay City hours updated:', bayCityUpdate);

    // Cuero: 7am - 11pm
    const cueroUpdate = await supabase
      .from('store_locations')
      .update({ hours: '7am-11pm' })
      .ilike('name', '%Cuero%');
    
    console.log('✅ Cuero hours updated:', cueroUpdate);

    // Remove Lufkin 2 if it exists
    const deleteLufkin2 = await supabase
      .from('store_locations')
      .delete()
      .or('name.ilike.%Lufkin 2%,name.ilike.%Lufkin%2%');
    
    console.log('✅ Lufkin 2 removed:', deleteLufkin2);

    // Lufkin HEB: 7am - 11pm
    const lufkinHEBUpdate = await supabase
      .from('store_locations')
      .update({ hours: '7am-11pm' })
      .or('name.ilike.%Lufkin%HEB%,name.and.(ilike.%Lufkin%,ilike.%HEB%)');
    
    console.log('✅ Lufkin HEB hours updated:', lufkinHEBUpdate);

    // San Antonio: 7am - 11pm
    const sanAntonioUpdate = await supabase
      .from('store_locations')
      .update({ hours: '7am-11pm' })
      .ilike('name', '%San Antonio%');
    
    console.log('✅ San Antonio hours updated:', sanAntonioUpdate);

    // Get all remaining locations to update to 7am-11pm
    const { data: remainingStores } = await supabase
      .from('store_locations')
      .select('id, name, hours')
      .not('name', 'ilike', '%Houston%Rosslyn%')
      .not('name', 'ilike', '%Rosslyn%')
      .not('name', 'ilike', '%Bay City%')
      .not('name', 'ilike', '%Cuero%')
      .not('name', 'ilike', '%San Antonio%')
      .not('name', 'ilike', '%Lufkin%HEB%');

    if (remainingStores && remainingStores.length > 0) {
      const remainingUpdate = await supabase
        .from('store_locations')
        .update({ hours: '7am-11pm' })
        .in('id', remainingStores.map(store => store.id));
      
      console.log('✅ Remaining stores hours updated:', remainingUpdate);
      console.log('Updated stores:', remainingStores.map(s => s.name));
    }

    console.log('🎉 All store hours updated successfully!');
    
    // Fetch and display updated hours
    const { data: updatedStores } = await supabase
      .from('store_locations')
      .select('name, hours')
      .order('name');
    
    console.log('\n📍 Updated store hours:');
    updatedStores?.forEach(store => {
      console.log(`- ${store.name}: ${store.hours}`);
    });

  } catch (error) {
    console.error('❌ Error updating store hours:', error);
  }
}

updateStoreHours();