-- Drop existing booking tables if they exist
DROP TABLE IF EXISTS public.booking_extras CASCADE;
DROP TABLE IF EXISTS public.booking_items CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.cleaners CASCADE;
DROP TABLE IF EXISTS public.service_extras CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  bedroom_price DECIMAL(10,2) DEFAULT 0,
  bathroom_price DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create service extras table
CREATE TABLE public.service_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cleaners table
CREATE TABLE public.cleaners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo_url TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  years_experience INTEGER DEFAULT 0,
  badges TEXT[],
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  service_id UUID REFERENCES public.services(id),
  cleaner_id UUID REFERENCES public.cleaners(id),
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 2,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  special_instructions TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'once-off',
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  service_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  paystack_reference TEXT,
  payment_status TEXT DEFAULT 'pending',
  booking_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create booking extras junction table
CREATE TABLE public.booking_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  extra_id UUID REFERENCES public.service_extras(id),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  UNIQUE(booking_id, extra_id)
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_extras ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service extras are viewable by everyone"
  ON public.service_extras FOR SELECT
  USING (is_active = true);

CREATE POLICY "Cleaners are viewable by everyone"
  ON public.cleaners FOR SELECT
  USING (is_available = true);

CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON public.bookings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create booking extras"
  ON public.booking_extras FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view booking extras"
  ON public.booking_extras FOR SELECT
  USING (true);

-- Insert sample services
INSERT INTO public.services (name, slug, description, base_price, bedroom_price, bathroom_price, image_url) VALUES
  ('Standard Cleaning', 'standard-cleaning', 'Regular home cleaning service covering all essential areas', 8000.00, 1500.00, 1000.00, '/lovable-uploads/standard-cleaning.png'),
  ('Deep Cleaning', 'deep-cleaning', 'Intensive cleaning service for a thoroughly clean home', 15000.00, 2500.00, 1500.00, '/lovable-uploads/deep-cleaning.png'),
  ('Move-in/Move-out Cleaning', 'move-in-out', 'Complete cleaning for moving in or out of a property', 20000.00, 3000.00, 2000.00, '/lovable-uploads/clean-home-background.png'),
  ('Airbnb Turnover', 'airbnb-turnover', 'Quick professional turnover cleaning for Airbnb properties', 12000.00, 2000.00, 1200.00, '/lovable-uploads/airbnb-turnover.png'),
  ('Post-Construction Cleaning', 'post-construction', 'Specialized cleaning after construction or renovation work', 25000.00, 3500.00, 2500.00, '/lovable-uploads/cleaner-working.png');

-- Insert sample extras
INSERT INTO public.service_extras (name, description, price, icon) VALUES
  ('Inside Oven', 'Deep clean inside your oven', 2500.00, 'Flame'),
  ('Inside Fridge', 'Clean and sanitize inside your refrigerator', 2000.00, 'Refrigerator'),
  ('Windows', 'Clean windows inside and out', 3000.00, 'Square'),
  ('Ironing', 'Ironing service for your clothes', 1500.00, 'Shirt'),
  ('Laundry', 'Wash and fold laundry service', 2500.00, 'Waves'),
  ('Inside Cabinets', 'Clean inside kitchen cabinets', 2000.00, 'Archive');

-- Insert sample cleaners
INSERT INTO public.cleaners (name, photo_url, rating, years_experience, badges) VALUES
  ('Sarah Johnson', '/lovable-uploads/cleaner-profile-1.png', 4.9, 5, ARRAY['Top Rated', 'Eco-Friendly']),
  ('Michael Chen', '/lovable-uploads/cleaner-profile-2.png', 4.8, 3, ARRAY['Fast & Efficient']),
  ('Emily Rodriguez', '/lovable-uploads/cleaner-profile-3.png', 5.0, 7, ARRAY['Top Rated', 'Detail-Oriented', 'Pet-Friendly']);