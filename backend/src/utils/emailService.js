// Initialize Twilio client lazily when needed
let twilioClient = null;
let twilioInitialized = false;

const initializeTwilio = async () => {
  if (twilioInitialized) return twilioClient;
  
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = await import('twilio');
      twilioClient = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      console.log('✅ Twilio initialized successfully');
    } else {
      console.log('⚠️ Twilio credentials not found - SMS features disabled');
    }
  } catch (error) {
    console.log('⚠️ Twilio not available - SMS features disabled:', error.message);
  }
  
  twilioInitialized = true;
  return twilioClient;
};

// Format phone number to E.164 format
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 1 and has 11 digits, add +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // If it has 10 digits, assume US number and add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // If it already starts with +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  console.log(`⚠️ Invalid phone number format: ${phone}`);
  return null;
};

export const sendOrderSMS = async (orderData) => {
  const rawPhone = orderData.contact_phone || orderData.phone;
  const customerPhone = formatPhoneNumber(rawPhone);
  
  if (!customerPhone) {
    console.log(`No valid customer phone provided - skipping SMS. Raw: ${rawPhone}`);
    return false;
  }
  
  const client = await initializeTwilio();
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('Twilio not configured - skipping SMS');
    console.log('Environment check:', {
      twilioClient: !!client,
      twilioPhone: !!process.env.TWILIO_PHONE_NUMBER,
      accountSid: !!process.env.TWILIO_ACCOUNT_SID,
      authToken: !!process.env.TWILIO_AUTH_TOKEN
    });
    return false;
  }
  
  try {
    console.log(`📱 Sending SMS to customer: ${customerPhone}`);
    const result = await client.messages.create({
      body: `Your order is confirmed! Thank you for shopping with PrintPhoneCase. Order #${orderData.order_number || orderData.id || ''}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: customerPhone
    });
    console.log('✅ Customer SMS sent successfully:', result.sid);
    return true;
  } catch (error) {
    console.error('❌ Failed to send customer SMS:', error);
    console.error('Error details:', error.message);
    return false;
  }
};
import sgMail from '@sendgrid/mail';

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send admin order notification email
export const sendAdminNotification = async (orderData) => {
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY_HERE') {
    console.log('📧 [DEMO MODE] Admin notification would be sent:', {
      to: 'support@printphonecover.com',
      subject: `New Order Received - Order #${orderData.order_number || orderData.id}`,
      customerName: orderData.contact_name || 'Not provided',
      customerEmail: orderData.contact_email || orderData.email || 'Not provided',
      phoneModel: orderData.phone_model || 'Not specified',
      amount: orderData.amount || 'Not specified'
    });
    return true; // Return true in demo mode so the flow continues
  }

  try {
    const emailContent = {
      to: 'support@printphonecover.com', // Admin notification email
      from: {
        email: 'support@printphonecover.com',
        name: 'PrintPhoneCase Order System'
      },
      replyTo: 'support@printphonecover.com',
  subject: `New Order Received - Order #${orderData.order_number || orderData.id}`,
  text: `New Order Received - Order #${orderData.order_number || orderData.id}\n\nOrder Number: ${orderData.order_number || orderData.id}\nOrder ID: ${orderData.id}\nCustomer: ${orderData.contact_name || 'Not provided'}\nEmail: ${orderData.contact_email || orderData.email || 'Not provided'}\nAmount: $${orderData.amount || 'Not specified'}`,
  html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 3px solid #007bff;">
            <h2 style="color: #007bff; margin: 0;">New Order Received!</h2>
            <p style="margin: 5px 0; color: #6c757d;">PrintPhoneCase Order Management System</p>
          </div>
          
          <div style="padding: 20px; background-color: white;">
            <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Order Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Order Number:</td><td style="padding: 8px; color: #007bff; font-weight: bold;">${orderData.order_number || orderData.id}</td></tr>
              <tr style="background-color: #f8f9fa;"><td style="padding: 8px; font-weight: bold;">Order ID:</td><td style="padding: 8px;">${orderData.id}</td></tr>
              <tr style="background-color: #f8f9fa;"><td style="padding: 8px; font-weight: bold;">Customer:</td><td style="padding: 8px;">${orderData.contact_name || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${orderData.contact_email || orderData.email || 'Not provided'}</td></tr>
              <tr style="background-color: #f8f9fa;"><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${orderData.contact_phone || orderData.phone || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone Model:</td><td style="padding: 8px;">${orderData.phone_model || 'Not specified'}</td></tr>
              <tr style="background-color: #f8f9fa;"><td style="padding: 8px; font-weight: bold;">Case Type:</td><td style="padding: 8px;">${orderData.case_type || 'regular'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Amount:</td><td style="padding: 8px; color: #28a745; font-weight: bold;">$${orderData.amount || 'Not specified'}</td></tr>
              <tr style="background-color: #f8f9fa;"><td style="padding: 8px; font-weight: bold;">Fulfillment:</td><td style="padding: 8px;">${orderData.fulfillment_method || 'Not specified'}</td></tr>
              ${orderData.delivery_address ? `<tr><td style="padding: 8px; font-weight: bold;">Delivery Address:</td><td style="padding: 8px;">${orderData.delivery_address}</td></tr>` : ''}
              <tr><td style="padding: 8px; font-weight: bold;">Order Time:</td><td style="padding: 8px;">${new Date().toLocaleString()}</td></tr>
            </table>
            
            <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px; margin-top: 30px;">Design Details</h3>
            <p><strong>Design Image:</strong> ${orderData.design_image || 'Not provided'}</p>
            ${orderData.original_image ? `<p><strong>Original Image:</strong> ${orderData.original_image}</p>` : ''}
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; color: #6c757d; font-size: 12px;">
            <p>This is an automated notification from PrintPhoneCase Order Management System</p>
            <p>Please do not reply directly to this email.</p>
          </div>
        </div>
      `
    };

    await sgMail.send(emailContent);
    console.log('Admin notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    
    // Log detailed error information
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body.errors, null, 2));
    }
    
    return false;
  }
};

// Function to send customer order confirmation email
export const sendCustomerConfirmation = async (orderData) => {
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY_HERE') {
    // Get customer email from different possible fields
    const customerEmail = orderData.contact_email || orderData.email;
    
    console.log('📧 [DEMO MODE] Customer confirmation would be sent:', {
      to: customerEmail || 'No email provided',
      subject: `Order Confirmation - PrintPhoneCase Order #${orderData.order_number || orderData.id || 'TBD'}`,
      customerName: orderData.contact_name || orderData.name || 'Valued Customer',
      phoneModel: orderData.phone_model || 'Not specified',
      amount: orderData.amount || 'TBD',
      fulfillmentMethod: orderData.fulfillment_method || 'Standard'
    });
    return customerEmail ? true : false; // Return true only if email exists
  }

  // Get customer email from different possible fields
  const customerEmail = orderData.contact_email || orderData.email;
  
  // Make sure we have a customer email
  if (!customerEmail) {
    console.log('No customer email provided - skipping customer confirmation');
    return false;
  }

  try {
    const emailContent = {
      to: customerEmail,
      from: {
        email: 'support@printphonecover.com',
        name: 'PrintPhoneCase'
      },
      replyTo: 'support@printphonecover.com',
      subject: `Order Confirmation - PrintPhoneCase Order #${orderData.order_number || orderData.id || 'TBD'}`,
      text: `Order Confirmed! Thank you for choosing PrintPhoneCase. Order #${orderData.order_number || orderData.id || 'TBD'} for ${orderData.phone_model || 'phone case'} - $${orderData.amount || 'TBD'}. You will receive updates as we process your order.`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="background-color: #28a745; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for choosing PrintPhoneCase!</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${orderData.contact_name || orderData.name || 'Valued Customer'},</h2>
            <p style="font-size: 16px; color: #333;">We've received your order and we're excited to create your custom phone case! Here are your order details:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
              <h3 style="color: #28a745; margin: 0 0 15px 0;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: bold;">Order Number:</td><td style="padding: 8px; color: #28a745; font-weight: bold; font-size: 16px;">${orderData.order_number || orderData.id || 'Will be provided shortly'}</td></tr>
                <tr style="background-color: white;"><td style="padding: 8px; font-weight: bold;">Order ID:</td><td style="padding: 8px; font-size: 12px; color: #666;">${orderData.id || 'Internal tracking ID'}</td></tr>
                <tr style="background-color: white;"><td style="padding: 8px; font-weight: bold;">Phone Model:</td><td style="padding: 8px;">${orderData.phone_model || 'Not specified'}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Case Type:</td><td style="padding: 8px;">${orderData.case_type || 'Premium'}</td></tr>
                <tr style="background-color: white;"><td style="padding: 8px; font-weight: bold;">Total Amount:</td><td style="padding: 8px; font-size: 18px; font-weight: bold; color: #28a745;">$${orderData.amount || 'TBD'}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Fulfillment:</td><td style="padding: 8px;">${orderData.fulfillment_method || 'Standard'}</td></tr>
              </table>
            </div>
            
            <h3 style="color: #333;">📦 What happens next?</h3>
            <ol style="color: #555; line-height: 1.8;">
              <li><strong>Order Processing:</strong> We'll start working on your custom phone case within 24 hours</li>
              <li><strong>Quality Check:</strong> Each case undergoes our quality assurance process</li>
              <li><strong>Fulfillment:</strong> ${orderData.fulfillment_method === 'delivery' ? 'Your case will be shipped to your address' : 'Your case will be ready for pickup at the selected location'}</li>
              <li><strong>Notification:</strong> You'll receive updates throughout the process</li>
            </ol>
            
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin: 0 0 10px 0;">📞 Need Help?</h4>
              <p style="margin: 0; color: #555;">If you have any questions about your order, please reply to this email or contact our support team.</p>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d;">
            <p style="margin: 0; font-size: 14px;">Thank you for choosing PrintPhoneCase!</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated confirmation email. Please keep this for your records.</p>
          </div>
        </div>
            <p><strong>Phone Model:</strong> ${orderData.phone_model || 'Not specified'}</p>
            <p><strong>Case Type:</strong> ${orderData.case_type || 'Regular'}</p>
            <p><strong>Total Amount:</strong> $${orderData.amount || 'TBD'}</p>
            <p><strong>Fulfillment Method:</strong> ${orderData.fulfillment_method || 'Standard'}</p>
            ${orderData.delivery_address ? `<p><strong>Delivery Address:</strong> ${orderData.delivery_address}</p>` : ''}
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="padding: 20px;">
            <h3>What's Next?</h3>
            <p>Your custom phone case is being prepared! We'll send you updates as your order progresses.</p>
            
            <h3>Need Help?</h3>
            <p>If you have any questions about your order, please contact us at <a href="mailto:support@printphonecover.com">support@printphonecover.com</a>.</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© 2024 PrintPhoneCase. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await sgMail.send(emailContent);
    console.log('Customer confirmation email sent successfully to:', customerEmail);
    return true;
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    
    // Log detailed error information
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body.errors, null, 2));
    }
    
    return false;
  }
};

// Function to send both admin and customer emails
export const sendOrderEmails = async (orderData) => {
  console.log('📧 Sending order notification emails...');
  
  const adminResult = await sendAdminNotification(orderData);
  const customerResult = await sendCustomerConfirmation(orderData);
  
  console.log(`Email results - Admin: ${adminResult ? '✅' : '❌'}, Customer: ${customerResult ? '✅' : '❌'}`);
  
  return {
    admin: adminResult,
    customer: customerResult
  };
};

// Get store owners configuration from environment or database
const getStoreOwners = () => {
  const owners = [];
  
  // Parse multiple owners from environment variables 
  // Format: OWNER_1_EMAIL=email1@domain.com,OWNER_1_PHONE=+1234567890,OWNER_1_NAME=John
  let i = 1;
  while (process.env[`OWNER_${i}_EMAIL`] || process.env[`OWNER_${i}_PHONE`]) {
    const owner = {
      id: i,
      name: process.env[`OWNER_${i}_NAME`] || `Owner ${i}`,
      email: process.env[`OWNER_${i}_EMAIL`],
      phone: process.env[`OWNER_${i}_PHONE`],
      stores: process.env[`OWNER_${i}_STORES`]?.split(',') || [], // Store IDs this owner manages
      isDefault: process.env[`OWNER_${i}_DEFAULT`] === 'true'
    };
    owners.push(owner);
    i++;
  }
  
  // Fallback to single owner configuration
  if (owners.length === 0 && (process.env.OWNER_PHONE_NUMBER || process.env.ADMIN_EMAIL)) {
    owners.push({
      id: 1,
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'support@printphonecover.com',
      phone: process.env.OWNER_PHONE_NUMBER,
      stores: [], // Manages all stores
      isDefault: true
    });
  }
  
  return owners;
};

// Get relevant owners for a specific order/store
const getRelevantOwners = (orderData, allOwners) => {
  const storeId = orderData.store_location_id || orderData.pickup_location_id;
  
  if (!storeId) {
    // No specific store, notify all default owners
    return allOwners.filter(owner => owner.isDefault || owner.stores.length === 0);
  }
  
  // Find owners who manage this specific store
  const storeOwners = allOwners.filter(owner => 
    owner.stores.includes(storeId.toString()) || 
    owner.stores.length === 0 || // Owners with no specific stores manage all
    owner.isDefault
  );
  
  return storeOwners.length > 0 ? storeOwners : allOwners.filter(owner => owner.isDefault);
};

// Enhanced notification system for multiple owners and customer
export const sendOrderNotifications = async (orderData) => {
  console.log('📧 Starting comprehensive multi-owner order notifications...');
  
  const results = {
    ownerEmails: [],
    customerEmail: false,
    ownerSMS: [],
    customerSMS: false,
    totalOwners: 0,
    successfulOwnerNotifications: 0
  };

  try {
    // Get all configured owners
    const allOwners = getStoreOwners();
    const relevantOwners = getRelevantOwners(orderData, allOwners);
    
    results.totalOwners = relevantOwners.length;
    console.log(`📋 Found ${relevantOwners.length} relevant owner(s) for this order`);
    console.log('👥 Owners to notify:', relevantOwners.map(o => `${o.name} (${o.email || 'no email'}, ${o.phone || 'no phone'})`));
    
    // 1. Send emails to all relevant owners
    console.log('📧 Sending owner email notifications...');
    for (const owner of relevantOwners) {
      if (owner.email) {
        const emailResult = await sendOwnerEmail(orderData, owner);
        results.ownerEmails.push({
          owner: owner.name,
          email: owner.email,
          success: emailResult
        });
        if (emailResult) results.successfulOwnerNotifications++;
      }
    }
    
    // 2. Send email to customer
    console.log('📧 Sending customer email confirmation...');
    const customerEmailResult = await sendCustomerConfirmation(orderData);
    results.customerEmail = customerEmailResult;
    
    // 3. Send SMS to all relevant owners
    console.log('📱 Sending owner SMS notifications...');
    for (const owner of relevantOwners) {
      if (owner.phone) {
        const smsResult = await sendOwnerSMS(orderData, owner.phone, owner);
        results.ownerSMS.push({
          owner: owner.name,
          phone: owner.phone,
          success: smsResult
        });
        if (smsResult) results.successfulOwnerNotifications++;
      }
    }
    
    // 4. Send SMS to customer
    console.log('📱 Sending customer SMS confirmation...');
    const customerSMSResult = await sendOrderSMS(orderData);
    results.customerSMS = customerSMSResult;
    
    console.log('✅ Multi-owner notification results:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Error in sendOrderNotifications:', error);
    return results;
  }
};

// Send email notification to a specific owner
const sendOwnerEmail = async (orderData, owner) => {
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY_HERE') {
    console.log(`📧 [DEMO MODE] Owner email would be sent to: ${owner.name} (${owner.email})`);
    return true;
  }

  try {
    const orderNumber = orderData.order_number || `#${orderData.id}`;
    const storeName = orderData.store_name || orderData.pickup_location_name || 'Your Store';
    const storeId = orderData.store_location_id || orderData.pickup_location_id || 'N/A';
    
    const emailContent = {
      to: owner.email,
      from: {
        email: 'support@printphonecover.com',
        name: 'PrintPhoneCase Order System'
      },
      replyTo: 'support@printphonecover.com',
      subject: `🔔 New Order Alert - ${orderNumber} (${storeName})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔔 New Order Alert</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Hi ${owner.name}!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 24px;">Order: <span style="color: #667eea;">${orderNumber}</span></h2>
              <p style="color: #666; margin: 0; font-size: 14px;">
                <strong>Store:</strong> ${storeName} ${storeId !== 'N/A' ? `(ID: ${storeId})` : ''}<br>
                <strong>Amount:</strong> <span style="color: #28a745; font-size: 18px; font-weight: bold;">$${orderData.amount || 'N/A'}</span>
              </p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 15px 0; border-bottom: 2px solid #eee; padding-bottom: 10px;">Customer Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 30%;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.contact_name || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.contact_email || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.contact_phone || 'N/A'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 15px 0; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 30%;">Phone Model:</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.phone_model || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Case Type:</td>
                  <td style="padding: 8px 0; color: #333; text-transform: capitalize;">${orderData.case_type || 'Regular'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Fulfillment:</td>
                  <td style="padding: 8px 0; color: #333;">${orderData.fulfillment_method || orderData.delivery_method || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Order Time:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(orderData.created_at || Date.now()).toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px;">
              <p style="margin: 0; font-size: 16px;">Check your admin dashboard for complete order details and management options.</p>
            </div>
          </div>
        </div>
      `,
      text: `New Order Alert for ${owner.name}\n\nOrder: ${orderNumber}\nStore: ${storeName}\nCustomer: ${orderData.contact_name || 'N/A'}\nPhone Model: ${orderData.phone_model || 'N/A'}\nAmount: $${orderData.amount || 'N/A'}\n\nCheck your admin dashboard for complete details.`
    };

    await sgMail.send(emailContent);
    console.log(`✅ Owner email sent successfully to: ${owner.name} (${owner.email})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send owner email to ${owner.name}:`, error);
    return false;
  }
};

// SMS notification for business owner
const sendOwnerSMS = async (orderData, rawOwnerPhone, owner = null) => {
  const ownerPhone = formatPhoneNumber(rawOwnerPhone);
  
  if (!ownerPhone) {
    console.log(`⚠️ Invalid owner phone number format: ${rawOwnerPhone}`);
    return false;
  }
  
  const client = await initializeTwilio();
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('⚠️ Twilio not configured - skipping owner SMS');
    console.log('Environment check:', {
      twilioClient: !!client,
      twilioPhone: !!process.env.TWILIO_PHONE_NUMBER,
      accountSid: !!process.env.TWILIO_ACCOUNT_SID,
      authToken: !!process.env.TWILIO_AUTH_TOKEN
    });
    return false;
  }
  
  try {
    const orderNumber = orderData.order_number || `#${orderData.id}`;
    const amount = orderData.amount || orderData.total_amount || 'N/A';
    const customerName = orderData.contact_name || orderData.customer_name || 'N/A';
    const phoneModel = orderData.phone_model || 'N/A';
    const storeName = orderData.store_name || orderData.pickup_location_name || 'Store';
    const ownerName = owner ? owner.name : 'Owner';
    
    const message = `🔔 NEW ORDER - ${storeName}\n\nHi ${ownerName}!\n\nOrder: ${orderNumber}\nCustomer: ${customerName}\nPhone: ${phoneModel}\nAmount: $${amount}\n\nCheck admin for details.`;
    
    console.log(`📱 Sending SMS to ${ownerName} (${ownerPhone})`);
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: ownerPhone
    });
    
    console.log(`✅ SMS sent to ${ownerName} (${ownerPhone}) - SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send owner SMS:', error);
    console.error('Error details:', error.message);
    return false;
  }
};

// Export additional utility functions for individual notifications
export { sendOwnerEmail, sendOwnerSMS };