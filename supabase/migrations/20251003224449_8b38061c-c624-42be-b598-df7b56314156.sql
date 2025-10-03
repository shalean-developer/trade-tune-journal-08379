-- First, let's check and drop any RLS policies that might reference the wrong column
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing RLS policies on booking_items
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'booking_items'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON booking_items', policy_record.policyname);
    END LOOP;
END $$;

-- Recreate simple RLS policies that use the correct column name
CREATE POLICY "Users can view their own booking items" 
ON booking_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_items.booking_id 
    AND bookings.customer_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own booking items" 
ON booking_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_items.booking_id 
    AND bookings.customer_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own booking items" 
ON booking_items FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_items.booking_id 
    AND bookings.customer_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own booking items" 
ON booking_items FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_items.booking_id 
    AND bookings.customer_id = auth.uid()
  )
);