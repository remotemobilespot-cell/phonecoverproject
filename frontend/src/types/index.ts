export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

export interface PhoneModel {
  id: string;
  brand: string;
  name: string; // Database uses 'name' instead of 'model'
  model?: string; // Keep for backward compatibility
  image?: string;
  base_price?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId?: string;
  phoneModel: PhoneModel;
  designImage: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  email: string;
  storeLocation?: StoreLocation;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  image?: string;
}