import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker for selected location
const createCustomIcon = (isSelected: boolean = false) => {
  const color = isSelected ? '#dc2626' : '#2563eb';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">📍</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

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

interface RealMapProps {
  locations: StoreLocation[];
  selectedLocation?: StoreLocation | null;
  onLocationSelect?: (location: StoreLocation) => void;
}

// Component to handle map bounds
function MapBounds({ locations }: { locations: StoreLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
      if (validLocations.length > 0) {
        const bounds = L.latLngBounds(
          validLocations.map(loc => [loc.latitude!, loc.longitude!])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [locations, map]);

  return null;
}

export default function RealMap({ locations, selectedLocation, onLocationSelect }: RealMapProps) {
  const validLocations = locations.filter(loc => loc.latitude && loc.longitude);

  if (validLocations.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Map Data Available</h3>
          <p className="text-sm">Location coordinates are not available for mapping.</p>
        </div>
      </div>
    );
  }

  // Calculate center point
  const centerLat = validLocations.reduce((sum, loc) => sum + (loc.latitude || 0), 0) / validLocations.length;
  const centerLng = validLocations.reduce((sum, loc) => sum + (loc.longitude || 0), 0) / validLocations.length;

  const handleNavigate = (location: StoreLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative">
      {/* Map Header */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Interactive Map - {validLocations.length} PrintPhone Locations
        </h3>
        <p className="text-blue-700 text-sm mt-1">
          Click on markers to view location details. Powered by OpenStreetMap.
        </p>
      </div>

      {/* Real Map Container */}
      <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBounds locations={validLocations} />
          
          {validLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude!, location.longitude!]}
              icon={createCustomIcon(selectedLocation?.id === location.id)}
              eventHandlers={{
                click: () => {
                  if (onLocationSelect) {
                    onLocationSelect(location);
                  }
                },
              }}
            >
              <Popup>
                <div className="min-w-64">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {location.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{location.address}</p>
                        <p className="text-gray-600">{location.city} {location.state} {location.zipCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-green-500" />
                      <span>{location.phone}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                      <span>{location.hours}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <Button 
                      size="sm"
                      className="w-full"
                      onClick={() => handleNavigate(location)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Controls */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span>PrintPhone Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            <span>Selected Location</span>
          </div>
        </div>
        <div className="text-xs">
          Powered by <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenStreetMap</a>
        </div>
      </div>
    </div>
  );
}