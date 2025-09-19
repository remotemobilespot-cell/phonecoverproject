// Application Constants
export const APP_CONFIG = {
  name: 'PrintPhone',
  description: 'Custom Phone Case Printing',
  version: '1.0.0',
  supportEmail: 'support@printphone.com',
  supportPhone: '1-800-PRINTPHONE'
} as const;

// API Configuration
export const API_CONFIG = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  timeout: 10000,
  retries: 3
} as const;

// UI Constants
export const UI_CONFIG = {
  animations: {
    duration: 300,
    easing: 'ease-in-out'
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  }
} as const;

// Business Constants
export const BUSINESS_CONFIG = {
  hours: 'Mon-Sun: 9am-9pm',
  defaultLocation: {
    lat: 29.7604,
    lng: -95.3698,
    city: 'Houston',
    state: 'TX'
  },
  pricing: {
    baseCasePrice: 24.99,
    shippingFee: 4.99,
    taxRate: 0.0825
  }
} as const;

// Phone Case Constants
export const CASE_CONFIG = {
  defaultDimensions: {
    width: 200,
    height: 400,
    offset: 10
  },
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  designLimits: {
    minScale: 10,
    maxScale: 200,
    maxRotation: 360
  }
} as const;

// Map Configuration
export const MAP_CONFIG = {
  defaultCenter: [29.5, -95.5] as [number, number],
  defaultZoom: 6,
  tileLayer: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors"
  }
} as const;