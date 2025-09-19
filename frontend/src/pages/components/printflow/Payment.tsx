// src/pages/components/printflow/Payment.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Shield, ExternalLink } from 'lucide-react';

interface OrderData {
  email: string;
  name: string;
  phone: string;
}

interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

interface DeliveryInfo {
  address: string;
  city: string;
  state: string;
  zip: string;
  instructions: string;
}

interface Step5PaymentProps {
  fulfillmentMethod: string;
  caseType: 'regular' | 'magsafe';
  orderData: OrderData;
  setOrderData: (data: OrderData) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  uploadedImage: string | null;
  editedImageBlob?: Blob;
  editedImageUrl?: string;
  filterValues: FilterValues;
  selectedPhone: string;
  phoneModels: any[];
  selectedLocation: string;
  deliveryInfo: DeliveryInfo;
  onCheckout: (paymentData?: any) => void;
  onBack: () => void;
}

export default function Step5Payment({ 
  fulfillmentMethod, 
  caseType,
  orderData, 
  setOrderData, 
  paymentMethod, 
  setPaymentMethod, 
  uploadedImage, 
  editedImageBlob,
  editedImageUrl,
  filterValues,
  selectedPhone,
  phoneModels,
  selectedLocation,
  deliveryInfo,
  onCheckout, 
  onBack 
}: Step5PaymentProps) {
  console.log('Payment component rendered with caseType:', {
    caseType,
    caseTypeType: typeof caseType,
    caseTypeStringified: JSON.stringify(caseType)
  });
  
  // Use caseType from props, fallback to localStorage if undefined
  const safeCaseType = caseType || localStorage.getItem('currentCaseType') || 'regular';
  console.log('Final caseType being used:', safeCaseType);
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate base price based on case type - CORRECT PRICING
  const basePrice = safeCaseType === 'magsafe' ? 30.00 : 20.00;
  const deliveryFee = fulfillmentMethod === 'delivery' ? 5.99 : 0;
  const subtotal = basePrice + deliveryFee;
  const taxRate = 0.0825; // 8.25% tax rate
  const taxAmount = subtotal * taxRate;
  const amount = subtotal + taxAmount;

  // Debug: Log pricing values
  console.log('Payment Step Debug:', {
    originalCaseType: caseType,
    safeCaseType,
    caseTypeType: typeof safeCaseType,
    caseTypeLength: safeCaseType?.length,
    caseTypeComparison: safeCaseType === 'magsafe',
    basePrice,
    subtotal,
    taxAmount,
    amount
  });

  const getImageStyle = () => {
    return {
      filter: `brightness(${100 + filterValues.brightness}%) contrast(${100 + filterValues.contrast}%) saturate(${100 + filterValues.saturation}%) blur(${filterValues.blur}px)`,
      transition: 'filter 0.2s ease'
    };
  };

  const handleStripeCheckout = async () => {
    if (!orderData.email || !orderData.name || !orderData.phone) {
      alert('Please fill in all contact information before proceeding to checkout.');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Saving order data to localStorage before Stripe redirect...');
      console.log('🔍 Payment Debug - Location Data Before Save:', {
        selectedLocation,
        deliveryInfo,
        fulfillmentMethod
      });
      
      // Save order data and images to localStorage for retrieval after Stripe redirect
      const selectedModel = phoneModels.find(p => p.id === selectedPhone);
      const phoneModelName = selectedModel?.brand && selectedModel?.name 
        ? `${selectedModel.brand} ${selectedModel.name}`
        : selectedModel?.name || 'Unknown Phone';
        
      const orderSession: any = {
        orderData,
        fulfillmentMethod,
        selectedLocation,
        deliveryInfo,
        caseType,
        filterValues,
        uploadedImage,
        editedImageUrl,
        selectedPhone,
        phoneModelName,
        basePrice,
        deliveryFee,
        subtotal,
        taxAmount,
        totalAmount: amount,
        timestamp: Date.now()
      };
      
      // Convert editedImageBlob to base64 for storage
      if (editedImageBlob) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          orderSession.editedImageBase64 = reader.result as string;
          
          // Also save original image if available
          if (uploadedImage) {
            orderSession.uploadedImageBase64 = uploadedImage; // Original is already base64
          }
          
          localStorage.setItem('pendingOrder', JSON.stringify(orderSession));
          console.log('🔍 Payment Debug - Order Session Saved to localStorage:', JSON.stringify(orderSession, null, 2));
          await proceedWithStripeCheckout();
        };
        reader.readAsDataURL(editedImageBlob);
      } else if (uploadedImage) {
        // Save the uploaded image URL and convert to base64 for storage
        orderSession.uploadedImageBase64 = uploadedImage; // Original is already base64
        localStorage.setItem('pendingOrder', JSON.stringify(orderSession));
        console.log('🔍 Payment Debug - Order Session Saved to localStorage (no blob):', JSON.stringify(orderSession, null, 2));
        await proceedWithStripeCheckout();
      } else {
        alert('No image found. Please upload an image before proceeding.');
        setIsProcessing(false);
      }
      
    } catch (error) {
      console.error('Error preparing Stripe checkout:', error);
      alert('Failed to prepare checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const proceedWithStripeCheckout = async () => {
    try {
      const payload = {
        amount: Math.round(amount * 100), // Convert to cents for Stripe
        currency: 'usd',
        orderData: {
          ...orderData,
          phoneModel: 'Selected Phone',
          fulfillmentMethod,
          caseType,
          filterValues,
          basePrice,
          deliveryFee,
          subtotal,
          taxAmount,
          totalAmount: amount
        },
        successUrl: `${window.location.origin}/print-now?success=true`,
        cancelUrl: `${window.location.origin}/print-now?canceled=true`,
      };
      console.log('Stripe checkout payload:', payload);
      // Create checkout session on your backend
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Checkout session creation failed: ${response.status} - ${errorText}`);
      }

      const { sessionId, url } = await response.json();
      console.log('Checkout session created:', { sessionId, url });

      if (url) {
        // Redirect to Stripe Checkout
        console.log('Redirecting to Stripe Checkout:', url);
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received from server');
      }
      
    } catch (error) {
      console.error('Stripe checkout error:', error);
      
      let errorMessage = 'Failed to redirect to Stripe checkout. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  const isFormValid = orderData.email && orderData.name && orderData.phone;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-green-600" />
          Secure Checkout with Stripe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary & Contact Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div>
              <h4 className="font-semibold mb-4">Order Summary</h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>{safeCaseType === 'magsafe' ? 'MagSafe Phone Case' : 'Regular Phone Case'}</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {fulfillmentMethod === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.25%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderData.email}
                    onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={orderData.name}
                    onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Design Preview & Checkout */}
          <div className="space-y-6">
            {/* Design Preview */}
            <div>
              <h4 className="font-semibold mb-4">Your Design Preview</h4>
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                {(editedImageUrl || uploadedImage) ? (
                  <div className="relative inline-block">
                    <div className="w-32 h-40 bg-black rounded-2xl p-2 shadow-lg">
                      <img
                        src={editedImageUrl || uploadedImage || ''}
                        alt="Your custom design"
                        className="w-full h-full object-cover rounded-xl"
                        style={getImageStyle()}
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {safeCaseType === 'magsafe' ? 'MagSafe Case' : 'Regular Case'}
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-40 bg-gray-200 rounded-2xl mx-auto flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stripe Checkout Button */}
            <div className="text-center space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Secure Payment with Stripe</span>
                </div>
                <p className="text-sm text-blue-700">
                  You'll be redirected to Stripe's secure checkout page to complete your payment.
                </p>
              </div>

              <Button 
                onClick={handleStripeCheckout}
                disabled={!isFormValid || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Checkout...
                  </>
                ) : (
                  <>
                    Pay ${amount.toFixed(2)} with Stripe
                    <ExternalLink className="h-4 w-4" />
                  </>
                )}
              </Button>

              {!isFormValid && (
                <p className="text-sm text-red-600">
                  Please fill in all contact information above to continue
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Payments secured by Stripe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onBack} disabled={isProcessing}>
            Back to Fulfillment
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Secure Checkout</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your payment is processed securely by Stripe. We never see or store your card details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}