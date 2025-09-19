import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Star, ArrowRight, Zap } from 'lucide-react';
import PhoneCaseOverlay from './PhoneCaseOverlay';

interface PhoneCase {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  description: string;
  popular?: boolean;
}

const phoneCases: PhoneCase[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    price: '$20.00',
    image: '/images/iPhone15Pro.jpg',
    description: 'Latest iPhone with premium materials',
    popular: true
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: '$22.00',
    image: '/images/SamsungGalaxyS24Ultra.jpg',
    description: 'Flagship Android with S Pen'
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    brand: 'Apple', 
    price: '$20.00',
    image: '/images/iPhone15Pro.jpg',
    description: 'Previous generation iPhone Pro'
  }
];

interface InteractivePhoneCasesProps {
  onSelectPhone?: (phoneCase: PhoneCase) => void;
  selectedPhoneId?: string;
}

const InteractivePhoneCases: React.FC<InteractivePhoneCasesProps> = ({ 
  onSelectPhone, 
  selectedPhoneId 
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (phoneCase: PhoneCase) => {
    if (onSelectPhone) {
      onSelectPhone(phoneCase);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Smartphone className="h-8 w-8 mr-3 text-blue-600" />
            Choose Your Phone Model
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your phone model to create the perfect custom case
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {phoneCases.map((phoneCase) => (
            <Card 
              key={phoneCase.id} 
              className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                selectedPhoneId === phoneCase.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              } ${hoveredId === phoneCase.id ? 'scale-105' : ''}`}
              onMouseEnter={() => setHoveredId(phoneCase.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleSelect(phoneCase)}
            >
              <CardContent className="p-6 text-center">
                {phoneCase.popular && (
                  <div className="flex justify-center mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </span>
                  </div>
                )}

                <div className="mb-6 flex justify-center">
                  <PhoneCaseOverlay 
                    phoneModel={phoneCase.name}
                    image={phoneCase.image}
                    className="transform transition-transform duration-300 hover:scale-110"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {phoneCase.name}
                </h3>
                
                <p className="text-sm text-gray-500 mb-3">
                  {phoneCase.brand} • {phoneCase.description}
                </p>
                
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  {phoneCase.price}
                </p>
                
                <Button 
                  className={`w-full transition-all duration-300 ${
                    selectedPhoneId === phoneCase.id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 hover:bg-blue-600'
                  }`}
                  onClick={() => handleSelect(phoneCase)}
                >
                  {selectedPhoneId === phoneCase.id ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    <>
                      Select This Model
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractivePhoneCases;