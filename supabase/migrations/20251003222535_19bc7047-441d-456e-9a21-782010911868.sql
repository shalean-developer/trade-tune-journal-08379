-- Remove foreign key constraint from bookings.customer_id to allow guest bookings
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;

-- customer_id will now store either:
-- 1. Authenticated user UUID (from auth.users)
-- 2. Guest user UUID (generated client-side for guest checkout)
COMMENT ON COLUMN bookings.customer_id IS 'User ID - can be authenticated user or guest UUID';