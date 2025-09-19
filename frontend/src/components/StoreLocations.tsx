import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

export default function StoreLocations() {
  const [storeLocations, setStoreLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreLocations();
  }, []);

  const fetchStoreLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching store locations:', error);
        setStoreLocations([]);
      } else {
        setStoreLocations(data || []);
      }
    } catch (error) {
      console.error('Error fetching store locations:', error);
      setStoreLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (location: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
    )}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Loading store locations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (storeLocations.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Store Locations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Store locations will be available soon. Check back later!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Store Locations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the nearest PrintPhone machine and start creating your custom case today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">{location.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                    <span>
                      {location.address}<br />
                      {location.city}, {location.state} {location.zipCode}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{location.phone}</span>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-600">
                    <Clock className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                    <span>{location.hours}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleNavigate(location)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate Me
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}