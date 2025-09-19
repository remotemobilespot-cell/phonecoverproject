# PrintPhoneCover.com - Complete Setup Instructions

## 🚀 Project Overview
A modern, mobile-friendly, SEO-optimized website for PrintPhoneCover.com - a business that allows customers to instantly design and print custom phone covers at vending machines across multiple store locations.

## 📁 Project Structure
```
printphonecover-website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── StoreLocations.tsx
│   │   ├── TestimonialsSlider.tsx
│   │   └── NewsletterSignup.tsx
│   ├── pages/              # Main application pages
│   │   ├── HomePage.tsx
│   │   ├── FindMachine.tsx
│   │   ├── PrintNow.tsx
│   │   ├── Auth.tsx
│   │   ├── Blog.tsx
│   │   ├── FAQ.tsx
│   │   └── Contact.tsx
│   ├── types/              # TypeScript type definitions
│   └── data/               # Mock data and constants
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🛠️ Technology Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn-UI components
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Query
- **Payments**: Stripe (integration ready)
- **Database**: MySQL/MongoDB (instructions below)
- **Hosting**: Hostinger compatible

## 🏗️ Installation & Development

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Local Development Setup
```bash
# Clone or download the project
cd printphonecover-website

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Run linter
pnpm run lint
```

## 🌐 Hostinger Deployment Instructions

### Step 1: Prepare Files for Upload
```bash
# Build the project
pnpm run build

# This creates a 'dist' folder with all static files
```

### Step 2: Upload to Hostinger
1. **Access File Manager**: Log into Hostinger control panel → File Manager
2. **Navigate to public_html**: This is your website's root directory
3. **Upload Files**: Upload all contents of the `dist` folder to `public_html`
4. **File Structure on Hostinger**:
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── css/
   │   └── js/
   └── favicon.svg
   ```

### Step 3: Configure Hostinger Settings
1. **Set up Custom Domain**: Point printphonecover.com to your Hostinger hosting
2. **Enable SSL Certificate**: Hostinger → SSL → Enable Let's Encrypt
3. **Set up 404 Redirects**: Create .htaccess file for React Router:

```apache
# Create .htaccess in public_html
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## 🗄️ Database Setup

### Option 1: MySQL Database (Recommended for Hostinger)

#### Create Database Structure
```sql
-- Create database
CREATE DATABASE printphonecover_db;
USE printphonecover_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Phone models table
CREATE TABLE phone_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store locations table
CREATE TABLE store_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    hours TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    email VARCHAR(255) NOT NULL,
    phone_model_id INT NOT NULL,
    design_image_url VARCHAR(500) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    stripe_payment_id VARCHAR(255),
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    store_location_id INT,
    pickup_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (phone_model_id) REFERENCES phone_models(id),
    FOREIGN KEY (store_location_id) REFERENCES store_locations(id)
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Contact messages
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'replied', 'resolved') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Insert Sample Data
```sql
-- Insert phone models
INSERT INTO phone_models (brand, model, image_url) VALUES
('Apple', 'iPhone 15 Pro Max', '/assets/phones/iphone-15-pro-max.jpg'),
('Apple', 'iPhone 15 Pro', '/images/iPhone15Pro.jpg'),
('Apple', 'iPhone 15', '/assets/phones/iphone-15.jpg'),
('Samsung', 'Galaxy S24 Ultra', '/images/SamsungGalaxyS24Ultra.jpg'),
('Samsung', 'Galaxy S24+', '/assets/phones/galaxy-s24-plus.jpg'),
('Google', 'Pixel 8 Pro', '/assets/phones/pixel-8-pro.jpg');

-- Insert store locations
INSERT INTO store_locations (name, address, city, state, zip_code, phone, hours, latitude, longitude) VALUES
('Lufkin Heb', '111 North Timberland Dr.' 'Lufkin', '123 Main Street, Suite 100', 'Los Angeles', 'CA', '90210', '(555) 123-4567', 'Mon-Sat: 10am-9pm, Sun: 11am-7pm', 34.0522, -118.2437),
('Westfield Shopping Center', '456 Oak Avenue', 'Santa Monica', 'CA', '90401', '(555) 234-5678', 'Daily: 10am-10pm', 34.0195, -118.4912),
('Tech Plaza - Phone Cover Express', '789 Silicon Drive', 'San Francisco', 'CA', '94102', '(555) 345-6789', 'Mon-Fri: 9am-8pm, Weekends: 10am-6pm', 37.7749, -122.4194);
```

### Option 2: MongoDB Setup
```javascript
// MongoDB Schema (using Mongoose)

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: String,
  passwordHash: String,
  googleId: String,
  createdAt: { type: Date, default: Date.now }
});

const phoneModelSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  imageUrl: String,
  isActive: { type: Boolean, default: true }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  phoneModel: { type: mongoose.Schema.Types.ObjectId, ref: 'PhoneModel' },
  designImageUrl: { type: String, required: true },
  amount: { type: Number, required: true },
  stripePaymentId: String,
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending' 
  },
  storeLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreLocation' },
  pickupCode: String,
  createdAt: { type: Date, default: Date.now }
});
```

## 💳 Stripe Payment Integration

### Step 1: Get Stripe Keys
1. **Create Stripe Account**: Visit https://stripe.com and create an account
2. **Get API Keys**: Dashboard → Developers → API Keys
   - **Publishable Key** (starts with `pk_`): For frontend
   - **Secret Key** (starts with `sk_`): For backend

### Step 2: Environment Variables
Create `.env` file:
```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Database Configuration  
DATABASE_URL=mysql://username:password@localhost:3306/printphonecover_db

# Email Configuration (for notifications)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=support@printphonecover.com
SMTP_PASS=your_email_password
```

### Step 3: Backend API Integration
```javascript
// Example Node.js/Express backend for payment processing
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, phoneModel, designImage } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      metadata: {
        phoneModel,
        designImage
      }
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
});

// Webhook for payment confirmation
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Update order status in database
    // Send confirmation email
    // Generate pickup code
  }

  res.json({received: true});
});
```

## 🔐 Authentication Setup

### Google OAuth Configuration
1. **Google Cloud Console**: https://console.cloud.google.com
2. **Create Project** → Enable Google+ API
3. **Create Credentials** → OAuth 2.0 Client ID
4. **Authorized Origins**: Add your domain
5. **Add to environment**:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### JWT Token Setup
```env
JWT_SECRET=your_super_secure_random_string
JWT_EXPIRES_IN=7d
```

## 📧 Email Integration

### SMTP Configuration (Hostinger Email)
```env
# Email settings for order confirmations
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=support@printphonecover.com
SMTP_PASS=your_hostinger_email_password
```

### Email Templates
Create templates for:
- Order confirmation
- Pickup ready notification  
- Newsletter welcome
- Password reset
- Contact form responses

## 🔍 SEO Optimization

### Meta Tags (Already Implemented)
- Page titles optimized for keywords
- Meta descriptions for each page
- Open Graph tags for social sharing
- Schema markup for business listings

### Google Analytics Setup
1. **Create GA4 Property**: https://analytics.google.com
2. **Get Tracking ID**: GA_MEASUREMENT_ID
3. **Add to index.html**:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Google Search Console
1. **Verify Domain**: https://search.google.com/search-console
2. **Submit Sitemap**: Create and submit sitemap.xml
3. **Monitor Performance**: Track search rankings and clicks

## 🚀 Performance Optimization

### Image Optimization
- Use WebP format for better compression
- Implement lazy loading for images
- Set up CDN for faster loading

### Caching Strategy
```apache
# .htaccess caching rules (already included above)
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    # ... other rules
</IfModule>
```

## 🔧 Maintenance & Monitoring

### Regular Tasks
- **Database Backups**: Schedule daily backups
- **Security Updates**: Keep dependencies updated
- **Performance Monitoring**: Use tools like Google PageSpeed Insights
- **Uptime Monitoring**: Set up alerts for downtime

### Error Logging
```javascript
// Example error logging setup
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 📱 Progressive Web App (PWA) Enhancement

### Service Worker Setup
```javascript
// sw.js - Service worker for offline functionality
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('printphonecover-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/css/main.css',
        '/static/js/main.js',
        // Add other critical assets
      ]);
    })
  );
});
```

### Web App Manifest
```json
{
  "name": "PrintPhoneCover",
  "short_name": "PrintPhone",
  "description": "Custom phone cases instantly",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🆘 Support & Troubleshooting

### Common Issues
1. **Build Errors**: Check Node.js version compatibility
2. **Routing Issues**: Ensure .htaccess is properly configured
3. **Payment Failures**: Verify Stripe webhook endpoints
4. **Database Connection**: Check credentials and firewall settings

### Getting Help
- **Documentation**: React, Tailwind CSS, Stripe documentation
- **Community**: Stack Overflow, GitHub Issues
- **Professional Support**: Consider hiring a developer for complex customizations

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema created and populated
- [ ] Stripe account set up with webhook endpoints
- [ ] Google Analytics and Search Console configured
- [ ] SSL certificate enabled
- [ ] .htaccess file configured for routing
- [ ] Email SMTP settings tested
- [ ] All pages tested on mobile and desktop
- [ ] Performance optimization implemented
- [ ] SEO meta tags verified
- [ ] Backup strategy in place

## 🎯 Next Steps After Deployment

1. **Content Creation**: Add real blog posts and testimonials
2. **Marketing Integration**: Set up social media pixels and email campaigns  
3. **A/B Testing**: Test different call-to-action buttons and layouts
4. **User Feedback**: Implement feedback collection system
5. **Analytics Review**: Monitor user behavior and conversion rates
6. **Feature Expansion**: Add new phone models, locations, or services

---

**Need Help?** This comprehensive guide covers all aspects of setting up and deploying PrintPhoneCover.com. For technical support or custom modifications, consider consulting with a web developer familiar with React and e-commerce platforms.