-- Drop ALL existing RLS policies for bookings, booking_items, and booking_extras
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'bookings' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.bookings';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'booking_items' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.booking_items';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'booking_extras' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.booking_extras';
    END LOOP;
END $$;

-- Create new RLS policies for bookings that allow guest users to create DRAFT bookings
CREATE POLICY "allow_draft_creation"
ON public.bookings
FOR INSERT
WITH CHECK (status = 'DRAFT');

CREATE POLICY "allow_view_own_or_draft"
ON public.bookings
FOR SELECT
USING (status = 'DRAFT' OR auth.uid() = customer_id);

CREATE POLICY "allow_update_own_or_draft"
ON public.bookings
FOR UPDATE
USING (status = 'DRAFT' OR auth.uid() = customer_id)
WITH CHECK (status = 'DRAFT' OR auth.uid() = customer_id);

-- Allow open access to booking_items and booking_extras for the booking flow to work
CREATE POLICY "allow_all_booking_items"
ON public.booking_items
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_all_booking_extras"
ON public.booking_extras
FOR ALL
USING (true)
WITH CHECK (true);