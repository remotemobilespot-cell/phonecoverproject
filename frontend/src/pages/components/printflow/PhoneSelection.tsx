// src/components/printflow/Step1PhoneSelection.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone } from 'lucide-react';


interface PhoneSelectionProps {
  phoneModels: any[];
  selectedPhone: string;
  setSelectedPhone: (phone: string) => void;
  onNext: () => void;
}

export default function PhoneSelection({
  phoneModels,
  selectedPhone,
  setSelectedPhone,
  onNext,
}: PhoneSelectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Step 1: Choose Your Phone Model
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label htmlFor="phone-select">Select your phone model</Label>
          <Select value={selectedPhone} onValueChange={setSelectedPhone}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your phone model" />
            </SelectTrigger>
            <SelectContent>
              {phoneModels && phoneModels.length > 0 ? (
                phoneModels.map((phone) => {
                  console.log('Rendering phone:', phone);
                  // Use 'name' field from database instead of 'model'
                  const displayName = phone.brand && phone.name 
                    ? `${phone.brand} ${phone.name}` 
                    : phone.name || phone.model || `Phone ${phone.id}`;
                  
                  return (
                    <SelectItem key={phone.id} value={phone.id}>
                      {displayName}
                    </SelectItem>
                  );
                })
              ) : (
                <SelectItem value="" disabled>
                  No phone models available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {selectedPhone && (
            <div className="mt-6 text-center">
              <div className="w-32 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-16 w-16 text-gray-400" />
              </div>
              {(() => {
                const selectedModel = phoneModels.find(p => p.id === selectedPhone);
                const displayName = selectedModel?.brand && selectedModel?.name 
                  ? `${selectedModel.brand} ${selectedModel.name}`
                  : selectedModel?.name || selectedModel?.model || 'Selected Phone';
                
                // Check MagSafe compatibility (default to true for newer models if column doesn't exist)
                const isMagSafeCompatible = selectedModel?.magsafe_compatible !== undefined 
                  ? selectedModel.magsafe_compatible 
                  : (selectedModel?.name && !selectedModel.name.includes('11')); // Assume 12+ support MagSafe
                
                const basePrice = selectedModel?.base_price || 20.00;
                
                return (
                  <div>
                    <p className="text-lg font-semibold mb-2">{displayName}</p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Regular Case:</span>
                        <span className="font-medium">$20.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">MagSafe Case:</span>
                        <span className={`font-medium ${isMagSafeCompatible ? 'text-green-600' : 'text-gray-400'}`}>
                          {isMagSafeCompatible ? '$30.00' : 'Not Available'}
                        </span>
                      </div>
                      {!isMagSafeCompatible && (
                        <p className="text-xs text-orange-600 mt-2">
                          MagSafe cases are only available for iPhone 12 and newer models
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          
          <Button 
            className="w-full mt-6" 
            disabled={!selectedPhone}
            onClick={onNext}
          >
            Continue to Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}