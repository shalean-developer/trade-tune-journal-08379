-- Create ENUM types
CREATE TYPE public.user_role AS ENUM ('CUSTOMER', 'CLEANER', 'ADMIN');
CREATE TYPE public.unit_type AS ENUM ('BEDROOM', 'BATHROOM', 'SQUARE_METER', 'HOUR');
CREATE TYPE public.booking_status AS ENUM ('DRAFT', 'READY_FOR_PAYMENT', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE public.availability_status AS ENUM ('AVAILABLE', 'BLOCKED');
CREATE TYPE public.payment_provider AS ENUM ('PAYSTACK');

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(10,2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (active = true);

-- Service items (bedrooms, bathrooms, etc.)
CREATE TABLE public.service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  unit_type unit_type NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  min_qty INTEGER NOT NULL DEFAULT 1,
  max_qty INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service items" ON public.service_items
  FOR SELECT USING (true);

-- Service extras (add-ons)
CREATE TABLE public.service_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.service_extras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active extras" ON public.service_extras
  FOR SELECT USING (active = true);

-- Regions
CREATE TABLE public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view regions" ON public.regions
  FOR SELECT USING (true);

-- Suburbs
CREATE TABLE public.suburbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(region_id, name)
);

ALTER TABLE public.suburbs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view suburbs" ON public.suburbs
  FOR SELECT USING (true);

-- Cleaners
CREATE TABLE public.cleaners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active cleaners" ON public.cleaners
  FOR SELECT USING (active = true);

-- Cleaner service areas
CREATE TABLE public.cleaner_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID NOT NULL REFERENCES public.cleaners(id) ON DELETE CASCADE,
  suburb_id UUID NOT NULL REFERENCES public.suburbs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cleaner_id, suburb_id)
);

ALTER TABLE public.cleaner_service_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cleaner service areas" ON public.cleaner_service_areas
  FOR SELECT USING (true);

-- Cleaner availability
CREATE TABLE public.cleaner_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID NOT NULL REFERENCES public.cleaners(id) ON DELETE CASCADE,
  start_ts TIMESTAMPTZ NOT NULL,
  end_ts TIMESTAMPTZ NOT NULL,
  status availability_status NOT NULL DEFAULT 'AVAILABLE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cleaner_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available slots" ON public.cleaner_availability
  FOR SELECT USING (status = 'AVAILABLE');

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id),
  region_id UUID REFERENCES public.regions(id),
  suburb_id UUID REFERENCES public.suburbs(id),
  status booking_status NOT NULL DEFAULT 'DRAFT',
  start_ts TIMESTAMPTZ,
  end_ts TIMESTAMPTZ,
  address TEXT,
  notes TEXT,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  cleaner_id UUID REFERENCES public.cleaners(id),
  payment_ref TEXT,
  payment_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = customer_id);

-- Booking items
CREATE TABLE public.booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_item_id UUID NOT NULL REFERENCES public.service_items(id),
  qty INTEGER NOT NULL,
  line_total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booking items" ON public.booking_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_items.booking_id 
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own booking items" ON public.booking_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_items.booking_id 
      AND bookings.customer_id = auth.uid()
    )
  );

-- Booking extras
CREATE TABLE public.booking_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_extra_id UUID NOT NULL REFERENCES public.service_extras(id),
  line_total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.booking_extras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booking extras" ON public.booking_extras
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_extras.booking_id 
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own booking extras" ON public.booking_extras
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_extras.booking_id 
      AND bookings.customer_id = auth.uid()
    )
  );

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  provider payment_provider NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  status TEXT,
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.customer_id = auth.uid()
    )
  );

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CUSTOMER')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Seed data: Services
INSERT INTO public.services (slug, name, description, base_price, active) VALUES
('standard-cleaning', 'Standard Cleaning', 'Regular house cleaning service', 500.00, true),
('deep-cleaning', 'Deep Cleaning', 'Thorough deep cleaning service', 800.00, true),
('move-in-out', 'Move In/Out Cleaning', 'Cleaning for moving properties', 1200.00, true),
('airbnb-cleaning', 'Airbnb Cleaning', 'Quick turnaround for Airbnb properties', 600.00, true),
('post-construction', 'Post-Construction Cleaning', 'Clean up after construction work', 1500.00, true);

-- Seed data: Regions
INSERT INTO public.regions (name) VALUES
('Cape Town'),
('Johannesburg'),
('Durban'),
('Pretoria');

-- Seed data: Suburbs (Cape Town)
INSERT INTO public.suburbs (region_id, name)
SELECT id, suburb FROM public.regions, 
  (VALUES 
    ('Sea Point'),
    ('Green Point'),
    ('Camps Bay'),
    ('Claremont'),
    ('Newlands'),
    ('Constantia')
  ) AS s(suburb)
WHERE regions.name = 'Cape Town';

-- Seed data: Suburbs (Johannesburg)
INSERT INTO public.suburbs (region_id, name)
SELECT id, suburb FROM public.regions,
  (VALUES 
    ('Sandton'),
    ('Rosebank'),
    ('Fourways'),
    ('Randburg'),
    ('Midrand')
  ) AS s(suburb)
WHERE regions.name = 'Johannesburg';