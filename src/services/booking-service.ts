import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price: number;
  active: boolean;
}

export interface ServiceExtra {
  id: string;
  service_id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
}

export interface Region {
  id: string;
  name: string;
}

export interface Suburb {
  id: string;
  region_id: string;
  name: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  service_id: string | null;
  region_id: string | null;
  suburb_id: string | null;
  status: string;
  start_ts: string | null;
  end_ts: string | null;
  address: string | null;
  notes: string | null;
  total_price: number;
  cleaner_id: string | null;
  payment_ref: string | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all active services
export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

// Fetch service by slug
export const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
};

// Fetch extras for a service
export const getServiceExtras = async (serviceId: string): Promise<ServiceExtra[]> => {
  const { data, error } = await supabase
    .from('service_extras')
    .select('*')
    .eq('service_id', serviceId)
    .eq('active', true);

  if (error) throw error;
  return data || [];
};

// Fetch all regions
export const getRegions = async (): Promise<Region[]> => {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

// Fetch suburbs by region
export const getSuburbsByRegion = async (regionId: string): Promise<Suburb[]> => {
  const { data, error } = await supabase
    .from('suburbs')
    .select('*')
    .eq('region_id', regionId)
    .order('name');

  if (error) throw error;
  return data || [];
};

// Get or create draft booking for current user
export const getOrCreateDraftBooking = async (userId: string): Promise<Booking> => {
  // First try to find existing draft
  const { data: existingDraft, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', userId)
    .eq('status', 'DRAFT')
    .single();

  if (existingDraft) {
    return existingDraft;
  }

  // Create new draft if none exists
  const { data: newDraft, error: createError } = await supabase
    .from('bookings')
    .insert({
      customer_id: userId,
      status: 'DRAFT',
      total_price: 0
    })
    .select()
    .single();

  if (createError) throw createError;
  return newDraft;
};

// Update booking
export const updateBooking = async (
  bookingId: string,
  updates: Partial<Booking>
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates as any)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get booking by ID
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
};

// Get user bookings
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', userId)
    .neq('status', 'DRAFT')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Booking items management
export const upsertBookingItem = async (
  bookingId: string,
  itemType: string,
  quantity: number,
  unitPrice: number
) => {
  const { data, error } = await supabase
    .from('booking_items')
    .upsert({
      booking_id: bookingId,
      item_type: itemType,
      qty: quantity,
      unit_price: unitPrice,
      line_total: quantity * unitPrice
    } as any, { onConflict: 'booking_id,item_type' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getBookingItems = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('booking_items')
    .select('*')
    .eq('booking_id', bookingId);

  if (error) throw error;
  return data || [];
};

// Booking extras management
export const upsertBookingExtra = async (
  bookingId: string,
  extraId: string,
  quantity: number,
  unitPrice: number
) => {
  const { data, error} = await supabase
    .from('booking_extras')
    .upsert({
      booking_id: bookingId,
      service_extra_id: extraId,
      qty: quantity,
      unit_price: unitPrice,
      line_total: quantity * unitPrice
    } as any, { onConflict: 'booking_id,service_extra_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBookingExtra = async (bookingId: string, extraId: string) => {
  const { error } = await supabase
    .from('booking_extras')
    .delete()
    .eq('booking_id', bookingId)
    .eq('service_extra_id', extraId);

  if (error) throw error;
};

export const getBookingExtras = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('booking_extras')
    .select('*, service_extras(*)')
    .eq('booking_id', bookingId);

  if (error) throw error;
  return data || [];
};

// Mark booking as ready for payment
export const markBookingReady = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'READY_FOR_PAYMENT' })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
