import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import RealMap from '@/components/maps/RealMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Navigation, Search, Locate, List, Map as MapIcon, Loader, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: string;
  latitude?: number;
  longitude?: number;
}

export default function FindMachine() {
  const [zipCode, setZipCode] = useState('');
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [error, setError] = useState<string | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from database
      const { data, error: dbError } = await supabase
        .from('store_locations')
        .select('*')
        .order('name');

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to load store locations from database');
      }

      if (data && data.length > 0) {
        console.log('Loaded from database:', data.length, 'locations');
        const dbLocations: StoreLocation[] = data.map(loc => ({
          id: loc.id.toString(),
          name: loc.name,
          address: loc.address,
          city: loc.city,
          state: loc.state,
          zipCode: loc.zipCode,
          phone: loc.phone,
          hours: loc.hours,
          latitude: loc.latitude,
          longitude: loc.longitude
        }));
        setLocations(dbLocations);
        setFilteredLocations(dbLocations);
      } else {
        console.log('No locations found in database');
        setLocations([]);
        setFilteredLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to load store locations. Please try again.');
      setLocations([]);
      setFilteredLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (zipCode) {
      const filtered = locations.filter(location => 
        location.zipCode.includes(zipCode) || 
        location.city.toLowerCase().includes(zipCode.toLowerCase()) ||
        location.name.toLowerCase().includes(zipCode.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  };

  const handleUseLocation = async () => {
    setLoading(true);
    try {
      // Use IP-based location instead of GPS
      const response = await fetch('http://ip-api.com/json/');
      const data = await response.json();
      
      if (data.status === 'success') {
        const userLat = data.lat;
        const userLng = data.lon;
        
        // Calculate distances and sort by proximity
        const locationsWithDistance = locations.map(location => {
          if (location.latitude && location.longitude) {
            const distance = Math.sqrt(
              Math.pow(userLat - location.latitude, 2) + 
              Math.pow(userLng - location.longitude, 2)
            );
            return { ...location, distance };
          }
          return { ...location, distance: Infinity };
        }).sort((a, b) => a.distance - b.distance);
        
        setFilteredLocations(locationsWithDistance);
        
        // Show user's detected location
        console.log(`Detected location: ${data.city}, ${data.regionName}, ${data.country}`);
        
      } else {
        throw new Error('Failed to detect location from IP');
      }
    } catch (error) {
      console.error('IP location detection failed:', error);
      
      // Fallback: Show all locations sorted by name
      const sortedLocations = [...locations].sort((a, b) => a.name.localeCompare(b.name));
      setFilteredLocations(sortedLocations);
      
      alert('Unable to detect your location automatically. Showing all locations instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (location: StoreLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
    )}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Loader className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
            <h1 className="text-2xl font-bold mb-2">Loading Store Locations...</h1>
            <p className="text-gray-600">Please wait while we load PrintPhone machine locations from our database</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if there's an error and no locations loaded
  if (error && locations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h1 className="text-2xl font-bold mb-4 text-red-800">Unable to Load Locations</h1>
              <p className="text-red-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={fetchLocations}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find a PrintPhone Machine</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Locate the nearest machine to start printing your custom phone case
          </p>
          
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md max-w-md mx-auto flex items-center justify-between">
              <span>{error}</span>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => {
                  setError(null);
                  fetchLocations();
                }}
                className="ml-2 text-yellow-700 hover:text-yellow-800"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter ZIP code, city name, or location name"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="flex-1 sm:flex-none">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={handleUseLocation} className="flex-1 sm:flex-none">
                  <Locate className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {filteredLocations.length} Machine{filteredLocations.length !== 1 ? 's' : ''} Found
            </h2>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                List View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2"
              >
                <MapIcon className="h-4 w-4" />
                Map View
              </Button>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'list' ? (
          // List View
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">{location.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-5 w-5 mt-1 mr-3 flex-shrink-0 text-blue-600" />
                      <div>
                        <p>{location.address}</p>
                        <p>{location.city} {location.state} {location.zipCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-green-600" />
                      <span>{location.phone}</span>
                    </div>
                    
                    <div className="flex items-start text-gray-600">
                      <Clock className="h-5 w-5 mt-1 mr-3 flex-shrink-0 text-purple-600" />
                      <span>{location.hours}</span>
                    </div>

                    {/* Show coordinates if available */}
                    {location.latitude && location.longitude && (
                      <div className="text-xs text-gray-500">
                        Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleNavigate(location)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setViewMode('map')}
                    >
                      <MapIcon className="h-4 w-4 mr-2" />
                      Show on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Map View
          <div className="bg-white rounded-lg shadow-lg p-6">
            <RealMap 
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={(location) => {
                setSelectedLocation(location);
                console.log('Selected location:', location);
              }}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}