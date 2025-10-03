-- Create booking_items table for bedrooms, bathrooms, etc.
CREATE TABLE IF NOT EXISTS public.booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'bedroom', 'bathroom', etc.
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(booking_id, item_type)
);

-- Create booking_extras table
CREATE TABLE IF NOT EXISTS public.booking_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  extra_id UUID NOT NULL REFERENCES public.service_extras(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(booking_id, extra_id)
);

-- Add new columns to bookings table
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Enable RLS
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_extras ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_items
CREATE POLICY "Users can view their own booking items"
  ON public.booking_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_items.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own booking items"
  ON public.booking_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_items.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own booking items"
  ON public.booking_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_items.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own booking items"
  ON public.booking_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_items.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

-- RLS Policies for booking_extras
CREATE POLICY "Users can view their own booking extras"
  ON public.booking_extras FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own booking extras"
  ON public.booking_extras FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own booking extras"
  ON public.booking_extras FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own booking extras"
  ON public.booking_extras FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

-- Function to calculate booking totals and duration
CREATE OR REPLACE FUNCTION public.calculate_booking_totals(p_booking_id UUID)
RETURNS TABLE(total_price DECIMAL, estimated_minutes INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_service_price DECIMAL := 0;
  v_items_total DECIMAL := 0;
  v_extras_total DECIMAL := 0;
  v_base_minutes INTEGER := 120; -- 2 hours default
  v_bedroom_minutes INTEGER := 30;
  v_bathroom_minutes INTEGER := 20;
  v_bedrooms INTEGER := 0;
  v_bathrooms INTEGER := 0;
  v_total_minutes INTEGER := 0;
BEGIN
  -- Get service base price
  SELECT COALESCE(s.base_price, 0) INTO v_service_price
  FROM public.bookings b
  LEFT JOIN public.services s ON b.service_id = s.id
  WHERE b.id = p_booking_id;

  -- Get items total and counts
  SELECT 
    COALESCE(SUM(quantity * unit_price), 0),
    COALESCE(SUM(CASE WHEN item_type = 'bedroom' THEN quantity ELSE 0 END), 2),
    COALESCE(SUM(CASE WHEN item_type = 'bathroom' THEN quantity ELSE 0 END), 1)
  INTO v_items_total, v_bedrooms, v_bathrooms
  FROM public.booking_items
  WHERE booking_id = p_booking_id;

  -- Get extras total
  SELECT COALESCE(SUM(quantity * unit_price), 0) INTO v_extras_total
  FROM public.booking_extras
  WHERE booking_id = p_booking_id;

  -- Calculate duration
  v_total_minutes := v_base_minutes + (v_bedrooms * v_bedroom_minutes) + (v_bathrooms * v_bathroom_minutes);

  RETURN QUERY SELECT 
    (v_service_price + v_items_total + v_extras_total)::DECIMAL,
    v_total_minutes::INTEGER;
END;
$$;

-- Trigger to update booking totals
CREATE OR REPLACE FUNCTION public.update_booking_totals_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_totals RECORD;
BEGIN
  -- Get calculated totals
  SELECT * INTO v_totals FROM public.calculate_booking_totals(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.booking_id
      ELSE NEW.booking_id
    END
  );

  -- Update booking
  UPDATE public.bookings
  SET 
    total_price = v_totals.total_price,
    estimated_minutes = v_totals.estimated_minutes,
    updated_at = now()
  WHERE id = CASE 
    WHEN TG_OP = 'DELETE' THEN OLD.booking_id
    ELSE NEW.booking_id
  END;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS booking_items_totals_trigger ON public.booking_items;
CREATE TRIGGER booking_items_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.booking_items
  FOR EACH ROW EXECUTE FUNCTION public.update_booking_totals_trigger();

DROP TRIGGER IF EXISTS booking_extras_totals_trigger ON public.booking_extras;
CREATE TRIGGER booking_extras_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.booking_extras
  FOR EACH ROW EXECUTE FUNCTION public.update_booking_totals_trigger();