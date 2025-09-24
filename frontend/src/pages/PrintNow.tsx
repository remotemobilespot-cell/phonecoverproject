import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

// Step components
import PhoneSelection from '@/pages/components/printflow/PhoneSelection';
import Step2ImageUpload from '@/pages/components/printflow/ImageUpload';
import Step3ImageEditor from '@/pages/components/printflow/ImageEditor';
import Fulfillment from '@/pages/components/printflow/Fulfillment';
import Step5Payment from '@/pages/components/printflow/Payment';

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

interface OrderData {
  email: string;
  name: string;
  phone: string;
}

export default function PrintNow() {
  const [step, setStep] = useState(1);
  const [selectedPhone, setSelectedPhone] = useState('');
  const [phoneModels, setPhoneModels] = useState<any[]>([]);
  const [storeLocations, setStoreLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [editedImageBlob, setEditedImageBlob] = useState<Blob | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
  });
  const [fulfillmentMethod, setFulfillmentMethod] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // Initialize caseType from localStorage if available
  const [caseType, setCaseTypeRaw] = useState<'regular' | 'magsafe'>(() => {
    const saved = localStorage.getItem('currentCaseType');
    return (saved === 'magsafe' || saved === 'regular') ? saved : 'regular';
  });
  
  // Wrapper to ensure caseType persists
  const setCaseType = (newCaseType: 'regular' | 'magsafe') => {
    console.log('Setting caseType to:', newCaseType);
    localStorage.setItem('currentCaseType', newCaseType);
    setCaseTypeRaw(newCaseType);
  };
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: '',
    city: '',
    state: '',
    zip: '',
    instructions: '',
  });
  const [orderData, setOrderData] = useState<OrderData>({
    email: '',
    name: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [nearbyLocations, setNearbyLocations] = useState<any[]>([]);

  const navigate = useNavigate();
  const totalSteps = 5;

  useEffect(() => {
    // Check for success/cancel query parameters from Stripe redirect
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    
    if (success === 'true') {
      // Payment successful - now upload images and create order
      handlePaymentSuccess();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === 'true') {
      // Show cancelation message and stay on payment step
      alert('Payment was canceled. You can try again.');
      setStep(5);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { session, user: session?.user });
      
      if (session?.user) {
        setUser(session.user);
        fetchOrders(session.user.email);
      } else {
        console.log('No user session - allowing guest access for development');
        setUser(null);
      }
    });

    fetchPhoneModelsAndLocations();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied by user.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            default:
              alert("An unknown error occurred.");
              break;
          }
          setUserLocation(null);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  async function fetchPhoneModelsAndLocations() {
    console.log('🔄 Fetching phone models and locations...');
    setLoading(true);
    
    try {
      const { data: models, error: modelsError } = await supabase.from('phone_models').select('*');
      console.log('Phone models response:', { models, modelsError });
      
      if (modelsError) {
        console.error('Error fetching phone models:', modelsError);
        throw new Error('Failed to fetch phone models');
      }
      
      if (models && models.length > 0) {
        console.log('Using database phone models:', models);
        setPhoneModels(models);
      } else {
        console.log('No phone models found in database');
        setPhoneModels([]);
      }
      
      const { data: locations, error: locationsError } = await supabase.from('store_locations').select('*');
      console.log('Store locations response:', { locations, locationsError });
      
      if (locationsError) {
        console.error('Error fetching store locations:', locationsError);
        throw new Error('Failed to fetch store locations');
      }
      
      if (locations && locations.length > 0) {
        console.log('✅ Store locations loaded successfully:', locations.length, 'stores');
        console.log('First few stores:', locations.slice(0, 3).map(l => ({ id: l.id, name: l.name })));
        setStoreLocations(locations);
      } else {
        console.log('No store locations found in database');
        setStoreLocations([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from database. Please try again later.');
      setLoading(false);
    }
  }

  async function fetchOrders(email: string) {
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('contact_email', email)
      .order('created_at', { ascending: false });
    setOrders(ordersData ?? []);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📸 handleImageUpload called with file:', file);
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('📸 FileReader loaded image, setting uploadedImage:', result?.substring(0, 50) + '...');
        setUploadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (filterId: string, value: number) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }));
  };

  const resetFilters = () => {
    setFilterValues({ brightness: 0, contrast: 0, saturation: 0, blur: 0 });
  };

  const handleEditedImageComplete = (blob: Blob, url: string) => {
    setEditedImageBlob(blob);
    setEditedImageUrl(url);
    setStep(4); // Move to fulfillment step
  };

  async function uploadDesignImage(imageToUpload: Blob | File, prefix: string = 'design'): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${prefix}-${timestamp}.jpg`;
    
    console.log(`Uploading ${prefix} image:`, fileName);
    
    const { data, error } = await supabase.storage
      .from('designs')
      .upload(fileName, imageToUpload, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }
    
    const { data: publicUrl } = supabase.storage
      .from('designs')
      .getPublicUrl(fileName);
      
    console.log(`${prefix} image uploaded successfully:`, publicUrl.publicUrl);
    return publicUrl.publicUrl;
  }

  const handlePaymentSuccess = async () => {
    console.log('Payment successful - processing order and uploading images...');
    
    try {
      // Restore order data from localStorage
      const savedOrderData = localStorage.getItem('pendingOrder');
      if (!savedOrderData) {
        console.error('No saved order data found');
        alert('Payment was successful, but order data was lost. Please contact support.');
        return;
      }
      
      const orderSession = JSON.parse(savedOrderData);
      console.log('Restored order session:', orderSession);
      console.log('🔍 HandlePaymentSuccess Debug - Location Data Retrieved:', {
        selectedLocation: orderSession.selectedLocation,
        deliveryInfo: orderSession.deliveryInfo,
        fulfillmentMethod: orderSession.fulfillmentMethod
      });
      
      // Restore the order data and caseType from the saved session
      if (orderSession.orderData) {
        setOrderData(orderSession.orderData);
      }
      if (orderSession.caseType) {
        setCaseType(orderSession.caseType);
      }
      if (orderSession.fulfillmentMethod) {
        setFulfillmentMethod(orderSession.fulfillmentMethod);
      }
      
      // Check if we have the necessary data
      if (!orderSession.editedImageBase64 && !orderSession.uploadedImage) {
        console.error('No image data available for order creation');
        alert('Payment was successful, but image data is missing. Please contact support with your payment details.');
        return;
      }
      
      if (!orderSession.orderData || !orderSession.orderData.email || !orderSession.orderData.name) {
        console.error('Order data incomplete:', { orderData, orderSessionData: orderSession.orderData });
        alert('Payment was successful, but order information is incomplete. Please contact support.');
        return;
      }
      
      // Create the order directly using the saved session data
      await createOrderFromSession(orderSession);
      
      // Clean up localStorage after successful order
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('currentCaseType');
      
      // Show success page
      setStep(6);
      
    } catch (error) {
      console.error('Error processing successful payment:', error);
      alert(`Payment was successful, but there was an issue creating your order: ${error.message}. Please contact support.`);
      setStep(5);
    }
  };
  
  const createOrderFromSession = async (orderSession: any) => {
    console.log('Creating order from session data...');
    
    // Ensure store locations are loaded before creating order
    if (storeLocations.length === 0) {
      console.log('⏳ Store locations not loaded yet, fetching...');
      try {
        const { data: locations, error } = await supabase.from('store_locations').select('*');
        if (error) throw error;
        if (locations && locations.length > 0) {
          setStoreLocations(locations);
          console.log('✅ Store locations loaded for order creation:', locations.length, 'stores');
          // Use the fresh data for this order creation
          await createOrderWithLocations(orderSession, locations);
          return;
        }
      } catch (err) {
        console.error('Failed to load store locations for order creation:', err);
      }
    } else {
      console.log('✅ Using existing store locations for order creation');
      await createOrderWithLocations(orderSession, storeLocations);
    }
  };
  
  const createOrderWithLocations = async (orderSession: any, locations: any[]) => {
    
    let designImageUrl = '';
    let originalImageUrl = '';
    
    // Handle original image upload from saved session data
    if (orderSession.uploadedImageBase64) {
      // Convert base64 back to blob and upload original image
      const response = await fetch(orderSession.uploadedImageBase64);
      const blob = await response.blob();
      originalImageUrl = await uploadDesignImage(blob, 'original');
      console.log('Original image uploaded from session:', originalImageUrl);
    }
    
    // Handle edited image upload from saved session data
    if (orderSession.editedImageBase64) {
      // Convert base64 back to blob and upload
      const response = await fetch(orderSession.editedImageBase64);
      const blob = await response.blob();
      designImageUrl = await uploadDesignImage(blob, 'edited');
      console.log('Edited image uploaded from session:', designImageUrl);
    } else if (originalImageUrl) {
      // If no edited version, use original as design image
      designImageUrl = originalImageUrl;
      console.log('Using original as design image');
    } else if (orderSession.uploadedImage) {
      // Fallback to stored image URL if available
      designImageUrl = orderSession.uploadedImage;
      console.log('Using stored image URL as fallback');
    }
    
    // EXPLICIT SESSION ORDER OBJECT CREATION  
    let sessionPickupLocation = null;
    let sessionStoreLocationId = null;
    let sessionDeliveryAddress = null;
    let sessionDeliveryCity = null;
    let sessionDeliveryState = null;
    let sessionDeliveryZip = null;

    if (orderSession.fulfillmentMethod === 'pickup') {
      // Find the selected store for session
      console.log('🏪 Debug - Looking for store in session:', {
        orderSessionSelectedLocation: orderSession.selectedLocation,
        locationsLength: locations.length,
        firstStore: locations[0],
        allStoreIds: locations.map(loc => ({ id: loc.id, name: loc.name }))
      });
      
      const matchedStore = locations.find(loc => String(loc.id) === String(orderSession.selectedLocation));
      
      if (matchedStore) {
        // Based on your schema: pickup_location is UUID, store_location_id is BIGINT
        sessionPickupLocation = String(matchedStore.id); // Always store as UUID string
        
        // For store_location_id, we need to handle the type conversion carefully
        if (typeof matchedStore.id === 'number') {
          // If store ID is already a number, use it directly  
          sessionStoreLocationId = Number(matchedStore.id);
        } else if (typeof matchedStore.id === 'string' && /^\d+$/.test(matchedStore.id)) {
          // If store ID is a numeric string, convert to number
          sessionStoreLocationId = Number(matchedStore.id);
        } else {
          // If store ID is UUID, we can't convert to BIGINT - this indicates a schema issue
          console.warn('⚠️  Schema Mismatch in session: store.id is UUID but store_location_id expects BIGINT');
          sessionStoreLocationId = null; // Set to null to avoid type error
        }
        
        console.log('📍 Session Pickup Location Set:', {
          selectedLocation: orderSession.selectedLocation,
          matchedStore: matchedStore.name,
          storeId: matchedStore.id,
          storeIdType: typeof matchedStore.id,
          pickup_location: sessionPickupLocation,
          store_location_id: sessionStoreLocationId
        });
      } else {
        console.error('❌ Store not found for session selectedLocation:', orderSession.selectedLocation);
      }
    } else if (orderSession.fulfillmentMethod === 'delivery' && orderSession.deliveryInfo) {
      sessionDeliveryAddress = orderSession.deliveryInfo.address;
      sessionDeliveryCity = orderSession.deliveryInfo.city;  
      sessionDeliveryState = orderSession.deliveryInfo.state;
      sessionDeliveryZip = orderSession.deliveryInfo.zip;
      
      console.log('🚚 Session Delivery Address Set:', {
        delivery_address: sessionDeliveryAddress,
        delivery_city: sessionDeliveryCity,
        delivery_state: sessionDeliveryState,
        delivery_zip: sessionDeliveryZip
      });
    }
    
    const orderObj = {
      phone_model: orderSession.phoneModelName || 'Unknown Phone',
      phone_model_id: orderSession.selectedPhone,
      case_type: orderSession.caseType || 'regular',
      design_image: designImageUrl,
      original_image: originalImageUrl,
      contact_email: orderSession.orderData.email,
      contact_name: orderSession.orderData.name,
      contact_phone: orderSession.orderData.phone,
      fulfillment_method: orderSession.fulfillmentMethod,
      // PICKUP FIELDS
      pickup_location: sessionPickupLocation,
      store_location_id: sessionStoreLocationId,
      // DELIVERY FIELDS
      delivery_address: sessionDeliveryAddress,
      delivery_city: sessionDeliveryCity,
      delivery_state: sessionDeliveryState,
      delivery_zip: sessionDeliveryZip,
      amount: orderSession.totalAmount,
      status: 'completed',
      payment_method: 'stripe',
      payment_transaction_id: 'stripe_success_redirect',
    };
    
    console.log('Creating order with data:', orderObj);
    
    // Add detailed debugging for session order
    console.log('🔍 Session Order Creation Debug:', {
      sessionFulfillmentMethod: orderSession.fulfillmentMethod,
      sessionSelectedLocation: orderSession.selectedLocation,
      sessionDeliveryInfo: orderSession.deliveryInfo,
      pickup_location_in_session_order: orderObj.pickup_location,
      store_location_id_in_session_order: orderObj.store_location_id,
      delivery_address_in_session_order: orderObj.delivery_address
    });

    // FINAL SAFETY CHECK - Remove any "undefined" strings for session orders
    if (orderObj.pickup_location === 'undefined' || orderObj.pickup_location === undefined) {
      console.warn('⚠️  Setting session pickup_location to null (was undefined)');
      orderObj.pickup_location = null;
    }
    
    if (orderObj.store_location_id === 'undefined' || orderObj.store_location_id === undefined) {
      console.warn('⚠️  Setting session store_location_id to null (was undefined)');
      orderObj.store_location_id = null;
    }

    console.log('🔒 Final Session Order Object:', orderObj);
    
    // Insert order into database
    const { error } = await supabase.from('orders').insert([orderObj]);
    if (error) {
      console.error('Database insertion error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Order created successfully from session data');
  };

  const handleCheckout = async (paymentData?: any) => {
    console.log('🚀 Starting checkout with current state:', {
      fulfillmentMethod,
      selectedLocation,
      deliveryInfo,
      storeLocations: storeLocations.length
    });

    // COMPREHENSIVE VALIDATION - Check fulfillment method and required data
    if (!fulfillmentMethod || (fulfillmentMethod !== 'pickup' && fulfillmentMethod !== 'delivery')) {
      alert('Please select either pickup or delivery method.');
      return;
    }

    // Validate pickup requirements
    if (fulfillmentMethod === 'pickup') {
      if (!selectedLocation || selectedLocation === 'undefined' || selectedLocation === '') {
        alert('Please select a store location for pickup.');
        return;
      }
      
      const validStore = storeLocations.find(loc => String(loc.id) === String(selectedLocation));
      if (!validStore) {
        alert('Selected store location is invalid. Please select a valid store.');
        return;
      }
      
      console.log('✅ Pickup validation passed:', { 
        selectedLocation, 
        validStore: validStore.name,
        validStoreId: validStore.id 
      });
    }

    // Validate delivery requirements  
    if (fulfillmentMethod === 'delivery') {
      if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.zip) {
        alert('Please fill in all delivery address fields (address, city, state, zip).');
        return;
      }
      
      console.log('✅ Delivery validation passed:', deliveryInfo);
    }
    
    console.log('Starting checkout process with payment data:', paymentData);
    
    try {
      let designImageUrl = '';
      let originalImageUrl = '';
      
      // Upload original image first
      if (uploadedFile) {
        console.log('Uploading original image...');
        originalImageUrl = await uploadDesignImage(uploadedFile, 'original');
        console.log('Original image uploaded:', originalImageUrl);
      }
      
      // Upload edited image if available, otherwise use original
      if (editedImageBlob) {
        console.log('Uploading edited image...');
        designImageUrl = await uploadDesignImage(editedImageBlob, 'edited');
        console.log('Edited image uploaded:', designImageUrl);
      } else if (uploadedFile) {
        designImageUrl = originalImageUrl; // Use original if no edits
        console.log('Using original image as design image');
      } else {
        throw new Error('No image to upload');
      }

      // Calculate proper pricing
      const basePrice = caseType === 'magsafe' ? 30.00 : 20.00;  // FIXED: Correct prices
      const deliveryFee = fulfillmentMethod === 'delivery' ? 5.99 : 0;
      const subtotal = basePrice + deliveryFee;
      const taxRate = 0.0825;
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount;

      // EXPLICIT ORDER OBJECT CREATION WITH DEBUGGING
      let orderPickupLocation = null;
      let orderStoreLocationId = null;
      let orderDeliveryAddress = null;
      let orderDeliveryCity = null;
      let orderDeliveryState = null;  
      let orderDeliveryZip = null;

      // Debug current store locations to understand the data structure
      console.log('🏪 Store Locations Debug:', {
        storeCount: storeLocations.length,
        firstStore: storeLocations[0],
        selectedLocation: selectedLocation,
        selectedLocationType: typeof selectedLocation
      });

      if (fulfillmentMethod === 'pickup') {
        // Find the selected store
        console.log('🏪 Debug - Direct Checkout Looking for store:', {
          selectedLocation,
          selectedLocationType: typeof selectedLocation,
          storeLocationsLength: storeLocations.length,
          firstStore: storeLocations[0],
          allStoreIds: storeLocations.map(loc => ({ id: loc.id, name: loc.name, idType: typeof loc.id }))
        });
        
        const matchedStore = storeLocations.find(loc => String(loc.id) === String(selectedLocation));
        
        if (matchedStore) {
          // Based on your schema: pickup_location is UUID, store_location_id is BIGINT
          // But if store.id is UUID and you need BIGINT for store_location_id, there's a mismatch
          
          // Let's try to handle this safely:
          orderPickupLocation = String(matchedStore.id); // Always store as UUID string
          
          // For store_location_id, we need to handle the type conversion carefully
          if (typeof matchedStore.id === 'number') {
            // If store ID is already a number, use it directly  
            orderStoreLocationId = Number(matchedStore.id);
          } else if (typeof matchedStore.id === 'string' && /^\d+$/.test(matchedStore.id)) {
            // If store ID is a numeric string, convert to number
            orderStoreLocationId = Number(matchedStore.id);
          } else {
            // If store ID is UUID, we can't convert to BIGINT - this indicates a schema issue
            console.warn('⚠️  Schema Mismatch: store.id is UUID but store_location_id expects BIGINT');
            orderStoreLocationId = null; // Set to null to avoid type error
          }
          
          console.log('📍 Pickup Location Set:', {
            selectedLocation,
            matchedStore: matchedStore.name,
            storeId: matchedStore.id,
            storeIdType: typeof matchedStore.id,
            pickup_location: orderPickupLocation,
            store_location_id: orderStoreLocationId
          });
        } else {
          console.error('❌ Store not found for selectedLocation:', selectedLocation);
        }
      } else if (fulfillmentMethod === 'delivery') {
        // Set delivery-specific fields
        orderDeliveryAddress = deliveryInfo.address;
        orderDeliveryCity = deliveryInfo.city;
        orderDeliveryState = deliveryInfo.state;
        orderDeliveryZip = deliveryInfo.zip;
        
        console.log('🚚 Delivery Address Set:', {
          delivery_address: orderDeliveryAddress,
          delivery_city: orderDeliveryCity,
          delivery_state: orderDeliveryState,
          delivery_zip: orderDeliveryZip
        });
      }

      const orderObj = {
        phone_model: (() => {
          const selectedModel = phoneModels.find(p => p.id === selectedPhone);
          return selectedModel?.brand && selectedModel?.name 
            ? `${selectedModel.brand} ${selectedModel.name}`
            : selectedModel?.name || selectedModel?.model || selectedPhone;
        })(),
        phone_model_id: selectedPhone,
        case_type: caseType,
        design_image: designImageUrl,
        original_image: originalImageUrl,
        brightness: filterValues.brightness,
        contrast: filterValues.contrast,
        saturation: filterValues.saturation,
        blur: filterValues.blur,
        fulfillment_method: fulfillmentMethod,
        contact_name: orderData.name,
        contact_email: orderData.email,
        contact_phone: orderData.phone,
        // PICKUP FIELDS
        pickup_location: orderPickupLocation,
        store_location_id: orderStoreLocationId,
        // DELIVERY FIELDS  
        delivery_address: orderDeliveryAddress,
        delivery_city: orderDeliveryCity,
        delivery_state: orderDeliveryState,
        delivery_zip: orderDeliveryZip,
        amount: totalAmount,
        status: 'pending',
        payment_method: paymentData?.type || paymentMethod,
        payment_transaction_id: paymentData?.payment_intent_id || 
                               paymentData?.paymentIntent?.id || 
                               paymentData?.token?.id || 
                               paymentData?.transaction?.id || null,
        payment_status: paymentData?.type === 'stripe' ? 'completed' : 'pending'
      };

      console.log('Order object prepared:', orderObj);
      
      // Add detailed debugging
      console.log('🔍 Order Creation Debug:', {
        fulfillmentMethod,
        selectedLocation,
        storeLocationsCount: storeLocations.length,
        deliveryInfo,
        orderData,
        pickup_location_in_order: orderObj.pickup_location,
        store_location_id_in_order: orderObj.store_location_id,
        delivery_address_in_order: orderObj.delivery_address
      });

      // FINAL SAFETY CHECK - Remove any "undefined" strings
      if (orderObj.pickup_location === 'undefined' || orderObj.pickup_location === undefined) {
        console.warn('⚠️  Setting pickup_location to null (was undefined)');
        orderObj.pickup_location = null;
      }
      
      if (orderObj.store_location_id === 'undefined' || orderObj.store_location_id === undefined) {
        console.warn('⚠️  Setting store_location_id to null (was undefined)');
        orderObj.store_location_id = null;
      }

      console.log('🔒 Final Order Object:', orderObj);

      // Create order via API or direct database insertion
      try {
        console.log('Creating order via API...');
        // Use environment variable for API URL with smart defaults
        // TEMPORARY FIX: Always use production backend for now
        const apiBaseUrl = 'https://phonecoverproject-1.onrender.com';
        
        console.log('Using API URL:', apiBaseUrl); // Debug log
        
        const response = await fetch(`${apiBaseUrl}/api/payments/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderObj),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();
        console.log('Order created via API successfully:', result);
        
      } catch (apiError) {
        console.warn('🚨 API endpoint failed, trying direct database insertion:', apiError);
        console.error('API Error details:', apiError.message);
        
        // Fallback to direct database insertion
        console.log('⚠️  Attempting direct database insertion...');
        const { data: insertedOrder, error } = await supabase.from('orders').insert([orderObj]).select().single();
        if (error) {
          console.error('Database insertion error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        console.log('Order created via direct database insertion');
        
        // IMPORTANT: Send emails manually since we bypassed the API
        console.log('📧 Sending emails manually after database insertion...');
        try {
          const emailResponse = await fetch(`https://phonecoverproject-1.onrender.com/api/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(insertedOrder),
          });
          
          if (emailResponse.ok) {
            console.log('✅ Emails sent successfully via fallback');
          } else {
            console.error('❌ Email sending failed in fallback');
          }
        } catch (emailError) {
          console.error('❌ Failed to send emails in fallback:', emailError);
          // Don't throw here - order was created successfully
        }
      }

      // Clean up blob URLs
      if (editedImageUrl) {
        URL.revokeObjectURL(editedImageUrl);
      }

      // Refresh orders if user is logged in
      if (orderData.email) {
        await fetchOrders(orderData.email);
      }
      
      // Go to success page
      setStep(6);
      
      console.log('Checkout completed successfully');
      
    } catch (err: any) {
      console.error('Error placing order:', err);
      alert('Error placing order: ' + (err.message || 'Unknown error occurred'));
      throw err; // Re-throw to be handled by payment component
    }
  };

  const fetchNearbyLocations = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`/api/locations/nearby?lat=${latitude}&lng=${longitude}`);
      if (!response.ok) {
        throw new Error('Failed to fetch nearby locations');
      }
      const data = await response.json();
      setNearbyLocations(data);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      alert('Unable to fetch nearby locations. Please try again later.');
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyLocations(latitude, longitude);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied by user.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            default:
              alert("An unknown error occurred.");
              break;
          }
          setUserLocation(null);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Custom Phone Case Creator</h1>
          {user && (
            <div className="mt-2 text-lg text-blue-700 font-semibold">
              Welcome, {user.user_metadata?.name || user.email}!
            </div>
          )}
          
          {/* Debug info */}
          <div className="mt-2 text-sm text-gray-500">
            Phone models loaded: {phoneModels.length} | Step: {step} | Fulfillment: {fulfillmentMethod || 'None'} | Location: {selectedLocation || 'None'} | Delivery: {deliveryInfo.address ? 'Set' : 'Empty'}
          </div>
        </div>
      </div>

      {user && orders.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-bold mb-2">Your Previous Orders</h2>
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <Card key={order.id} className="border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">Order #{order.id}</div>
                      <div className="text-gray-600">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="font-medium">${order.amount}</div>
                      <div className="text-gray-600">{order.payment_method}</div>
                    </div>
                    <div>
                      <div className={`inline-block px-2 py-1 rounded text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    <div>
                      {order.design_image && (
                        <img 
                          src={order.design_image} 
                          alt="Order preview" 
                          className="w-12 h-16 object-cover rounded border"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Print Your Custom Case</h1>
            <p className="text-xl text-gray-600">
              Create your personalized phone case in {totalSteps} easy steps
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading phone models and store locations...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={() => {
                    setError(null);
                    fetchPhoneModelsAndLocations();
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Main Content - Only show when not loading and no error */}
          {!loading && !error && (
            <>
              {/* Progress Steps */}
              <div className="flex justify-center mb-12 overflow-x-auto">
                <div className="flex items-center space-x-2 md:space-x-4 min-w-max">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                          step >= num ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {step > num ? <Check className="h-4 w-4" /> : num}
                      </div>
                      {num < totalSteps && (
                        <div
                          className={`w-8 md:w-16 h-1 ${step > num ? 'bg-blue-600' : 'bg-gray-300'}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Components */}
              {step === 1 && (
                <PhoneSelection
                  phoneModels={phoneModels}
                  selectedPhone={selectedPhone}
                  setSelectedPhone={setSelectedPhone}
                  onNext={() => setStep(2)}
                />
              )}

              {step === 2 && (
                <Step2ImageUpload
                  uploadedImage={uploadedImage}
                  onImageUpload={handleImageUpload}
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                />
              )}

              {step === 3 && (
                <Step3ImageEditor
                  uploadedImage={uploadedImage}
                  filterValues={filterValues}
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                  onBack={() => setStep(2)}
                  onNext={handleEditedImageComplete}
                  selectedPhone={(() => {
                    const selectedModel = phoneModels.find(p => p.id === selectedPhone);
                    return selectedModel?.brand && selectedModel?.name 
                    ? `${selectedModel.brand} ${selectedModel.name}`
                    : selectedModel?.name || selectedModel?.model || 'Selected Phone';
                  })()}
                  caseType={caseType}
                  onCaseTypeChange={setCaseType}
                />
              )}              {step === 4 && (
                <Fulfillment
                  storeLocations={storeLocations}
                  fulfillmentMethod={fulfillmentMethod}
                  setFulfillmentMethod={setFulfillmentMethod}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  deliveryInfo={deliveryInfo}
                  setDeliveryInfo={setDeliveryInfo}
                  userLocation={userLocation}
                  caseType={caseType}
                  onBack={() => setStep(3)}
                  onNext={() => setStep(5)}
                />
              )}

              {step === 5 && (
                <Step5Payment
                  fulfillmentMethod={fulfillmentMethod}
                  caseType={caseType}
                  orderData={orderData}
                  setOrderData={setOrderData}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  uploadedImage={uploadedImage}
                  editedImageBlob={editedImageBlob}
                  editedImageUrl={editedImageUrl}
                  filterValues={filterValues}
                  selectedPhone={selectedPhone}
                  phoneModels={phoneModels}
                  selectedLocation={selectedLocation}
                  deliveryInfo={deliveryInfo}
                  onCheckout={handleCheckout}
                  onBack={() => setStep(4)}
                />
              )}

              {step === 6 && (
                <Card className="text-center">
                  <CardContent className="p-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
                    <p className="text-lg text-gray-600 mb-6">
                      {fulfillmentMethod === 'pickup'
                        ? 'Your custom phone case will be ready for pickup in 5-10 minutes.'
                        : 'Your custom phone case will be delivered in 1-2 business days.'}
                    </p>
                    <div className="space-y-3 mb-6">
                      <p className="text-sm text-gray-600">
                        Order confirmation will be sent to: <strong>{orderData.email}</strong>
                      </p>
                      {editedImageUrl && (
                        <div className="flex justify-center">
                          <img 
                            src={editedImageUrl} 
                            alt="Your design" 
                            className="w-20 h-28 object-cover rounded border shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/')}
                      >
                        Go to Home
                      </Button>
                      <Button onClick={() => window.location.reload()}>
                        Create Another Case
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}