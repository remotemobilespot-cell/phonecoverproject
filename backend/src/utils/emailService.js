import sgMail from '@sendgrid/mail';

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send admin order notification email
export const sendAdminNotification = async (orderData) => {
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY_HERE') {
    console.log('📧 [DEMO MODE] Admin notification would be sent:', {
      to: 'r.eshwarkiran@gmail.com',
      subject: `New Order Received - Order #${orderData.id}`,
      customerName: orderData.contact_name || 'Not provided',
      customerEmail: orderData.contact_email || orderData.email || 'Not provided',
      phoneModel: orderData.phone_model || 'Not specified',
      amount: orderData.amount || 'Not specified'
    });
    return true; // Return true in demo mode so the flow continues
  }

  try {
    const emailContent = {
      to: 'r.eshwarkiran@gmail.com', // Your notification email
      from: {
        email: 'r.eshwarkiran@gmail.com',
        name: 'PrintPhoneCase'
      }, // Must be verified sender
      subject: `New Order Received - Order #${orderData.id}`,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Order ID:</strong> ${orderData.id}</p>
        <p><strong>Customer:</strong> ${orderData.contact_name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${orderData.contact_email || orderData.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${orderData.contact_phone || orderData.phone || 'Not provided'}</p>
        <p><strong>Phone Model:</strong> ${orderData.phone_model || 'Not specified'}</p>
        <p><strong>Case Type:</strong> ${orderData.case_type || 'regular'}</p>
        <p><strong>Amount:</strong> $${orderData.amount || 'Not specified'}</p>
        <p><strong>Fulfillment Method:</strong> ${orderData.fulfillment_method || 'Not specified'}</p>
        ${orderData.delivery_address ? `<p><strong>Delivery Address:</strong> ${orderData.delivery_address}</p>` : ''}
        <p><strong>Order Time:</strong> ${new Date().toLocaleString()}</p>
        
        <h3>Order Details:</h3>
        <p>Design Image: ${orderData.design_image || 'Not provided'}</p>
        ${orderData.original_image ? `<p>Original Image: ${orderData.original_image}</p>` : ''}
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
      subject: `Order Confirmation - PrintPhoneCase Order #${orderData.id || 'TBD'}`,
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
        email: 'r.eshwarkiran@gmail.com',
        name: 'PrintPhoneCase'
      }, // Must be verified sender
      subject: `Order Confirmation - PrintPhoneCase Order #${orderData.id || 'TBD'}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
            <h1>Order Confirmation</h1>
            <p>Thank you for your order with PrintPhoneCase!</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${orderData.id || 'Will be provided shortly'}</p>
            <p><strong>Customer Name:</strong> ${orderData.contact_name || orderData.name || 'Valued Customer'}</p>
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
            <p>If you have any questions about your order, please contact us:</p>
            <p>Email: r.eshwarkiran@gmail.com</p>
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