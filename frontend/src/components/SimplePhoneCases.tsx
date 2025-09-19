import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Sparkles, ArrowRight } from 'lucide-react';

const phoneCases = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: '$20.00',
    image: '/images/iPhone15Pro.jpg',
    description: 'Custom case for iPhone 15 Pro'
  },
  {
    id: 2,
    name: 'Galaxy S24 Ultra',
    price: '$26.99',
    image: '/images/SamsungGalaxyS24Ultra.jpg',
    description: 'Custom case for Galaxy S24 Ultra'
  },
  {
    id: 3,
    name: 'iPhone 14 Pro',
    price: '$22.99',
    image: '/images/iPhone15Pro.jpg',
    description: 'Custom case for iPhone 14 Pro'
  }
];

export default function SimplePhoneCases() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Custom Phone Cases
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Design and print your perfect phone case in minutes at our convenient locations
          </p>
        </div>

        {/* Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          {phoneCases.map((phoneCase) => (
            <Card key={phoneCase.id} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <img 
                    src={phoneCase.image} 
                    alt={phoneCase.name}
                    className="w-32 h-auto mx-auto object-contain"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {phoneCase.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {phoneCase.description}
                </p>
                
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  {phoneCase.price}
                </p>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = '/design-case'}
                >
                  Design This Case
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <Smartphone className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
              <div>
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Design</h4>
                <p className="text-sm text-gray-600">Create your custom design online</p>
              </div>
              <div>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Visit</h4>
                <p className="text-sm text-gray-600">Find a nearby PrintPhone kiosk</p>
              </div>
              <div>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Print</h4>
                <p className="text-sm text-gray-600">Get your case printed in 2 minutes</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/design-case'}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Designing
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = '/find-machine'}
              >
                Find Locations
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}