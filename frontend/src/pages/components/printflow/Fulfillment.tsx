import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Truck, Search, Navigation } from 'lucide-react';
import { useState } from 'react';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface DeliveryInfo {
  address: string;
  city: string;
  state: string;
  zip: string;
  instructions: string;
}

interface Step4FulfillmentProps {
  storeLocations: any[];
  fulfillmentMethod: string;
  setFulfillmentMethod: (method: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  deliveryInfo: DeliveryInfo;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  userLocation: {lat: number, lng: number} | null;
  caseType: 'regular' | 'magsafe';
  onBack: () => void;
  onNext: () => void;
}

export default function Fulfillment({
  storeLocations,
  fulfillmentMethod,
  setFulfillmentMethod,
  selectedLocation,
  setSelectedLocation,
  deliveryInfo,
  setDeliveryInfo,
  userLocation,
  caseType,
  onBack,
  onNext
}: Step4FulfillmentProps) {
  const [searchZip, setSearchZip] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(storeLocations);
  const [showZipSearch, setShowZipSearch] = useState(false);

  const getDistanceStr = (location: any) => {
    if (userLocation && location.latitude && location.longitude) {
      const dist = haversineDistance(userLocation.lat, userLocation.lng, location.latitude, location.longitude);
      return dist.toFixed(1) + ' miles away';
    }
    return 'Distance unavailable';
  };

  const getEstimatedTime = (location: any) => {
    if (userLocation && location.latitude && location.longitude) {
      const dist = haversineDistance(userLocation.lat, userLocation.lng, location.latitude, location.longitude);
      // Estimate: ~25 mph average city driving speed
      const timeInHours = dist / 25;
      const timeInMinutes = Math.round(timeInHours * 60);
      
      if (timeInMinutes < 5) return '< 5 mins';
      if (timeInMinutes < 60) return `${timeInMinutes} mins`;
      
      const hours = Math.floor(timeInMinutes / 60);
      const remainingMins = timeInMinutes % 60;
      return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
    }
    return '5-15 mins';
  };

  const handleZipSearch = async () => {
    if (!searchZip.trim()) {
      setFilteredLocations(storeLocations);
      return;
    }

    try {
      // First try to get coordinates for the ZIP code using a free geocoding API
      const response = await fetch(`https://api.zippopotam.us/us/${searchZip.trim()}`);
      if (response.ok) {
        const data = await response.json();
        const zipLat = parseFloat(data.places[0].latitude);
        const zipLng = parseFloat(data.places[0].longitude);
        
        // Calculate distances and sort by proximity
        const locationsWithDistance = storeLocations.map(location => {
          if (location.latitude && location.longitude) {
            const distance = haversineDistance(zipLat, zipLng, location.latitude, location.longitude);
            return { ...location, distance, zipLat, zipLng };
          }
          return { ...location, distance: Infinity };
        }).sort((a, b) => a.distance - b.distance);
        
        setFilteredLocations(locationsWithDistance);
      } else {
        // Fallback: filter by ZIP code match
        const filtered = storeLocations.filter(location => 
          location.zipCode?.includes(searchZip) ||
          location.address?.toLowerCase().includes(searchZip.toLowerCase())
        );
        setFilteredLocations(filtered.length > 0 ? filtered : storeLocations);
      }
    } catch (error) {
      console.error('ZIP search error:', error);
      // Fallback: text-based filtering
      const filtered = storeLocations.filter(location => 
        location.zipCode?.includes(searchZip) ||
        location.address?.toLowerCase().includes(searchZip.toLowerCase()) ||
        location.city?.toLowerCase().includes(searchZip.toLowerCase())
      );
      setFilteredLocations(filtered.length > 0 ? filtered : storeLocations);
    }
  };

  const handlePickupMethodSelect = () => {
    setFulfillmentMethod('pickup');
    setShowZipSearch(true);
    setFilteredLocations(storeLocations);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Step 4: Choose Fulfillment Method
        </CardTitle>
        
        {/* Case Type Display */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                Selected Case Type: {caseType === 'magsafe' ? 'MagSafe Compatible' : 'Regular Case'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {caseType === 'magsafe' 
                  ? '🧲 Wireless charging compatible with magnetic accessories - $30.00' 
                  : '📱 Standard protective case - $20.00'
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {caseType === 'magsafe' ? '$30.00' : '$20.00'}
              </div>
              <div className="text-xs text-gray-500">
                + tax & delivery fee
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                fulfillmentMethod === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={handlePickupMethodSelect}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Pickup</h3>
                  <p className="text-sm text-gray-600">Ready in 5-10 minutes</p>
                  <p className="text-sm font-medium text-green-600">FREE</p>
                </div>
              </div>
            </div>
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                fulfillmentMethod === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setFulfillmentMethod('delivery')}
            >
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Delivery</h3>
                  <p className="text-sm text-gray-600">1-2 business days</p>
                  <p className="text-sm font-medium">$5.99</p>
                </div>
              </div>
            </div>
          </div>

          {/* ZIP Code Search for Pickup */}
          {fulfillmentMethod === 'pickup' && showZipSearch && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Find Nearby Pickup Locations</h4>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter your ZIP code (e.g., 77036)"
                    value={searchZip}
                    onChange={(e) => setSearchZip(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleZipSearch()}
                    maxLength={5}
                  />
                </div>
                <Button onClick={handleZipSearch} className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
              {searchZip && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchZip('');
                    setFilteredLocations(storeLocations);
                  }}
                >
                  Show All Locations
                </Button>
              )}
            </div>
          )}

          {/* Pickup Locations */}
          {fulfillmentMethod === 'pickup' && showZipSearch && (
            <div className="space-y-4">
              <h4 className="font-semibold">
                Select Pickup Location 
                {searchZip && ` (${filteredLocations.length} near ${searchZip})`}
              </h4>
              <div className="space-y-3">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedLocation === location.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedLocation(location.id)} // location.id is UUID
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium">{location.name}</h5>
                        <p className="text-sm text-gray-600">{location.address}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-blue-600 flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            {location.distance ? `${location.distance.toFixed(1)} miles` : getDistanceStr(location)}
                          </span>
                          <span className="text-sm text-green-600">
                            Est. {getEstimatedTime(location)} drive
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Ready in 5 mins
                        </span>
                        {location.distance && location.distance < 5 && (
                          <div className="mt-1">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Nearby
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredLocations.length === 0 && searchZip && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No locations found near {searchZip}</h3>
                    <p className="text-sm mb-4">Try searching with a different ZIP code or city name</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchZip('');
                        setFilteredLocations(storeLocations);
                      }}
                    >
                      Show All Locations
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery Information */}
          {fulfillmentMethod === 'delivery' && (
            <div className="space-y-4">
              <h4 className="font-semibold">Delivery Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={deliveryInfo.city}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={deliveryInfo.state}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={deliveryInfo.zip}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zip: e.target.value })}
                    placeholder="10001"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={deliveryInfo.instructions}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, instructions: e.target.value })}
                  placeholder="Leave at front door, ring doorbell, etc."
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={
                !fulfillmentMethod ||
                (fulfillmentMethod === 'pickup' && !selectedLocation) ||
                (fulfillmentMethod === 'delivery' && (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.zip))
              }
              onClick={onNext}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}