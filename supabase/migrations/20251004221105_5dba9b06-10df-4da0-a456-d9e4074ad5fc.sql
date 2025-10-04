-- Add unique constraint for booking_items if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'booking_items_booking_id_item_type_key'
    ) THEN
        ALTER TABLE public.booking_items 
        ADD CONSTRAINT booking_items_booking_id_item_type_key 
        UNIQUE (booking_id, item_type);
    END IF;
END $$;

-- Add unique constraint for booking_extras if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'booking_extras_booking_id_service_extra_id_key'
    ) THEN
        ALTER TABLE public.booking_extras 
        ADD CONSTRAINT booking_extras_booking_id_service_extra_id_key 
        UNIQUE (booking_id, service_extra_id);
    END IF;
END $$;