-- Drop restrictive policies on booking_items that only allow authenticated users
DROP POLICY IF EXISTS "Users can insert their own booking items" ON booking_items;
DROP POLICY IF EXISTS "Users can update their own booking items" ON booking_items;
DROP POLICY IF EXISTS "Users can delete their own booking items" ON booking_items;
DROP POLICY IF EXISTS "Users can view their own booking items" ON booking_items;

-- Create more flexible policies that allow managing items for DRAFT bookings or owned bookings
CREATE POLICY "Anyone can manage booking items for draft bookings"
ON booking_items
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_items.booking_id
    AND (
      bookings.status = 'DRAFT'
      OR bookings.customer_id = auth.uid()
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_items.booking_id
    AND (
      bookings.status = 'DRAFT'
      OR bookings.customer_id = auth.uid()
    )
  )
);