import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to parse address and extract city, state, zip
function parseAddress(address) {
  let city = '';
  let state = '';
  let zipCode = '';
  
  // Clean up the address
  const cleanAddress = address.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Try to extract ZIP code (5 digits, but not longer numbers)
  const zipMatch = cleanAddress.match(/\b(\d{5})\b(?!\d)/);
  if (zipMatch) {
    zipCode = zipMatch[1];
  }
  
  // Try to extract state (2 capital letters or full state names)
  const stateMatch = cleanAddress.match(/\b(TX|Texas|AL|Alabama|CA|California|FL|Florida|NY|New York)\b/i);
  if (stateMatch) {
    state = stateMatch[1].toUpperCase();
    // Convert full state names to abbreviations
    if (state === 'TEXAS') state = 'TX';
    if (state === 'ALABAMA') state = 'AL';
    if (state === 'CALIFORNIA') state = 'CA';
    if (state === 'FLORIDA') state = 'FL';
    if (state === 'NEW YORK') state = 'NY';
    
    // Extract city - look for text between commas before the state
    const parts = cleanAddress.split(',');
    if (parts.length >= 2) {
      // Find the part with the state
      const statePartIndex = parts.findIndex(part => part.trim().includes(state) || part.trim().toLowerCase().includes('texas'));
      if (statePartIndex > 0) {
        city = parts[statePartIndex - 1].trim();
        // Remove street parts from city (anything with numbers or "St", "Dr", "Ave", etc.)
        city = city.replace(/^\d+\s+[A-Z][\w\s]*(?:St|Dr|Ave|Rd|Blvd|Way|Ln)[\w\s]*,?\s*/i, '').trim();
      }
    }
  }
  
  // Fallback: if no city found, try to extract from common patterns
  if (!city) {
    // Look for city names we know exist in the data
    const knownCities = ['Bay City', 'Corpus Christi', 'Cuero', 'Houston', 'Lufkin', 'San Antonio'];
    for (const knownCity of knownCities) {
      if (cleanAddress.toLowerCase().includes(knownCity.toLowerCase())) {
        city = knownCity;
        break;
      }
    }
  }
  
  return {
    city: city || 'Unknown',
    state: state || 'TX', // Default to TX since most locations are in Texas
    zipCode: zipCode || 'Unknown'
  };
}

// Helper function to transform location data
function transformLocation(location) {
  const { city, state, zipCode } = parseAddress(location.address);
  
  return {
    id: location.id,
    name: location.name,
    address: location.address,
    city,
    state,
    zipCode,
    phone: location.phone,
    hours: location.hours,
    latitude: location.latitude,
    longitude: location.longitude,
    lat: location.latitude, // For map compatibility
    lng: location.longitude, // For map compatibility
    is_active: location.is_active !== false, // Default to true if not specified
    email: location.email || '',
    created_at: location.created_at
  };
}

// GET /api/locations - Get all store locations
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('store_locations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching store locations:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch store locations',
        details: error.message 
      });
    }

    // Transform data to match frontend expectations
    const locations = data?.map(transformLocation) || [];

    res.json({
      success: true,
      data: locations,
      count: locations.length
    });

  } catch (error) {
    console.error('Error in locations API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /api/locations/:id - Get specific store location
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('store_locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ 
          error: 'Store location not found' 
        });
      }
      console.error('Error fetching store location:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch store location',
        details: error.message 
      });
    }

    // Transform data to match frontend expectations
    const location = transformLocation(data);

    res.json({
      success: true,
      data: location
    });

  } catch (error) {
    console.error('Error in location API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /api/locations/search/:zipCode - Search locations by ZIP code
router.get('/search/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;
    
    const { data, error } = await supabase
      .from('store_locations')
      .select('*')
      .ilike('address', `%${zipCode}%`)
      .order('name');

    if (error) {
      console.error('Error searching store locations:', error);
      return res.status(500).json({ 
        error: 'Failed to search store locations',
        details: error.message 
      });
    }

    // Transform data to match frontend expectations
    const locations = data?.map(transformLocation) || [];

    res.json({
      success: true,
      data: locations,
      count: locations.length,
      searchTerm: zipCode
    });

  } catch (error) {
    console.error('Error in location search API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /api/locations/nearby - Get nearby store locations
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 10 } = req.query; // Default radius is 10 km

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const { data, error } = await supabase.rpc('get_nearby_locations', {
      user_lat: parseFloat(lat),
      user_lng: parseFloat(lng),
      search_radius: parseFloat(radius)
    });

    if (error) {
      console.error('Error fetching nearby locations:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch nearby locations',
        details: error.message 
      });
    }

    // Transform data to match frontend expectations
    const locations = data?.map(transformLocation) || [];

    res.json({
      success: true,
      data: locations,
      count: locations.length
    });

  } catch (error) {
    console.error('Error in nearby locations API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('store_locations')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Store locations API is healthy',
      database_connected: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Store locations API health check failed',
      database_connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
