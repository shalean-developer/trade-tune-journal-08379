-- Add missing columns to booking_items table
ALTER TABLE booking_items 
ADD COLUMN IF NOT EXISTS item_type TEXT,
ADD COLUMN IF NOT EXISTS unit_price NUMERIC DEFAULT 0;

-- Create unique constraint for upsert operations
ALTER TABLE booking_items 
DROP CONSTRAINT IF EXISTS booking_items_booking_id_item_type_key;

ALTER TABLE booking_items 
ADD CONSTRAINT booking_items_booking_id_item_type_key 
UNIQUE (booking_id, item_type);

-- Add comment explaining item_type usage
COMMENT ON COLUMN booking_items.item_type IS 'Type of item: bedroom, bathroom, or other property-related items';