export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  bedroom_price: number;
  bathroom_price: number;
  image_url: string | null;
}

export interface ServiceExtra {
  id: string;
  name: string;
  description: string | null;
  price: number;
  icon: string | null;
}

export interface Cleaner {
  id: string;
  name: string;
  photo_url: string | null;
  rating: number;
  years_experience: number;
  badges: string[];
}

export interface BookingState {
  service: Service | null;
  bedrooms: number;
  bathrooms: number;
  extras: Array<{ extra: ServiceExtra; quantity: number }>;
  specialInstructions: string;
  date: Date | null;
  time: string;
  frequency: 'once-off' | 'weekly' | 'bi-weekly' | 'monthly';
  cleaner: Cleaner | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface BookingSummary {
  subtotal: number;
  discount: number;
  serviceFee: number;
  total: number;
}
