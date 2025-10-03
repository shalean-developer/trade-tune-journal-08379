-- Make service_item_id nullable for booking_items table
-- This allows storing property details (bedrooms, bathrooms) without requiring a service_item_id
ALTER TABLE booking_items 
ALTER COLUMN service_item_id DROP NOT NULL;