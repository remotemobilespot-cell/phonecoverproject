// src/pages/components/printflow/CaseTypeSelection.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Zap } from 'lucide-react';

interface CaseTypeSelectionProps {
  selectedPhone: string;
  phoneModels: any[];
  caseType: 'regular' | 'magsafe';
  setCaseType: (type: 'regular' | 'magsafe') => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CaseTypeSelection({
  selectedPhone,
  phoneModels,
  caseType,
  setCaseType,
  onNext,
  onBack
}: CaseTypeSelectionProps) {
  // Get selected phone model details
  const selectedModel = phoneModels.find(p => p.id === selectedPhone);
  const phoneDisplayName = selectedModel?.brand && selectedModel?.name 
    ? `${selectedModel.brand} ${selectedModel.name}`
    : selectedModel?.name || 'Selected Phone';

  // Check MagSafe compatibility
  const isMagSafeCompatible = selectedModel?.magsafe_compatible !== undefined 
    ? selectedModel.magsafe_compatible 
    : (selectedModel?.name && !selectedModel.name.includes('11')); // Default logic for older data

  const regularPrice = 20.00;
  const magsafePrice = 30.00;
  const taxRate = 0.0825;
  
  const subtotal = caseType === 'magsafe' ? magsafePrice : regularPrice;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Smartphone className="h-6 w-6 text-blue-600" />
          Step 3: Choose Your Case Type
        </CardTitle>
        <p className="text-center text-gray-600 mt-2">
          Selected Phone: <span className="font-semibold text-blue-600">{phoneDisplayName}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Regular Case Option */}
          <div
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
              caseType === 'regular' 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onClick={() => {
              console.log('Regular case selected');
              setCaseType('regular');
            }}
          >
            <div className="text-center">
              <div className="w-20 h-32 bg-gray-300 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                <Smartphone className="h-12 w-12 text-gray-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Regular Case</h3>
              <p className="text-gray-600 mb-4">Standard protection with clean design</p>
              
              <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="text-2xl font-bold text-green-600">${regularPrice.toFixed(2)}</div>
                <div className="text-sm text-gray-500">+ tax (${(regularPrice * taxRate).toFixed(2)})</div>
                <div className="text-sm font-semibold text-gray-800">Total: ${(regularPrice * (1 + taxRate)).toFixed(2)}</div>
              </div>
              
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Durable TPU material</li>
                <li>✓ Precise cutouts</li>
                <li>✓ Drop protection</li>
                <li>✓ Wireless charging compatible</li>
              </ul>
            </div>
          </div>

          {/* MagSafe Case Option */}
          <div
            className={`border-2 rounded-xl p-6 transition-all ${
              !isMagSafeCompatible
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                : caseType === 'magsafe' 
                  ? 'border-blue-500 bg-blue-50 shadow-md cursor-pointer hover:shadow-lg' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer hover:shadow-lg'
            }`}
            onClick={() => {
              if (isMagSafeCompatible) {
                console.log('MagSafe case selected');
                setCaseType('magsafe');
              }
            }}
          >
            <div className="text-center">
              <div className={`w-20 h-32 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm relative ${
                isMagSafeCompatible ? 'bg-blue-200' : 'bg-gray-200'
              }`}>
                <Smartphone className={`h-12 w-12 ${isMagSafeCompatible ? 'text-blue-700' : 'text-gray-500'}`} />
                {isMagSafeCompatible && (
                  <>
                    <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-50"></div>
                    <Zap className="absolute top-2 right-2 h-4 w-4 text-blue-600" />
                  </>
                )}
              </div>
              
              <h3 className={`text-xl font-bold mb-2 ${isMagSafeCompatible ? 'text-gray-900' : 'text-gray-500'}`}>
                MagSafe Case
              </h3>
              <p className={`mb-4 ${isMagSafeCompatible ? 'text-gray-600' : 'text-gray-400'}`}>
                {isMagSafeCompatible 
                  ? 'Magnetic compatibility + premium protection' 
                  : 'Not available for this model'}
              </p>
              
              <div className={`p-4 rounded-lg border mb-4 ${isMagSafeCompatible ? 'bg-white' : 'bg-gray-100'}`}>
                {isMagSafeCompatible ? (
                  <>
                    <div className="text-2xl font-bold text-blue-600">${magsafePrice.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">+ tax (${(magsafePrice * taxRate).toFixed(2)})</div>
                    <div className="text-sm font-semibold text-gray-800">Total: ${(magsafePrice * (1 + taxRate)).toFixed(2)}</div>
                  </>
                ) : (
                  <div className="text-lg text-gray-400">Not Available</div>
                )}
              </div>
              
              <ul className={`text-sm space-y-1 ${isMagSafeCompatible ? 'text-gray-600' : 'text-gray-400'}`}>
                <li>{isMagSafeCompatible ? '✓' : '✗'} Built-in magnets</li>
                <li>{isMagSafeCompatible ? '✓' : '✗'} MagSafe accessory support</li>
                <li>{isMagSafeCompatible ? '✓' : '✗'} Faster wireless charging</li>
                <li>{isMagSafeCompatible ? '✓' : '✗'} Premium materials</li>
              </ul>
              
              {!isMagSafeCompatible && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs text-orange-700">
                    <strong>Note:</strong> MagSafe cases require iPhone 12 or newer models
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-lg mb-4 text-center">Order Summary</h4>
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span>{caseType === 'magsafe' ? 'MagSafe Case' : 'Regular Case'}</span>
              <span>${(caseType === 'magsafe' ? magsafePrice : regularPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (8.25%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            Back to Image Upload
          </Button>
          <Button 
            onClick={onNext}
            className="px-8"
          >
            Continue to Customize Design
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}