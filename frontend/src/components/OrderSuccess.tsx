import React from 'react';
import { CheckCircle, Copy, ArrowRight, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessProps {
  orderNumber?: string;
  orderData?: {
    contact_name?: string;
    contact_email?: string;
    phone_model?: string;
    amount?: number;
    case_type?: string;
    fulfillment_method?: string;
  };
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ 
  orderNumber = "PC-" + new Date().toISOString().slice(0,10).replace(/-/g,'') + "-" + Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
  orderData 
}) => {
  const navigate = useNavigate();

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
          <CardDescription className="text-green-100 text-lg">
            Your custom phone case order has been confirmed
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {/* Order Number Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-dashed border-gray-300">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Order Number</h3>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-3xl font-bold text-blue-600 bg-white px-4 py-2 rounded border">
                  {orderNumber}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyOrderNumber}
                  className="h-12 px-3"
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Save this order number for tracking your custom phone case
              </p>
            </div>
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Customer:</span>
                    <p className="text-gray-900">{orderData.contact_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phone Model:</span>
                    <p className="text-gray-900">{orderData.phone_model || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Case Type:</span>
                    <p className="text-gray-900">{orderData.case_type === 'magsafe' ? 'MagSafe Compatible' : 'Regular'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{orderData.contact_email || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Total Amount:</span>
                    <p className="text-green-600 font-bold text-xl">${orderData.amount || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Fulfillment:</span>
                    <p className="text-gray-900">{orderData.fulfillment_method === 'delivery' ? 'Home Delivery' : 'Store Pickup'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center">
              <ArrowRight className="mr-2" size={20} />
              What happens next?
            </h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <span><strong>Confirmation Email:</strong> Check your email for order confirmation and tracking details</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span><strong>Production:</strong> We'll start creating your custom phone case within 24 hours</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <span><strong>Quality Check:</strong> Each case undergoes our premium quality assurance process</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                <span><strong>Fulfillment:</strong> {orderData?.fulfillment_method === 'delivery' ? 'Your case will be shipped to your address' : 'You\'ll receive pickup instructions'}</span>
              </li>
            </ol>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2 text-gray-800">Need Help?</h4>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>support@printphonecover.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>Reference Order #{orderNumber}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => navigate('/')} 
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              Back to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/print-now')} 
              className="flex-1"
            >
              Create Another Design
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;