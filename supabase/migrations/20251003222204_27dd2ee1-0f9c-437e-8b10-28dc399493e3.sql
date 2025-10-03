-- Allow anyone to create draft bookings (for guest checkout)
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;

-- Allow anyone to create draft bookings
CREATE POLICY "Anyone can create draft bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (status = 'DRAFT');

-- Allow anyone to view and update their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  USING (customer_id::text = current_setting('request.jwt.claims', true)::json->>'sub' OR status = 'DRAFT');

-- Allow users to update their own draft bookings
CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  USING (customer_id::text = current_setting('request.jwt.claims', true)::json->>'sub' OR status = 'DRAFT')
  WITH CHECK (customer_id::text = current_setting('request.jwt.claims', true)::json->>'sub' OR status = 'DRAFT');

-- Allow anyone to insert booking items for draft bookings
DROP POLICY IF EXISTS "Users can manage booking items" ON booking_items;
CREATE POLICY "Anyone can manage booking items"
  ON booking_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_items.booking_id
      AND (bookings.status = 'DRAFT' OR bookings.customer_id::text = current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

-- Allow anyone to manage booking extras for draft bookings
DROP POLICY IF EXISTS "Users can manage booking extras" ON booking_extras;
CREATE POLICY "Anyone can manage booking extras"
  ON booking_extras
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_extras.booking_id
      AND (bookings.status = 'DRAFT' OR bookings.customer_id::text = current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );