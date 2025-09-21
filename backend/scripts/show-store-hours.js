import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function showAllStoreHours() {
  const { data: stores } = await supabase
    .from('store_locations')
    .select('name, hours')
    .order('name');
  
  console.log('📍 Final store hours:');
  stores?.forEach(store => {
    console.log(`- ${store.name}: ${store.hours}`);
  });
}

showAllStoreHours();