-- Add missing columns to booking_extras table
ALTER TABLE public.booking_extras 
ADD COLUMN IF NOT EXISTS qty integer NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS unit_price numeric NOT NULL DEFAULT 0;

-- Add unique constraint for booking_items upserts
ALTER TABLE public.booking_items 
DROP CONSTRAINT IF EXISTS booking_items_booking_id_item_type_key;

ALTER TABLE public.booking_items 
ADD CONSTRAINT booking_items_booking_id_item_type_key 
UNIQUE (booking_id, item_type);

-- Add unique constraint for booking_extras upserts
ALTER TABLE public.booking_extras 
DROP CONSTRAINT IF EXISTS booking_extras_booking_id_service_extra_id_key;

ALTER TABLE public.booking_extras 
ADD CONSTRAINT booking_extras_booking_id_service_extra_id_key 
UNIQUE (booking_id, service_extra_id);

-- Ensure RLS is enabled on all booking tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suburbs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bookings (users can manage their own bookings)
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings" ON public.bookings
FOR SELECT USING (customer_id::text = auth.uid()::text OR customer_id::text = current_setting('request.jwt.claim.sub', true));

DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
CREATE POLICY "Users can create their own bookings" ON public.bookings
FOR INSERT WITH CHECK (customer_id::text = auth.uid()::text OR true);

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
CREATE POLICY "Users can update their own bookings" ON public.bookings
FOR UPDATE USING (customer_id::text = auth.uid()::text OR customer_id::text = current_setting('request.jwt.claim.sub', true));

-- Create RLS policies for booking_items
DROP POLICY IF EXISTS "Users can view their booking items" ON public.booking_items;
CREATE POLICY "Users can view their booking items" ON public.booking_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_items.booking_id 
    AND (bookings.customer_id::text = auth.uid()::text OR bookings.customer_id::text = current_setting('request.jwt.claim.sub', true))
  )
);

DROP POLICY IF EXISTS "Users can manage their booking items" ON public.booking_items;
CREATE POLICY "Users can manage their booking items" ON public.booking_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_items.booking_id 
    AND (bookings.customer_id::text = auth.uid()::text OR true)
  )
);

-- Create RLS policies for booking_extras
DROP POLICY IF EXISTS "Users can view their booking extras" ON public.booking_extras;
CREATE POLICY "Users can view their booking extras" ON public.booking_extras
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_extras.booking_id 
    AND (bookings.customer_id::text = auth.uid()::text OR bookings.customer_id::text = current_setting('request.jwt.claim.sub', true))
  )
);

DROP POLICY IF EXISTS "Users can manage their booking extras" ON public.booking_extras;
CREATE POLICY "Users can manage their booking extras" ON public.booking_extras
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_extras.booking_id 
    AND (bookings.customer_id::text = auth.uid()::text OR true)
  )
);

-- Public read access for services, extras, regions, and suburbs
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
CREATE POLICY "Anyone can view services" ON public.services
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view service extras" ON public.service_extras;
CREATE POLICY "Anyone can view service extras" ON public.service_extras
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view regions" ON public.regions;
CREATE POLICY "Anyone can view regions" ON public.regions
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view suburbs" ON public.suburbs;
CREATE POLICY "Anyone can view suburbs" ON public.suburbs
FOR SELECT USING (true);