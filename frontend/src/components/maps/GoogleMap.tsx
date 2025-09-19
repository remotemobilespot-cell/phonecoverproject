import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Declare global google maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

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

interface GoogleMapProps {
  locations: StoreLocation[];
  selectedLocation?: StoreLocation | null;
  onLocationSelect?: (location: StoreLocation) => void;
}

// To use this component, you need to:
// 1. Get a Google Maps API key from https://console.cloud.google.com/
// 2. Enable Maps JavaScript API
// 3. Add the script tag to index.html:
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>

export default function GoogleMap({ locations, selectedLocation, onLocationSelect }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const validLocations = locations.filter(loc => loc.latitude && loc.longitude);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    } else {
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleMapsLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (isGoogleMapsLoaded && mapRef.current && validLocations.length > 0) {
      // Calculate center
      const centerLat = validLocations.reduce((sum, loc) => sum + (loc.latitude || 0), 0) / validLocations.length;
      const centerLng = validLocations.reduce((sum, loc) => sum + (loc.longitude || 0), 0) / validLocations.length;

      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          // Optional: Custom styling for a modern look
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstance.current = map;

      // Create bounds to fit all markers
      const bounds = new google.maps.LatLngBounds();

      // Add markers
      validLocations.forEach((location) => {
        const position = { lat: location.latitude!, lng: location.longitude! };
        bounds.extend(position);

        const marker = new google.maps.Marker({
          position,
          map,
          title: location.name,
          icon: {
            url: selectedLocation?.id === location.id 
              ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
              : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 250px;">
              <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                📍 ${location.name}
              </h3>
              <div style="margin-bottom: 8px;">
                <strong>Address:</strong><br>
                ${location.address}<br>
                ${location.city}, ${location.state} ${location.zipCode}
              </div>
              <div style="margin-bottom: 8px;">
                <strong>📞 Phone:</strong> ${location.phone}
              </div>
              <div style="margin-bottom: 12px;">
                <strong>🕒 Hours:</strong> ${location.hours}
              </div>
              <button 
                onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address + ', ' + location.city + ', ' + location.state + ' ' + location.zipCode)}', '_blank')"
                style="background: #2563eb; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                🧭 Get Directions
              </button>
            </div>
          `
        });

        marker.addListener('click', () => {
          // Close other info windows
          if (onLocationSelect) {
            onLocationSelect(location);
          }
          infoWindow.open(map, marker);
        });
      });

      // Fit map to show all markers
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
      });
    }
  }, [isGoogleMapsLoaded, validLocations, selectedLocation, onLocationSelect]);

  const handleNavigate = (location: StoreLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
    )}`;
    window.open(url, '_blank');
  };

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

  if (!isGoogleMapsLoaded) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Loading Google Maps...</h3>
          <p className="text-sm">Please wait while we load the interactive map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Header */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Google Maps - {validLocations.length} PrintPhone Locations
        </h3>
        <p className="text-blue-700 text-sm mt-1">
          Click on markers to view location details and get directions.
        </p>
      </div>

      {/* Google Map Container */}
      <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
        <div ref={mapRef} className="w-full h-full" />
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
          Powered by <span className="text-blue-600">Google Maps</span>
        </div>
      </div>
    </div>
  );
}