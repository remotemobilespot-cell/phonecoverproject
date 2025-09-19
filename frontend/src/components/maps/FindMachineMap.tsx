import { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface FindMachineMapProps {
  locations: StoreLocation[];
  onLocationSelect?: (location: StoreLocation) => void;
}

export default function FindMachineMap({ locations, onLocationSelect }: FindMachineMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 32.7767, lng: -96.7970 }); // Dallas center

  // Calculate map bounds based on locations
  useEffect(() => {
    if (locations.length > 0) {
      const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
      if (validLocations.length > 0) {
        const avgLat = validLocations.reduce((sum, loc) => sum + (loc.latitude || 0), 0) / validLocations.length;
        const avgLng = validLocations.reduce((sum, loc) => sum + (loc.longitude || 0), 0) / validLocations.length;
        setMapCenter({ lat: avgLat, lng: avgLng });
      }
    }
  }, [locations]);

  const handleLocationClick = (location: StoreLocation) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const handleNavigate = (location: StoreLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
    )}`;
    window.open(url, '_blank');
  };

  const validLocations = locations.filter(loc => loc.latitude && loc.longitude);

  console.log('FindMachineMap received locations:', locations.length);
  console.log('Valid locations with coordinates:', validLocations.length);
  console.log('Sample location:', validLocations[0]);

  if (validLocations.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Map Data Available</h3>
          <p className="text-sm">Location coordinates are not available for mapping.</p>
          <p className="text-sm mt-1">Please use the list view to see available locations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Interactive Map Container */}
      <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg relative overflow-hidden border-2 border-gray-200">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-100">
          {/* Grid Pattern for Map Feel */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        </div>

        {/* Location Markers */}
        <div className="absolute inset-0">
          {validLocations.map((location, index) => {
            // Calculate position based on lat/lng relative to bounds
            const minLat = Math.min(...validLocations.map(l => l.latitude || 0));
            const maxLat = Math.max(...validLocations.map(l => l.latitude || 0));
            const minLng = Math.min(...validLocations.map(l => l.longitude || 0));
            const maxLng = Math.max(...validLocations.map(l => l.longitude || 0));
            
            const latRange = maxLat - minLat || 1;
            const lngRange = maxLng - minLng || 1;
            
            const x = ((location.longitude || 0) - minLng) / lngRange;
            const y = 1 - ((location.latitude || 0) - minLat) / latRange; // Invert Y for screen coordinates
            
            // Add some padding and ensure markers are within bounds
            const left = Math.max(5, Math.min(95, 10 + (x * 80)));
            const top = Math.max(5, Math.min(95, 10 + (y * 80)));

            console.log(`Location ${location.name}: lat=${location.latitude}, lng=${location.longitude}, x=${x}, y=${y}, left=${left}%, top=${top}%`);

            return (
              <button
                key={location.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10 ${
                  selectedLocation?.id === location.id 
                    ? 'scale-125' 
                    : 'hover:scale-110'
                }`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`
                }}
                onClick={() => handleLocationClick(location)}
              >
                <div className={`relative ${
                  selectedLocation?.id === location.id 
                    ? 'animate-bounce' 
                    : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full border-3 shadow-lg flex items-center justify-center ${
                    selectedLocation?.id === location.id
                      ? 'bg-red-500 border-red-600'
                      : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
                  }`}>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Location label - always show for debugging */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap block">
                    <div className="bg-white px-2 py-1 rounded text-xs font-medium shadow-lg border max-w-32 truncate">
                      {location.name}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="bg-white rounded-lg shadow-lg p-2">
            <div className="text-xs font-medium text-gray-600 mb-1">Legend</div>
            <div className="flex items-center text-xs text-gray-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              PrintPhone Machine
            </div>
            <div className="flex items-center text-xs text-gray-700 mt-1">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              Selected Location
            </div>
          </div>
        </div>

        {/* Map Info */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <div className="text-sm font-medium text-gray-800">
              {validLocations.length} Machine{validLocations.length !== 1 ? 's' : ''} Mapped
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Click markers for details
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Texas Locations
            </div>
          </div>
        </div>

        {/* Debug Info - Remove later */}
        <div className="absolute top-4 left-4 bg-yellow-100 rounded-lg shadow-lg p-2 text-xs">
          <div>Total: {locations.length}</div>
          <div>Valid: {validLocations.length}</div>
          <div>Rendering: {validLocations.length > 0 ? '✅' : '❌'}</div>
        </div>
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="mt-6">
          <Card className="border-2 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {selectedLocation.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start text-gray-600">
                    <MapPin className="h-5 w-5 mt-1 mr-3 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="font-medium">{selectedLocation.address}</p>
                      <p>{selectedLocation.city}, {selectedLocation.state} {selectedLocation.zipCode}</p>
                      {selectedLocation.latitude && selectedLocation.longitude && (
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-green-600" />
                    <span>{selectedLocation.phone}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start text-gray-600">
                    <Clock className="h-5 w-5 mt-1 mr-3 flex-shrink-0 text-purple-600" />
                    <span>{selectedLocation.hours}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => handleNavigate(selectedLocation)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedLocation(null)}
                >
                  Close Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Action Bar */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="flex flex-wrap justify-center gap-2">
          {validLocations.slice(0, 4).map((location, index) => (
            <Button
              key={location.id}
              variant="outline"
              size="sm"
              onClick={() => handleLocationClick(location)}
              className={`text-xs ${
                selectedLocation?.id === location.id 
                  ? 'bg-blue-100 border-blue-300' 
                  : ''
              }`}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {location.name.split(' ').slice(0, 2).join(' ')}
            </Button>
          ))}
          {validLocations.length > 4 && (
            <div className="text-xs text-gray-500 flex items-center px-2">
              +{validLocations.length - 4} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
